import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ['librarian-orders', user?.displayName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/librarian-orders/${user.displayName}`);
      return res.data;
    }
  });
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  };

  const handleCancel = (orderId) => {
    Swal.fire({
      title: "Cancel this Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/orders/cancel/${orderId}`);
          toast.success("Order cancelled successfully");
          refetch();
        } catch (error) {
          console.error("Cancel failed:", error);
          toast.error("Failed to cancel order");
        }
      }
    });
  };

  if (isLoading) return <div className="p-4">Loading orders...</div>;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Update Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-bold">{order.bookTitle}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>{order.customerEmail || order.email}</div>
                    {order.address && <div className="text-xs text-gray-400 mt-1">{order.address}</div>}
                  </TableCell>
                  <TableCell>
                    <span className={order.payment_status === 'paid' ? "text-green-600 font-bold" : "text-yellow-600 font-medium"}>
                      {order.payment_status || 'Unpaid'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'pending' ? "secondary" :
                        order.status === 'shipped' ? "default" :
                          order.status === 'delivered' ? "outline" :
                            "destructive"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleStatusChange(order._id, val)}
                      disabled={order.status === 'cancelled'}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      onClick={() => handleCancel(order._id)}>
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
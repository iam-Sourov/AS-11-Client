import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { AuthContext } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const LibrarianOrders = () => {
  const {user}= useContext(AuthContext)
  const axiosInstance = useAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['librarian-orders', user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/librarian-orders/${user.email}`);
      return res.data;
    }
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-bold">{order.bookTitle}</TableCell>
                <TableCell>{order.customerEmail || order.email}</TableCell>
                <TableCell>
                  <span className={`capitalize font-medium ${order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'shipped' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(val) => handleStatusChange(order._id, val)}
                  >
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LibrarianOrders;
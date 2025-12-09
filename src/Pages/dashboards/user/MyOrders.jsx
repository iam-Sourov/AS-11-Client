import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const MyOrders = () => {
  const { user } = useContext(AuthContext)
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    }
  });
  console.log(orders)

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/orders/cancel/${id}`);
          toast.success("Order Cancelled");
          refetch();
        } catch (err) {
          console.log(err);
          toast.error("Failed to cancel");
        }
      }
    });
  };
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead >Cover</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium"><img className='w-9 h-9 rounded' src={order.image_url} alt="" /> </TableCell>
                <TableCell className="font-medium">{order.bookTitle}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'cancelled' ? "destructive" : "outline"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={order.paymentStatus === 'paid' ? "text-green-600 font-bold text-xl" : "text-yellow-600"}>
                    {order.payment_Status || 'Unpaid'}
                  </span>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  {order.status !== 'cancelled' && order.paymentStatus !== 'paid' && (
                    <Link to={`/dashboard/payment/${order._id}`}>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Pay Now</Button>
                    </Link>
                  )}
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancel(order._id)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyOrders;
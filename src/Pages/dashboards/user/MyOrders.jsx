import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
    refetchInterval: 5000,
  });
  console.log(orders)

  const handlePayment = async (order) => {
    const orderInfo = {
      _id: order._id,
      email: order.email,
      bookTitle: order.bookTitle,
      image: order.image,
      price: order.price,
    };

    try {
      const res = await axiosSecure.post('/payment-checkout-session', orderInfo);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Payment redirect failed", error);
      toast.error("Failed to initiate payment");
    }
  };
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
              <TableHead>Cover</TableHead>
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
                <TableCell>
                  <img className='w-9 h-9 rounded' src={order.image} alt={order.bookTitle} />
                </TableCell>
                <TableCell className="font-medium">{order.bookTitle}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                              'bg-gray-100 text-gray-800'
                    }
                    variant="outline">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={order.payment_status === 'paid' ? "text-green-600 font-bold" : "text-yellow-600"}>
                    {order.payment_status ? order.payment_status : 'Unpaid'}
                  </span>
                </TableCell>

                <TableCell className="text-right flex justify-end gap-2">
                  {order.status === 'pending' && order.payment_status !== 'paid' && (
                    <Button
                      onClick={() => handlePayment(order)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700">
                      Pay Now
                    </Button>
                  )}
                  {order.status === 'pending' && order.payment_status !== 'paid' && (
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
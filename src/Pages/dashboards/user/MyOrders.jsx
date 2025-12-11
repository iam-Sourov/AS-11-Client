import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CreditCard,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [cancelId, setCancelId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  const handlePayment = async (order) => {
    setPayingId(order._id);
    const orderInfo = {
      _id: order._id,
      email: order.email,
      bookTitle: order.bookTitle,
      image: order.image,
      price: order.price,
    };

    try {
      const res = await axiosSecure.post("/payment-checkout-session", orderInfo);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Payment redirect failed", error);
      toast.error("Failed to initiate payment");
      setPayingId(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelId) return;

    try {
      await axiosSecure.patch(`/orders/cancel/${cancelId}`);
      toast.success("Order Cancelled");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setCancelId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
      shipped: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      cancelled: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    };

    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      shipped: <Truck className="w-3 h-3 mr-1" />,
      delivered: <CheckCircle className="w-3 h-3 mr-1" />,
      cancelled: <AlertCircle className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={`font-normal ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) return <OrdersSkeleton />;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
        <p className="text-muted-foreground">Track pending orders and view past purchases.</p>
      </div>
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[350px]">Product</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-9 rounded overflow-hidden bg-muted border">
                          <img
                            src={order.image}
                            alt={order.bookTitle}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                        </div>
                        <span className="font-medium text-foreground">{order.bookTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.date ? format(new Date(order.date), "MMM dd, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.price}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${order.payment_status === 'paid'
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-amber-600 bg-amber-50"
                        }`}>
                        {order.payment_status === 'paid' ? "PAID" : "UNPAID"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "pending" && order.payment_status !== "paid" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                              onClick={() => handlePayment(order)}
                              disabled={payingId === order._id}>
                              {payingId === order._id ? (
                                <span className="animate-pulse">Processing...</span>
                              ) : (
                                <>
                                  <CreditCard className="w-3.5 h-3.5 mr-2" /> Pay
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100"
                              onClick={() => setCancelId(order._id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                        {(order.payment_status === 'paid' || order.status !== 'pending') && (
                          <span className="text-xs text-muted-foreground italic">No actions</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12 mb-3 opacity-20" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">You haven't placed any orders yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700">
              Yes, Cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const OrdersSkeleton = () => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-12 w-9 rounded" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default MyOrders;
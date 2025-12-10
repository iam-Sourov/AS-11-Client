import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const updatePayment = async () => {
  //     try {
  //       await axiosSecure.patch(`/orders/payment-success/${id}`, {
  //         payment_status: "paid",
  //         status: "completed",
  //         date: new Date(),
  //       });
  //       const { data } = await axiosSecure.get(`/orders/${id}`);
  //       setOrder(data);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   updatePayment();
  // }, [id,axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-lg">Updating payment...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto text-green-600 w-16 h-16 mb-4" />
          <CardTitle className="text-3xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your payment for <strong>{order?.bookTitle}</strong> has been
            successfully completed.
          </p>

          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link to="/dashboard/my-orders">Go to Orders</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id')
  console.log(sessionId)

  useEffect(() => {
    if (sessionId) {
      axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
        .then(res => {
          console.log(res.data);
          setLoading(false)
        })
    }
  }, [sessionId, axiosSecure])


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="text-lg text-gray-500">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full shadow-lg border-t-4 border-t-green-600">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto text-green-600 w-20 h-20 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-800">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 text-lg">
            Thank you! Your payment has been successfully verified and your order is now being processed.
          </p>

          <div className="pt-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
              <Link to="/dashboard/my-orders">
                View My Orders
              </Link>
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            Transaction ID: <span className="font-mono">{sessionId?.slice(-10)}...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

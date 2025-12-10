import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <XCircle className="mx-auto text-red-600 w-16 h-16 mb-4" />
          <CardTitle className="text-3xl font-bold text-red-600">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your payment was not completed. You can try again anytime.
          </p>
          <Button asChild className="w-full bg-red-600 hover:bg-red-700">
            <Link to="/dashboard/my-orders">Back to Orders</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;

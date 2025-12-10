import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext";

const Invoices = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["my-invoices", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="p-4">Loading Invoices...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Invoices</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-mono text-xs">
                    {invoice.transactionId || "N/A"}
                  </TableCell>
                  
                  <TableCell>{invoice.bookTitle}</TableCell>
                  
                  <TableCell className="font-bold text-green-600">
                    ${invoice.price}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(invoice.paymentDate || invoice.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Invoices;
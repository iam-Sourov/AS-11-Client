import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, MoreHorizontal, AlertCircle, PackageOpen } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageBooks = () => {
  const axiosSecure = useAxiosSecure();
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: books = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axiosSecure.delete(`/books/${deleteId}`);
      toast.success("Book deleted successfully", {
        description: "The book and associated orders have been removed.",
      });
      refetch();
    } catch (error) {
      toast.error("Failed to delete book", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your library collection ({books.length} items)
          </p>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[400px]">Book Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PackageOpen className="h-10 w-10 mb-2 opacity-20" />
                    <p>No books in inventory.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book._id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-10 overflow-hidden rounded-md border bg-muted">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium leading-none truncate max-w-[200px]">
                          {book.title}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {book.author}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    ${book.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(book._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Book
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book
              <span className="font-semibold text-foreground">
                {" "}{books.find((b) => b._id === deleteId)?.title}{" "}
              </span>
              and remove all associated order data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const TableSkeleton = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-6">
    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
    <div className="border rounded-xl bg-card">
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-8 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ManageBooks;
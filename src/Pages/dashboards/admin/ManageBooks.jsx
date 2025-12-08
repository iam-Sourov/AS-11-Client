import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2'; 
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageBooks = () => {
  const axiosSecure = useAxiosSecure();

  const { data: books = [], refetch } = useQuery({
    queryKey: ['all-books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the book AND all its orders!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/books/${id}`);
          Swal.fire("Deleted!", "Book and orders have been deleted.", "success");
          refetch();
        } catch (error) {
          Swal.fire("Error", "Could not delete book", error);
        }
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin: Manage All Books</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <img src={book.image_url} alt="" className="w-8 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="text-xs text-gray-500">{book.librarianEmail}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageBooks;
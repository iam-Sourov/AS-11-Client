import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyBooks = () => {
    const { user } = useContext(AuthContext) ; // Get logged in user
    const axiosInstance = useAxiosSecure();

    const { data: books = [] } = useQuery({
        queryKey: ['my-books', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/books/librarian/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Added Books</h2>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book._id}>
                                <TableCell>
                                    <img src={book.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                                </TableCell>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs text-white ${book.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                        {book.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/dashboard/update-book/${book._id}`}>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Edit size={14} /> Edit
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MyBooks;
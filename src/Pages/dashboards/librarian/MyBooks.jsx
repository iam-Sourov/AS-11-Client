import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyBooks = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const { data: books = [], isLoading } = useQuery({
        queryKey: ['my-books', user?.displayName],
        enabled: !!user?.displayName,
        queryFn: async () => {
            const res = await axiosSecure.get(`/books/${user.displayName}`);
            return res.data;
        }
    });
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const res = await axiosSecure.patch(`/books/${id}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Book updated successfully!");
            queryClient.invalidateQueries(['my-books']);
            setIsEditOpen(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update book");
        }
    });

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setNewStatus(book.status)
        setIsEditOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
            title: form.title.value,
            author: form.author.value,
            price: parseFloat(form.price.value),
            image: form.image_url.value,
            status: newStatus
        };

        updateMutation.mutate({ id: selectedBook._id, updatedData });
    };

    if (isLoading) return <div className="p-10 text-center">Loading books...</div>;

    return (
        <div className="p-6 bg-background min-h-screen">
            <h2 className="text-2xl font-bold mb-6">My Added Books ({books.length})</h2>

            <div className="border rounded-md shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book._id}>
                                <TableCell>
                                    <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded border" />
                                </TableCell>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>${book.price}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.status === 'published'
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                        {book.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => handleEditClick(book)}>
                                        <Edit size={14} /> Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Book Details</DialogTitle>
                        <DialogDescription>
                            Modify book details or change publication status.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBook && (
                        <form onSubmit={handleUpdateSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" defaultValue={selectedBook.title} className="col-span-3" required />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="author" className="text-right">Author</Label>
                                <Input id="author" name="author" defaultValue={selectedBook.author} className="col-span-3 bg-muted" readOnly />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input id="price" name="price" type="number" defaultValue={selectedBook.price} className="col-span-3" required />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image_url" className="text-right">Image URL</Label>
                                <Input id="image_url" name="image_url" defaultValue={selectedBook.image_url} className="col-span-3" required />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <div className="col-span-3">
                                    <Select
                                        onValueChange={setNewStatus}
                                        defaultValue={selectedBook.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="unpublished">Unpublished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyBooks;
import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Ban, CheckCircle } from 'lucide-react'; // Added CheckCircle for Publish icon
import { toast } from 'sonner';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyBooks = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    // 1. Setup React Hook Form (Removed 'status' from defaults)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            author: '',
            price: '',
            image: ''
        }
    });

    const { data: books = [], isLoading } = useQuery({
        queryKey: ['my-books', user?.displayName],
        enabled: !!user?.displayName,
        queryFn: async () => {
            if (!user?.displayName) return [];
            const res = await axiosSecure.get(`/books/${user.displayName}`);
            return res.data;
        }
    });

    // 2. Update form values when a book is selected (Removed 'status')
    useEffect(() => {
        if (selectedBook) {
            reset({
                title: selectedBook.title,
                author: selectedBook.author,
                price: selectedBook.price,
                image: selectedBook.image
            });
        }
    }, [selectedBook, reset]);

    // 3. Mutation for Updating Book Details (General Edit)
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

    // 4. Mutation for Toggling Status (Publish/Unpublish)
    const statusMutation = useMutation({
        mutationFn: async ({ id, newStatus }) => {
            // Send only the status field
            const res = await axiosSecure.patch(`/books/${id}`, { status: newStatus });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Book ${variables.newStatus} successfully!`);
            queryClient.invalidateQueries(['my-books']);
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsEditOpen(true);
    };

    const handleStatusChange = (id, newStatus) => {
        statusMutation.mutate({ id, newStatus });
    };

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            price: parseFloat(data.price),
            image: data.image 
        };
        updateMutation.mutate({
            id: selectedBook._id,
            updatedData: formattedData
        });
    };

    if (isLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" />Loading books...</div>;

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
                        {books.length > 0 ? (
                            books.map((book) => (
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
                                            : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            {book.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => handleEditClick(book)}>
                                                <Edit size={14} /> Edit
                                            </Button>

                                            {book.status === 'unpublished' ? (
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleStatusChange(book._id, 'published')}
                                                    disabled={statusMutation.isPending}
                                                >
                                                    {statusMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                    Publish
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => handleStatusChange(book._id, 'unpublished')}
                                                    disabled={statusMutation.isPending}
                                                >
                                                    {statusMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                                                    Unpublish
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No books found. Add some books to see them here!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal - Status Field Removed */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Book Details</DialogTitle>
                        <DialogDescription>
                            Make changes to your book here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" className="col-span-3" {...register("title", { required: true })} />
                        </div>

                        {/* Author (Read Only) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author" className="text-right">Author</Label>
                            <Input id="author" className="col-span-3 bg-muted" readOnly {...register("author")} />
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input id="price" type="number" className="col-span-3" {...register("price", { required: true })} />
                        </div>

                        {/* Image URL */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">Image URL</Label>
                            <Input id="image" className="col-span-3" {...register("image", { required: true })} />
                        </div>

                        {/* STATUS FIELD REMOVED FROM HERE */}

                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyBooks;
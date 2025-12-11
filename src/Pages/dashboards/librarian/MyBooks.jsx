import React, { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    MoreHorizontal,
    Loader2,
    Pencil,
    Globe,
    Archive,
    BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyBooks = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: { title: '', price: '', image: '' }
    });

    const watchedImage = watch('image');

    const { data: books = [], isLoading } = useQuery({
        queryKey: ['my-books', user?.displayName],
        enabled: !!user?.displayName,
        queryFn: async () => {
            if (!user?.displayName) return [];
            const res = await axiosSecure.get(`/books/${user.displayName}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (selectedBook) {
            reset({
                title: selectedBook.title,
                price: selectedBook.price,
                image: selectedBook.image
            });
        }
    }, [selectedBook, reset]);

    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const res = await axiosSecure.patch(`/books/${id}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Book details updated");
            queryClient.invalidateQueries(['my-books']);
            setIsEditOpen(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || "Update failed")
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, newStatus }) => {
            const res = await axiosSecure.patch(`/books/${id}`, { status: newStatus });
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast.success(variables.newStatus === 'published' ? "Book published!" : "Book archived");
            queryClient.invalidateQueries(['my-books']);
        },
        onError: () => toast.error("Failed to update status")
    });

    const onSubmit = (data) => {
        updateMutation.mutate({
            id: selectedBook._id,
            updatedData: { ...data, price: parseFloat(data.price) }
        });
    };

    if (isLoading) return (
        <div className="flex h-[50vh] w-full items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading library...
        </div>
    );

    return (
        <div className="container mx-auto p-6 md:p-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Collection</h2>
                    <p className="text-muted-foreground">Manage the books you've contributed to the library.</p>
                </div>
                <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                    Total: {books.length}
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[400px]">Book Details</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <BookOpen className="h-10 w-10 mb-2 opacity-20" />
                                        <p>You haven't added any books yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={book._id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-9 rounded-sm overflow-hidden bg-muted border">
                                                <img
                                                    src={book.image}
                                                    alt={book.title}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
                                            </div>
                                            <div>
                                                <div className="font-medium">{book.title}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{book._id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">${book.price}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={book.status === 'published' ? 'default' : 'secondary'}
                                            className={book.status === 'published' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                            {book.status}
                                        </Badge>
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
                                                <DropdownMenuItem onClick={() => { setSelectedBook(book); setIsEditOpen(true); }}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {book.status === 'unpublished' ? (
                                                    <DropdownMenuItem onClick={() => statusMutation.mutate({ id: book._id, newStatus: 'published' })}>
                                                        <Globe className="mr-2 h-4 w-4 text-emerald-600" /> Publish
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => statusMutation.mutate({ id: book._id, newStatus: 'unpublished' })}>
                                                        <Archive className="mr-2 h-4 w-4 text-orange-600" /> Unpublish
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                        <DialogDescription>Update the details for your book listing.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="flex gap-4">
                            <div className="w-1/3 shrink-0">
                                <div className="aspect-2/3 w-full rounded-md border bg-muted overflow-hidden relative">
                                    {watchedImage ? (
                                        <img src={watchedImage} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Preview</div>
                                    )}
                                </div>
                            </div>
                            <div className="w-2/3 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" {...register("title", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" step="0.01" {...register("price", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input id="image" {...register("image", { required: true })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
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
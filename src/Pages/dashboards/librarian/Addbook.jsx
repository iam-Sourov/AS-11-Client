import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';

const CATEGORIES = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Mystery & Thriller",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Children",
    "Romance"
];

const AddBook = () => {
    const { user } = useContext(AuthContext);
    console.log(user)
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            status: 'published',
            category: '',
            price: ''
        }
    });


    const onSubmit = async (data) => {
        const toastId = toast.loading("Uploading image and adding book...");

        try {
            const formData = new FormData();
            formData.append('image', data.image[0]);

            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`, formData);
            const imageUrl = res.data.data.display_url;
            const bookData = {
                title: data.title,
                author: data.author,
                price: parseFloat(data.price),
                category: data.category,
                status: data.status,
                image: imageUrl,
                rating: 1,
                description: data.description,
                email: user?.email
            };
            await axiosSecure.post('/books', bookData);
            toast.success("Book Added Successfully", { id: toastId });
            reset();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add book. Please try again.", { id: toastId });
        }
    };
    return (
        <div className="max-w-2xl mx-auto p-8 border rounded-xl shadow-sm bg-card mt-10 mb-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Add New Book</h2>
                <p className="text-muted-foreground mt-2">Enter the details to add a book to the library.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label>Book Title</Label>
                    <Input
                        {...register("title", { required: "Title is required" })}
                        placeholder="e.g. The Great Gatsby"
                    />
                    {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                </div>

                {/* Author */}
                <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input defaultValue={user.displayName} readOnly
                        {...register("author", { required: "Author is required" })}
                        placeholder="Author Name"
                    />
                    {errors.author && <span className="text-red-500 text-xs">{errors.author.message}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Price (USD)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("price", { required: "Price is required", min: 0 })}
                            placeholder="0.00" />
                        {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="unpublished">Unpublished</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        {...register("description", { required: "Description is required" })}
                        placeholder="Write a short summary of the book..."
                        className="h-32 resize-none" />
                    {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label>Book Cover Image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        {...register("image", { required: "Image is required" })}
                        className="cursor-pointer file:text-primary" />
                    {errors.image && <span className="text-red-500 text-xs">{errors.image.message}</span>}
                </div>
                <Button type="submit" className="w-full font-semibold text-lg py-6">
                    Add Book
                </Button>
            </form>
        </div>
    );
};

export default AddBook;
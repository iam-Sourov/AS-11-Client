import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { AuthContext } from '../../../contexts/AuthContext';
import useRole from '../../../hooks/useRole';

const AddBook = () => {
    const { user } = useContext(AuthContext)
    const [role] = useRole();
    console.log(role)
    const { register, handleSubmit, setValue, reset } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        const toastId = toast.loading("Adding book...");
        try {
            // 1. Upload Image
            const formData = new FormData();
            formData.append('image', data.image[0]);
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`, formData);
            const imageUrl = res.data.data.display_url;

            // 2. Prepare Data
            const bookData = {
                title: data.title,
                author: data.author,
                price_USD: parseFloat(data.price),
                discounted_price_USD: parseFloat(data.price), // Default same or add field
                status: data.status, // published / unpublished
                image_url: imageUrl,
                quantity: parseInt(data.quantity)
            };

            // 3. Save to DB
            await axiosSecure.post('/books', bookData);
            toast.success("Book Added Successfully", { id: toastId });
            reset();
        } catch (err) {
            toast.error("Failed to add book", { id: toastId });
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label className="mb-2">Book Title</Label>
                    <Input {...register("title", { required: true })} placeholder="Enter book name" />
                </div>
                <div>
                    <Label className="mb-2">Author Name</Label>
                    <Input {...register("author", { required: true })} defaultValue={user?.displayName} placeholder="Author name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="mb-2">Price (USD)</Label>
                        <Input type="number" step="0.01" {...register("price", { required: true })} />
                    </div>
                    <div>
                        <Label className="mb-2">Quantity</Label>
                        <Input type="number" {...register("quantity", { required: true })} />
                    </div>
                </div>
                <div>
                    <Label className="mb-2">Status</Label>
                    <Select onValueChange={(val) => setValue("status", val)} defaultValue="published">
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="unpublished">Unpublished</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="mb-2">Book Cover Image</Label>
                    <Input type="file" {...register("image", { required: true })} className="cursor-pointer" />
                </div>

                <Button type="submit" className="w-full">Add Book</Button>
            </form>
        </div>
    );
};

export default AddBook;
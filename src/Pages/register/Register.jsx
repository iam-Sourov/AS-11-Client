import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { toast } from "sonner";
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthContext } from '../../contexts/AuthContext';
import useAxios from '../../hooks/useAxios';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  image: z.any().optional(),
});

const Register = () => {
  const { signUp, updateUser, GoogleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || '/';

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating Account...");
    try {
      let photoURL = null;
      if (data.image) {
        const formData = new FormData();
        formData.append("image", data.image);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_KEY}`,
          formData
        );
        photoURL = res.data.data.display_url;
      }
      await signUp(data.email, data.password);
      await updateUser({
        displayName: data.name,
        photoURL: photoURL,
      });
      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: photoURL,
        role: "user",
      };
      const dbResponse = await useAxios.post("/users", userInfo);
      if (dbResponse?.data?.insertedId) {
        toast.success("Registration Successful!", { id: toastId });
        navigate("/");
      } else {
        toast.success("Account created, please login.", { id: toastId });
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || "Registration failed", { id: toastId });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await GoogleLogin();

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "user",
      };
      await useAxios.post("/users", userInfo);

      toast.success("Google Login Successful!");
      navigate(from, { replace: true });

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Join BookLibrary today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="********" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                  {imagePreview ? <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" /> : <Upload className="text-gray-400 h-6 w-6" />}
                </div>

                <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Register</Button>
          </form>

          <div className="my-4 flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-500 uppercase">Or</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" onClick={handleGoogleLogin} className="w-full gap-2">
            Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
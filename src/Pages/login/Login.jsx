import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthContext } from '../../contexts/AuthContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Login = () => {
  const { LogIn, GoogleLogin } = useContext(AuthContext); 
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
const axios = useAxiosSecure()
  const onLogin = async ({ email, password }) => {
    try {
      await LogIn(email, password);
      toast.success("Login Successful!");
      navigate(from, { replace: true });

    } catch (err) {
    
      console.error(err);
      toast.error("Invalid Email or Password");
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
      await axios.post("/users", userInfo);
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
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Login to access your BookLibrary account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" {...register("email", { required: "Email is required" })} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="********" {...register("password", { required: "Password is required" })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
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
          <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
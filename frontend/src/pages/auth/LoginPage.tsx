import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Chrome, Eye, EyeOff, Github, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSuccess } from "@/features/auth/authSlice";
import { RequestInterceptor } from "@/lib/api/interceptor";
import { useLoginMutation } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const from = location.state?.from?.pathname || "/app/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await RequestInterceptor.handleRequest(
        () =>
          login({
            email: data.email,
            password: data.password,
          }).unwrap(),
        {
          onSuccess: () => {
            // The login success will be handled by the mutation result
            toast.success("Welcome back to the circus!");
            navigate(from, { replace: true });
          },
          onError: (error) => {
            console.error("Login error:", error);
          },
          successMessage: "Login successful!",
          errorMessage: "Login failed. Please check your credentials.",
          showToast: true,
        },
        "LOGIN"
      );

      // Handle the successful login response
      if (result.success && result.data) {
        dispatch(
          loginSuccess({
            access_token: result.data.access_token,
            refresh_token: result.data.refresh_token,
            user: {
              id: result.data.user?.id || result.data.id,
              name: result.data.user?.name || result.data.name,
              email: result.data.user?.email || result.data.email,
              isAdmin: result.data.isAdmin,
            },
          })
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    toast.loading(`Signing in with ${provider}...`);
    // TODO: Implement social login
    setTimeout(() => {
      toast.dismiss();
      toast.error(`${provider} login not implemented yet`);
    }, 2000);
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-space-300">
          Sign in to your SocialSphere account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => handleSocialLogin("google")}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => handleSocialLogin("github")}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-space-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-space-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="rounded border-white/20 bg-white/10 text-cosmic-500 focus:ring-cosmic-500"
                {...register("rememberMe")}
              />
              <Label htmlFor="rememberMe" className="text-space-300 text-sm">
                Remember me
              </Label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-cosmic-400 hover:text-cosmic-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full cosmic" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-space-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-cosmic-400 hover:text-cosmic-300 transition-colors font-medium"
            >
              Sign up
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

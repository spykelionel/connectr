import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Chrome,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import { getPasswordStrength } from "@/lib/utils";
import { useRegisterMutation } from "@/services/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    gender: z.string().optional(),
    contact: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await RequestInterceptor.handleRequest(
        () =>
          register({
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            contact: data.contact,
          }).unwrap(),
        {
          onSuccess: () => {
            toast.success(
              "Account created successfully! Welcome to CircusPrime!"
            );
            navigate("/app/dashboard", { replace: true });
          },
          onError: (error) => {
            console.error("Registration error:", error);
          },
          successMessage: "Registration successful!",
          errorMessage: "Registration failed. Please try again.",
          showToast: true,
        },
        "REGISTER"
      );

      // Handle the successful registration response
      if (result.success && result.data) {
        dispatch(
          loginSuccess({
            access_token: result.data.access_token,
            refresh_token: result.data.refresh_token,
            user: {
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              isAdmin: result.data.isAdmin,
            },
          })
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    toast.loading(`Signing up with ${provider}...`);
    // TODO: Implement social login
    setTimeout(() => {
      toast.dismiss();
      toast.error(`${provider} registration not implemented yet`);
    }, 2000);
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return "text-red-400";
    if (score <= 3) return "text-yellow-400";
    return "text-green-400";
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Join SocialSphere
        </CardTitle>
        <CardDescription className="text-space-300">
          Create your account and start connecting
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                {...registerField("name")}
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

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
                {...registerField("email")}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white">
                Gender (Optional)
              </Label>
              <select
                id="gender"
                className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-space-400 focus:outline-none focus:ring-2 focus:ring-cosmic-400 focus:border-cosmic-400"
                {...registerField("gender")}
              >
                <option value="" className="bg-space-900 text-white">
                  Select gender
                </option>
                <option value="male" className="bg-space-900 text-white">
                  Male
                </option>
                <option value="female" className="bg-space-900 text-white">
                  Female
                </option>
                <option value="other" className="bg-space-900 text-white">
                  Other
                </option>
                <option
                  value="prefer-not-to-say"
                  className="bg-space-900 text-white"
                >
                  Prefer not to say
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-white">
                Contact (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-space-400" />
                <Input
                  id="contact"
                  type="tel"
                  placeholder="Phone number"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                  {...registerField("contact")}
                />
              </div>
            </div>
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
                placeholder="Create a password"
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                {...registerField("password")}
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

            {/* Password Strength Indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-space-400">Password strength:</span>
                  <span className={getStrengthColor(passwordStrength.score)}>
                    {getStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        level <= passwordStrength.score
                          ? level <= 2
                            ? "bg-red-400"
                            : level <= 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-space-400">
                    <p>Password should include:</p>
                    <ul className="list-disc list-inside">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                {...registerField("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 text-space-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          <Button type="submit" className="w-full cosmic" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-space-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-cosmic-400 hover:text-cosmic-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;

"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api";
import { apiHelper } from "@/zustand/utils/api";
import { signupSchema, SignupFormValues } from "@/lib/validations";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsRegistering(true);
      // Create a new object without confirmPassword
      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await apiHelper.post(API_CONFIG.endpoints.auth.signup, signupData);

      toast.success("Account created successfully", {
        description: "You can now log in with your credentials.",
      });

      // Redirect to login page after successful signup
      router.push("/auth/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";

      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Nimbus</span>
            </a>
            <h1 className="text-xl font-bold">Create an account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="underline text-sm text-muted-foreground hover:text-primary"
              >
                Login
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isRegistering}
            >
              {isRegistering ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        By clicking create account, you agree to our{" "}
        <a href="/legal/terms" className="hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" className="hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

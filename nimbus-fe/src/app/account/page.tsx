"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiHelper } from "@/zustand/utils/api.utils";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { changePasswordSchema } from "@/lib/validations";
import AppLayout from "@/layouts/app-layout";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// Define the user response type
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initialize profile form with empty values
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Initialize password change form with empty values
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await apiHelper.get<{ data: UserData }>(
          API_CONFIG.endpoints.auth.profile,
        );
        if (response.data && response.data.data) {
          reset({
            name: response.data.data.name,
            email: response.data.data.email,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load user profile data";
        toast.error("Error loading profile", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [reset]);

  // Handle profile form submission
  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      await apiHelper.put(
        API_CONFIG.endpoints.auth.profile.replace("/me", "/update-profile"),
        data,
      );
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully",
      });
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error("Update failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle password change form submission
  async function onPasswordChange(data: ChangePasswordFormValues) {
    try {
      setIsChangingPassword(true);

      // Only pass currentPassword and newPassword to the API
      const passwordChangeData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      await apiHelper.put(
        API_CONFIG.endpoints.auth.changePassword,
        passwordChangeData,
      );

      toast.success("Password updated", {
        description: "Your password has been updated successfully",
      });

      resetPassword();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      toast.error("Password update failed", {
        description: errorMessage,
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Account", href: "/settings/account" }]}>
      <div className="container mx-auto py-10">
        <div className="grid gap-6 mx-auto ">
          {/* Profile Information */}
          <Card className="bg-black border-none">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings and change your personal
                information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    disabled={isLoading}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Your email"
                    {...register("email")}
                    disabled={isLoading}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    type="submit"
                    disabled={isLoading}
                    className="bg-black"
                  >
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-black border-none">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePasswordSubmit(onPasswordChange)}
                className="space-y-6"
              >
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("currentPassword")}
                    disabled={isChangingPassword}
                    aria-invalid={
                      passwordErrors.currentPassword ? "true" : "false"
                    }
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("newPassword")}
                    disabled={isChangingPassword}
                    aria-invalid={passwordErrors.newPassword ? "true" : "false"}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("confirmPassword")}
                    disabled={isChangingPassword}
                    aria-invalid={
                      passwordErrors.confirmPassword ? "true" : "false"
                    }
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-black"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

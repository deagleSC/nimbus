"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { changePasswordSchema } from "@/lib/validations";
import AppLayout from "@/layouts/app-layout";
import Link from "next/link";
import { useUserStore } from "@/zustand/stores/userStore";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Trash2, User } from "lucide-react";

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function AccountPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const {
    userData,
    isLoading,
    fetchUserProfile,
    updateProfile,
    changePassword,
  } = useUserStore();

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
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Update form when user data is loaded
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
      });
    }
  }, [userData, reset]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  // Handle profile form submission
  async function onSubmit(data: ProfileFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);

    if (selectedImage) {
      formData.append("image", selectedImage);
    } else if (!previewUrl && userData?.image) {
      // If there's no preview URL and we had an image before, it means we want to remove the image
      formData.append("image", "");
    } else {
      // If we're not changing the image, don't include the image field at all
      formData.append("image", userData?.image || "");
    }

    await updateProfile(formData);
    router.refresh();
  }

  // Handle password change form submission
  async function onPasswordChange(data: ChangePasswordFormValues) {
    await changePassword(data.currentPassword, data.newPassword);
    resetPassword();
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-24 h-24 rounded-full border overflow-hidden drop-shadow-glow-1">
                    {previewUrl || userData?.image ? (
                      <Image
                        src={previewUrl || userData?.image || ""}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-black"
                        >
                          Update Image
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() =>
                            document.getElementById("profile-image")?.click()
                          }
                          className="cursor-pointer"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          <span>Upload Image</span>
                        </DropdownMenuItem>
                        {(previewUrl || userData?.image) && (
                          <DropdownMenuItem
                            onClick={handleRemoveImage}
                            className="cursor-pointer text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove Current</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
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
                    value={userData?.email || ""}
                    disabled={true}
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">
                    Email address cannot be updated. Please{" "}
                    <Link
                      href="/support"
                      className="text-blue-500 hover:text-blue-500/80"
                    >
                      contact support
                    </Link>{" "}
                    if you need to change your email.
                  </p>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className="bg-black"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
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

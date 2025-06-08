import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiHelper } from "@/zustand/utils/api.utils";
import { API_CONFIG } from "@/config/api";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
}

interface UserState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      userData: null,
      isLoading: false,
      error: null,

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiHelper.get<{ data: UserData }>(
            API_CONFIG.endpoints.auth.profile,
          );
          if (response.data && response.data.data) {
            set({ userData: response.data.data });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load user profile data";
          set({ error: errorMessage });
          toast.error("Error loading profile", {
            description: errorMessage,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (formData: FormData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiHelper.put<{ data: UserData }>(
            API_CONFIG.endpoints.auth.profile.replace("/me", "/update-profile"),
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          if (response.data && response.data.data) {
            set({ userData: response.data.data });
          }

          toast.success("Profile updated", {
            description: "Your profile has been updated successfully",
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update profile";
          set({ error: errorMessage });
          toast.error("Update failed", {
            description: errorMessage,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          await apiHelper.put(API_CONFIG.endpoints.auth.changePassword, {
            currentPassword,
            newPassword,
          });
          toast.success("Password updated", {
            description: "Your password has been updated successfully",
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update password";
          set({ error: errorMessage });
          toast.error("Password update failed", {
            description: errorMessage,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "user-store" },
  ),
);

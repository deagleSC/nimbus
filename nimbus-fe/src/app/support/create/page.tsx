"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiHelper } from "@/zustand/utils/api.utils";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/zustand";
import SupportLayout from "@/layouts/support-layout";

const SUPPORT_REQUEST_LIMITS = {
  SUBJECT_MIN: 5,
  SUBJECT_MAX: 100,
  MESSAGE_MIN: 20,
  MESSAGE_MAX: 1000,
} as const;

const supportFormSchema = z.object({
  subject: z
    .string()
    .min(SUPPORT_REQUEST_LIMITS.SUBJECT_MIN, {
      message: `Subject must be at least ${SUPPORT_REQUEST_LIMITS.SUBJECT_MIN} characters.`,
    })
    .max(SUPPORT_REQUEST_LIMITS.SUBJECT_MAX, {
      message: `Subject must not exceed ${SUPPORT_REQUEST_LIMITS.SUBJECT_MAX} characters.`,
    }),
  message: z
    .string()
    .min(SUPPORT_REQUEST_LIMITS.MESSAGE_MIN, {
      message: `Message must be at least ${SUPPORT_REQUEST_LIMITS.MESSAGE_MIN} characters.`,
    })
    .max(SUPPORT_REQUEST_LIMITS.MESSAGE_MAX, {
      message: `Message must not exceed ${SUPPORT_REQUEST_LIMITS.MESSAGE_MAX} characters.`,
    }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function CreateSupportRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState({
    subject: 0,
    message: 0,
  });
  const user = useAuthStore((state) => state.user);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to submit a support request.",
      });
      router.push("/auth/login");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Watch for changes in subject and message to update character count
  const subject = watch("subject");
  const message = watch("message");

  // Update character count when subject or message changes
  useEffect(() => {
    setCharCount({
      subject: subject.length,
      message: message.length,
    });
  }, [subject, message]);

  async function onSubmit(data: SupportFormValues) {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to submit a support request.",
      });
      router.push("/auth/login");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiHelper.post(API_CONFIG.endpoints.support.request, data);
      toast.success("Support request submitted", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
      setCharCount({ subject: 0, message: 0 });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit support request";
      toast.error("Submission failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Don't render the form if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <SupportLayout
      breadcrumbs={[
        { title: "Contact Support", href: "/support" },
        { title: "Create", href: "/support/create" },
      ]}
    >
      <div className="container mx-auto">
        <div className="mx-auto">
          <Card className="bg-transparent border-none px-0">
            <CardHeader className="px-0">
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Need help? Fill out the form below and our support team will get
                back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-0">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What do you need help with?"
                    {...register("subject")}
                    disabled={isSubmitting}
                    aria-invalid={errors.subject ? "true" : "false"}
                    maxLength={SUPPORT_REQUEST_LIMITS.SUBJECT_MAX}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="text-red-500">
                      {errors.subject?.message}
                    </span>
                    <span>
                      {charCount.subject}/{SUPPORT_REQUEST_LIMITS.SUBJECT_MAX}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your request..."
                    {...register("message")}
                    disabled={isSubmitting}
                    aria-invalid={errors.message ? "true" : "false"}
                    className="min-h-[150px]"
                    maxLength={SUPPORT_REQUEST_LIMITS.MESSAGE_MAX}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="text-red-500">
                      {errors.message?.message}
                    </span>
                    <span>
                      {charCount.message}/{SUPPORT_REQUEST_LIMITS.MESSAGE_MAX}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SupportLayout>
  );
}

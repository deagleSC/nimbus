"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AppLayout from "@/layouts/app-layout";

export default function PreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [theme, setTheme] = useState("system");

  // Function to handle notification preference toggle
  const handleNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
    // In a real implementation, this would also save to the backend
    toast.success("Notification preferences updated");
  };

  // Function to handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value);
    // In a real implementation, this would also save to the backend
    toast.success("Theme preference updated");
  };

  return (
    <AppLayout
      breadcrumbs={[{ title: "Preferences", href: "/settings/preferences" }]}
    >
      <div className="container mx-auto py-10">
        <div className="grid gap-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="block">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={emailNotifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application appears.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

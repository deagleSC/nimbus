"use client";

import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
export function AppBranding() {
  // For demo purposes - in a real app, you would get this from the user's subscription
  // This is a placeholder until you implement plan data in your API/models
  const userPlan = {
    value: "PRO",
    label: "Pro",
  };

  return (
    <SidebarMenuButton
      size="lg"
      className="hover:bg-sidebar-muted"
      //   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Nimbus</span>
        <span className="truncate text-xs">{userPlan?.label}</span>
      </div>
    </SidebarMenuButton>
  );
}

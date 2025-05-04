"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore, useSidebarStore } from "@/zustand";
import { AppBranding } from "./app-branding";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);
  const { sidebarData, setActiveNav } = useSidebarStore();
  const pathname = usePathname();

  // Update active nav item based on current path
  useEffect(() => {
    if (pathname) {
      setActiveNav(pathname);
    }
  }, [pathname, setActiveNav]);

  const userData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

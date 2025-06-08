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
import { useSidebarStore, useUserStore } from "@/zustand";
import { AppBranding } from "./app-branding";
import { isEmpty } from "lodash";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useUserStore((state) => state.userData);
  const getUserData = useUserStore((state) => state.fetchUserProfile);
  const { sidebarData, setActiveNav } = useSidebarStore();
  const pathname = usePathname();

  // Update active nav item based on current path
  useEffect(() => {
    if (pathname) {
      setActiveNav(pathname);
    }
  }, [pathname, setActiveNav]);

  useEffect(() => {
    if (isEmpty(userData)) {
      getUserData();
    }
  }, [userData, getUserData]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData ?? { name: "", email: "", image: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

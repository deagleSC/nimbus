"use client";

import * as React from "react";
import {
  Brain,
  LayoutDashboard,
  PlayCircle,
  Settings,
  Trophy,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/zustand";
import { AppBranding } from "./app-branding";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  const data = {
    user: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
    },
    // teams: [
    //   {
    //     name: "Nimbus",
    //     logo: Trophy,
    //     plan: "Pro",
    //   },
    //   /* MVP: Focus on single team for now
    //   {
    //     name: "City League",
    //     logo: Users,
    //     plan: "Club",
    //   },
    //   {
    //     name: "School Team",
    //     logo: GraduationCap,
    //     plan: "Free",
    //   },
    //   */
    // ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "/dashboard/overview",
          },
          /* MVP: Focus on core dashboard features
          {
            title: "Analytics",
            url: "/dashboard/analytics",
          },
          {
            title: "Progress",
            url: "/dashboard/progress",
          },
          */
        ],
      },
      {
        title: "Play",
        url: "/play",
        icon: PlayCircle,
        items: [
          {
            title: "New Game",
            url: "/play/new",
          },
          {
            title: "Join Game",
            url: "/play/join",
          },
          /* MVP: Focus on core gameplay features
          {
            title: "Tournament",
            url: "/play/tournament",
          },
          */
        ],
      },
      {
        title: "AI Coach",
        url: "/coach",
        icon: Brain,
        items: [
          {
            title: "Analyze Game",
            url: "/coach/analyze",
          },
          {
            title: "Training Puzzles",
            url: "/coach/puzzles",
          },
          {
            title: "Opening Trainer",
            url: "/coach/openings",
          },
          {
            title: "Strategy Tips",
            url: "/coach/strategy",
          },
        ],
      },
      /* MVP: Advanced features to implement later
      {
        title: "Library",
        url: "/library",
        icon: BookOpen,
        items: [
          {
            title: "My Games",
            url: "/library/games",
          },
          {
            title: "Saved Studies",
            url: "/library/studies",
          },
          {
            title: "Openings Database",
            url: "/library/openings",
          },
          {
            title: "Famous Games",
            url: "/library/famous",
          },
        ],
      },
      {
        title: "Community",
        url: "/community",
        icon: Users,
        items: [
          {
            title: "Friends",
            url: "/community/friends",
          },
          {
            title: "Clubs",
            url: "/community/clubs",
          },
          {
            title: "Tournaments",
            url: "/community/tournaments",
          },
          {
            title: "Forums",
            url: "/community/forums",
          },
        ],
      },
      {
        title: "Learn",
        url: "/learn",
        icon: GraduationCap,
        items: [
          {
            title: "Courses",
            url: "/learn/courses",
          },
          {
            title: "Video Lessons",
            url: "/learn/videos",
          },
          {
            title: "Interactive Tutorials",
            url: "/learn/tutorials",
          },
          {
            title: "Chess Articles",
            url: "/learn/articles",
          },
        ],
      },
      */
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        items: [
          {
            title: "Account",
            url: "/settings/account",
          },
          {
            title: "Preferences",
            url: "/settings/preferences",
          },
          /* MVP: Focus on core settings
          {
            title: "Subscription",
            url: "/settings/subscription",
          },
          {
            title: "Notifications",
            url: "/settings/notifications",
          },
          */
        ],
      },
    ],
    /* MVP: Focus on core functionality first
    tournaments: [
      {
        name: "Weekly Blitz",
        url: "/tournaments/weekly-blitz",
        icon: Zap,
        status: "Ongoing",
      },
      {
        name: "Monthly Classical",
        url: "/tournaments/monthly-classical",
        icon: Clock,
        status: "Registration Open",
      },
      {
        name: "Team League",
        url: "/tournaments/team-league",
        icon: Flag,
        status: "Upcoming",
      },
    ],
    quickLinks: [
      {
        name: "Daily Puzzle",
        url: "/puzzles/daily",
        icon: Puzzle,
      },
      {
        name: "Leaderboard",
        url: "/leaderboard",
        icon: BarChart,
      },
      {
        name: "Stream Games",
        url: "/stream",
        icon: Radio,
      },
    ],
    */
    tournaments: [],
    quickLinks: [],
    projects: [],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

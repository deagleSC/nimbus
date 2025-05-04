import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Brain, LayoutDashboard, PlayCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: {
    title: string;
    url: string;
  }[];
};

type ProjectItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type TournamentItem = {
  name: string;
  url: string;
  icon: LucideIcon;
  status: string;
};

type QuickLinkItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type SidebarData = {
  navMain: NavItem[];
  projects: ProjectItem[];
  tournaments: TournamentItem[];
  quickLinks: QuickLinkItem[];
};

type SidebarState = {
  isOpen: boolean;
  sidebarData: SidebarData;
  toggle: () => void;
  close: () => void;
  open: () => void;
  updateNavItems: (navItems: NavItem[]) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  setActiveNav: (url: string) => void;
};

const defaultNavItems: NavItem[] = [
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
    ],
  },
  {
    title: "AI Coach",
    url: "/ai-coach",
    icon: Brain,
    items: [
      {
        title: "Analyze Game",
        url: "/ai-coach/analysis",
      },
      {
        title: "Training Puzzles",
        url: "/ai-coach/puzzles",
      },
      {
        title: "Opening Trainer",
        url: "/ai-coach/openings",
      },
      {
        title: "Strategy Tips",
        url: "/ai-coach/strategy",
      },
    ],
  },
  // {
  //   title: "About",
  //   url: "/about",
  //   icon: Info,
  //   items: [
  //     {
  //       title: "Our Team",
  //       url: "/about/team",
  //     },
  //     {
  //       title: "Mission",
  //       url: "/about/mission",
  //     },
  //     {
  //       title: "Contact",
  //       url: "/about/contact",
  //     },
  //   ],
  // },
];

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isOpen: true,
        sidebarData: {
          navMain: defaultNavItems,
          projects: [],
          tournaments: [],
          quickLinks: [],
        },
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
        close: () => set({ isOpen: false }),
        open: () => set({ isOpen: true }),
        updateNavItems: (navItems) =>
          set((state) => ({
            sidebarData: {
              ...state.sidebarData,
              navMain: navItems,
            },
          })),
        updateProjects: (projects) =>
          set((state) => ({
            sidebarData: {
              ...state.sidebarData,
              projects,
            },
          })),
        setActiveNav: (url) =>
          set((state) => {
            const updatedNavItems = state.sidebarData.navMain.map((item) => ({
              ...item,
              isActive:
                item.url === url ||
                url.startsWith(item.url) ||
                item.items.some((subItem) => subItem.url === url),
            }));
            return {
              sidebarData: {
                ...state.sidebarData,
                navMain: updatedNavItems,
              },
            };
          }),
      }),
      {
        name: "sidebar-storage",
        partialize: (state) => ({ isOpen: state.isOpen }),
      },
    ),
    { name: "sidebar-store" },
  ),
);

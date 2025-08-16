"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "{{APP_NAME}}",
      logo: GalleryVerticalEnd,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
        {
          title: "Reports",
          url: "/admin/reports",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Bot,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Add User",
          url: "/admin/users/new",
        },
        {
          title: "User Roles",
          url: "/admin/users/roles",
        },
      ],
    },
    {
      title: "Content",
      url: "/admin/content",
      icon: BookOpen,
      items: [
        {
          title: "Posts",
          url: "/admin/content/posts",
        },
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Media",
          url: "/admin/content/media",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings",
        },
        {
          title: "Security",
          url: "/admin/settings/security",
        },
        {
          title: "Integrations",
          url: "/admin/settings/integrations",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website",
      url: "/admin/projects/website",
      icon: Frame,
    },
    {
      name: "Analytics",
      url: "/admin/projects/analytics",
      icon: PieChart,
    },
    {
      name: "Documentation",
      url: "/admin/projects/docs",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
  )
}
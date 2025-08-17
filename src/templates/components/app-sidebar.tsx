"use client"

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { getAppName } from "@/lib/app-config"
import { getIconComponent } from "@/lib/icons"
import { NavigationConfig } from "@/types/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigation?: NavigationConfig
}

export function AppSidebar({ navigation, ...props }: AppSidebarProps) {
  const brand = {
    name: getAppName(),
    logo: GalleryVerticalEnd,
  }

  // Default user if none provided
  const defaultUser = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  }

  // Convert string icons to components for NavMain
  const navGroupsWithIcons = navigation?.navGroups?.map((group) => ({
    ...group,
    icon: getIconComponent(group.icon),
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <a href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <brand.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{brand.name}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroupsWithIcons && (
          <NavMain items={navGroupsWithIcons} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigation?.user || defaultUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
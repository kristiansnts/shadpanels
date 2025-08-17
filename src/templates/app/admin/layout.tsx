import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar"
import { getAppName, getDashboardTitle } from "@/lib/app-config"
import { NavigationConfig } from "@/types/navigation"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function generateMetadata(): Metadata {
  const appName = getAppName();
  const title = getDashboardTitle();
  
  return {
    title,
    description: `${appName} Dashboard`,
  };
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigationConfig: NavigationConfig = {
    navGroups: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: "layout-dashboard",
        isActive: true,
      },
    ],
    user: {
      name: "shadcn",
      email: "shadpanel@admin.com",
      avatar: "",
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar navigation={navigationConfig} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
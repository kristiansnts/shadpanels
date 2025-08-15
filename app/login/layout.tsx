import type { Metadata } from "next";
import { getAppName } from "@/lib/app-config"

export function generateMetadata(): Metadata {
  const appName = getAppName();
  
  return {
    title: `Login - ${appName}`,
    description: `Login to ${appName}`,
  };
}

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
// app/(dashboard)/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthMe } from "@/hooks/useAuthMe";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getMenuItemByPath } from "@/constants/menuItems";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: user, isLoading, isError, refetch } = useAuthMe();

  // Check token dan initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      
      setIsChecking(false);
      
      // Delay sebentar untuk smooth transition
      setTimeout(() => {
        setIsInitializing(false);
      }, 100); // Minimal delay
    };

    initializeAuth();
  }, [router]);

  // Handle authentication errors
  useEffect(() => {
    if (!isLoading && !isChecking && !isInitializing) {
      if (isError) {
        console.log("Layout: Authentication error detected:", isError);
        if (!user) {
          console.log("Layout: No user data with error, logging out");
          localStorage.removeItem("token");
          router.replace("/auth/login");
        }
      } else if (user) {
        console.log("Layout: User authenticated successfully:", user.name, user.role_name);
      }
    }
  }, [isLoading, isError, user, router, isChecking, isInitializing]);

  const { menuItem } = getMenuItemByPath(pathname);
  const activeMenuName = menuItem?.name || "Dashboard";

  // Prevent flash
  if (isChecking) {
    return null;
  }

  // Loading state - tampilkan saat initializing atau loading
  if (isLoading || isInitializing) {
    return (
      <LoadingScreen 
        message="Loading your profile..." 
        submessage="Please wait a moment" 
      />
    );
  }

  // Error state
  if (isError || !user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
  <div className="h-screen flex w-full overflow-hidden relative bg-white pl-1 gap-4">
    {/* Decorative background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007BFF]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A0F000]/5 rounded-full blur-3xl"></div>
    </div>

    {/* Sidebar dengan rounded */}
    <div className="hidden lg:block flex-shrink-0 relative z-10 rounded-3xl overflow-hidden">
      <AppSidebar activeItem={activeMenuName} />
    </div>

    {/* Main Area dengan rounded */}
    <SidebarInset className="flex-1 flex flex-col min-w-0 relative z-10 rounded-l-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-white/40">
      <div className="flex-shrink-0">
        <Header />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </div>
      </main>

      <div className="flex-shrink-0">
        <Footer />
      </div>
    </SidebarInset>
  </div>
</SidebarProvider>
  );
};

export default DashboardLayout;
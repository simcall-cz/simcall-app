"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Get role from profile
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setUserRole(data?.role || "free");
          });
      }
    });
  }, []);

  // Determine sidebar variant from URL path + user role
  let variant: "agent" | "manager" | "team_manager" | "admin";
  if (pathname.startsWith("/admin")) {
    variant = "admin";
  } else if (userRole === "admin") {
    variant = "admin";
  } else if (userRole === "team_manager") {
    variant = "team_manager";
  } else if (pathname.startsWith("/manager")) {
    variant = "manager";
  } else {
    variant = "agent";
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-25">
      <Sidebar
        variant={variant}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

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
  const [roleLoaded, setRoleLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setUserRole(data?.role || "free");
            setRoleLoaded(true);
          });
      } else {
        setRoleLoaded(true);
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
      {roleLoaded ? (
        <Sidebar
          variant={variant}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      ) : (
        <div className="hidden lg:flex w-64 shrink-0 items-center justify-center border-r border-neutral-100 bg-white">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500" />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

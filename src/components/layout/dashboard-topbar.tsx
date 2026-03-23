"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, ChevronRight, Lightbulb } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

const breadcrumbLabels: Record<string, string> = {
  dashboard: "Dashboard",
  hovory: "Hovory",
  "novy-hovor": "Nový hovor",
  statistiky: "Statistiky",
  profil: "Profil",
  admin: "Admin",
  uzivatele: "Uživatelé",
  upozorneni: "Upozornění",
  agenti: "Agenti",
  dotazy: "Dotazy",
  manager: "Manager",
  tym: "Tým",
  schuzky: "Schůzky",
  platby: "Platby",
};

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAdminPath) {
      fetch("/api/admin/notifications/unread")
        .then((res) => {
          if (res.ok) return res.json();
          return { count: 0 };
        })
        .then((data) => {
          if (typeof data.count === "number") {
            setUnreadCount(data.count);
          }
        })
        .catch(console.error);
    }
  }, [isAdminPath, pathname]);

  // Build breadcrumb segments
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: breadcrumbLabels[seg] || seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="h-14 sm:h-16 border-b border-neutral-100 bg-white flex items-center justify-between px-3 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Otevřít menu"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-0.5 lg:hidden">
          <span className="text-lg font-bold text-neutral-800">Sim</span>
          <span className="text-lg font-bold text-primary-500">Call</span>
        </Link>

        {/* Breadcrumb */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />}
              {crumb.isLast ? (
                <span className="text-neutral-800 font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Admin Notifications */}
        {isAdminPath && (
          <Link
            href="/admin/upozorneni"
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-neutral-50 transition-colors mr-1 sm:mr-2"
            aria-label="Upozornění"
          >
            <Lightbulb className="w-5 h-5 text-neutral-600 hover:text-yellow-500 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </Link>
        )}

        {/* New Call Button */}
        <Link
          href="/dashboard/hovory/novy-hovor"
          className={buttonVariants({ size: "sm" })}
        >
          <PhoneCall className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Nový hovor</span>
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  return (
    <header className="h-16 border-b border-neutral-100 bg-white flex items-center justify-between px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Otevřít menu"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-neutral-400">Dashboard</span>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Notifikace"
        >
          <Bell className="w-5 h-5 text-neutral-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* New Call Button */}
        <Link
          href="/dashboard/novy-hovor"
          className={buttonVariants({ size: "sm" })}
        >
          Nový hovor
        </Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Menu, Bell, PhoneCall } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
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
        <nav className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-neutral-400">Dashboard</span>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Notifikace"
        >
          <Bell className="w-5 h-5 text-neutral-500" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

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

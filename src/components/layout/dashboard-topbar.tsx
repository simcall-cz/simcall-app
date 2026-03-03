"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, ChevronRight } from "lucide-react";
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
  "financni-prehled": "Finance",
  agenti: "Agenti",
  dotazy: "Dotazy",
  manager: "Manager",
  tym: "Tým",
};

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();

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

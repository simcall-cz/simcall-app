"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Phone,
  BarChart3,
  User,
  Users,
  X,
  DollarSign,
  Shield,
  Bot,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  variant: "agent" | "manager" | "admin";
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const agentNavItems: SidebarNavItem[] = [
  {
    label: "Přehled",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Hovory",
    href: "/dashboard/hovory",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    label: "Statistiky",
    href: "/dashboard/statistiky",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: "Profil",
    href: "/dashboard/profil",
    icon: <User className="w-5 h-5" />,
  },
];

const managerNavItems: SidebarNavItem[] = [
  {
    label: "Přehled",
    href: "/manager",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Tým",
    href: "/manager/tym",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Přidat člena",
    href: "/manager/tym#pridat",
    icon: <UserPlus className="w-5 h-5" />,
  },
];

const adminNavItems: SidebarNavItem[] = [
  {
    label: "Přehled",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Uživatelé",
    href: "/admin/uzivatele",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Finance",
    href: "/admin/financni-prehled",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    label: "Agenti",
    href: "/admin/agenti",
    icon: <Bot className="w-5 h-5" />,
  },
  {
    label: "Dotazy",
    href: "/admin/dotazy",
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

export function Sidebar({ variant, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems =
    variant === "admin"
      ? adminNavItems
      : variant === "manager"
      ? managerNavItems
      : agentNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/manager" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-bold text-neutral-800">Sim</span>
            <span className="text-xl font-bold text-primary-500">Call</span>
          </Link>
          {variant === "admin" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-600 uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-50 transition-colors"
          aria-label="Zavřít menu"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary-50 text-primary-500"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            )}
          >
            <span
              className={cn(
                isActive(item.href) ? "text-primary-500" : "text-neutral-400"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            variant === "admin" ? "bg-primary-100" : "bg-neutral-100"
          )}>
            <span className={cn(
              "text-xs font-medium",
              variant === "admin" ? "text-primary-600" : "text-neutral-600"
            )}>
              {variant === "admin" ? "SC" : "JN"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {variant === "admin" ? "SimCall Admin" : "Jan Novák"}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {variant === "admin" ? "admin@simcall.cz" : "jan@realitka.cz"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:min-h-screen bg-white border-r border-neutral-100">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Sidebar Panel */}
          <aside className="relative w-[280px] h-full bg-white shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

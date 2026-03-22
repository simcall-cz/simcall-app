"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Phone,
  PhoneCall,
  BarChart3,
  User,
  Users,
  X,
  DollarSign,
  Shield,
  Bot,
  UserPlus,
  MessageSquare,
  LogOut,
  Loader2,
  LifeBuoy,
  Receipt,
  CreditCard,
  FileText,
  BookOpen,
  Dumbbell,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { getAuthHeaders } from "@/lib/auth";

interface SidebarProps {
  variant: "agent" | "manager" | "team_manager" | "admin";
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
    label: "Trénink",
    href: "/dashboard/hovory/novy-hovor",
    icon: <Dumbbell className="w-5 h-5" />,
  },
  {
    label: "Lekce",
    href: "/dashboard/lekce",
    icon: <GraduationCap className="w-5 h-5" />,
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
  {
    label: "Můj balíček",
    href: "/dashboard/balicek",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Podpora",
    href: "/dashboard/podpora",
    icon: <LifeBuoy className="w-5 h-5" />,
  },
];

const managerNavItems: SidebarNavItem[] = [
  {
    label: "Přehled týmu",
    href: "/manager",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Správa týmu",
    href: "/manager/tym",
    icon: <Users className="w-5 h-5" />,
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
    label: "Hovory",
    href: "/admin/hovory",
    icon: <PhoneCall className="w-5 h-5" />,
  },
  {
    label: "Platby",
    href: "/admin/platby",
    icon: <Receipt className="w-5 h-5" />,
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
  {
    label: "Podpora",
    href: "/admin/podpora",
    icon: <LifeBuoy className="w-5 h-5" />,
  },
];

export function Sidebar({ variant, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadTickets, setUnreadTickets] = useState(0);

  const isTeamManager = variant === "team_manager";
  const isAdmin = variant === "admin";

  const primaryNavItems =
    isAdmin
      ? adminNavItems
      : variant === "manager"
        ? managerNavItems
        : agentNavItems;

  // Fetch unread ticket count for agent sidebar
  useEffect(() => {
    if (isAdmin || variant === "manager") return;

    async function fetchUnread() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/tickets/unread", { headers });
        const data = await res.json();
        setUnreadTickets(data.count || 0);
      } catch {
        // silent
      }
    }

    fetchUnread();
    // Poll every 60 seconds for new responses
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [isAdmin, variant]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null);
        setUserName(
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          null
        );
      }
    });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear auth cookie
      document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";
      await supabase.auth.signOut();
      window.location.href = "/prihlaseni";
    } catch {
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/manager" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const initials = userName
    ? userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : userEmail?.[0]?.toUpperCase() || "?";

  const renderNavLink = (item: SidebarNavItem) => {
    const showBadge = item.href === "/dashboard/podpora" && unreadTickets > 0;
    return (
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
            "relative",
            isActive(item.href) ? "text-primary-500" : "text-neutral-400"
          )}
        >
          {item.icon}
          {showBadge && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadTickets}
            </span>
          )}
        </span>
        {item.label}
      </Link>
    );
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
          {(isAdmin || isTeamManager) && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              isAdmin
                ? "bg-primary-50 text-primary-600"
                : "bg-purple-50 text-purple-600"
            )}>
              {isAdmin ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
              {isAdmin ? "Admin" : "Manager"}
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
        {primaryNavItems.map(renderNavLink)}

        {/* Manager section for team_manager */}
        {isTeamManager && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Manager
              </p>
            </div>
            {managerNavItems.map(renderNavLink)}
          </>
        )}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-neutral-100 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            isAdmin ? "bg-primary-100" : isTeamManager ? "bg-purple-100" : "bg-neutral-100"
          )}>
            <span className={cn(
              "text-xs font-medium",
              isAdmin ? "text-primary-600" : isTeamManager ? "text-purple-600" : "text-neutral-600"
            )}>
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {userName || "Uživatel"}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {userEmail || "—"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          Odhlásit se
        </button>
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

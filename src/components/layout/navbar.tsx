"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { label: "Domů", href: "/" },
  { label: "Funkce", href: "/funkce" },
  { label: "AI Simulátor", href: "/ai-simulator" },
  { label: "Ceník", href: "/cenik" },
  { label: "FAQ", href: "/faq" },
  { label: "O nás", href: "/o-nas" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 text-white text-xs text-center py-1.5 px-4">
        <span className="opacity-80">🇨🇿 První AI simulátor pro realitní makléře v Česku</span>
        <Link href="/registrace" className="ml-3 text-primary-400 font-semibold hover:text-primary-300 transition-colors">
          Vyzkoušet zdarma →
        </Link>
      </div>

      <header
        className={cn(
          "fixed top-7 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl transition-all duration-300",
          isScrolled && "border-b border-neutral-100/80 bg-white/97 shadow-sm shadow-neutral-100/50"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 shrink-0">
              <span className="text-2xl font-black text-neutral-900 tracking-tight">Sim</span>
              <span className="text-2xl font-black text-primary-500 tracking-tight">Call</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors rounded-lg group",
                      isActive
                        ? "text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                    )}
                  >
                    {item.label}
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                    )}
                    {/* Hover underline */}
                    {!isActive && (
                      <span className="absolute bottom-0.5 left-3 right-3 h-px bg-neutral-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                href="/prihlaseni"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors px-2 py-1.5"
              >
                Přihlásit se
              </Link>
              <Link
                href="/demo"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow group"
                )}
              >
                Vyzkoušet demo
                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-neutral-50 transition-colors"
              aria-label={isMobileMenuOpen ? "Zavřít menu" : "Otevřít menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-neutral-800" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-800" />
              )}
            </button>
          </nav>
        </Container>

        {/* Mobile Menu — slide down */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-neutral-100",
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white">
            <Container className="py-4">
              <div className="flex flex-col">
                {navItems.map((item) => {
                  const isActive = item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between py-3 text-base font-medium border-b border-neutral-50 transition-colors",
                        isActive ? "text-primary-500" : "text-neutral-700 hover:text-primary-500"
                      )}
                    >
                      {item.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-col gap-3 pb-2">
                <Link
                  href="/prihlaseni"
                  className="text-center text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors py-2.5 border border-neutral-200 rounded-xl"
                >
                  Přihlásit se
                </Link>
                <Link
                  href="/demo"
                  className={cn(buttonVariants(), "w-full justify-center group")}
                >
                  Vyzkoušet demo
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Container>
          </div>
        </div>
      </header>

      {/* Spacer for announcement bar + navbar */}
      <div className="h-[92px]" />
    </>
  );
}

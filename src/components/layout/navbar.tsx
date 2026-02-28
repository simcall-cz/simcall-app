"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Funkce", href: "/funkce" },
  { label: "Pro makléře", href: "/pro-maklere" },
  { label: "Pro manažery", href: "/pro-manazery" },
  { label: "Ceník", href: "/cenik" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg transition-all duration-300",
        isScrolled && "border-b border-neutral-100 bg-white/95"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-xl font-bold text-neutral-800">ELITE</span>
            <span className="text-xl font-bold text-primary-500">AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/prihlaseni"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Přihlásit se
            </Link>
            <Link
              href="/demo"
              className={buttonVariants({ size: "sm" })}
            >
              Vyzkoušet demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-50 transition-colors"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden">
          <Container className="py-8">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-neutral-800 hover:text-primary-500 transition-colors py-3 border-b border-neutral-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/prihlaseni"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors py-3"
              >
                Přihlásit se
              </Link>
              <Link
                href="/demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(buttonVariants(), "w-full")}
              >
                Vyzkoušet demo
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

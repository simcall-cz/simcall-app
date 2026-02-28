import type { NavItem } from "@/types";

export const mainNavItems: NavItem[] = [
  {
    label: "Funkce",
    href: "/funkce",
    children: [
      { label: "AI Hlasový Agenti", href: "/funkce#ai-agenti" },
      { label: "Scénáře", href: "/funkce#scenare" },
      { label: "Analýza hovorů", href: "/funkce#analyza" },
      { label: "Gamifikace", href: "/funkce#gamifikace" },
    ],
  },
  {
    label: "Pro makléře",
    href: "/pro-maklere",
  },
  {
    label: "Pro manažery",
    href: "/pro-manazery",
  },
  {
    label: "Ceník",
    href: "/cenik",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Kontakt",
    href: "/kontakt",
  },
];

export const ctaNavItem: NavItem = {
  label: "Vyzkoušet demo",
  href: "/demo",
};

export const footerNavItems: {
  title: string;
  items: NavItem[];
}[] = [
  {
    title: "Produkt",
    items: [
      { label: "Funkce", href: "/funkce" },
      { label: "Ceník", href: "/cenik" },
      { label: "Demo", href: "/demo" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Pro koho",
    items: [
      { label: "Pro makléře", href: "/pro-maklere" },
      { label: "Pro manažery", href: "/pro-manazery" },
      { label: "Pro realitní kanceláře", href: "/pro-kancelare" },
    ],
  },
  {
    title: "Podpora",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Dokumentace", href: "/docs" },
      { label: "Návody", href: "/navody" },
    ],
  },
  {
    title: "Firma",
    items: [
      { label: "O nás", href: "/o-nas" },
      { label: "Blog", href: "/blog" },
      { label: "Ochrana soukromí", href: "/ochrana-soukromi" },
      { label: "Obchodní podmínky", href: "/obchodni-podminky" },
    ],
  },
];

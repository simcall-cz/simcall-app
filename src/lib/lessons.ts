export interface CategoryConfig {
  label: string;    // Czech display name
  icon: string;     // Lucide icon name
  color: string;    // Tailwind color class
}

// Map engine category IDs to Czech display config
export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  sales:        { label: "Prodej",              icon: "Home",           color: "blue" },
  rental:       { label: "Nájem",               icon: "Key",            color: "green" },
  finance:      { label: "Finance",             icon: "Banknote",       color: "amber" },
  legal:        { label: "Právní vady",         icon: "Scale",          color: "red" },
  cadastre:     { label: "Katastr",             icon: "Map",            color: "purple" },
  technical:    { label: "Technické",           icon: "Wrench",         color: "orange" },
  contracts:    { label: "Smlouvy",             icon: "FileText",       color: "indigo" },
  special:      { label: "Speciální typy",      icon: "Star",           color: "pink" },
  marketing:    { label: "Marketing",           icon: "Megaphone",      color: "cyan" },
  ethics:       { label: "Etika & klienti",     icon: "Shield",         color: "emerald" },
  objections:   { label: "Námitky",             icon: "MessageCircle",  color: "rose" },
  pricing:      { label: "Cenotvorba",          icon: "TrendingUp",     color: "yellow" },
  reluctant:    { label: "Neochotní klienti",   icon: "UserX",          color: "slate" },
  personality:  { label: "Osobnosti",           icon: "Users",          color: "violet" },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

// Tier display config
export const TIER_CONFIG = {
  beginner:     { label: "Začátečník",        color: "green" },
  intermediate: { label: "Středně pokročilý", color: "amber" },
  advanced:     { label: "Pokročilý",         color: "red" },
} as const;

export const TIERS = Object.keys(TIER_CONFIG) as Array<keyof typeof TIER_CONFIG>;

// Progress levels (kept from old system, extended to 105)
export const PROGRESS_LEVELS = [
  { min: 0,  max: 10,  label: "Nováček",           title: "Nováček",           description: "Začínáte svou cestu",           emoji: "🌱" },
  { min: 11, max: 30,  label: "Začátečník",        title: "Začátečník",        description: "Učíte se základy",             emoji: "📘" },
  { min: 31, max: 50,  label: "Pokročilý",         title: "Pokročilý",         description: "Máte solidní základ",           emoji: "📗" },
  { min: 51, max: 70,  label: "Zkušený makléř",    title: "Zkušený makléř",    description: "Vaše dovednosti rostou",        emoji: "📙" },
  { min: 71, max: 90,  label: "Expert",            title: "Expert",            description: "Blížíte se k mistrovství",      emoji: "🏆" },
  { min: 91, max: 105, label: "Elitní makléř",     title: "Elitní makléř",     description: "Jste na vrcholu",               emoji: "👑" },
];

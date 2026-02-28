import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "1 490 Kč/měsíc",
    priceAnnual: "1 290 Kč/měsíc",
    description:
      "Ideální pro jednotlivé makléře, kteří chtějí zlepšit své telefonní dovednosti a zvýšit úspěšnost hovorů.",
    features: [
      "5 AI agentů k tréninku",
      "5 scénářů",
      "20 tréninkových hovorů měsíčně",
      "Základní analýza hovorů",
      "Přepis hovoru",
      "Sledování pokroku",
      "E-mailová podpora",
    ],
    highlighted: false,
    cta: "Začít s Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    price: "2 990 Kč/měsíc",
    priceAnnual: "2 490 Kč/měsíc",
    description:
      "Pro ambiciózní makléře, kteří chtějí maximální pokrok. Neomezený přístup ke všem funkcím a pokročilá analytika.",
    features: [
      "Všech 10 AI agentů",
      "Všechny scénáře + vlastní",
      "Neomezené tréninkové hovory",
      "Pokročilá analýza hovorů",
      "Detailní feedback a doporučení",
      "Gamifikace a žebříčky",
      "Lekce a vzdělávací obsah",
      "Achievementy a odznaky",
      "Prioritní podpora",
    ],
    highlighted: true,
    cta: "Vyzkoušet zdarma na 14 dní",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Na míru",
    priceAnnual: "Na míru",
    description:
      "Pro realitní kanceláře a týmy. Kompletní řešení s manažerským přehledem, CRM integrací a vlastní konfigurací.",
    features: [
      "Vše z Professional",
      "Manažerský dashboard",
      "Přehled výkonnosti týmu",
      "CRM integrace",
      "Vlastní scénáře a AI agenti",
      "Firemní branding",
      "API přístup",
      "Dedikovaný account manažer",
      "Onboarding a školení týmu",
      "SLA garantovaná dostupnost",
    ],
    highlighted: false,
    cta: "Kontaktujte nás",
  },
];

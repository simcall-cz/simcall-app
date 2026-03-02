import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "solo",
    name: "Solo",
    description:
      "Pro jednotlivé makléře, kteří chtějí zlepšit své telefonní dovednosti a zvýšit úspěšnost hovorů.",
    tiers: [
      { calls: 50, agents: 5, price: 490 },
      { calls: 100, agents: 10, price: 990 },
      { calls: 250, agents: 25, price: 1990 },
      { calls: 500, agents: 50, price: 3490 },
      { calls: 1000, agents: 100, price: 4990 },
    ],
    features: [
      { label: "AI analýza hovoru" },
      { label: "Přepis hovoru" },
      { label: "Historie hovorů a nahrávky" },
      { label: "Sledování pokroku a podrobné statistiky" },
      { label: "Personalizovaná doporučení" },
      { label: "Pokročilá analýza (detailní scoring)" },
      { label: "Export přepisů (PDF/CSV)" },
    ],
    highlighted: false,
    cta: "Vybrat Solo",
    ctaLink: "/checkout",
  },
  {
    id: "team",
    name: "Team",
    description:
      "Pro firmy a týmy. Správa celého týmu z jednoho místa s neomezeným počtem členů.",
    tiers: [
      { calls: 250, agents: 25, price: 2490 },
      { calls: 500, agents: 50, price: 4490 },
      { calls: 1000, agents: 100, price: 7990 },
      { calls: 2500, agents: 250, price: 14990 },
      { calls: 5000, agents: 500, price: 24990 },
    ],
    features: [
      { label: "Vše ze Solo" },
      {
        label: "Manager dashboard",
        tooltip: "Přehled výkonu celého týmu na jednom místě",
      },
      { label: "Neomezený počet uživatelských profilů" },
      {
        label: "Správa týmu",
        tooltip:
          "Vytvářejte a spravujte účty členů týmu přímo z dashboardu",
      },
      {
        label: "Analytika zaměstnanců",
        tooltip:
          "Sledujte pokrok, úspěšnost a aktivitu každého člena",
      },
      {
        label: "Žebříčky v týmu",
        tooltip:
          "Gamifikace — srovnání výkonu mezi členy motivuje ke zlepšení",
      },
      {
        label: "Sdílená banka hovorů",
        tooltip:
          "Hovory se čerpají ze společného poolu, rozdělíte jak potřebujete",
      },
    ],
    highlighted: true,
    cta: "Vybrat Team",
    ctaLink: "/checkout",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Kompletní řešení na míru pro velké realitní kanceláře s vlastním brandingem a dedikovanou podporou.",
    tiers: [],
    features: [
      { label: "Vše z Team" },
      {
        label: "White-label",
        tooltip:
          "Vlastní logo a branding — SimCall vystupuje pod značkou vaší firmy",
      },
      {
        label: "Vlastní AI agenti a scénáře na míru",
        tooltip:
          "Vytvořte scénáře z reálných situací vaší firmy — zaškolte tým na problémy, které jste už v praxi řešili, a předejděte opakovaným chybám",
      },
      {
        label: "Dedikovaný account manažer",
        tooltip:
          "Přímý kontakt na vašeho osobního vývojáře ze SimCall, který vám pomůže s čímkoli — od nastavení po nové analytiky a funkce na míru",
      },
      { label: "Neomezený počet hovorů" },
      { label: "Neomezený počet agentů + vlastní agenti" },
    ],
    highlighted: false,
    cta: "Domluvit schůzku",
    ctaLink: "/domluvit-schuzku",
  },
];

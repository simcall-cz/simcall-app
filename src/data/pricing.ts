import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    id: "solo",
    name: "Solo",
    description:
      "Pro jednotlivé makléře, kteří chtějí zlepšit své telefonní dovednosti a zvýšit úspěšnost hovorů.",
    tiers: [
      { calls: 100, agents: 10, price: 990 },
      { calls: 250, agents: 20, price: 2490 },
      { calls: 500, agents: 50, price: 4990 },
      { calls: 1000, agents: 100, price: 9990 },
    ],
    features: [
      { label: "AI analýza hovoru" },
      { label: "Přepis hovoru" },
      { label: "Historie hovorů a nahrávky" },
      { label: "Sledování pokroku a podrobné statistiky" },
      { label: "Personalizovaná doporučení" },
      { label: "Pokročilá analýza (detailní scoring)" },
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
      { calls: 500, agents: 50, price: 7490 },
      { calls: 1000, agents: 100, price: 14990 },
      { calls: 2500, agents: 200, price: 37490 },
      { calls: 5000, agents: 500, price: 74990 },
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
          "Gamifikace a srovnání výkonu mezi členy motivuje ke zlepšení",
      },
      {
        label: "Sdílený pool minut",
        tooltip:
          "Minuty se čerpají ze společného poolu, rozdělíte jak potřebujete",
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
        label: "Whitelabel",
        tooltip:
          "Vlastní logo a branding, SimCall odteď vystupuje pod značkou vaší firmy",
      },
      {
        label: "Vlastní AI agenti a scénáře na míru",
        tooltip:
          "Vytvořte scénáře z reálných situací vaší firmy a zaškolte tým na problémy, které jste už v praxi řešili, čímž předejdete opakovaným chybám",
      },
      {
        label: "Dedikovaný account manažer",
        tooltip:
          "Přímý kontakt na vašeho osobního vývojáře ze SimCall, který vám pomůže se vším od nastavení po nové analytiky a funkce na míru",
      },
      { label: "Počet minut a agentů dohodou" },
    ],
    highlighted: false,
    cta: "Domluvit schůzku",
    ctaLink: "/domluvit-schuzku",
  },
];

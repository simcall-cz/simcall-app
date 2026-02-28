import type { Achievement } from "@/types/dashboard";

export const achievements: Achievement[] = [
  {
    id: "achievement-1",
    title: "První hovor",
    description: "Absolvujte svůj první tréninkový hovor s AI agentem.",
    icon: "Phone",
    earned: true,
    earnedDate: "2025-09-16",
  },
  {
    id: "achievement-2",
    title: "Týdenní série",
    description:
      "Absolvujte alespoň jeden tréninkový hovor každý den po dobu 7 dní v řadě.",
    icon: "Flame",
    earned: true,
    earnedDate: "2025-10-03",
  },
  {
    id: "achievement-3",
    title: "Stohovorák",
    description: "Absolvujte celkem 100 tréninkových hovorů.",
    icon: "Target",
    earned: true,
    earnedDate: "2025-12-18",
  },
  {
    id: "achievement-4",
    title: "Přemožitel skeptiků",
    description:
      "Dosáhněte skóre nad 80 % v hovoru se skeptickým klientem (Jana Nováková).",
    icon: "Shield",
    earned: true,
    earnedDate: "2026-01-15",
  },
  {
    id: "achievement-5",
    title: "Mistr vyjednávání",
    description:
      "Úspěšně obhajte provizi nad 3,5 % ve scénáři vyjednávání o provizi.",
    icon: "Handshake",
    earned: false,
  },
  {
    id: "achievement-6",
    title: "Dvoustovka",
    description: "Absolvujte celkem 200 tréninkových hovorů.",
    icon: "Award",
    earned: true,
    earnedDate: "2026-02-10",
  },
  {
    id: "achievement-7",
    title: "Všestranný makléř",
    description:
      "Absolvujte alespoň 5 hovorů v každé kategorii scénářů (horký lead, studený kontakt, konkurence, vyjednávání, listing).",
    icon: "Star",
    earned: false,
  },
  {
    id: "achievement-8",
    title: "Měsíční šampion",
    description:
      "Dosáhněte průměrného skóre nad 80 % za celý kalendářní měsíc s minimálně 30 hovory.",
    icon: "Crown",
    earned: false,
  },
];

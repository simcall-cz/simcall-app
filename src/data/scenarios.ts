import type { Scenario } from "@/types";

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    title: "Přesvědčení skeptického prodejce",
    description:
      "Petr Horák prodává rodinný dům 5+kk v Černošicích sám přes Bezrealitky už 3 měsíce. Měl špatné zkušenosti s dvěma makléři. Je frustrovaný, úsečný a podezřívavý. Vaším cílem je získat si jeho důvěru a domluvit si schůzku.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Překonat počáteční odmítnutí a cynismus",
      "Prokázat znalost lokality a konkrétních cen v Černošicích",
      "Identifikovat chyby předchozích makléřů a odlišit se",
      "Domluvit si osobní schůzku (i když jen 15 minut)",
    ],
    agentId: "agent-1",
  },
];

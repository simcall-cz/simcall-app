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
  {
    id: "scenario-6",
    title: "Prodej sklepní kóje v Pardubicích",
    description: "Viktor Bílek prodává sklepní kóji 8 m² v Pardubicích-Dukle. Mluví stroze a pomalu, nechce se otevírat. Má zmatené odhady od různých makléřů. Skrývá vadu — hliníkové rozvody (nebezpečí požáru). Cenová představa 100-300 tis. Kč.",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Překonat počáteční strozí komunikaci a získat důvěru",
      "Zjistit detaily nemovitosti včetně technického stavu",
      "Odhalit skrytou vadu (hliníkové rozvody)",
      "Pracovat s námitkami (provize, nespěch, mám kupce)",
      "Domluvit si osobní schůzku a prohlídku"
    ],
    agentId: "agent-6"
  },
  {
    id: "scenario-zbynek",
    title: "Formulář na webu — Finanční tíseň",
    description: "Zbyněk Zajíc nezávazně odeslal formulář z webu — potřebuje vyřešit urgentní prodej bytu kvůli hrozící exekuci a spotřebitelským úvěrům. Čas hraje proti němu, avšak zůstává skeptickým realistou, který vyžaduje fakta a důkazy.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Potvrdit, že jste četli formulář (klient to velmi ocení)",
      "Projevit diskrétní pochopení situace, aniž byste ho soudili",
      "Předložit konkrétní prokazatelné reference (nemá rád sliby)",
      "Domluvit osobní schůzku ještě tento týden (nenechat ho čekat)",
    ],
    agentId: "agent-zbynek",
    imageUrl: "/scenarios/zbynek-form.png"
  },
];

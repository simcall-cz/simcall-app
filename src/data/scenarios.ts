import type { Scenario } from "@/types";

export const scenarios: Scenario[] = [

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

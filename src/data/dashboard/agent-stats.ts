import type { AgentProfile, DailyStats } from "@/types/dashboard";

export const agentProfile: AgentProfile = {
  id: "user-1",
  name: "Roman Filip",
  email: "roman.filip@remax.cz",
  company: "RE/MAX Premium",
  role: "Senior realitní makléř",
  avatarInitials: "RF",
  memberSince: "2025-09-15",
  totalCalls: 247,
  avgSuccessRate: 72,
  callsThisWeek: 14,
  bestScenario: "První kontakt s horkým leadem",
};

export const dailyStats: DailyStats[] = [
  { date: "2026-01-28", calls: 3, successRate: 65 },
  { date: "2026-01-29", calls: 5, successRate: 70 },
  { date: "2026-01-30", calls: 4, successRate: 68 },
  { date: "2026-01-31", calls: 2, successRate: 55 },
  { date: "2026-02-01", calls: 6, successRate: 75 },
  { date: "2026-02-02", calls: 3, successRate: 72 },
  { date: "2026-02-03", calls: 4, successRate: 78 },
  { date: "2026-02-04", calls: 5, successRate: 80 },
  { date: "2026-02-05", calls: 3, successRate: 62 },
  { date: "2026-02-06", calls: 4, successRate: 74 },
  { date: "2026-02-07", calls: 6, successRate: 82 },
  { date: "2026-02-08", calls: 2, successRate: 60 },
  { date: "2026-02-09", calls: 5, successRate: 76 },
  { date: "2026-02-10", calls: 4, successRate: 71 },
  { date: "2026-02-11", calls: 3, successRate: 69 },
  { date: "2026-02-12", calls: 7, successRate: 85 },
  { date: "2026-02-13", calls: 4, successRate: 73 },
  { date: "2026-02-14", calls: 5, successRate: 77 },
  { date: "2026-02-15", calls: 3, successRate: 66 },
  { date: "2026-02-16", calls: 6, successRate: 81 },
  { date: "2026-02-17", calls: 4, successRate: 74 },
  { date: "2026-02-18", calls: 5, successRate: 79 },
  { date: "2026-02-19", calls: 3, successRate: 68 },
  { date: "2026-02-20", calls: 4, successRate: 76 },
  { date: "2026-02-21", calls: 6, successRate: 83 },
  { date: "2026-02-22", calls: 5, successRate: 78 },
  { date: "2026-02-23", calls: 3, successRate: 71 },
  { date: "2026-02-24", calls: 4, successRate: 75 },
  { date: "2026-02-25", calls: 5, successRate: 80 },
  { date: "2026-02-26", calls: 2, successRate: 73 },
];

export const performanceByCategory = [
  { category: "Horké leady", successRate: 85, totalCalls: 62 },
  { category: "Studené kontakty", successRate: 58, totalCalls: 78 },
  { category: "Konkurenční situace", successRate: 71, totalCalls: 45 },
  { category: "Vyjednávání", successRate: 64, totalCalls: 35 },
  { category: "Získání zakázky", successRate: 73, totalCalls: 27 },
];

export const weeklyGoals = {
  callsTarget: 20,
  callsCompleted: 14,
  avgScoreTarget: 75,
  avgScoreCurrent: 72,
  scenariosTarget: 5,
  scenariosCompleted: 3,
};

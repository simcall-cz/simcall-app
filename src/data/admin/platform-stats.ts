import type {
  PlatformStats,
  DailyCallsData,
  MonthlyRevenueData,
  RecentRegistration,
  SystemMetrics,
} from "@/types/admin";

export const platformStats: PlatformStats = {
  totalUsers: 247,
  totalUsersTrend: 12,
  totalCalls: 3842,
  totalCallsTrend: 18,
  mrr: 124500,
  mrrTrend: 8,
  activeSubscribers: 89,
  activeSubscribersTrend: 5,
};

// Last 30 days of calls
export const dailyCallsData: DailyCallsData[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date(2026, 1, i + 1); // Feb 2026
    const base = 80 + Math.floor(Math.random() * 60);
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? 0.4 : 1;
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}.`,
      calls: Math.floor(base * weekend),
    };
  }
);

// Revenue last 6 months
export const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: "Září", revenue: 78000 },
  { month: "Říjen", revenue: 89500 },
  { month: "Listopad", revenue: 95200 },
  { month: "Prosinec", revenue: 102800 },
  { month: "Leden", revenue: 115300 },
  { month: "Únor", revenue: 124500 },
];

export const recentRegistrations: RecentRegistration[] = [
  {
    id: "reg-1",
    name: "Tomáš Veselý",
    email: "tomas@praguerealty.cz",
    company: "Prague Realty s.r.o.",
    plan: "professional",
    date: "2026-02-28T14:30:00",
  },
  {
    id: "reg-2",
    name: "Klára Benešová",
    email: "klara@homefinder.cz",
    company: "HomeFinder CZ",
    plan: "trial",
    date: "2026-02-27T09:15:00",
  },
  {
    id: "reg-3",
    name: "Martin Černý",
    email: "martin@luxuryestates.cz",
    company: "Luxury Estates",
    plan: "enterprise",
    date: "2026-02-26T16:45:00",
  },
  {
    id: "reg-4",
    name: "Eva Procházková",
    email: "eva@realitypro.cz",
    company: "Reality Pro",
    plan: "starter",
    date: "2026-02-25T11:20:00",
  },
  {
    id: "reg-5",
    name: "Petr Holub",
    email: "petr@centryremax.cz",
    company: "RE/MAX Centrum",
    plan: "professional",
    date: "2026-02-24T08:00:00",
  },
];

export const systemMetrics: SystemMetrics = {
  elevenlabsCalls: 12450,
  elevenlabsCreditsUsed: 78,
  elevenlabsCreditsTotal: 100,
  openaiTokens: 2340000,
  openaiCost: 4280,
  storageUsedGB: 12.4,
  storageTotalGB: 50,
  uptime: 99.97,
};

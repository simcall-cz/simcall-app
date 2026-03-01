import type { PlanRevenueBreakdown, ChurnData, Invoice } from "@/types/admin";

export const planRevenueBreakdown: PlanRevenueBreakdown[] = [
  { plan: "Starter", revenue: 15840, subscribers: 12, color: "#a3a3a3" },
  { plan: "Professional", revenue: 35820, subscribers: 18, color: "#3b82f6" },
  { plan: "Enterprise", revenue: 72840, subscribers: 8, color: "#ef4444" },
];

export const churnData: ChurnData[] = [
  { month: "Září", rate: 5.2 },
  { month: "Říjen", rate: 4.8 },
  { month: "Listopad", rate: 3.9 },
  { month: "Prosinec", rate: 4.1 },
  { month: "Leden", rate: 3.5 },
  { month: "Únor", rate: 2.8 },
];

export const invoices: Invoice[] = [
  { id: "inv-1", companyId: "comp-6", companyName: "Century 21 Brno", amount: 29900, status: "paid", issuedAt: "2026-02-01", paidAt: "2026-02-03", period: "Únor 2026" },
  { id: "inv-2", companyId: "comp-1", companyName: "RE/MAX Centrum", amount: 24900, status: "paid", issuedAt: "2026-02-01", paidAt: "2026-02-05", period: "Únor 2026" },
  { id: "inv-3", companyId: "comp-3", companyName: "Luxury Estates", amount: 18500, status: "paid", issuedAt: "2026-02-01", paidAt: "2026-02-02", period: "Únor 2026" },
  { id: "inv-4", companyId: "comp-2", companyName: "Prague Realty s.r.o.", amount: 14950, status: "pending", issuedAt: "2026-02-01", paidAt: null, period: "Únor 2026" },
  { id: "inv-5", companyId: "comp-5", companyName: "Reality Pro", amount: 11940, status: "paid", issuedAt: "2026-02-01", paidAt: "2026-02-08", period: "Únor 2026" },
  { id: "inv-6", companyId: "comp-7", companyName: "Moravská Realitka", amount: 3960, status: "overdue", issuedAt: "2026-02-01", paidAt: null, period: "Únor 2026" },
  { id: "inv-7", companyId: "comp-8", companyName: "Flat Zone Praha", amount: 1980, status: "overdue", issuedAt: "2026-01-01", paidAt: null, period: "Leden 2026" },
];

export const financialSummary = {
  mrr: 124500,
  arr: 1494000,
  avgRevenuePerUser: 1399,
  totalOutstanding: 20890,
  paidThisMonth: 99290,
};

// Platform-level stats
export interface PlatformStats {
  totalUsers: number;
  totalUsersTrend: number;
  totalCalls: number;
  totalCallsTrend: number;
  mrr: number;
  mrrTrend: number;
  activeSubscribers: number;
  activeSubscribersTrend: number;
}

// Daily calls for area chart
export interface DailyCallsData {
  date: string;
  calls: number;
}

// Monthly revenue for bar chart
export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

// Recent registration
export interface RecentRegistration {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "starter" | "professional" | "enterprise" | "trial";
  date: string;
}

// System metrics
export interface SystemMetrics {
  elevenlabsCalls: number;
  elevenlabsCreditsUsed: number;
  elevenlabsCreditsTotal: number;
  openaiTokens: number;
  openaiCost: number;
  storageUsedGB: number;
  storageTotalGB: number;
  uptime: number;
}

// Company
export interface Company {
  id: string;
  name: string;
  ico: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  agentCount: number;
  plan: "starter" | "professional" | "enterprise" | "trial";
  mrr: number;
  status: "active" | "trial" | "inactive";
  registeredAt: string;
  totalCalls: number;
  avgScore: number;
}

// Company detail includes members & invoices
export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: "makléř" | "manažer" | "admin";
  callsThisMonth: number;
  avgScore: number;
  lastActive: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  companyName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  issuedAt: string;
  paidAt: string | null;
  period: string;
}

// Admin user
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  company: string;
  companyId: string;
  role: "makléř" | "manažer" | "admin";
  lastActive: string;
  callsTotal: number;
  avgScore: number;
  plan: "starter" | "professional" | "enterprise" | "trial";
}

// Revenue breakdown by plan
export interface PlanRevenueBreakdown {
  plan: string;
  revenue: number;
  subscribers: number;
  color: string;
}

// Churn data
export interface ChurnData {
  month: string;
  rate: number;
}

// Error log entry
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  service: "elevenlabs" | "openai" | "supabase" | "vercel";
  message: string;
  severity: "error" | "warning" | "info";
}

import type { AdminUser } from "@/types/admin";

export const adminUsers: AdminUser[] = [
  { id: "u-1", name: "Jan Novotný", email: "jan@centryremax.cz", company: "RE/MAX Centrum", companyId: "comp-1", role: "admin", lastActive: "2026-02-28T10:00:00", callsTotal: 156, avgScore: 78, plan: "enterprise" },
  { id: "u-2", name: "Petr Holub", email: "petr@centryremax.cz", company: "RE/MAX Centrum", companyId: "comp-1", role: "manažer", lastActive: "2026-02-28T09:30:00", callsTotal: 89, avgScore: 82, plan: "enterprise" },
  { id: "u-3", name: "Marie Krejčí", email: "marie@centryremax.cz", company: "RE/MAX Centrum", companyId: "comp-1", role: "makléř", lastActive: "2026-02-27T16:00:00", callsTotal: 234, avgScore: 71, plan: "enterprise" },
  { id: "u-4", name: "Ondřej Marek", email: "ondrej@centryremax.cz", company: "RE/MAX Centrum", companyId: "comp-1", role: "makléř", lastActive: "2026-02-28T11:15:00", callsTotal: 198, avgScore: 68, plan: "enterprise" },
  { id: "u-5", name: "Tereza Vlková", email: "tereza@centryremax.cz", company: "RE/MAX Centrum", companyId: "comp-1", role: "makléř", lastActive: "2026-02-26T14:20:00", callsTotal: 167, avgScore: 75, plan: "enterprise" },
  { id: "u-6", name: "Tomáš Veselý", email: "tomas@praguerealty.cz", company: "Prague Realty s.r.o.", companyId: "comp-2", role: "admin", lastActive: "2026-02-28T14:30:00", callsTotal: 45, avgScore: 80, plan: "professional" },
  { id: "u-7", name: "Lucie Šimková", email: "lucie@praguerealty.cz", company: "Prague Realty s.r.o.", companyId: "comp-2", role: "makléř", lastActive: "2026-02-28T12:00:00", callsTotal: 312, avgScore: 73, plan: "professional" },
  { id: "u-8", name: "Filip Horák", email: "filip@praguerealty.cz", company: "Prague Realty s.r.o.", companyId: "comp-2", role: "makléř", lastActive: "2026-02-27T17:45:00", callsTotal: 201, avgScore: 69, plan: "professional" },
  { id: "u-9", name: "Martin Černý", email: "martin@luxuryestates.cz", company: "Luxury Estates", companyId: "comp-3", role: "admin", lastActive: "2026-02-28T08:00:00", callsTotal: 78, avgScore: 85, plan: "enterprise" },
  { id: "u-10", name: "Andrea Nová", email: "andrea@luxuryestates.cz", company: "Luxury Estates", companyId: "comp-3", role: "makléř", lastActive: "2026-02-27T15:30:00", callsTotal: 189, avgScore: 77, plan: "enterprise" },
  { id: "u-11", name: "Klára Benešová", email: "klara@homefinder.cz", company: "HomeFinder CZ", companyId: "comp-4", role: "admin", lastActive: "2026-02-27T09:15:00", callsTotal: 15, avgScore: 62, plan: "trial" },
  { id: "u-12", name: "Eva Procházková", email: "eva@realitypro.cz", company: "Reality Pro", companyId: "comp-5", role: "admin", lastActive: "2026-02-26T11:20:00", callsTotal: 67, avgScore: 72, plan: "professional" },
  { id: "u-13", name: "Lukáš Kratochvíl", email: "lukas@c21brno.cz", company: "Century 21 Brno", companyId: "comp-6", role: "admin", lastActive: "2026-02-28T08:30:00", callsTotal: 134, avgScore: 76, plan: "enterprise" },
  { id: "u-14", name: "Hana Pokorná", email: "hana@moravskarealitka.cz", company: "Moravská Realitka", companyId: "comp-7", role: "manažer", lastActive: "2026-02-25T16:00:00", callsTotal: 56, avgScore: 59, plan: "starter" },
  { id: "u-15", name: "David Vlček", email: "david@flatzone.cz", company: "Flat Zone Praha", companyId: "comp-8", role: "admin", lastActive: "2026-02-10T12:00:00", callsTotal: 34, avgScore: 52, plan: "starter" },
];

"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Phone,
  Users,
  TrendingUp,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getCompanyById,
  getCompanyMembers,
} from "@/data/admin/companies";
import { invoices } from "@/data/admin/financial";

const statusConfig = {
  active: { label: "Aktivní", variant: "success" as const },
  trial: { label: "Trial", variant: "warning" as const },
  inactive: { label: "Neaktivní", variant: "secondary" as const },
};

const planLabel: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
  trial: "Trial",
};

const invoiceStatusConfig = {
  paid: { label: "Zaplaceno", variant: "success" as const },
  pending: { label: "Čeká", variant: "warning" as const },
  overdue: { label: "Po splatnosti", variant: "secondary" as const },
};

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = getCompanyById(id);
  const members = getCompanyMembers(id);
  const companyInvoices = invoices.filter((inv) => inv.companyId === id);

  if (!company) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Firma nebyla nalezena</p>
        <Link href="/admin/firmy" className="text-primary-500 text-sm mt-2 inline-block">
          Zpět na seznam firem
        </Link>
      </div>
    );
  }

  const status = statusConfig[company.status];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/firmy"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na firmy
      </Link>

      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-primary-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-neutral-900">
                    {company.name}
                  </h1>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant="secondary">{planLabel[company.plan]}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {company.contactEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    IČO: {company.ico}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {company.phone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Company Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Makléřů", value: company.agentCount, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Hovorů celkem", value: company.totalCalls, icon: Phone, color: "bg-purple-50 text-purple-600" },
          { label: "Prům. skóre", value: `${company.avgScore}%`, icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "MRR", value: company.mrr > 0 ? `${(company.mrr).toLocaleString("cs-CZ")} Kč` : "—", icon: CreditCard, color: "bg-amber-50 text-amber-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">{stat.label}</p>
                    <p className="text-lg font-bold text-neutral-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Members Table + Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Členové ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Žádní členové
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Header */}
                  <div className="hidden sm:grid sm:grid-cols-6 gap-3 px-3 py-2 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                    <span className="col-span-2">Jméno</span>
                    <span>Role</span>
                    <span className="text-center">Hovory/m</span>
                    <span className="text-center">Skóre</span>
                    <span className="text-right">Aktivita</span>
                  </div>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-1 sm:grid-cols-6 gap-1 sm:gap-3 px-3 py-3 rounded-lg hover:bg-neutral-50 transition-colors items-center"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-600 shrink-0">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-neutral-400 truncate sm:hidden">
                            {member.role} · {member.callsThisMonth} hovorů · {member.avgScore}%
                          </p>
                        </div>
                      </div>
                      <p className="hidden sm:block text-xs text-neutral-600 capitalize">
                        {member.role}
                      </p>
                      <p className="hidden sm:block text-sm font-medium text-neutral-900 text-center">
                        {member.callsThisMonth}
                      </p>
                      <p className={`hidden sm:block text-sm font-bold text-center ${getScoreColor(member.avgScore)}`}>
                        {member.avgScore}%
                      </p>
                      <p className="hidden sm:block text-xs text-neutral-400 text-right">
                        {new Date(member.lastActive).toLocaleDateString("cs-CZ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Fakturace</CardTitle>
            </CardHeader>
            <CardContent>
              {companyInvoices.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Žádné faktury
                </p>
              ) : (
                <div className="space-y-3">
                  {companyInvoices.map((inv) => {
                    const invStatus = invoiceStatusConfig[inv.status];
                    return (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {inv.amount.toLocaleString("cs-CZ")} Kč
                          </p>
                          <p className="text-xs text-neutral-500">
                            {inv.period}
                          </p>
                        </div>
                        <Badge variant={invStatus.variant}>
                          {invStatus.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

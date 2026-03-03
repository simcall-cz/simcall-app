"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Archive,
  Phone,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface FormSubmission {
  id: string;
  type: "kontakt" | "schuzka" | "enterprise";
  status: "new" | "read" | "replied" | "archived";
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string | null;
  meeting_date: string | null;
  meeting_time: string | null;
  team_size: string | null;
  created_at: string;
}

interface FormCounts {
  total: number;
  new: number;
  read: number;
  replied: number;
  kontakt: number;
  schuzka: number;
  enterprise: number;
}

const typeConfig: Record<
  string,
  { label: string; icon: typeof Mail; color: string }
> = {
  kontakt: { label: "Kontakt", icon: Mail, color: "bg-blue-50 text-blue-600" },
  schuzka: {
    label: "Schůzka",
    icon: Calendar,
    color: "bg-purple-50 text-purple-600",
  },
  enterprise: {
    label: "Enterprise",
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" }
> = {
  new: { label: "Nový", variant: "warning" },
  read: { label: "Přečteno", variant: "default" },
  replied: { label: "Odpovězeno", variant: "success" },
  archived: { label: "Archivováno", variant: "secondary" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDotazyPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [counts, setCounts] = useState<FormCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchSubmissions() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/forms?${params}`, { headers });
      if (!res.ok) throw new Error("Nepodařilo se načíst dotazy");
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setCounts(data.counts || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při načítání");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, [typeFilter, statusFilter]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/admin/forms", {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Chyba");
      await fetchSubmissions();
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-neutral-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchSubmissions();
          }}
          className="text-sm text-primary-500 hover:underline"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">
          Dotazy & Schůzky
        </h1>
        <p className="text-neutral-500 mt-1">
          Příchozí zprávy z formulářů a žádosti o schůzky
        </p>
      </motion.div>

      {/* Stats */}
      {counts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-neutral-900">
                {counts.new}
              </p>
              <p className="text-xs text-neutral-500">Nových</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-neutral-900">
                {counts.kontakt}
              </p>
              <p className="text-xs text-neutral-500">Kontaktních</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-neutral-900">
                {counts.schuzka}
              </p>
              <p className="text-xs text-neutral-500">Schůzek</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-neutral-900">
                {counts.total}
              </p>
              <p className="text-xs text-neutral-500">Celkem</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">Všechny typy</option>
          <option value="kontakt">Kontakt</option>
          <option value="schuzka">Schůzky</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="all">Všechny stavy</option>
          <option value="new">Nové</option>
          <option value="read">Přečtené</option>
          <option value="replied">Odpovězené</option>
          <option value="archived">Archivované</option>
        </select>
      </div>

      {/* Submissions */}
      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500 font-medium">Zatím žádné dotazy</p>
          <p className="text-sm text-neutral-400 mt-1">
            Dotazy z formulářů se zobrazí zde
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub, index) => {
            const tc = typeConfig[sub.type] || typeConfig.kontakt;
            const sc = statusConfig[sub.status] || statusConfig.new;
            const TypeIcon = tc.icon;
            const isExpanded = expandedId === sub.id;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card
                  className={`cursor-pointer transition-shadow ${
                    sub.status === "new"
                      ? "border-l-4 border-l-amber-400"
                      : ""
                  } ${isExpanded ? "shadow-md" : "hover:shadow-sm"}`}
                >
                  <CardContent className="p-0">
                    {/* Summary row */}
                    <div
                      className="flex items-center gap-4 p-4"
                      onClick={() => {
                        setExpandedId(isExpanded ? null : sub.id);
                        if (sub.status === "new") {
                          updateStatus(sub.id, "read");
                        }
                      }}
                    >
                      <div className={`p-2 rounded-lg ${tc.color} shrink-0`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-neutral-900">
                            {sub.name}
                          </p>
                          <Badge variant={sc.variant} className="text-[10px]">
                            {sc.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 truncate">
                          {sub.email}
                          {sub.subject && ` · ${sub.subject}`}
                          {sub.meeting_date && sub.meeting_time && (
                            <> · Schůzka: {sub.meeting_date} v {sub.meeting_time}</>
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-neutral-400 shrink-0 hidden sm:block">
                        {formatDate(sub.created_at)}
                      </p>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-neutral-100 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-neutral-400 mb-1">
                              Kontakt
                            </p>
                            <p className="text-sm text-neutral-700">
                              {sub.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {sub.email}
                            </p>
                            {sub.phone && (
                              <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {sub.phone}
                              </p>
                            )}
                          </div>
                          <div>
                            {sub.company && (
                              <div className="mb-2">
                                <p className="text-xs text-neutral-400 mb-1">
                                  Firma
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {sub.company}
                                </p>
                              </div>
                            )}
                            {sub.team_size && (
                              <div className="mb-2">
                                <p className="text-xs text-neutral-400 mb-1">
                                  Velikost týmu
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {sub.team_size}
                                </p>
                              </div>
                            )}
                            {sub.meeting_date && (
                              <div>
                                <p className="text-xs text-neutral-400 mb-1">
                                  Termín schůzky
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {sub.meeting_date} v {sub.meeting_time}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {sub.message && (
                          <div className="mb-4">
                            <p className="text-xs text-neutral-400 mb-1">
                              Zpráva
                            </p>
                            <p className="text-sm text-neutral-700 whitespace-pre-wrap bg-neutral-50 p-3 rounded-lg">
                              {sub.message}
                            </p>
                          </div>
                        )}

                        {/* Status actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-neutral-400 mr-2">
                            Změnit stav:
                          </span>
                          {sub.status !== "read" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(sub.id, "read")}
                              disabled={updatingId === sub.id}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              Přečteno
                            </Button>
                          )}
                          {sub.status !== "replied" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(sub.id, "replied")}
                              disabled={updatingId === sub.id}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Odpovězeno
                            </Button>
                          )}
                          {sub.status !== "archived" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(sub.id, "archived")}
                              disabled={updatingId === sub.id}
                            >
                              <Archive className="w-3 h-3 mr-1" />
                              Archivovat
                            </Button>
                          )}
                          <a
                            href={`mailto:${sub.email}`}
                            className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium ml-auto"
                          >
                            <Mail className="w-3 h-3" />
                            Odpovědět emailem
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

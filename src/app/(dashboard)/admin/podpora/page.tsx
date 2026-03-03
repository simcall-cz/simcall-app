"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Loader2,
  Clock,
  CheckCircle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { email: string; full_name: string | null };
}

const statusConfig = {
  open: { label: "Otevřený", variant: "warning" as const, icon: Clock },
  in_progress: { label: "Řeší se", variant: "default" as const, icon: ArrowRight },
  resolved: { label: "Vyřešeno", variant: "success" as const, icon: CheckCircle },
};

export default function AdminPodporaPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchTickets() {
    try {
      const headers = await getAuthHeaders();
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/tickets${params}`, { headers });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchTickets();
  }, [statusFilter]);

  async function handleStatusChange(ticketId: string, newStatus: string, note?: string) {
    setUpdating(ticketId);
    try {
      const headers = await getAuthHeaders();
      await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId,
          status: newStatus,
          adminNote: note || undefined,
        }),
      });
      await fetchTickets();
      setExpandedId(null);
      setAdminNote("");
    } catch {
      // silent
    } finally {
      setUpdating(null);
    }
  }

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900">Podpora</h1>
        <p className="text-neutral-500 mt-1">
          Správa support tiketů od uživatelů
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "all", label: "Celkem", count: counts.all },
          { key: "open", label: "Otevřené", count: counts.open },
          { key: "in_progress", label: "Řeší se", count: counts.in_progress },
          { key: "resolved", label: "Vyřešené", count: counts.resolved },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`p-3 rounded-xl border text-left transition-all ${
              statusFilter === s.key
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-100 bg-white hover:border-neutral-200"
            }`}
          >
            <p className="text-2xl font-bold text-neutral-900">{s.count}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Tikety
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <LifeBuoy className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-sm text-neutral-400">Žádné tikety</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {tickets.map((ticket) => {
                const cfg = statusConfig[ticket.status] || statusConfig.open;
                const isExpanded = expandedId === ticket.id;
                return (
                  <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => {
                        setExpandedId(isExpanded ? null : ticket.id);
                        setAdminNote(ticket.admin_note || "");
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-900 text-sm">
                            {ticket.subject}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {ticket.profiles?.full_name || ticket.profiles?.email || "—"} ·{" "}
                            {new Date(ticket.created_at).toLocaleDateString("cs-CZ")}
                          </p>
                        </div>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pl-0 space-y-3"
                      >
                        <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-700">
                          {ticket.message}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">
                            Odpověď / poznámka
                          </label>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                            placeholder="Napište odpověď uživateli..."
                          />
                        </div>

                        <div className="flex gap-2">
                          {ticket.status !== "in_progress" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === ticket.id}
                              onClick={() =>
                                handleStatusChange(ticket.id, "in_progress", adminNote)
                              }
                            >
                              Řeší se
                            </Button>
                          )}
                          {ticket.status !== "resolved" && (
                            <Button
                              size="sm"
                              disabled={updating === ticket.id}
                              onClick={() =>
                                handleStatusChange(ticket.id, "resolved", adminNote)
                              }
                            >
                              Vyřešit
                            </Button>
                          )}
                          {ticket.status === "resolved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === ticket.id}
                              onClick={() =>
                                handleStatusChange(ticket.id, "open", adminNote)
                              }
                            >
                              Znovu otevřít
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  Send,
  Mail,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  admin_note: string | null;
  user_read: boolean;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  open: { label: "Odesláno", variant: "warning" as const, icon: Send },
  in_progress: { label: "Řeší se", variant: "default" as const, icon: ArrowRight },
  resolved: { label: "Vyřešeno", variant: "success" as const, icon: CheckCircle },
};

export default function PodporaPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTickets() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/tickets", { headers });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      setError("Nepodařilo se načíst tikety");
    } finally {
      setIsLoading(false);
    }
  }

  // Mark all tickets as read when page is opened
  async function markAsRead() {
    try {
      const headers = await getAuthHeaders();
      await fetch("/api/tickets", {
        method: "PATCH",
        headers,
      });
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchTickets();
    markAsRead();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba při odesílání");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
      setShowForm(false);
      await fetchTickets();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Podpora</h1>
          <p className="text-neutral-500 mt-1">
            Potřebujete pomoct? Vytvořte tiket a náš tým se vám ozve.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nový tiket
        </Button>
      </motion.div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3.5 text-sm text-green-700"
        >
          <CheckCircle className="w-4 h-4" />
          Tiket byl úspěšně odeslán. Ozveme se vám co nejdříve!
        </motion.div>
      )}

      {/* New Ticket Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary-500" />
                Nový tiket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Předmět
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Stručně popište problém..."
                    required
                    className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Zpráva
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Podrobně popište váš problém nebo dotaz..."
                    required
                    rows={4}
                    className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Odeslat tiket
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Zrušit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tickets List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Moje tikety</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <LifeBuoy className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm text-neutral-400">
                  Zatím nemáte žádné tikety
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {tickets.map((ticket) => {
                  const cfg = statusConfig[ticket.status] || statusConfig.open;
                  const StatusIcon = cfg.icon;
                  const hasNewResponse = ticket.admin_note && !ticket.user_read;
                  return (
                    <div
                      key={ticket.id}
                      className={`py-4 first:pt-0 last:pb-0 ${hasNewResponse ? "bg-primary-50/30 -mx-4 px-4 rounded-lg" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                            <h3 className="font-medium text-neutral-900 text-sm truncate">
                              {ticket.subject}
                            </h3>
                            {hasNewResponse && (
                              <span className="shrink-0 flex items-center gap-1 rounded-full bg-primary-100 text-primary-600 px-2 py-0.5 text-[10px] font-semibold">
                                <Mail className="w-3 h-3" />
                                Nová odpověď
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-2 ml-6">
                            {ticket.message}
                          </p>
                          {ticket.admin_note && (
                            <div className="mt-2 ml-6 rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-xs text-blue-700">
                              <strong>Odpověď:</strong> {ticket.admin_note}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(ticket.created_at).toLocaleDateString("cs-CZ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

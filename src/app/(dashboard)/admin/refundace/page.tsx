"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  X,
  Loader2,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PhoneCall,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DisputeRecord {
  id: string;
  call_id: string;
  user_id: string;
  user_name: string;
  reason: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  refunded_seconds: number;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  calls: {
    id: string;
    date: string;
    duration_seconds: number;
    success_rate: number;
    audio_url: string | null;
    agents: { name: string; personality: string } | null;
  } | null;
}

const statusConfig = {
  pending: { label: "Čekající", variant: "warning" as const, icon: Clock },
  approved: { label: "Schváleno", variant: "success" as const, icon: CheckCircle2 },
  rejected: { label: "Zamítnuto", variant: "secondary" as const, icon: XCircle },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function DisputeDetailModal({
  dispute,
  onClose,
  onResolved,
}: {
  dispute: DisputeRecord;
  onClose: () => void;
  onResolved: (updated: DisputeRecord) => void;
}) {
  const [adminNote, setAdminNote] = useState(dispute.admin_note || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = dispute.calls;
  const durationMinutes = call ? Math.ceil(call.duration_seconds / 60) : 0;

  async function handleResolve(status: "approved" | "rejected", refund: boolean) {
    setIsSubmitting(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/disputes/${dispute.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          status,
          admin_note: adminNote.trim() || null,
          refund,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Chyba při zpracování");
      }

      const data = await res.json();
      onResolved({
        ...dispute,
        ...data.dispute,
        calls: dispute.calls,
        user_name: dispute.user_name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isPending = dispute.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-2xl sm:my-8 sm:mx-4 max-h-[92vh] sm:max-h-[90vh] border border-neutral-100 flex flex-col overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Reklamace hovoru
                </h2>
                <Badge variant={statusConfig[dispute.status].variant}>
                  {statusConfig[dispute.status].label}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-500 mt-1">
                <span className="font-medium text-neutral-700">{dispute.user_name}</span>
                <span>{formatDate(dispute.created_at)}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {/* Call info */}
          {call && (
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Info o hovoru</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-neutral-400 text-xs">Agent</span>
                  <p className="font-medium text-neutral-800">{call.agents?.name || "—"}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs">Datum</span>
                  <p className="font-medium text-neutral-800">{formatDate(call.date)}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs">Doba trvani</span>
                  <p className="font-medium text-neutral-800">{formatDuration(call.duration_seconds)}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs">Skore</span>
                  <p className="font-medium text-neutral-800">{call.success_rate > 0 ? `${call.success_rate}%` : "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Audio player */}
          {call?.audio_url ? (
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4">
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Nahravka hovoru</h4>
              <audio controls className="w-full h-10" preload="metadata">
                <source src={call.audio_url} type="audio/mpeg" />
              </audio>
            </div>
          ) : (
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <PhoneCall className="w-4 h-4" />
                <span>Nahravka neni k dispozici</span>
              </div>
            </div>
          )}

          {/* Dispute reason */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">Duvod reklamace</h4>
            <p className="text-sm text-amber-700 font-medium">{dispute.reason}</p>
            {dispute.message && (
              <p className="text-sm text-amber-700 mt-2">{dispute.message}</p>
            )}
          </div>

          {/* Refund info for resolved disputes */}
          {dispute.status !== "pending" && dispute.refunded_seconds > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Vraceno {Math.ceil(dispute.refunded_seconds / 60)} min ({dispute.refunded_seconds} s)
                </span>
              </div>
            </div>
          )}

          {/* Admin note (read-only for resolved, editable for pending) */}
          {isPending ? (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Poznamka pro uzivatele (volitelne)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Napiste odpoved ci komentar pro uzivatele..."
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>
          ) : dispute.admin_note ? (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">Odpoved admina</h4>
              <p className="text-sm text-blue-700">{dispute.admin_note}</p>
              {dispute.resolved_at && (
                <p className="text-xs text-blue-500 mt-2">
                  Vyreseno: {formatDate(dispute.resolved_at)} ({dispute.resolved_by})
                </p>
              )}
            </div>
          ) : null}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 sm:px-6 border-t border-neutral-100 shrink-0">
          {isPending ? (
            <>
              <Button
                onClick={() => handleResolve("approved", true)}
                disabled={isSubmitting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                Schvalit a vratit {durationMinutes} min
              </Button>
              <Button
                variant="outline"
                onClick={() => handleResolve("approved", false)}
                disabled={isSubmitting}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Schvalit bez refundace
              </Button>
              <Button
                variant="outline"
                onClick={() => handleResolve("rejected", false)}
                disabled={isSubmitting}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                Zamitnout
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Zavrit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminRefundacePage() {
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(null);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch("/api/admin/disputes", { headers });
        if (!res.ok) throw new Error("Nepodarilo se nacist reklamace");
        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chyba");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDisputes();
  }, []);

  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      const matchesSearch =
        searchQuery === "" ||
        d.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.calls?.agents?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [disputes, searchQuery, statusFilter]);

  const pendingCount = disputes.filter((d) => d.status === "pending").length;

  function handleResolved(updated: DisputeRecord) {
    setDisputes((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
    setSelectedDispute(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">Refundace</h1>
          {pendingCount > 0 && (
            <Badge variant="warning">{pendingCount} cekajicich</Badge>
          )}
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Reklamace hovoru od uzivatelu — kontrola a vraceni minut
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      )}

      {error && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <p className="text-neutral-600 font-medium">Chyba pri nacitani</p>
            <p className="text-sm text-neutral-400 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && disputes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-lg font-semibold text-neutral-700">Zadne reklamace</p>
            <p className="text-sm text-neutral-400 mt-2">
              Zatim nebyla podana zadna reklamace hovoru.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && disputes.length > 0 && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Hledat podle uzivatele, duvodu nebo agenta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-neutral-700"
                >
                  <option value="all">Vsechny stavy</option>
                  <option value="pending">Cekajici</option>
                  <option value="approved">Schvalene</option>
                  <option value="rejected">Zamitnute</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-25">
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">Datum</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">Uzivatel</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500">Duvod</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden md:table-cell">Agent</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Hovor</th>
                      <th className="text-center py-3 px-4 font-medium text-neutral-500">Stav</th>
                      <th className="text-right py-3 px-4 font-medium text-neutral-500">Akce</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.map((dispute) => {
                      const cfg = statusConfig[dispute.status];
                      return (
                        <tr
                          key={dispute.id}
                          className={`border-b border-neutral-50 hover:bg-neutral-25 transition-colors ${
                            dispute.status === "pending" ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <td className="py-3 px-4 text-neutral-600 whitespace-nowrap">
                            {formatDate(dispute.created_at)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-neutral-800">{dispute.user_name}</span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600 max-w-[200px] truncate">
                            {dispute.reason}
                          </td>
                          <td className="py-3 px-4 text-neutral-600 hidden md:table-cell">
                            {dispute.calls?.agents?.name || "—"}
                          </td>
                          <td className="py-3 px-4 text-neutral-600 hidden sm:table-cell">
                            {dispute.calls ? formatDuration(dispute.calls.duration_seconds) : "—"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={cfg.variant}>{cfg.label}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDispute(dispute)}
                            >
                              Detail
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredDisputes.length === 0 && (
                  <div className="text-center py-12 text-neutral-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Zadne reklamace neodpovidaji filtru.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedDispute && (
        <DisputeDetailModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolved={handleResolved}
        />
      )}
    </div>
  );
}

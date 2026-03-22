"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Phone,
  Loader2,
  AlertCircle,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface TeamMember {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  totalMinutes: number;
  avgScore: number | null;
  minutesThisMonth: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamMinutesUsed, setTeamMinutesUsed] = useState(0);
  const [teamMinutesLimit, setTeamMinutesLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add member form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function fetchTeam() {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/manager/team", { headers });
      if (!res.ok) throw new Error("Nepodařilo se načíst tým");
      const data = await res.json();
      setMembers(data.members || []);
      setTeamMinutesUsed(data.teamMinutesUsed || 0);
      setTeamMinutesLimit(data.teamMinutesLimit || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při načítání");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();

    // Check for hash to auto-open add form
    if (typeof window !== "undefined" && window.location.hash === "#pridat") {
      setShowAddForm(true);
    }
  }, []);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!addEmail.trim()) return;

    setAddLoading(true);
    setAddError(null);
    setAddSuccess(null);

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/manager/team", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nepodařilo se přidat člena");
      }

      setAddSuccess(
        `${data.member.fullName || data.member.email} byl přidán do týmu.`
      );
      setAddEmail("");
      await fetchTeam();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemoveMember(userId: string) {
    setDeleteLoading(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/manager/team", {
        method: "DELETE",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nepodařilo se odebrat člena");
      }

      setDeletingId(null);
      await fetchTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error && members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-neutral-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchTeam();
          }}
          className="text-sm text-primary-500 hover:underline"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  const usagePercentage =
    teamMinutesLimit > 0
      ? Math.min(100, Math.round((teamMinutesUsed / teamMinutesLimit) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Můj tým</h1>
          <p className="text-neutral-500 mt-1">
            Spravujte a sledujte výkon jednotlivých členů
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Přidat člena
        </Button>
      </motion.div>

      {/* Add Member Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id="pridat"
        >
          <Card className="border-primary-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Přidat nového člena</CardTitle>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setAddError(null);
                  setAddSuccess(null);
                }}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="flex gap-3">
                <input
                  type="email"
                  placeholder="Email uživatele (musí být registrován)..."
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Přidat"
                  )}
                </Button>
              </form>
              {addError && (
                <p className="text-sm text-red-500 mt-2">{addError}</p>
              )}
              {addSuccess && (
                <p className="text-sm text-green-600 mt-2">{addSuccess}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Team Usage Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Celkem členů</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {members.length}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-neutral-500">
                    Využití týmových minut
                  </p>
                  <p className="text-sm font-bold text-neutral-900">
                    {teamMinutesUsed} / {teamMinutesLimit || "∞"}
                  </p>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      usagePercentage >= 90
                        ? "bg-red-500"
                        : usagePercentage >= 70
                        ? "bg-amber-500"
                        : "bg-primary-500"
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Grid */}
      {members.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500 font-medium">Váš tým je zatím prázdný</p>
          <p className="text-sm text-neutral-400 mt-1">
            Přidejte první členy pomocí tlačítka výše
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, index) => (
            <motion.div
              key={member.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
            >
              <Card className="hover:shadow-card-hover transition-shadow h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-semibold shrink-0">
                      {member.fullName
                        ? member.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : member.email?.[0]?.toUpperCase() || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 truncate">
                        {member.fullName || "Bez jména"}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">
                        {member.email}
                      </p>
                      <Badge
                        variant={
                          member.role === "manager" ? "success" : "secondary"
                        }
                        className="mt-1"
                      >
                        {member.role === "manager" ? "Manažer" : "Makléř"}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-5 space-y-3">
                    {/* Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">
                        Průměrné skóre
                      </span>
                      <span
                        className={`text-xl font-bold ${
                          member.avgScore !== null && member.avgScore >= 70
                            ? "text-green-600"
                            : member.avgScore !== null && member.avgScore >= 50
                            ? "text-amber-600"
                            : member.avgScore !== null
                            ? "text-red-600"
                            : "text-neutral-400"
                        }`}
                      >
                        {member.avgScore !== null
                          ? `${member.avgScore}%`
                          : "—"}
                      </span>
                    </div>

                    {/* Calls */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        Tento měsíc
                      </span>
                      <span className="font-medium text-neutral-700">
                        {member.minutesThisMonth}
                      </span>
                    </div>

                    {/* Total Calls */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">
                        Celkem minut
                      </span>
                      <span className="text-sm text-neutral-500">
                        {member.totalMinutes}
                      </span>
                    </div>
                  </div>

                  {/* Progress detail button */}
                  {member.role !== "manager" && (
                    <div className="mt-4">
                      <a
                        href={`/manager/makler/${member.userId}`}
                        className="flex items-center justify-center gap-2 w-full rounded-lg border border-primary-200 bg-primary-50/50 px-3 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 hover:border-primary-300"
                      >
                        <Eye className="h-4 w-4" />
                        Zobrazit progress
                      </a>
                    </div>
                  )}

                  {/* Remove Button (not for managers) */}
                  {member.role !== "manager" && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      {deletingId === member.userId ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 flex-1">
                            Opravdu odebrat?
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(null)}
                            disabled={deleteLoading}
                          >
                            Ne
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleRemoveMember(member.userId)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Ano"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-500 hover:text-red-600 hover:border-red-200"
                          onClick={() => setDeletingId(member.userId)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Odebrat z týmu
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

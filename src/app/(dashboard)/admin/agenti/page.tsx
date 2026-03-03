"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Trash2, Save, X, Loader2, Bot, Search } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface Agent {
  id: string;
  name: string;
  personality: string | null;
  description: string | null;
  difficulty: string;
  avatar_initials: string;
  traits: string[];
  elevenlabs_agent_id: string | null;
  category: string | null;
  created_at: string;
}

const emptyAgent: Omit<Agent, "id" | "created_at"> = {
  name: "",
  personality: "",
  description: "",
  difficulty: "medium",
  avatar_initials: "",
  traits: [],
  elevenlabs_agent_id: "",
  category: "",
};

export default function AdminAgentiPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Agent>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyAgent);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAgents = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/agents", { headers });
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers,
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setShowCreate(false);
        setCreateForm(emptyAgent);
        await fetchAgents();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        await fetchAgents();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Opravdu smazat agenta "${name}"?`)) return;
    try {
      const headers = await getAuthHeaders();
      await fetch("/api/admin/agents", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });
      await fetchAgents();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.category || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Agenti</h1>
          <p className="text-sm text-neutral-500 mt-1">{agents.length} agentů celkem</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          Nový agent
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat agenta..."
          className="w-full rounded-lg border border-neutral-200 pl-10 pr-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-xl border border-primary-200 bg-primary-50/30 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Nový agent</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Jméno *" value={createForm.name} onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <input placeholder="Kategorie" value={createForm.category || ""} onChange={(e) => setCreateForm(p => ({ ...p, category: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <input placeholder="Osobnost" value={createForm.personality || ""} onChange={(e) => setCreateForm(p => ({ ...p, personality: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <select value={createForm.difficulty} onChange={(e) => setCreateForm(p => ({ ...p, difficulty: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option value="easy">Snadný</option>
              <option value="medium">Střední</option>
              <option value="hard">Těžký</option>
            </select>
            <input placeholder="ElevenLabs Agent ID" value={createForm.elevenlabs_agent_id || ""} onChange={(e) => setCreateForm(p => ({ ...p, elevenlabs_agent_id: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-2" />
            <textarea placeholder="Popis" value={createForm.description || ""} onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Vytvořit
            </button>
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* Agents list */}
      <div className="space-y-2">
        {filtered.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            {editingId === agent.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Jméno" value={editForm.name || ""} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                  <input placeholder="Kategorie" value={editForm.category || ""} onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
                  <input placeholder="ElevenLabs Agent ID" value={editForm.elevenlabs_agent_id || ""} onChange={(e) => setEditForm(p => ({ ...p, elevenlabs_agent_id: e.target.value }))} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-2" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(agent.id)} disabled={saving} className="flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600">
                    <Save className="w-3 h-3" /> Uložit
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
                    <X className="w-3 h-3" /> Zrušit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 truncate">{agent.name}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        agent.difficulty === "easy" ? "bg-green-100 text-green-700" :
                        agent.difficulty === "hard" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {agent.difficulty}
                      </span>
                      {agent.category && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {agent.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {agent.elevenlabs_agent_id ? `EL: ${agent.elevenlabs_agent_id.substring(0, 20)}...` : "⚠ Chybí ElevenLabs ID"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditingId(agent.id); setEditForm(agent); }}
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id, agent.name)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            <Bot className="w-8 h-8 mx-auto mb-2" />
            <p>{search ? "Žádní agenti nenalezeni" : "Zatím žádní agenti"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

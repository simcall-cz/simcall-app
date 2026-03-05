"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check, X, CalendarPlus, FileText, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";

interface InvoiceRequest {
  id: string;
  user_id: string;
  current_plan: string;
  current_tier: number;
  requested_plan: string;
  requested_tier: number;
  status: string;
  created_at: string;
  customer_email?: string;
  customer_name?: string;
}

interface InvoiceSubscription {
  id: string;
  user_id: string;
  plan: string;
  tier: number;
  status: string;
  calls_used: number;
  calls_limit: number;
  current_period_start: string | null;
  current_period_end: string | null;
  customer_name: string | null;
  customer_email: string | null;
}

export default function FakturyAdminPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "active">("requests");
  const [requests, setRequests] = useState<InvoiceRequest[]>([]);
  const [subscriptions, setSubscriptions] = useState<InvoiceSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/invoices", { headers });
      const data = await res.json();
      if (!data.error) {
        setRequests(data.requests || []);
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.error("Failed to fetch invoices data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveRequest = async (requestId: string, status: "approved" | "rejected") => {
    if (!window.confirm(`Opravdu chcete ${status === "approved" ? "schválit" : "zamítnout"} tuto žádost?`)) return;
    
    setActionLoading(`req_${requestId}`);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve_request", requestId, status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Žádost byla úspěšně ${status === "approved" ? "schválena" : "zamítnuta"}.`);
        fetchData();
      } else {
        alert(data.error || "Chyba při zpracování žádosti.");
      }
    } catch (err) {
      alert("Chyba spojení.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtend = async (subId: string) => {
    if (!window.confirm("Potvrzujete přijetí platby za fakturu a prodloužení o 1 měsíc? Tímto se zresetují vyčerpané hovory a odešle se potvrzovací e-mail.")) return;

    setActionLoading(`extend_${subId}`);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend", subscriptionId: subId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Předplatné bylo úspěšně prodlouženo.");
        fetchData();
      } else {
        alert(data.error || "Chyba při prodlužování.");
      }
    } catch (err) {
      alert("Chyba spojení.");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { id: "requests", label: "Žádosti o změnu" },
    { id: "active", label: "Aktivní fakturace" },
  ] as const;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" />
          Fakturační Zákazníci
        </h1>
        <p className="text-neutral-500 mt-1">
          Schvalování změn tarifů a manuální prodlužování fakturací.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {t.label}
            {t.id === "requests" && requests.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "requests" && (
            <Card>
              <CardContent className="p-0">
                <div className="hidden lg:grid grid-cols-7 gap-3 px-5 py-3 border-b border-neutral-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                  <span className="col-span-2">Zákazník</span>
                  <span className="col-span-2 text-center">Změna</span>
                  <span className="col-span-1 text-center">Datum</span>
                  <span className="col-span-2 text-right">Akce</span>
                </div>
                <div className="divide-y divide-neutral-50">
                  {requests.length === 0 ? (
                    <div className="text-center py-12 text-sm text-neutral-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                      Žádné čekající žádosti
                    </div>
                  ) : (
                    requests.map((req) => (
                      <div key={req.id} className="grid grid-cols-1 lg:grid-cols-7 gap-3 px-5 py-4 items-center">
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {req.customer_name || "Neznámý"}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">{req.customer_email}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {req.current_plan} {req.current_tier}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                          <Badge variant="default" className="capitalize text-xs bg-primary-100 text-primary-700 hover:bg-primary-200">
                            {req.requested_plan} {req.requested_tier}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-center text-xs text-neutral-500 hidden lg:block">
                          {new Date(req.created_at).toLocaleDateString("cs-CZ")}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                            disabled={!!actionLoading}
                            onClick={() => handleResolveRequest(req.id, "rejected")}
                          >
                            {actionLoading === `req_${req.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                            Zamítnout
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!!actionLoading}
                            onClick={() => handleResolveRequest(req.id, "approved")}
                          >
                            {actionLoading === `req_${req.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                            Schválit
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "active" && (
            <Card>
              <CardContent className="p-0">
                <div className="hidden lg:grid grid-cols-8 gap-3 px-5 py-3 border-b border-neutral-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                  <span className="col-span-2">Zákazník</span>
                  <span className="col-span-1 text-center">Plán</span>
                  <span className="col-span-2 text-center">Hovory (Využito / Limit)</span>
                  <span className="col-span-1 text-center">Vyprší za</span>
                  <span className="col-span-2 text-right">Akce</span>
                </div>
                <div className="divide-y divide-neutral-50">
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-12 text-sm text-neutral-400">
                      Zatím žádní zákazníci na fakturu
                    </div>
                  ) : (
                    subscriptions.map((sub) => {
                      const daysLeft = sub.current_period_end 
                        ? Math.max(0, Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : null;
                      
                      const isExpiringSoon = daysLeft !== null && daysLeft <= 5;
                      const isExpired = daysLeft === 0;

                      return (
                        <div key={sub.id} className="grid grid-cols-1 lg:grid-cols-8 gap-3 px-5 py-3 items-center">
                          <div className="col-span-2">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {sub.customer_name || "Neznámý"}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">{sub.customer_email}</p>
                          </div>
                          <div className="col-span-1 text-center">
                            <Badge variant="secondary" className="capitalize">
                              {sub.plan} {sub.tier}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-center">
                            <p className="text-sm font-medium text-neutral-800">
                              {sub.calls_used} <span className="text-neutral-400 font-normal">/ {sub.calls_limit}</span>
                            </p>
                          </div>
                          <div className="col-span-1 text-center">
                            <Badge variant={isExpired ? "secondary" : isExpiringSoon ? "warning" : "outline"} className={isExpired ? "bg-red-100 text-red-800 border-red-200" : isExpiringSoon ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-neutral-50 border-neutral-200"}>
                              {daysLeft !== null ? `${daysLeft} dní` : "N/A"}
                            </Badge>
                            {sub.current_period_end && (
                              <p className="text-[10px] text-neutral-400 mt-1">
                                {new Date(sub.current_period_end).toLocaleDateString("cs-CZ")}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary-200 text-primary-700 hover:bg-primary-50"
                              disabled={!!actionLoading}
                              onClick={() => handleExtend(sub.id)}
                            >
                              {actionLoading === `extend_${sub.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-1.5" />}
                              Prodloužit o měsíc
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}

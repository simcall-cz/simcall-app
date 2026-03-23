"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Settings,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
  format,
  isSameDay,
  isSameMonth
} from "date-fns";
import { cs } from "date-fns/locale";

interface Meeting {
  id: string;
  guest_name: string;
  guest_email: string;
  start_time: string;
  end_time: string;
  meet_link: string | null;
  status: string;
}

interface Availability {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const DAYS_OF_WEEK = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

export default function AdminSchuzkyPage() {
  const [activeTab, setActiveTab] = useState<"list" | "calendar" | "settings">("list");
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isMeetingsLoading, setIsMeetingsLoading] = useState(true);

  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    fetchMeetings();
    fetchAvailability();
  }, []);

  async function fetchMeetings() {
    setIsMeetingsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/meetings", { headers });
      if (res.ok) {
        const data = await res.json();
        setMeetings(data.meetings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMeetingsLoading(false);
    }
  }

  async function fetchAvailability() {
    setIsAvailabilityLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/availability", { headers });
      if (res.ok) {
        const data = await res.json();
        const serverAvail = data.availability || [];
        
        // Ensure all 7 days exist in state
        const completeAvail: Availability[] = [];
        for (let i = 0; i < 7; i++) {
          const found = serverAvail.find((a: any) => a.day_of_week === i);
          completeAvail.push({
            day_of_week: i,
            start_time: found ? found.start_time.substring(0, 5) : "09:00",
            end_time: found ? found.end_time.substring(0, 5) : "17:00",
            is_active: found ? found.is_active : false
          });
        }
        setAvailability(completeAvail);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAvailabilityLoading(false);
    }
  }

  async function handleSaveAvailability() {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ availability })
      });

      if (!res.ok) throw new Error("Chyba při ukládání");
      setSaveMessage({ type: "success", text: "Dostupnost byla úspěšně uložena" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      console.error(e);
      setSaveMessage({ type: "error", text: "Nepodařilo se uložit dostupnost" });
    } finally {
      setIsSaving(false);
    }
  }

  const handleAvailChange = (index: number, field: keyof Availability, value: any) => {
    const newAvail = [...availability];
    newAvail[index] = { ...newAvail[index], [field]: value };
    setAvailability(newAvail);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Správa schůzek</h1>
          <p className="text-neutral-500 mt-1">
            Přehled rezervací a nastavení vaší dostupnosti
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "list" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <ListIcon className="w-4 h-4" />
            Seznam
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "calendar" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Kalendář
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "settings" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            Nastavení dostupnosti
          </button>
        </div>
      </motion.div>

      {/* Tab: Schůzky */}
      {activeTab === "list" && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Nadcházející a proběhlé schůzky</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isMeetingsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Zatím žádné schůzky nebyly zarezervovány</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 bg-neutral-25">
                        <th className="text-left py-3 px-4 font-medium text-neutral-500">Datum a čas</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-500">Klient</th>
                        <th className="text-center py-3 px-4 font-medium text-neutral-500">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-neutral-500">Akce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetings.map((m) => {
                        const date = new Date(m.start_time);
                        const isPast = date < new Date();
                        return (
                          <tr key={m.id} className="border-b border-neutral-50 hover:bg-neutral-25 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-medium text-neutral-800">
                                {date.toLocaleDateString("cs-CZ")}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-neutral-800">{m.guest_name}</div>
                              <div className="text-xs text-neutral-500">{m.guest_email}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {m.status === "cancelled" ? (
                                <Badge variant="secondary">Zrušeno</Badge>
                              ) : isPast ? (
                                <Badge variant="secondary">Proběhlo</Badge>
                              ) : (
                                <Badge variant="success">Naplánováno</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {m.meet_link && !isPast && m.status !== "cancelled" && (
                                <a href={m.meet_link} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <Video className="w-4 h-4 text-blue-500" />
                                    Připojit se
                                  </Button>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab: Kalendář */}
      {activeTab === "calendar" && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Měsíční přehled</CardTitle>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setCurrentCalendarMonth(subMonths(currentCalendarMonth, 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="font-medium text-neutral-800 min-w-[120px] text-center capitalize">
                  {format(currentCalendarMonth, "MMMM yyyy", { locale: cs })}
                </div>
                <Button variant="outline" size="icon" onClick={() => setCurrentCalendarMonth(addMonths(currentCalendarMonth, 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isMeetingsLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-200 overflow-hidden bg-white">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
                    {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map(d => (
                      <div key={d} className="py-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider border-r border-neutral-200 last:border-r-0">
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Calendar Grid */}
                  <div className="flex flex-col">
                    {(() => {
                      const monthStart = startOfMonth(currentCalendarMonth);
                      const monthEnd = endOfMonth(monthStart);
                      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

                      const rows = [];
                      let days = [];
                      let day = startDate;
                      let formattedDate = "";

                      while (day <= endDate) {
                        for (let i = 0; i < 7; i++) {
                          formattedDate = format(day, "d");
                          const cloneDay = day;
                          const dayMeetings = meetings.filter(m => isSameDay(new Date(m.start_time), cloneDay));
                          
                          days.push(
                            <div
                              className={`min-h-[100px] border-b border-r border-neutral-200 p-1.5 sm:p-2 transition-colors ${
                                !isSameMonth(day, monthStart)
                                  ? "bg-neutral-50/50 text-neutral-400"
                                  : "bg-white text-neutral-900"
                              } hover:bg-neutral-50`}
                              key={day.toString()}
                            >
                              <div className="flex justify-end mb-1">
                                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-primary-500 text-white' : ''}`}>
                                  {formattedDate}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {dayMeetings.slice(0, 4).map(m => (
                                  <div key={m.id} className={`text-[10px] leading-tight p-1 rounded border truncate ${m.status === 'cancelled' ? 'bg-neutral-100 text-neutral-500 border-neutral-200' : 'bg-primary-50 text-primary-700 border-primary-100 relative'}`} title={`${format(new Date(m.start_time), "HH:mm")} - ${m.guest_name}`}>
                                    <span className="font-semibold">{format(new Date(m.start_time), "HH:mm")}</span> {m.guest_name}
                                  </div>
                                ))}
                                {dayMeetings.length > 4 && (
                                  <div className="text-[10px] text-neutral-500 font-medium pl-1">
                                    + {dayMeetings.length - 4} další
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                          day = addDays(day, 1);
                        }
                        rows.push(
                          <div className="grid grid-cols-7 last:border-b-0" key={day.toString()}>
                            {days}
                          </div>
                        );
                        days = [];
                      }
                      return rows;
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab: Dostupnost */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Kdy jste dostupný pro schůzky?</CardTitle>
            </CardHeader>
            <CardContent>
              {isAvailabilityLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Re-order days so Monday is first (1-6, then 0) */}
                  {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                    const rowIdx = availability.findIndex((a) => a.day_of_week === dayNum);
                    const row = availability[rowIdx];
                    if (!row) return null;

                    return (
                      <div key={dayNum} className={`flex items-center justify-between p-3 rounded-lg border ${row.is_active ? 'border-primary-100 bg-primary-25' : 'border-neutral-100 bg-neutral-50'}`}>
                        <div className="flex items-center gap-3 w-40">
                          <input
                            type="checkbox"
                            checked={row.is_active}
                            onChange={(e) => handleAvailChange(rowIdx, "is_active", e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                          />
                          <span className={`font-medium ${row.is_active ? 'text-neutral-900' : 'text-neutral-400'}`}>
                            {DAYS_OF_WEEK[dayNum]}
                          </span>
                        </div>
                        
                        {row.is_active ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={row.start_time}
                              onChange={(e) => handleAvailChange(rowIdx, "start_time", e.target.value)}
                              className="px-2 py-1 border rounded-md text-sm"
                            />
                            <span className="text-neutral-400">—</span>
                            <input
                              type="time"
                              value={row.end_time}
                              onChange={(e) => handleAvailChange(rowIdx, "end_time", e.target.value)}
                              className="px-2 py-1 border rounded-md text-sm"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-neutral-400 italic">Nedostupný</div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-4 mt-8 pt-4 border-t">
                    <Button onClick={handleSaveAvailability} disabled={isSaving} className="gap-2">
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Uložit dostupnost
                    </Button>
                    
                    {saveMessage && (
                      <span className={`text-sm flex items-center gap-1.5 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {saveMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {saveMessage.text}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

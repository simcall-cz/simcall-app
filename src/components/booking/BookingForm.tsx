"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, User, Mail, UserCheck, Loader2, Phone, AlignLeft, AlertCircle } from "lucide-react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { cs } from "date-fns/locale";

interface TimeSlot {
  time: string;
  isoDate: string;
}

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar dates (next 14 days)
  const today = startOfToday();
  const next14Days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  // Fetch slots when date changes
  useEffect(() => {
    async function fetchSlots() {
      setIsLoadingSlots(true);
      setSelectedSlot(null);
      setError(null);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/booking/availability?date=${dateStr}`);
        const data = await res.json();
        
        if (res.ok) {
          setAvailableSlots(data.slots || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (e) {
        console.error("Failed to fetch slots", e);
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    
    fetchSlots();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name || !email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: name,
          guest_email: email,
          guest_phone: phone,
          guest_notes: notes,
          start_time: selectedSlot.isoDate
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Něco se pokazilo, zkuste to prosím znovu.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 md:p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">Schůzka potvzená!</h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          Těšíme se na vás <strong>{format(new Date(selectedSlot!.isoDate), "d. MMMM 'v' HH:mm", { locale: cs })}</strong>.
          <br /><br />
          Pozvánka na Google Meet a detaily vám byly právě odeslány na email: <strong className="text-neutral-800">{email}</strong>.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-xl transition-all"
        >
          Zpět na hlavní stránku
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row">
      
      {/* Left side: Date & Time Selection */}
      <div className={`p-6 md:p-8 flex-1 transition-all ${selectedSlot ? "md:w-1/2 bg-neutral-50/50 hidden md:block" : "w-full"}`}>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Vyberte termín schůzky</h2>
        
        {/* Horizontal Calendar scrolling for next 14 days */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-800">{format(selectedDate, "MMMM yyyy", { locale: cs })}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 snap-x hide-scrollbar" style={{ scrollbarWidth: "none" }}>
            {next14Days.map(date => {
              const isSelected = isSameDay(date, selectedDate);
              const dayName = format(date, "EEEEEE", { locale: cs });
              const dayObj = date.getDay();
              const isWeekend = dayObj === 0 || dayObj === 6;

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`snap-center shrink-0 w-[72px] h-[90px] rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                    isSelected 
                      ? "border-primary-600 bg-primary-50 text-primary-700 shadow-md scale-105" 
                      : "border-transparent bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:scale-105"
                  } ${isWeekend ? "opacity-60" : ""}`}
                >
                  <span className="text-xs uppercase font-medium tracking-wider mb-1 opacity-80">{dayName}</span>
                  <span className={`text-2xl font-bold ${isSelected ? "text-primary-700" : "text-neutral-900"}`}>
                    {format(date, "d")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-neutral-400" />
            Dostupné časy
          </h3>
          
          {isLoadingSlots ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-10 bg-neutral-50 rounded-xl border border-neutral-100 border-dashed">
              <p className="text-neutral-500">Pro tento den nejsou žádné dostupné termíny.</p>
              <p className="text-sm text-neutral-400 mt-1">Zkuste prosím vybrat jiné datum.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    selectedSlot?.time === slot.time
                      ? "border-primary-600 bg-primary-600 text-white shadow-md"
                      : "border-neutral-100 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-600"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Form (appears when slot is selected) */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:w-1/2 bg-white p-6 md:p-8 border-l border-neutral-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Vaše údaje</h2>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="md:hidden text-sm text-primary-600 font-medium flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" /> Zpět na termíny
              </button>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 mb-8 flex items-start gap-3 border border-primary-100">
              <Clock className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary-900">
                  {format(selectedDate, "d. MMMM yyyy", { locale: cs })}
                </p>
                <p className="text-primary-700">{selectedSlot.time} (30 minut)</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Jméno a příjmení *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Např. Jan Novák"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="jan@email.cz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Telefon</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="+420 777 666 555"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Poznámka / O čem se budeme bavit?</label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <AlignLeft className="h-5 w-5 text-neutral-400" />
                  </div>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Jaké máte očekávání ze schůzky..."
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Zpracovávám...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Potvrdit schůzku
                  </>
                )}
              </button>
              <p className="text-center text-xs text-neutral-400 mt-4">
                Odesláním souhlasíte se zpracováním osobních údajů pro účely schůzky.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}

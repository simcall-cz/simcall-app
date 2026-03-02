"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Check,
  ChevronLeft,
  ArrowRight,
  Building2,
  Loader2,
  Phone,
  Mail,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";

const timeSlots = {
  morning: [
    { time: "9:00", label: "9:00" },
    { time: "10:00", label: "10:00" },
    { time: "11:00", label: "11:00" },
  ],
  afternoon: [
    { time: "14:00", label: "14:00" },
    { time: "15:00", label: "15:00" },
    { time: "16:00", label: "16:00" },
  ],
};

const enterpriseFeatures = [
  "White-label — SimCall pod vaší značkou",
  "Vlastní AI agenti a scénáře na míru",
  "Dedikovaný account manažer",
  "Počet hovorů a agentů dohodou",
  "Manager dashboard a analytika týmu",
  "Onboarding a školení celého týmu",
];

function getNextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  let current = new Date(today);
  current.setDate(current.getDate() + 1);

  while (days.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
}

export default function DomluvitSchuzku() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    teamSize: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessDays = getNextBusinessDays(10);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Zadejte jméno";
    if (!form.email.trim()) newErrors.email = "Zadejte e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Neplatný formát e-mailu";
    if (!form.company.trim()) newErrors.company = "Zadejte název firmy";
    if (!selectedDate) newErrors.date = "Vyberte datum";
    if (!selectedTime) newErrors.time = "Vyberte čas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate — will be replaced with real booking API (Calendly, Cal.com, or custom)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  // Success state
  if (submitted) {
    const dateObj = businessDays.find(
      (d) => d.toISOString().split("T")[0] === selectedDate
    );
    return (
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <ScrollReveal>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                Schůzka naplánována!
              </h1>
              <p className="mt-4 text-neutral-500 leading-relaxed">
                Děkujeme, {form.fullName.split(" ")[0]}. Vaše schůzka je
                naplánována na{" "}
                <span className="font-semibold text-neutral-800">
                  {dateObj ? formatDate(dateObj) : selectedDate} v {selectedTime}
                </span>
                . Potvrzení jsme odeslali na {form.email}.
              </p>
              <div className="mt-6 rounded-xl border border-neutral-200 p-4 text-left max-w-sm mx-auto">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <span className="text-neutral-700">
                    {dateObj ? formatDate(dateObj) : selectedDate}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <Clock className="h-4 w-4 text-primary-500" />
                  <span className="text-neutral-700">{selectedTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <Phone className="h-4 w-4 text-primary-500" />
                  <span className="text-neutral-700">Online video hovor (odkaz v e-mailu)</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  Zpět na hlavní stránku
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-20">
        <Container>
          <ScrollReveal>
            <Link
              href="/cenik"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
            >
              <ChevronLeft className="h-4 w-4" />
              Zpět na ceník
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <Badge className="mb-4">Enterprise</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                  Domluvte si{" "}
                  <GradientText>nezávaznou schůzku</GradientText>
                </h1>
                <p className="mt-4 text-neutral-500 leading-relaxed">
                  Probereme vaše potřeby a připravíme řešení na míru pro váš
                  tým. Schůzka trvá přibližně 30 minut.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="mt-8 space-y-3">
                  {enterpriseFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="mt-8 rounded-xl bg-neutral-50 border border-neutral-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">
                        Dedikovaný vývojář
                      </p>
                      <p className="text-xs text-neutral-500">
                        K dispozici přes WhatsApp
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Každý Enterprise klient dostane přímý kontakt na svého
                    osobního vývojáře ze SimCall, který pomůže s čímkoli — od
                    nastavení po nové funkce na míru.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Booking form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.05}>
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
                >
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                    <h2 className="font-semibold text-neutral-800">
                      Vyberte termín schůzky
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Date picker */}
                    <div>
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 block">
                        <Calendar className="h-3.5 w-3.5 inline mr-1.5" />
                        Datum
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {businessDays.map((date) => {
                          const key = date.toISOString().split("T")[0];
                          const isSelected = selectedDate === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setSelectedDate(key);
                                if (errors.date) setErrors((prev) => ({ ...prev, date: "" }));
                              }}
                              className={`rounded-lg border p-2 text-center transition-all ${
                                isSelected
                                  ? "border-primary-500 bg-primary-50 shadow-sm"
                                  : "border-neutral-200 hover:border-neutral-300"
                              }`}
                            >
                              <p
                                className={`text-xs ${
                                  isSelected ? "text-primary-600" : "text-neutral-400"
                                }`}
                              >
                                {date.toLocaleDateString("cs-CZ", { weekday: "short" })}
                              </p>
                              <p
                                className={`text-sm font-semibold mt-0.5 ${
                                  isSelected ? "text-primary-700" : "text-neutral-800"
                                }`}
                              >
                                {date.getDate()}.{date.getMonth() + 1}.
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.date && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>
                      )}
                    </div>

                    {/* Time slots */}
                    <div>
                      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3 block">
                        <Clock className="h-3.5 w-3.5 inline mr-1.5" />
                        Čas
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-neutral-400 mb-2">Dopoledne</p>
                          <div className="space-y-2">
                            {timeSlots.morning.map((slot) => {
                              const isSelected = selectedTime === slot.time;
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTime(slot.time);
                                    if (errors.time)
                                      setErrors((prev) => ({ ...prev, time: "" }));
                                  }}
                                  className={`w-full rounded-lg border py-2.5 px-4 text-sm font-medium transition-all ${
                                    isSelected
                                      ? "border-primary-500 bg-primary-50 text-primary-700"
                                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 mb-2">Odpoledne</p>
                          <div className="space-y-2">
                            {timeSlots.afternoon.map((slot) => {
                              const isSelected = selectedTime === slot.time;
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTime(slot.time);
                                    if (errors.time)
                                      setErrors((prev) => ({ ...prev, time: "" }));
                                  }}
                                  className={`w-full rounded-lg border py-2.5 px-4 text-sm font-medium transition-all ${
                                    isSelected
                                      ? "border-primary-500 bg-primary-50 text-primary-700"
                                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {errors.time && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>
                      )}
                    </div>

                    <div className="border-t border-neutral-100" />

                    {/* Contact form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Celé jméno *
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Jan Novák"
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.fullName ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                        </div>
                        <div>
                          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Firma *
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Reality s.r.o."
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.company ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            E-mail *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="jan@firma.cz"
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.email ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Telefon
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+420 123 456 789"
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="teamSize" className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Velikost týmu
                        </label>
                        <select
                          id="teamSize"
                          name="teamSize"
                          value={form.teamSize}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 bg-white transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                          <option value="">Vyberte...</option>
                          <option value="5-10">5–10 makléřů</option>
                          <option value="10-25">10–25 makléřů</option>
                          <option value="25-50">25–50 makléřů</option>
                          <option value="50+">50+ makléřů</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-neutral-700">
                          Co byste chtěli probrat?{" "}
                          <span className="text-neutral-400 font-normal">(nepovinné)</span>
                        </label>
                        <textarea
                          id="note"
                          name="note"
                          rows={3}
                          value={form.note}
                          onChange={handleChange}
                          placeholder="Popište vaše potřeby, velikost týmu, specifické požadavky..."
                          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-primary-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Rezervuji termín...
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4" />
                          Rezervovat schůzku
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-neutral-400">
                      Nezávazná konzultace. Schůzka trvá cca 30 minut přes video hovor.
                    </p>
                  </div>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

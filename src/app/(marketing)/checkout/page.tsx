"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Check,
  Shield,
  Lock,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Receipt,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { pricingPlans } from "@/data/pricing";
import { getAuthHeaders } from "@/lib/auth";
import type { PricingPlan } from "@/types";

type PaymentMethod = "card" | "invoice";

interface BillingForm {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  ico: string;
  dic: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  note: string;
}

const emptyForm: BillingForm = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  ico: "",
  dic: "",
  street: "",
  city: "",
  zip: "",
  country: "CZ",
  note: "",
};

const planIcons = {
  solo: User,
  team: Users,
  enterprise: Building2,
} as const;

export default function CheckoutPageWrapper() {
  return (
    <Suspense
      fallback={
        <section className="py-20">
          <Container>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          </Container>
        </section>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}

function CheckoutPage() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "solo";
  const tierParam = parseInt(searchParams.get("tier") || "0") || 0;

  const [selectedPlanId, setSelectedPlanId] = useState<"solo" | "team">(
    planParam === "team" ? "team" : "solo"
  );
  const [tierIndex, setTierIndex] = useState(tierParam);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState<BillingForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BillingForm, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const plan = pricingPlans.find((p) => p.id === selectedPlanId) as PricingPlan;
  const safeTierIndex = Math.min(tierIndex, plan.tiers.length - 1);
  const tier = plan.tiers[safeTierIndex];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BillingForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  };

  const handlePlanChange = (id: "solo" | "team") => {
    setSelectedPlanId(id);
    setTierIndex(0);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BillingForm, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Zadejte jméno";
    if (!form.email.trim()) newErrors.email = "Zadejte e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Neplatný formát e-mailu";

    if (paymentMethod === "invoice") {
      if (!form.street.trim()) newErrors.street = "Zadejte ulici a číslo popisné";
      if (!form.city.trim()) newErrors.city = "Zadejte město";
      if (!form.zip.trim()) newErrors.zip = "Zadejte PSČ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (paymentMethod === "card") {
        // Stripe checkout — send auth headers if logged in
        const headers = await getAuthHeaders();

        const res = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers,
          body: JSON.stringify({
            plan: selectedPlanId,
            tier: tier.calls,
            email: form.email,
            name: form.fullName,
            phone: form.phone,
            companyName: form.companyName,
          }),
        });

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url;
          return;
        }

        if (data.error) {
          setSubmitError(data.error);
        }
      } else {
        // Invoice — submit form to forms API and create pending payment
        const headers = await getAuthHeaders();

        await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "enterprise",
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            company: form.companyName,
            message: `Objednávka fakturou: ${plan.name} ${tier.calls} hovorů (${tier.price} Kč/měs). IČO: ${form.ico || "—"}, DIČ: ${form.dic || "—"}. Adresa: ${form.street}, ${form.city} ${form.zip}. Poznámka: ${form.note || "—"}`,
          }),
        });

        // Create pending payment record for admin approval
        await fetch("/api/payments/create", {
          method: "POST",
          headers,
          body: JSON.stringify({
            plan: selectedPlanId,
            tier: safeTierIndex + 1,
            amount: tier.price,
            email: form.email,
            name: form.fullName,
          }),
        });

        const params = new URLSearchParams({
          method: "invoice",
          plan: selectedPlanId,
          tier: tier.calls.toString(),
        });
        window.location.href = `/dekujeme?${params.toString()}`;
        return;
      }
    } catch {
      setSubmitError("Došlo k chybě. Zkuste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-20">
      <Container>
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/cenik"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Zpět na ceník
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left column: Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                Dokončit objednávku
              </h1>
              <p className="mt-2 text-neutral-500">
                Vyberte balíček, vyplňte údaje a zvolte způsob platby.
              </p>
            </ScrollReveal>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {/* Plan selector */}
              <ScrollReveal delay={0.05}>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-3">
                    Plán
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(["solo", "team"] as const).map((id) => {
                      const p = pricingPlans.find((pl) => pl.id === id)!;
                      const Icon = planIcons[id];
                      const isSelected = selectedPlanId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handlePlanChange(id)}
                          className={`text-left rounded-xl border-2 p-4 transition-all ${
                            isSelected
                              ? "border-primary-500 bg-primary-50/50 shadow-sm"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  isSelected
                                    ? "bg-primary-500 text-white"
                                    : "bg-neutral-100 text-neutral-500"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-800">
                                  {p.name}
                                </span>
                                {p.highlighted && (
                                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    Populární
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                isSelected
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-neutral-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-neutral-500">
                            {p.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tier selector */}
                  <div className="mt-4">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">
                      Počet hovorů / měsíc
                    </label>
                    <div className="relative">
                      <select
                        value={safeTierIndex}
                        onChange={(e) => setTierIndex(Number(e.target.value))}
                        className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 pr-10 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                      >
                        {plan.tiers.map((t, i) => (
                          <option key={i} value={i}>
                            {t.calls} hovorů / {t.agents} agentů — {t.price.toLocaleString("cs-CZ")} Kč/měs
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact info */}
              <ScrollReveal delay={0.1}>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                    Kontaktní údaje
                  </h2>
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
                        placeholder="jan@example.com"
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.email ? "border-red-400" : "border-neutral-300"
                        }`}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div className="sm:col-span-2">
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
                </div>
              </ScrollReveal>

              {/* Payment method */}
              <ScrollReveal delay={0.15}>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                    Způsob platby
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        paymentMethod === "card"
                          ? "border-primary-500 bg-primary-50/50 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                        paymentMethod === "card" ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">Kartou online</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Visa, Mastercard, Apple Pay</p>
                      </div>
                      <div className={`ml-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 ${
                        paymentMethod === "card" ? "border-primary-500 bg-primary-500" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "card" && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("invoice")}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        paymentMethod === "invoice"
                          ? "border-primary-500 bg-primary-50/50 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                        paymentMethod === "invoice" ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}>
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">Fakturou</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Bankovní převod, splatnost 14 dní</p>
                      </div>
                      <div className={`ml-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 ${
                        paymentMethod === "invoice" ? "border-primary-500 bg-primary-500" : "border-neutral-300"
                      }`}>
                        {paymentMethod === "invoice" && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Invoice form — only for invoice payment */}
              {paymentMethod === "invoice" && (
                <ScrollReveal delay={0.05}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                        Fakturační údaje
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Název firmy / Jméno
                          </label>
                          <input id="companyName" name="companyName" type="text" value={form.companyName} onChange={handleChange} placeholder="Reality s.r.o. nebo Jan Novák" className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        </div>
                        <div>
                          <label htmlFor="ico" className="mb-1.5 block text-sm font-medium text-neutral-700">IČO <span className="text-neutral-400 font-normal">(nepovinné)</span></label>
                          <input id="ico" name="ico" type="text" value={form.ico} onChange={handleChange} placeholder="12345678" maxLength={8} className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        </div>
                        <div>
                          <label htmlFor="dic" className="mb-1.5 block text-sm font-medium text-neutral-700">DIČ <span className="text-neutral-400 font-normal">(nepovinné)</span></label>
                          <input id="dic" name="dic" type="text" value={form.dic} onChange={handleChange} placeholder="CZ12345678" className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">Fakturační adresa</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label htmlFor="street" className="mb-1.5 block text-sm font-medium text-neutral-700">Ulice a číslo popisné *</label>
                          <input id="street" name="street" type="text" autoComplete="street-address" value={form.street} onChange={handleChange} placeholder="Vinohradská 123" className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.street ? "border-red-400" : "border-neutral-300"}`} />
                          {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
                        </div>
                        <div>
                          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-neutral-700">Město *</label>
                          <input id="city" name="city" type="text" autoComplete="address-level2" value={form.city} onChange={handleChange} placeholder="Praha" className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.city ? "border-red-400" : "border-neutral-300"}`} />
                          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                        </div>
                        <div>
                          <label htmlFor="zip" className="mb-1.5 block text-sm font-medium text-neutral-700">PSČ *</label>
                          <input id="zip" name="zip" type="text" autoComplete="postal-code" value={form.zip} onChange={handleChange} placeholder="110 00" maxLength={6} className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${errors.zip ? "border-red-400" : "border-neutral-300"}`} />
                          {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip}</p>}
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-neutral-700">Stát</label>
                          <select id="country" name="country" value={form.country} onChange={handleChange} className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 bg-white transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                            <option value="CZ">Česká republika</option>
                            <option value="SK">Slovensko</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-neutral-700">Poznámka k objednávce <span className="text-neutral-400 font-normal">(nepovinné)</span></label>
                      <textarea id="note" name="note" rows={3} value={form.note} onChange={handleChange} placeholder="Další informace k fakturaci..." className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none" />
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Error */}
              {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <ScrollReveal delay={0.2}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Zpracovávám...
                    </>
                  ) : paymentMethod === "card" ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Zaplatit kartou — {tier.price.toLocaleString("cs-CZ")} Kč/měs
                    </>
                  ) : (
                    <>
                      <Receipt className="h-4 w-4" />
                      Objednat a vystavit fakturu
                    </>
                  )}
                </button>

                {paymentMethod === "card" && (
                  <p className="mt-3 text-center text-xs text-neutral-400">
                    Budete přesměrováni na zabezpečenou platební bránu Stripe
                  </p>
                )}
              </ScrollReveal>

              {/* Trust badges */}
              <ScrollReveal delay={0.25}>
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Zabezpečená platba</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Lock className="h-3.5 w-3.5" />
                    <span>SSL šifrování</span>
                  </div>
                </div>
              </ScrollReveal>
            </form>
          </div>

          {/* Right column: Order summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.1}>
              <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                  <h2 className="font-semibold text-neutral-800">Shrnutí objednávky</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-neutral-800">{plan.name}</p>
                      <p className="font-bold text-neutral-800">{tier.price.toLocaleString("cs-CZ")} Kč</p>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{tier.calls} hovorů / {tier.agents} agentů / měsíc</p>
                  </div>
                  <div className="border-t border-neutral-100" />
                  <div className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span className="text-xs text-neutral-600">{feature.label}</span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-neutral-400 pl-5">+ dalších {plan.features.length - 5} funkcí</p>
                    )}
                  </div>
                  <div className="border-t border-neutral-100" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">{plan.name} ({tier.calls} hovorů)</span>
                      <span className="text-neutral-800">{tier.price.toLocaleString("cs-CZ")} Kč</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Cena je včetně DPH</span>
                    </div>
                  </div>
                  <div className="border-t border-neutral-200" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800">Celkem / měsíc</span>
                    <span className="text-xl font-bold text-neutral-800">{tier.price.toLocaleString("cs-CZ")} Kč</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

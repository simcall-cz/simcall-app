"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Check,
  Shield,
  Lock,
  ChevronLeft,
  Loader2,
  ArrowRight,
  Receipt,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { pricingPlans } from "@/data/pricing";

type PaymentMethod = "card" | "invoice";
type BillingPeriod = "monthly" | "annual";

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
  const planParam = searchParams.get("plan") || "professional";
  const billingParam = (searchParams.get("billing") as BillingPeriod) || "monthly";

  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(billingParam);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState<BillingForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BillingForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const plan = pricingPlans.find((p) => p.id === selectedPlan) || pricingPlans[1];
  const isEnterprise = plan.id === "enterprise";
  const price = billingPeriod === "annual" ? plan.priceAnnual : plan.price;

  // Parse numeric price for summary
  const numericPrice = price.match(/[\d\s]+/)?.[0]?.replace(/\s/g, "") || "0";
  const priceNum = parseInt(numericPrice) || 0;
  const annualTotal = billingPeriod === "annual" ? priceNum * 12 : null;

  useEffect(() => {
    if (searchParams.get("plan")) setSelectedPlan(searchParams.get("plan")!);
    if (searchParams.get("billing")) setBillingPeriod(searchParams.get("billing") as BillingPeriod);
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BillingForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BillingForm, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Zadejte jmeno";
    if (!form.email.trim()) newErrors.email = "Zadejte e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Neplatny format e-mailu";

    if (paymentMethod === "invoice") {
      if (!form.street.trim()) newErrors.street = "Zadejte ulici a cislo popisne";
      if (!form.city.trim()) newErrors.city = "Zadejte mesto";
      if (!form.zip.trim()) newErrors.zip = "Zadejte PSC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate submission - will be replaced with Stripe / invoice API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  // Success state
  if (submitted) {
    return (
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <ScrollReveal>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                {paymentMethod === "card"
                  ? "Objednavka prijata!"
                  : "Faktura bude vystavena"}
              </h1>
              <p className="mt-4 text-neutral-500 leading-relaxed">
                {paymentMethod === "card"
                  ? "Dekujeme za objednavku. Platebni brana Stripe bude brzy napojena. Budeme vas kontaktovat na e-mail."
                  : `Dekujeme za objednavku planu ${plan.name}. Fakturu zasleme na ${form.email} do 24 hodin. Po prijeti platby aktivujeme vas ucet.`}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  Prejit do dashboardu
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Zpet na hlavni stranku
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    );
  }

  // Enterprise → contact page
  if (isEnterprise) {
    return (
      <section className="py-20 sm:py-28">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <ScrollReveal>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                Enterprise plan
              </h1>
              <p className="mt-4 text-neutral-500 leading-relaxed">
                Pro Enterprise plan s vlastni konfiguraci nas prosim kontaktujte.
                Pripravime nabidku na miru pro vas tym.
              </p>
              <div className="mt-8">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  Kontaktujte nas
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
    <section className="py-12 sm:py-20">
      <Container>
        {/* Back link */}
        <ScrollReveal>
          <Link
            href="/cenik"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Zpet na cenik
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left column: Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
                Dokoncit objednavku
              </h1>
              <p className="mt-2 text-neutral-500">
                Vyplnte fakturacni udaje a vyberte zpusob platby.
              </p>
            </ScrollReveal>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {/* Plan selector */}
              <ScrollReveal delay={0.05}>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-3">
                    Vybrany plan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pricingPlans
                      .filter((p) => p.id !== "enterprise")
                      .map((p) => {
                        const isSelected = selectedPlan === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPlan(p.id)}
                            className={`text-left rounded-xl border-2 p-4 transition-all ${
                              isSelected
                                ? "border-primary-500 bg-primary-50/50 shadow-sm"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
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
                            <p className="mt-1 text-sm text-neutral-500">
                              {billingPeriod === "annual" ? p.priceAnnual : p.price}
                            </p>
                          </button>
                        );
                      })}
                  </div>

                  {/* Billing period toggle */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingPeriod("monthly")}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        billingPeriod === "monthly"
                          ? "bg-neutral-800 text-white"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      Mesicne
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod("annual")}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        billingPeriod === "annual"
                          ? "bg-neutral-800 text-white"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      }`}
                    >
                      Rocne
                      <span className="ml-1.5 text-green-500 text-xs font-bold">-15%</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Contact info */}
              <ScrollReveal delay={0.1}>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                    Kontaktni udaje
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Cele jmeno *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Jan Novak"
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                          errors.fullName ? "border-red-400" : "border-neutral-300"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
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
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
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
                    Zpusob platby
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Card payment */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        paymentMethod === "card"
                          ? "border-primary-500 bg-primary-50/50 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                          paymentMethod === "card"
                            ? "bg-primary-500 text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">Kartou online</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Visa, Mastercard, Apple Pay
                        </p>
                      </div>
                      <div
                        className={`ml-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 ${
                          paymentMethod === "card"
                            ? "border-primary-500 bg-primary-500"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </button>

                    {/* Invoice / bank transfer */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("invoice")}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        paymentMethod === "invoice"
                          ? "border-primary-500 bg-primary-50/50 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                          paymentMethod === "invoice"
                            ? "bg-primary-500 text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800">Fakturou</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Bankovni prevod, splatnost 14 dni
                        </p>
                      </div>
                      <div
                        className={`ml-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 ${
                          paymentMethod === "invoice"
                            ? "border-primary-500 bg-primary-500"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === "invoice" && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card payment placeholder */}
              {paymentMethod === "card" && (
                <ScrollReveal delay={0.05}>
                  <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
                    <CreditCard className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-600">
                      Platebni brana Stripe
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Stripe Checkout bude brzy napojen. Zatim pouzijte platbu fakturou.
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {/* Invoice form fields */}
              {paymentMethod === "invoice" && (
                <ScrollReveal delay={0.05}>
                  <div className="space-y-6">
                    {/* Company info */}
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                        Fakturacni udaje
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="companyName"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            Nazev firmy / Jmeno
                          </label>
                          <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="Reality s.r.o. nebo Jan Novak"
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="ico"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            ICO{" "}
                            <span className="text-neutral-400 font-normal">(nepovinne)</span>
                          </label>
                          <input
                            id="ico"
                            name="ico"
                            type="text"
                            value={form.ico}
                            onChange={handleChange}
                            placeholder="12345678"
                            maxLength={8}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="dic"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            DIC{" "}
                            <span className="text-neutral-400 font-normal">(nepovinne)</span>
                          </label>
                          <input
                            id="dic"
                            name="dic"
                            type="text"
                            value={form.dic}
                            onChange={handleChange}
                            placeholder="CZ12345678"
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                        Fakturacni adresa
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="street"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            Ulice a cislo popisne *
                          </label>
                          <input
                            id="street"
                            name="street"
                            type="text"
                            autoComplete="street-address"
                            value={form.street}
                            onChange={handleChange}
                            placeholder="Vinohradska 123"
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.street ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.street && (
                            <p className="mt-1 text-xs text-red-500">{errors.street}</p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            Mesto *
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="address-level2"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Praha"
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.city ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="zip"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            PSC *
                          </label>
                          <input
                            id="zip"
                            name="zip"
                            type="text"
                            autoComplete="postal-code"
                            value={form.zip}
                            onChange={handleChange}
                            placeholder="110 00"
                            maxLength={6}
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                              errors.zip ? "border-red-400" : "border-neutral-300"
                            }`}
                          />
                          {errors.zip && (
                            <p className="mt-1 text-xs text-red-500">{errors.zip}</p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="country"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                          >
                            Stat
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 bg-white transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          >
                            <option value="CZ">Ceska republika</option>
                            <option value="SK">Slovensko</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label
                        htmlFor="note"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Poznamka k objednavce{" "}
                        <span className="text-neutral-400 font-normal">(nepovinne)</span>
                      </label>
                      <textarea
                        id="note"
                        name="note"
                        rows={3}
                        value={form.note}
                        onChange={handleChange}
                        placeholder="Dalsi informace k fakturaci..."
                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Submit button */}
              <ScrollReveal delay={0.2}>
                <button
                  type="submit"
                  disabled={isSubmitting || (paymentMethod === "card")}
                  className="w-full rounded-xl bg-primary-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Zpracovavam...
                    </>
                  ) : paymentMethod === "card" ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Zaplatit kartou (pripravujeme)
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
                    Platba kartou bude dostupna po napojeni Stripe. Pouzijte prosim platbu fakturou.
                  </p>
                )}
              </ScrollReveal>

              {/* Trust badges */}
              <ScrollReveal delay={0.25}>
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Zabezpecena platba</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Lock className="h-3.5 w-3.5" />
                    <span>SSL sifrovani</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Check className="h-3.5 w-3.5" />
                    <span>14 dni zdarma</span>
                  </div>
                </div>
              </ScrollReveal>
            </form>
          </div>

          {/* Right column: Order summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.1}>
              <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                  <h2 className="font-semibold text-neutral-800">
                    Shrnutí objednávky
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* Plan info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-800">{plan.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {billingPeriod === "annual" ? "Rocni fakturace" : "Mesicni fakturace"}
                      </p>
                    </div>
                    <p className="font-bold text-neutral-800">{price}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100" />

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span className="text-xs text-neutral-600">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-neutral-400 pl-5">
                        + dalších {plan.features.length - 5} funkcí
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-100" />

                  {/* Price breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Plan {plan.name}</span>
                      <span className="text-neutral-800">{price}</span>
                    </div>
                    {billingPeriod === "annual" && annualTotal && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Rocne celkem</span>
                        <span className="text-neutral-800">
                          {annualTotal.toLocaleString("cs-CZ")} Kc
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">DPH (21%)</span>
                      <span className="text-neutral-800">
                        {Math.round(priceNum * 0.21).toLocaleString("cs-CZ")} Kc
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-200" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-800">Celkem / mesíc</span>
                    <span className="text-xl font-bold text-neutral-800">
                      {Math.round(priceNum * 1.21).toLocaleString("cs-CZ")} Kc
                    </span>
                  </div>

                  {/* Trial note */}
                  <div className="rounded-lg bg-green-50 border border-green-100 p-3">
                    <p className="text-xs text-green-700 font-medium">
                      Prvních 14 dní zdarma. Platba se strhne až po skončení zkušební doby.
                    </p>
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

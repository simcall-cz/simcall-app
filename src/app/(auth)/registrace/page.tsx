"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Check,
  Loader2,
  Phone,
  BarChart3,
  MessageSquare,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type PlanType = "free" | "paid";

const plans = [
  {
    id: "free" as PlanType,
    name: "Demo",
    price: "0 Kč",
    period: "navždy",
    icon: Zap,
    description: "Ideální pro vyzkoušení",
    features: [
      "3 tréninkové hovory celkem",
      "1 AI agent (Petr Svoboda)",
      "Základní zpětná vazba",
      "Historie hovorů",
    ],
    limitations: [
      "Omezený počet hovorů",
      "Bez pokročilé analýzy",
    ],
    popular: false,
  },
  {
    id: "paid" as PlanType,
    name: "Solo",
    price: "od 490 Kč",
    period: "/ měsíc",
    icon: Crown,
    description: "Pro profesionální makléře",
    features: [
      "500 AI agentů k výběru",
      "Až 1 000 hovorů/měsíc",
      "Detailní AI analýza hovoru",
      "Přepis hovoru s exportem PDF",
      "Sledování pokroku a statistiky",
      "Personalizovaná doporučení",
      "Prioritní podpora",
    ],
    limitations: [],
    popular: true,
  },
];

export default function RegistracePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"plan" | "details">("plan");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError("Zadejte své jméno");
      return;
    }
    if (!formData.email.trim()) {
      setError("Zadejte e-mail");
      return;
    }
    if (formData.password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Hesla se neshodují");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: selectedPlan,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Tento e-mail je již zaregistrován. Přihlaste se.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        // 2. Create profile in profiles table
        // Insert profile (phone column needs to be added in Supabase Dashboard)
        const profileData: Record<string, string | null> = {
          id: data.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: selectedPlan,
        };
        if (formData.phone.trim()) {
          profileData.phone = formData.phone.trim();
        }
        await supabase.from("profiles").insert(profileData);

        // 3. Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Vytvořte si účet
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {step === "plan"
            ? "Vyberte si svůj plán a začněte trénovat"
            : "Vyplňte své údaje pro dokončení registrace"}
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            step === "plan"
              ? "bg-primary-500 text-white"
              : "bg-primary-100 text-primary-600"
          }`}
        >
          {step === "details" ? <Check className="h-4 w-4" /> : "1"}
        </div>
        <div
          className={`h-0.5 w-12 rounded ${
            step === "details" ? "bg-primary-500" : "bg-neutral-200"
          }`}
        />
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            step === "details"
              ? "bg-primary-500 text-white"
              : "bg-neutral-100 text-neutral-400"
          }`}
        >
          2
        </div>
      </div>

      {/* Step 1: Plan selection */}
      {step === "plan" && (
        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-xl border-2 p-4 sm:p-5 transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50/50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-900">
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                            <Sparkles className="h-3 w-3" />
                            Populární
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-500">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-bold text-neutral-900">
                      {plan.price}
                    </p>
                    <p className="text-xs text-neutral-400">{plan.period}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 grid gap-1.5">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      <span className="text-sm text-neutral-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Selection indicator */}
                <div className="mt-4 flex items-center justify-end">
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
              </button>
            );
          })}

          <button
            onClick={() => setStep("details")}
            className="mt-4 w-full rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Pokračovat
          </button>
        </div>
      )}

      {/* Step 2: Registration form */}
      {step === "details" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selected plan badge */}
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3">
            {selectedPlan === "paid" ? (
              <Crown className="h-4 w-4 text-primary-500" />
            ) : (
              <Zap className="h-4 w-4 text-neutral-500" />
            )}
            <span className="text-sm font-medium text-neutral-700">
              Plán:{" "}
              <span className="text-primary-600">
                {selectedPlan === "paid" ? "Solo (od 490 Kč/měs)" : "Demo"}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setStep("plan")}
              className="ml-auto text-xs text-primary-500 hover:text-primary-600"
            >
              Změnit
            </button>
          </div>

          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Celé jméno
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jan Novák"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jan@example.com"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Telefonní číslo
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+420 123 456 789"
                className="w-full rounded-lg border border-neutral-300 pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Heslo
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimálně 6 znaků"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Potvrdit heslo
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Zopakujte heslo"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Vytvářím účet...
              </>
            ) : (
              "Vytvořit účet"
            )}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-neutral-400">
            Registrací souhlasíte s{" "}
            <Link href="#" className="text-primary-500 hover:text-primary-600">
              obchodními podmínkami
            </Link>{" "}
            a{" "}
            <Link href="#" className="text-primary-500 hover:text-primary-600">
              zásadami ochrany osobních údajů
            </Link>
          </p>
        </form>
      )}

      {/* Login link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500">
          Už máte účet?{" "}
          <Link
            href="/prihlaseni"
            className="font-semibold text-primary-500 hover:text-primary-600"
          >
            Přihlaste se
          </Link>
        </p>
      </div>
    </div>
  );
}

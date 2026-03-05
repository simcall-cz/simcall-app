"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Phone,
  CheckCircle,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegistracePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "+420 ",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

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
      // Sign up with Supabase Auth — always demo role
      // The DB trigger handle_new_user() creates the profile automatically
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone || undefined,
            role: "free",
          },
          emailRedirectTo: `${window.location.origin}/prihlaseni`,
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
        // Send welcome email via Resend
        fetch("/api/email/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            planName: "Demo",
          }),
        }).catch(() => { });

        // Notify about new registration (Discord)
        fetch("/api/notify/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, name: formData.fullName }),
        }).catch(() => { });

        // Check if session exists (email confirmation disabled)
        if (data.session) {
          // User is logged in immediately — set cookie and redirect
          document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
          window.location.href = "/dashboard";
        } else {
          // Email confirmation required — show "check your email" message
          setEmailSent(true);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Email confirmation sent screen
  if (emailSent) {
    return (
      <div>
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-5">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Účet vytvořen!
          </h2>
          <p className="text-neutral-500 text-sm max-w-sm mb-6">
            Na adresu <strong className="text-neutral-700">{formData.email}</strong> jsme
            odeslali potvrzovací e-mail. Klikněte na odkaz v e-mailu pro
            aktivaci účtu.
          </p>
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-left">
              <Mail className="h-5 w-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Zkontrolujte svou e-mailovou schránku
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Pokud e-mail nevidíte, zkontrolujte složku spam
                </p>
              </div>
            </div>
            <Link
              href="/prihlaseni"
              className="block w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Přejít na přihlášení
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Vytvořte si účet
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Začněte zdarma — 3 tréninkové hovory bez závazků
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            Telefonní číslo{" "}
            <span className="text-neutral-400 font-normal">(nepovinné)</span>
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
            "Vytvořit účet zdarma"
          )}
        </button>

        {/* Free plan info */}
        <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3">
          <p className="text-xs text-neutral-500 text-center">
            <span className="font-medium text-neutral-700">Demo zdarma</span>
            {" — "}3 tréninkové hovory, 1 AI agent, základní zpětná vazba.
            Plné plány od 490 Kč/měsíc.
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-neutral-400">
          Registrací souhlasíte s{" "}
          <Link
            href="/obchodni-podminky"
            className="text-primary-500 hover:text-primary-600"
          >
            obchodními podmínkami
          </Link>{" "}
          a{" "}
          <Link
            href="/ochrana-soukromi"
            className="text-primary-500 hover:text-primary-600"
          >
            zásadami ochrany osobních údajů
          </Link>
        </p>
      </form>

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

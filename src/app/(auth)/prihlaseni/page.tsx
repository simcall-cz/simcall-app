"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PrihlaseniPage() {
  const router = useRouter();
  // Get redirect URL from query params (set by middleware)
  const getRedirectUrl = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("redirect") || "/dashboard";
    }
    return "/dashboard";
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError("Zadejte e-mail");
      return;
    }
    if (!formData.password) {
      setError("Zadejte heslo");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login")) {
          setError("Nesprávný e-mail nebo heslo");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Potvrďte prosím svůj e-mail. Zkontrolujte svou schránku.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.session) {
        router.push(getRedirectUrl());
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/prihlaseni`,
      });

      if (error) {
        setError(error.message);
      } else {
        setResetSent(true);
      }
    } catch (err) {
      setError("Nepodařilo se odeslat e-mail pro reset hesla");
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset view
  if (showReset) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Obnovit heslo
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {resetSent
              ? "Zkontrolujte svou e-mailovou schránku"
              : "Zadejte svůj e-mail a my vám pošleme odkaz pro obnovení hesla"}
          </p>
        </div>

        {resetSent ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-xl bg-green-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-green-800">E-mail odeslán!</p>
                <p className="mt-1 text-sm text-green-600">
                  Odkaz pro obnovení hesla jsme odeslali na{" "}
                  <strong>{resetEmail}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowReset(false);
                setResetSent(false);
              }}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Zpět na přihlášení
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label
                htmlFor="resetEmail"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                E-mail
              </label>
              <input
                id="resetEmail"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="jan@example.com"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Odesílám...
                </>
              ) : (
                "Odeslat odkaz pro obnovení"
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
            >
              Zpět na přihlášení
            </button>
          </form>
        )}
      </div>
    );
  }

  // Login view
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Přihlášení</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Vítejte zpět! Přihlaste se ke svému účtu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700"
            >
              Heslo
            </label>
            <button
              type="button"
              onClick={() => {
                setShowReset(true);
                setError(null);
              }}
              className="text-xs font-medium text-primary-500 hover:text-primary-600"
            >
              Zapomněli jste heslo?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Vaše heslo"
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
              Přihlašuji...
            </>
          ) : (
            "Přihlásit se"
          )}
        </button>
      </form>

      {/* Register link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500">
          Nemáte účet?{" "}
          <Link
            href="/registrace"
            className="font-semibold text-primary-500 hover:text-primary-600"
          >
            Zaregistrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}

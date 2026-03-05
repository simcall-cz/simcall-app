"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NoveHesloPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user has a valid recovery session (from the email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    };

    // Listen for auth state changes (recovery token from URL hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
          setChecking(false);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hesla se neshodují");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch {
      setError("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!isValidSession && !success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            Neplatný odkaz
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Odkaz na obnovení hesla vypršel nebo je neplatný. Vyžádejte si nový odkaz.
          </p>
          <a
            href="/prihlaseni"
            className="inline-block px-6 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
          >
            Zpět na přihlášení
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="text-3xl font-black text-neutral-900 tracking-tight">Sim</span>
            <span className="text-3xl font-black text-primary-500 tracking-tight">Call</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-8">
          {success ? (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h1 className="text-xl font-bold text-neutral-900 mb-2">
                Heslo změněno
              </h1>
              <p className="text-neutral-500 text-sm mb-4">
                Vaše heslo bylo úspěšně aktualizováno. Za chvíli budete přesměrováni do dashboardu.
              </p>
              <Loader2 className="w-5 h-5 animate-spin text-neutral-300 mx-auto" />
            </div>
          ) : (
            /* Reset form */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary-500" />
                </div>
                <h1 className="text-xl font-bold text-neutral-900 mb-1">
                  Nastavte nové heslo
                </h1>
                <p className="text-neutral-500 text-sm">
                  Zadejte nové heslo pro svůj SimCall účet
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Nové heslo
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Minimálně 6 znaků"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Potvrdit heslo
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Zadejte heslo znovu"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Ukládám...
                    </>
                  ) : (
                    "Uložit nové heslo"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          © 2026 SimCall — AI tréninkový simulátor pro realitní makléře
        </p>
      </div>
    </div>
  );
}

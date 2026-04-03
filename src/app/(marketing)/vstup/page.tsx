"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VstupPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sitePassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    if (sitePassword && pw === sitePassword) {
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `site-password=${sitePassword}; expires=${expires}; path=/; SameSite=Strict${window.location.protocol === "https:" ? "; Secure" : ""}`;
      router.push("/");
    } else {
      setError(true);
      setPw("");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <span className="text-2xl font-bold tracking-tight text-white">
            Sim<span className="text-[#e8491d]">Call</span>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            placeholder="Přístupové heslo"
            autoFocus
            className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm outline-none focus:ring-1 transition-all ${
              error
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:ring-white/20 focus:border-white/20"
            }`}
          />
          {error && (
            <p className="text-red-400/80 text-xs pl-1">Nesprávné heslo</p>
          )}
          <button
            type="submit"
            disabled={pw.length === 0}
            className="w-full py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Vstoupit
          </button>
        </form>
      </div>
    </div>
  );
}

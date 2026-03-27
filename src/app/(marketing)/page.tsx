"use client";

import { useState } from "react";

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !terms) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, terms }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Chyba při odesílání");
      }
    } catch {
      setError("Zkuste to prosím znovu");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="py-2">
        <p className="text-white font-medium text-sm">Zaevidováno. Ozveme se Vám jako první.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Váš e-mail"
        required
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
      />
      <label className="flex items-start gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => setTerms(!terms)}
          className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border transition-all ${
            terms ? "bg-[#e8491d] border-[#e8491d]" : "border-white/20"
          }`}
          aria-label="Souhlas s podmínkami"
        >
          {terms && (
            <svg className="w-full h-full text-white" fill="none" viewBox="0 0 16 16">
              <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="text-xs text-white/40 leading-relaxed">
          Souhlasím se zpracováním osobních údajů a zasíláním informací o spuštění.
        </span>
      </label>
      {error && <p className="text-red-400/70 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading || !email || !terms}
        className="w-full py-3.5 bg-[#e8491d] hover:bg-[#d13f17] text-white font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        {loading ? "Odesílám..." : "Mít přístup jako první"}
      </button>
    </form>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#e8491d]/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Nav */}
        <nav className="px-8 md:px-16 py-7">
          <span className="text-xl font-bold tracking-tight">
            Sim<span className="text-[#e8491d]">Call</span>
          </span>
        </nav>

        {/* Main */}
        <main className="flex-1 flex items-center px-8 md:px-16 py-16">
          <div className="w-full max-w-4xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left — headline */}
              <div>
                <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-6">
                  Připravujeme spuštění
                </p>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                  Každá chyba
                  <br />
                  <span className="text-white/20">u telefonu</span>
                  <br />
                  <span className="text-[#e8491d]">Vás stojí klienta.</span>
                </h1>
              </div>

              {/* Right — email form */}
              <div>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Zanechte svůj e-mail a budete mezi prvními, kdo se dozví o spuštění.
                </p>
                <SubscribeForm />
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 md:px-16 py-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/20">
              © {new Date().getFullYear()} SimCall
            </p>
            <div className="flex gap-5 text-xs text-white/20">
              <a href="#" className="hover:text-white/40 transition-colors">Podmínky</a>
              <a href="#" className="hover:text-white/40 transition-colors">Ochrana soukromí</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  { value: "315+", label: "AI personas v databázi" },
  { value: "105", label: "tréninkových lekcí" },
  { value: "24/7", label: "k dispozici" },
  { value: "0", label: "reálných klientů ohroženo" },
];

const FEATURES = [
  {
    icon: "🎙️",
    title: "Živý hlasový hovor",
    desc: "Trénuj přes telefon nebo mikrofon — ne přes chat. Přesně jako v realitě.",
  },
  {
    icon: "🧠",
    title: "AI klient, který tlačí",
    desc: "Každá persona má svůj příběh, motivaci a námitky. Žádné papírové dialogy.",
  },
  {
    icon: "📊",
    title: "Zpětná vazba po každém hovoru",
    desc: "Skóre, checkpointy, co fungovalo a co příště udělat jinak. Konkrétně.",
  },
  {
    icon: "⚡",
    title: "Stovky scénářů",
    desc: "Od prvního kontaktu přes exekuce po rozvody. Tréninky reálných situací.",
  },
];

// ─── Password form ──────────────────────────────────────────────────────────────
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    if (pw === "MercedesCLE53") {
      // Set cookie for 30 days
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `site-password=MercedesCLE53; expires=${expires}; path=/`;
      setTimeout(() => onSuccess(), 150);
    } else {
      setError(true);
      setLoading(false);
      setPw("");
    }
  }

  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4 font-medium">
        Přístup pro partnery
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Přístupové heslo"
          className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:ring-1 transition-all ${
            error
              ? "border-red-500/60 focus:ring-red-500/40"
              : "border-white/10 focus:ring-white/20 focus:border-white/20"
          }`}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || pw.length === 0}
          className="px-5 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "..." : "Vstup"}
        </button>
      </form>
      {error && (
        <p className="text-red-400 text-xs mt-2 ml-1">Nesprávné heslo</p>
      )}
    </div>
  );
}

// ─── Email subscribe form ───────────────────────────────────────────────────────
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
      setError("Zkus to znovu");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-white font-semibold text-lg">Perfektní, jsme v kontaktu.</p>
        <p className="text-white/50 text-sm mt-1">Dostaneš zprávu jako první.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tvuj@email.cz"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 text-sm outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
        />
      </div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          className={`relative mt-0.5 w-5 h-5 rounded flex-shrink-0 border transition-all ${
            terms
              ? "bg-[#e8491d] border-[#e8491d]"
              : "border-white/20 group-hover:border-white/40"
          }`}
          onClick={() => setTerms(!terms)}
        >
          {terms && (
            <svg className="absolute inset-0 m-auto w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input type="checkbox" className="sr-only" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span className="text-xs text-white/50 leading-relaxed">
          Souhlasím se{" "}
          <a href="#" className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
            zpracováním osobních údajů
          </a>{" "}
          a zasíláním informací o spuštění SimCall.
        </span>
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading || !email || !terms}
        className="w-full py-3.5 bg-[#e8491d] hover:bg-[#d13f17] text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {loading ? "Odesílám..." : "Chci být mezi prvními →"}
      </button>
    </form>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────────
export default function ComingSoonPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already has valid password cookie
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("site-password=MercedesCLE53"));
    if (hasCookie) {
      router.push("/dashboard");
    }
  }, [router]);

  function handlePasswordSuccess() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#e8491d]/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Sim<span className="text-[#e8491d]">Call</span>
            </span>
            <span className="text-xs text-white/30 border border-white/10 rounded-full px-2 py-0.5 font-medium">
              beta
            </span>
          </div>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Jsem z týmu →
          </button>
        </nav>

        {/* Hero */}
        <section className="px-6 md:px-12 pt-16 pb-12 max-w-5xl mx-auto">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="inline-flex items-center gap-2 text-xs text-[#e8491d] font-medium border border-[#e8491d]/30 bg-[#e8491d]/10 rounded-full px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8491d] animate-pulse" />
              Spuštění se blíží
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Každá chyba
              <br />
              <span className="text-white/20">u telefonu</span>
              <br />
              <span className="text-[#e8491d]">tě stojí klienta.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-4">
              Připravujeme prostředí, kde si realitní makléři mohou trénovat
              hovory s AI klienty — bez rizika, bez trapných chvil,
              bez ztracených obchodů.
            </p>
            <p className="text-sm text-white/30 max-w-xl">
              Stovky scénářů. Živé hlasové hovory. Zpětná vazba po každém
              tréninku. Přesně tak, jak to v realitě funguje.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="border border-white/5 rounded-2xl p-5 bg-white/[0.02]"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-6 font-medium">
            Co se chystá
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email form */}
        <section className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Buď mezi prvními.
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Zanech svůj email a dáme ti vědět jako prvním, jakmile SimCall
                otevřeme. Žádný spam — jen to podstatné.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span className="text-[#e8491d]">✓</span>
                  Dostaneš pozvánku dříve než ostatní
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span className="text-[#e8491d]">✓</span>
                  Speciální podmínky pro early adopters
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span className="text-[#e8491d]">✓</span>
                  Žádné spamování, kdykoli se odhlásíš
                </div>
              </div>
            </div>
            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
              <SubscribeForm />
            </div>
          </div>
        </section>

        {/* Password gate (collapsible) */}
        <section className="px-6 md:px-12 py-6 max-w-5xl mx-auto">
          {showPassword && (
            <div
              className={`transition-all duration-300 ${showPassword ? "opacity-100" : "opacity-0"}`}
            >
              <PasswordGate onSuccess={handlePasswordSuccess} />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-8 max-w-5xl mx-auto border-t border-white/5 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold">
              Sim<span className="text-[#e8491d]">Call</span>
            </span>
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} SimCall · AI tréninky pro realitní makléře v ČR
            </p>
            <div className="flex gap-4 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">
                Podmínky
              </a>
              <a href="#" className="hover:text-white/60 transition-colors">
                Ochrana soukromí
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

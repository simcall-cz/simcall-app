import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-neutral-900 p-12 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-lg font-black text-white">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              ELITE <span className="text-primary-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Trénujte své prodejní dovednosti s{" "}
            <span className="text-primary-400">umělou inteligencí</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
            Realistické simulace hovorů, okamžitá zpětná vazba a personalizované
            lekce pro realitní makléře v České republice.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-primary-400">500+</p>
              <p className="mt-1 text-sm text-neutral-500">Aktivních makléřů</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-400">10k+</p>
              <p className="mt-1 text-sm text-neutral-500">Tréninkových hovorů</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-400">+34%</p>
              <p className="mt-1 text-sm text-neutral-500">Lepší výsledky</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-xl bg-white/5 border border-white/10 p-6">
          <p className="text-sm italic text-neutral-300 leading-relaxed">
            &ldquo;Za první měsíc jsem zvýšil úspěšnost svých hovorů o 40 %. ELITE AI
            mi pomáhá trénovat přesně ty situace, ve kterých jsem dříve selhal.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500/20">
              <span className="text-xs font-bold text-primary-400">JK</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Jan Kovář</p>
              <p className="text-xs text-neutral-500">Senior makléř, RE/MAX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-lg font-black text-white">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                ELITE <span className="text-primary-500">AI</span>
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

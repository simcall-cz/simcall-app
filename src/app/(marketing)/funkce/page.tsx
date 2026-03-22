import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp,
  BarChart3,
  Trophy,
  Wand2,
  Check,
  Building2,
  Users,
  PhoneCall,
  MessageSquare,
  Home,
  Heart,
  ShieldCheck,
  UserX,
  Briefcase,
  Globe,
  GraduationCap,
  Map,
  Target,
  BookOpen,
  Dumbbell,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalyticsMockup } from "@/components/marketing/analytics-mockup";
import { BoardGameMockup } from "@/components/marketing/board-game-mockup";

export const metadata: Metadata = {
  title: "Funkce | SimCall",
  description:
    "Všechny funkce SimCall: 100 lekcí z realitní praxe, volný tréninkový mód, AI analýza hovorů, přepisy, manager dashboard a žebříčky.",
};

const features = [
  {
    icon: GraduationCap,
    title: "100 lekcí z realitní praxe",
    desc: "Kompletní učební cesta od začátečníka po elitního makléře. 10 tematických kategorií pokrývajících vše od prodeje po etiku.",
    tag: "Lekce",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Sparkles,
    title: "Okamžitá AI analýza po zavěšení",
    desc: "Získejte okamžité skóre, silné stránky a přesné prodejní tipy ke zlepšení konverze dříve, než sáhnete po dalším telefonu.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: FileText,
    title: "Detailní přepis hledající chyby",
    desc: "AI najde vašim makléřům chybné formulace a výplňová slova, která zabíjejí obchody.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: TrendingUp,
    title: "Křivka pokroku a výkonnosti",
    desc: "Manažeři i makléři jasně vidí, jestli rostou. Grafy prokazatelně určující propálení peněz za reklamu.",
    tag: "Solo",
    tagColor: "bg-primary-50 text-primary-600",
  },
  {
    icon: BarChart3,
    title: "Manažerské řídící centrum",
    desc: "Přehled o celém týmu bez nutnosti stát u každého makléře s tužkou. Komplexní analytika cold calls všech zaměstnanců.",
    tag: "Team",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: Trophy,
    title: "Surové kompetitivní žebříčky",
    desc: "Nemilosrdná gamifikace, která probudí prodejní instinkt celého oddělení. Vědí, kdo prodává a kdo jen zvedá telefony.",
    tag: "Team",
    tagColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Zabudovaná česká realiťácká pravidla",
    desc: "Naši AI agenti plně znají českou legislativu, správný rezervační proces i katastrální postupy. Makléř nemůže říct hloupost.",
    tag: "Obsahuje",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Dumbbell,
    title: "Volný tréninkový mód",
    desc: "Více než 500 AI agentů se scénáři ze skutečných případů. Trénujte kdykoli, cokoli, bez omezení tématu.",
    tag: "Obsahuje",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
];

const scenarios = [
  {
    icon: ShieldCheck,
    title: "Složitý proces v ČR",
    situation: '"Chci prodat byt, ale nevím, jak to u nás chodí."',
    solution: "Naše AI zná přesný český postup od rezervace k úschově a následně do katastru. Makléři se naučí prodávat proces bez váhání.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: PhoneCall,
    title: "Cold Call: Majitel z katastru",
    situation: '"Odkud máte moje číslo? Nechci prodat přes makléře!"',
    solution: "Nejběžnější křest ohněm. Agent simuluje vztek a podrážděnost a učí makléře, jak rychle prorazit bariéru k hodnotě.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: MessageSquare,
    title: "Bleskový Web Lead",
    situation: '"Právě jsem vyplnil formulář, chci prodat rychle."',
    solution: "Tlak na rychlé uzavření a profesionalitu. Simulace učí neusnout na vavřínech u teplého leadu a nepokazit 100% jistotu.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Krizový prodej a rozvod",
    situation: '"Musíme to rychle prodat, rozvádíme se. Rychle!"',
    solution: "Extrémní trénink empatie. Klienti na sebe křičí a makléř musí ustát mediaci a nenechat se stáhnout do hádky.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Home,
    title: "Mladý pár kupuje první byt",
    situation: '"Chceme koupit první bydlení, ale vůbec nevíme jak na to."',
    solution: "Budování celoživotního důvěrného vztahu. Makléři trénují, jak edukovat vyděšeného kupce a neztratit ho kvůli byrokracii.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Wand2,
    title: "Obhajoba exkluzivní smlouvy a provize",
    situation: '"Proč bych vám měl dávat exkluzivitu a 5% provizi, když mi jinde nabízí prodej bez závazků?"',
    solution: "Klíčový moment byznysu. Agent trénuje pádné argumenty pro exkluzivitu a učí se obhájit svou odměnu bez ustupování.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const lessonCategories = [
  { label: "Prodej", count: 15, color: "bg-blue-500" },
  { label: "Nájem", count: 13, color: "bg-emerald-500" },
  { label: "Finance", count: 10, color: "bg-yellow-500" },
  { label: "Právní vady", count: 13, color: "bg-purple-500" },
  { label: "Katastr", count: 5, color: "bg-indigo-500" },
  { label: "Technické", count: 11, color: "bg-orange-500" },
  { label: "Smlouvy", count: 7, color: "bg-cyan-500" },
  { label: "Speciální typy", count: 11, color: "bg-rose-500" },
  { label: "Marketing", count: 7, color: "bg-pink-500" },
  { label: "Etika a klienti", count: 8, color: "bg-teal-500" },
];

const plans = [
  {
    id: "solo",
    icon: Check,
    name: "Solo",
    color: "text-primary-500",
    border: "border-primary-200",
    bg: "bg-primary-50/50",
    highlighted: false,
    items: [
      "100 lekcí — cesta k Elitnímu makléři",
      "Volný tréninkový mód (500+ agentů)",
      "AI analýza hovoru a přepis",
      "Historie hovorů a nahrávky",
      "Sledování pokroku a statistiky",
      "Pokročilá analýza (detailní scoring)",
    ],
    price: "od 990 Kč/měs",
    href: "/checkout?plan=solo&tier=0",
  },
  {
    id: "team",
    icon: Users,
    name: "Team",
    color: "text-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50/50",
    highlighted: true,
    items: [
      "Vše ze Solo",
      "Manager dashboard",
      "Neomezený počet uživatelů",
      "Správa týmu a analytika",
      "Žebříčky v týmu",
      "Sdílený pool minut",
    ],
    price: "od 7 490 Kč/měs",
    href: "/checkout?plan=team&tier=0",
  },
  {
    id: "enterprise",
    icon: Building2,
    name: "Enterprise",
    color: "text-purple-500",
    border: "border-purple-200",
    bg: "bg-purple-50/50",
    highlighted: false,
    items: [
      "Vše z Team",
      "Whitelabel řešení",
      "Vlastní AI agenti a scénáře",
      "Dedikovaný account manažer",
      "Počet minut dohodou",
      "Vlastní analytiky na míru",
    ],
    price: "Cena dohodou",
    href: "/domluvit-schuzku",
  },
];

export default function FunkcePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-primary-50/50 blur-3xl" />
        </div>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <ScrollReveal>
              <Badge className="mb-5">Funkce</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-800 leading-[1.1]">
                Tvrdý trénink.{" "}
                <GradientText>Reálné provize.</GradientText>
              </h1>
              <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
                100 lekcí z realitní praxe vás provedou kompletní cestou od začátečníka po elitního makléře. Co je před zkouškou z dokumentu, to se v praxi naučíte tady.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-7 flex gap-3 justify-center">
                <Link href="/registrace">
                  <Button size="lg" className="group">
                    Začít zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg">Zobrazit ceník</Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 100 LESSONS — LEARNING PATH */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <ScrollReveal>
                <Badge className="mb-4">Hlavní produkt</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 tracking-tight">
                  100 lekcí k titulu{" "}
                  <GradientText>Elitní makléř</GradientText>
                </h2>
                <p className="mt-4 text-neutral-500 leading-relaxed">
                  Strukturovaná učební cesta postavená na reálných situacích, které makléři každý den řeší v praxi. Každá lekce obsahuje 3 pod-scénáře s rostoucí obtížností. Pro postup musíte získat minimálně 80 % u každého hovoru.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="mt-6 space-y-3">
                  {[
                    { icon: Map, text: "Interaktivní mapa s postupným odemykáním lekcí" },
                    { icon: Target, text: "3 pod-scénáře v každé lekci (začátečník → pokročilý)" },
                    { icon: BookOpen, text: "Edukační úvod s tipy před každým hovorem" },
                    { icon: TrendingUp, text: "Progress od Začátečníka po Elitního makléře" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-primary-500" />
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Category breakdown */}
              <ScrollReveal delay={0.2}>
                <div className="mt-8">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">10 tematických kategorií</p>
                  <div className="grid grid-cols-2 gap-2">
                    {lessonCategories.map((cat) => (
                      <div key={cat.label} className="flex items-center gap-2 text-sm text-neutral-600">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                        <span>{cat.label}</span>
                        <span className="text-neutral-400 text-xs">({cat.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15}>
              <div className="flex justify-center">
                <BoardGameMockup className="max-w-sm w-full" />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* TWO MODES: LEKCE + TRÉNINK */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Dva režimy"
              title="Lekce i volný trénink"
              subtitle="Strukturovaná cesta pro systematický růst. Volný mód pro trénink čehokoli, kdykoli."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ScrollReveal delay={0.05}>
              <div className="h-full rounded-2xl border-2 border-primary-200 bg-primary-50/30 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 text-lg">Lekce</h3>
                    <span className="text-xs text-primary-600 font-medium">Strukturovaná cesta</span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "100 lekcí pokrývajících kompletní realitní praxi",
                    "300 pod-scénářů s rostoucí obtížností",
                    "Postupné odemykání — nelze přeskočit",
                    "Minimálně 80 % u každého hovoru pro postup",
                    "Edukační materiály a tipy před každým hovorem",
                    "10 barevně odlišených kategorií",
                    "Progress bar od Začátečníka po Elitního makléře",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-2xl border-2 border-amber-200 bg-amber-50/30 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 text-lg">Trénink</h3>
                    <span className="text-xs text-amber-600 font-medium">Volný mód</span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Více než 500 AI agentů se scénáři z praxe",
                    "Filtry dle obtížnosti a kategorie klienta",
                    "Bez omezení pořadí — trénujte cokoli",
                    "Situace podle skutečných případů z praxe",
                    "Každý agent má vlastní osobnost a styl",
                    "Horký, teplý i studený lead",
                    "Vhodný pro opakování slabých míst",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* REAL WORLD SCENARIOS */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Situace z praxe"
              title="Trénujte to, na čem to reálně padá"
              subtitle="6 situací, které oddělují elitní makléře od průměrných telefonistů. Naši AI agenti je simulují do puntíku."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {scenarios.map((scen, idx) => (
              <ScrollReveal key={scen.title} delay={idx * 0.1}>
                <div className="border border-neutral-100 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-neutral-50/50 h-full flex flex-col">
                  <div className="flex gap-4 items-center mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${scen.bg}`}>
                      <scen.icon className={`w-6 h-6 ${scen.color}`} />
                    </div>
                    <h3 className="font-bold text-neutral-800 leading-tight">{scen.title}</h3>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Klient v telefonu:</span>
                      <p className="text-sm font-medium text-neutral-700 italic border-l-2 border-neutral-200 pl-3 py-1">
                        {scen.situation}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Předmět tréninku:</span>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {scen.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CLIENT CATEGORIES */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="6 kategorií klientů"
              title="Každý typ přináší jiné výzvy"
              subtitle="Od skeptiků po investory. Trénujte na všech typech klientů, se kterými se v praxi setkáte."
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: UserX, label: "Skeptici a Odmítači", desc: "Nedůvěřiví majitelé, kteří ze zásady nenávidí makléře." },
              { icon: Briefcase, label: "Zkušení Investoři", desc: "Tvrdí vyjednavači analyzující každé vaše slovo." },
              { icon: Users, label: "Rodiny a Rozvody", desc: "Hádky, křik a extrémní emoce přímo na telefonu." },
              { icon: Building2, label: "Developeři", desc: "Arogantní profesionálové s nerealistickými nároky." },
              { icon: Home, label: "Prvokupci", desc: "Vyděšení začátečníci nevědící co mají dělat." },
              { icon: Globe, label: "Zahraniční klientela", desc: "Kulturní bariéra a obrovská nedůvěra na dálku." },
            ].map((cat, i) => (
              <ScrollReveal key={cat.label} delay={i * 0.07}>
                <div className="p-6 rounded-2xl bg-white border border-neutral-100 hover:shadow-lg transition-shadow group flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-500 flex justify-center items-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-800">{cat.label}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{cat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FEATURE GRID */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader badge="Co dostanete" title="Klíčové funkce" />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.07}>
                <div className="h-full bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <f.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${f.tagColor}`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-sm leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ANALYTICS SHOWCASE */}
      <section className="py-16 sm:py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <ScrollReveal>
                <Badge className="mb-4">Zpětná vazba pro dospělé</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Surová analytika{" "}
                  <span className="text-primary-400">každého slova</span>
                </h2>
                <p className="mt-4 text-neutral-400 leading-relaxed">
                  Podívejte se pravdě do očí. Po každém hovoru přesně ukážeme, ve které vteřině jste ztratili klienta kvůli váhání nebo aroganci.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ul className="mt-6 space-y-3">
                  {[
                    "Celkové skóre a splněné cíle",
                    "Kompletní přepis s časovými razítky",
                    "Identifikace výplňových slov",
                    "Personalizované tipy ke zlepšení",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-neutral-300">
                      <Sparkles className="w-4 h-4 text-primary-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
            <div className="flex justify-center">
              <AnalyticsMockup className="max-w-sm w-full" />
            </div>
          </div>
        </Container>
      </section>

      {/* PLAN COMPARISON */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Plány"
              title="Vyberte plán pro vás"
              subtitle="Solo pro jednotlivce, Team pro firmy, Enterprise na míru."
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={plan.id} delay={i * 0.08}>
                <div className={`h-full rounded-2xl border ${plan.border} ${plan.bg} p-6 flex flex-col ${plan.highlighted ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                    <h3 className="font-bold text-neutral-800">{plan.name}</h3>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.color}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-neutral-200/50">
                    <p className={`text-sm font-bold ${plan.color}`}>{plan.price}</p>
                    <Link href={plan.href} className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full group">
                        Začít
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-8 text-center">
              <Link href="/cenik" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                Podrobné porovnání plánů
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* AGENT SHOWCASE */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Poznejte naše agenty"
              title="S kým si zavoláte?"
              subtitle="Ukázka 4 AI agentů z naší databáze. Každý má vlastní osobnost, příběh a styl komunikace."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Agent 1 */}
            <ScrollReveal delay={0.05}>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-base font-bold">RZ</div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Urgentní prodej a rozvod</h3>
                    <span className="text-xs text-rose-600 font-medium">Obtížnost: Střední</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 italic border-l-2 border-rose-300 pl-3 mb-3">
                  &quot;Potřebuji to vyřešit co nejrychleji. Rozvádíme se.&quot;
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                  Klientka volá, chce prodat společnou nemovitost kvůli rozvodu. Cílem je projevit empatii, ale hlavně zjistit, zda s prodejem souhlasí i partner. Bez jeho souhlasu nelze nemovitost prodat.
                </p>
                <div className="mt-4 pt-3 border-t border-rose-200/50">
                  <p className="text-xs text-neutral-500"><span className="font-semibold">Tip:</span> Buď citlivý. Nastav realistická očekávání ohledně rychlosti. Ověř souhlas obou manželů.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Agent 2 */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-base font-bold">CC</div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Cold call z katastru</h3>
                    <span className="text-xs text-red-600 font-medium">Obtížnost: Těžká</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 italic border-l-2 border-red-300 pl-3 mb-3">
                  &quot;Odkud máte mé číslo?!&quot;
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                  Voláte vlastníkovi domu z katastru. Okamžitě je agresivní a podezíravý. Musíte překonat první odpor a rychle přejít k hodnotě, kterou můžete nabídnout.
                </p>
                <div className="mt-4 pt-3 border-t border-red-200/50">
                  <p className="text-xs text-neutral-500"><span className="font-semibold">Tip:</span> Buď upřímný ohledně toho odkud máš číslo. Rychle přejdi k hodnotě a řekni, že voláš protože máš pro tento typ nemovitosti kupce.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Agent 3 */}
            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center text-base font-bold">VB</div>
                  <div>
                    <h3 className="font-bold text-neutral-800">Věcné břemeno na dožití babičky</h3>
                    <span className="text-xs text-amber-600 font-medium">Obtížnost: Pokročilá</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 italic border-l-2 border-amber-300 pl-3 mb-3">
                  &quot;Chci prodat dům, ale babička tam má doživotní právo bydlet.&quot;
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                  Klient chce prodat dům, na kterém vázne věcné břemeno dožití. Musíte vysvětlit vliv na cenu a okruh kupců, a navrhnout řešení.
                </p>
                <div className="mt-4 pt-3 border-t border-amber-200/50">
                  <p className="text-xs text-neutral-500"><span className="font-semibold">Tip:</span> Věcné břemeno snižuje cenu, proto buď upřímný. Vysvětli prodej s břemenem oproti jeho zániku. Doporuč notáře.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Agent 4 */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-base font-bold">PK</div>
                  <div>
                    <h3 className="font-bold text-neutral-800">První kupující neví jak začít</h3>
                    <span className="text-xs text-purple-600 font-medium">Obtížnost: Snadná</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 italic border-l-2 border-purple-300 pl-3 mb-3">
                  &quot;Chceme koupit první byt, ale vůbec nevíme kde začít.&quot;
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                  Mladý pár volá poprvé. Jsou vyděšení z celého procesu, potřebují průvodce. Cílem je stát se jejich důvěryhodným partnerem na celou cestu.
                </p>
                <div className="mt-4 pt-3 border-t border-purple-200/50">
                  <p className="text-xs text-neutral-500"><span className="font-semibold">Tip:</span> Zjisti budget a potřebu hypotéky. Doporuč hypotečního poradce, pak teprve hledání. Nabídni, že jim budeš posílat nabídky zdarma.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* '500+ dalších' */}
          <ScrollReveal delay={0.25}>
            <div className="mt-8 text-center">
              <p className="text-neutral-500 text-sm mb-5">
                ...a dalších <span className="font-bold text-neutral-800">500+ scénářů</span> ve volném tréninkovém módu
              </p>
              <Link href="/registrace">
                <Button size="lg" className="group">
                  Chci začít trénovat
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Připraveni začít?</h2>
              <p className="mt-3 text-neutral-400">10 minut zdarma. Bez kreditní karty.</p>
              <div className="mt-7 flex gap-3 justify-center flex-wrap">
                <Link href="/registrace">
                  <Button size="lg" className="group">
                    Vyzkoušet zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600">
                    Zobrazit ceník
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, Target, Lightbulb, Users, TrendingUp } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Filip Mojik",
    role: "Zakladatel & CEO",
    initials: "FM",
    desc: "Zakladatel a vizionář SimCall. Zodpovědný za celkový směr a strategii.",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    name: "Trung Le",
    role: "Spoluzakladatel & CTO",
    initials: "TL",
    desc: "Technologický základ platformy. Stará se o AI integraci a vývoj.",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Marek Černý",
    role: "Marketing",
    initials: "MČ",
    desc: "Marketingová strategie, kampaně a budování značky SimCall na trhu.",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    name: "Mario Stránský",
    role: "Obchod",
    initials: "MS",
    desc: "Obchodní vztahy, péče o klienty a rozvoj partnerství.",
    gradient: "from-green-400 to-green-600",
  },
];

const values = [
  {
    icon: Target,
    title: "Zaměření na výsledky",
    desc: "Vše, co děláme, je podloženo daty. Měříme reálný dopad na výkonnost makléřů.",
  },
  {
    icon: Lightbulb,
    title: "Inovace",
    desc: "Neustále vylepšujeme AI technologii, aby trénink byl co nejrealističtější.",
  },
  {
    icon: Users,
    title: "Komunita",
    desc: "Budujeme komunitu makléřů, kteří se vzájemně inspirují a posouvají vpřed.",
  },
  {
    icon: TrendingUp,
    title: "Měřitelný růst",
    desc: "Naši klienti zvyšují úspěšnost hovorů průměrně o 34 % během prvních 3 měsíců.",
  },
];

export default function ONasPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 bg-neutral-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="text-center max-w-3xl mx-auto relative">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                O nás
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                Česká firma, která mění{" "}
                <span className="text-primary-400">trénink hovorů</span>
              </h1>
              <p className="mt-5 text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                SimCall vznikl z frustrace s průměrným tréninkem makléřů. Chceme
                dát každému realitnímu makléři nástroj, který mu pomůže trénovat
                kdykoli — bez trenéra, bez stresu, s okamžitou zpětnou vazbou.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* STORY */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                {[
                  { value: "500+", label: "AI agentů" },
                  { value: "34%", label: "průměrné zlepšení" },
                  { value: "🇨🇿", label: "Česká firma" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-5 text-neutral-600 leading-relaxed">
                <p>
                  <strong className="text-neutral-800">Realitní trh v Česku je náročný.</strong>{" "}
                  Makléři tráví roky zdokonalováním svého přístupu k zákazníkům —
                  ale tradičních způsobů tréninku je málo, jsou drahé a závislé na
                  kouči nebo kolegovi.
                </p>
                <p>
                  My jsme to chtěli změnit. Vytvořili jsme platformu, která makléřům
                  umožní trénovat telefonní hovory s{" "}
                  <GradientText>realistickými AI agenty</GradientText> — kdykoli,
                  odkudkoli, na vlastním tempem.
                </p>
                <p>
                  Dnes máme 500+ AI agentů s různými osobnostmi, 6 kategorií klientů
                  a okamžitou AI analýzu každého hovoru. A teprve začínáme.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* TEAM */}
      <section className="py-16 sm:py-24 bg-neutral-50/80">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800">Náš tým</h2>
              <p className="mt-3 text-neutral-500">Lidé stojící za SimCall</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.08}>
                <div className="h-full bg-white rounded-2xl border border-neutral-100 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg mb-4`}>
                    <span className="text-xl font-bold text-white">{member.initials}</span>
                  </div>
                  <h3 className="font-bold text-neutral-800">{member.name}</h3>
                  <p className="text-xs font-medium text-primary-500 mt-0.5">{member.role}</p>
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed">{member.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <section className="py-16 sm:py-24">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800">Naše hodnoty</h2>
              <p className="mt-3 text-neutral-500">Principy, kterými se řídíme každý den</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="h-full bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-sm">{v.title}</h3>
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-white">Chcete se přidat?</h2>
              <p className="mt-3 text-neutral-400">Vyzkoušejte SimCall zdarma — 3 hovory, bez kreditní karty.</p>
              <div className="mt-7 flex gap-3 justify-center flex-wrap">
                <Link href="/registrace">
                  <Button size="lg" className="group">
                    Začít zdarma
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600">
                    Kontaktujte nás
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

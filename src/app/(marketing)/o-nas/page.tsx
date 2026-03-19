import Link from "next/link";
import { ArrowRight, Target, Lightbulb, Users, TrendingUp } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Filip Mojik",
    role: "Spoluzakladatel & CEO",
    initials: "FM",
    desc: "Bývalý realitní makléř, který si prošel peklem cold callingu. Zodpovídá za produktovou vizi.",
    gradient: "from-primary-400 to-primary-600",
  },
  {
    name: "Trung Le",
    role: "Spoluzakladatel & CTO",
    initials: "TL",
    desc: "Mozek za AI technologií. Stará se o to, aby agenti byli rychlí, agresivní a realističtí.",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Tým expertů",
    role: "Realitní matadoři",
    initials: "RE",
    desc: "Naši AI agenty skriptujeme a trénujeme ve spolupráci s elitními českými makléři a developery.",
    gradient: "from-purple-400 to-purple-600",
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
                Nástroj, který jsme{" "}
                <span className="text-primary-400">sami zoufale potřebovali</span>
              </h1>
              <p className="mt-5 text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                Začínali jsme v 18 letech s telefonem v ruce, obrovským stresem v břiše a nulovými zkušenostmi. Dnes stavíme nástroj, díky kterému už žádný nováček nemusí zažít paralyzující strach ze sluchátka.
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
                  { value: "500+", label: "Realitních scénářů" },
                  { value: "0", label: "Spálených leadů" },
                  { value: "100%", label: "Jistota manažera" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-5 text-neutral-600 leading-relaxed text-lg">
                <p>
                  <strong className="text-neutral-800">Když nám bylo 18 let, začali jsme dělat cold calling.</strong>{" "}
                  Byl to extrémní stres. Zíráte na to číslo, potí se vám ruce a jste paralyzovaní, protože nevíte, co člověk na druhé straně odpoví. A každá chyba vás sráží níž.
                </p>
                <p>
                  Velmi rychle jsme pochopili krutou realitu realitního trhu: <strong className="text-neutral-800">Zkušení manažeři nechtějí ztrácet čas s juniory.</strong> Nechtějí hodiny poslouchat hrozné hovory a dělat "hraní rolí". Juniorské oddělení je v mnoha firmách začarovaný kruh, kde se jen čeká, kdo z nováčků to náhodou přežije.
                </p>
                <p>
                  A největší noční můra manažera? Svěřit draze zaplacený, horký lead z reklamy nevypsanému nováčkovi, který ho do minuty spálí.
                </p>
                <p>
                  <strong className="text-neutral-800 text-primary-500">Proto jsme vytvořili SimCall.</strong>
                </p>
                <p>
                  Dnes mohou nováčci i zaběhnutí makléři udělat 50 chyb denně, ale udělají je na umělé inteligenci. Když manažer vidí v našem grafu, že je makléř připravený, může mu předat skutečný lead s ledovým klidem. Žádné pálení peněz. Žádný strach ze sluchátka.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
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
              <h2 className="text-3xl font-bold text-white">Připraveni začít?</h2>
              <p className="mt-3 text-neutral-400">Vyzkoušejte SimCall — 10 minut zdarma a bez kreditní karty.</p>
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

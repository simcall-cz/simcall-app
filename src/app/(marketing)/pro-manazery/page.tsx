import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  X,
  Users,
  BarChart3,
  Headphones,
  ClipboardList,
  LineChart,
  FileDown,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Target,
  Shield,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { IconBox } from "@/components/shared/icon-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pro manažery | ELITE AI",
  description:
    "Posuňte celý tým na novou úroveň. ELITE AI nabízí manažerský dashboard, sledování výkonnosti týmu a měřitelné výsledky školení.",
};

const painPoints = [
  {
    title: "Nekonzistentní výkon týmu",
    description:
      "Někteří makléři jsou hvězdy, jiní zaostávají. Nemáte nástroj, jak systematicky zvyšovat úroveň celého týmu.",
  },
  {
    title: "Nemožnost sledovat kvalitu hovorů",
    description:
      "Nevíte, jak vaši makléři skutečně telefonují. Nemůžete odposlouchávat každý hovor a dávat zpětnou vazbu.",
  },
  {
    title: "Chybějící data pro hodnocení",
    description:
      "Hodnotíte makléře podle výsledků, ale nemáte data o procesu. Nevíte, proč někdo nevykazuje lepší čísla.",
  },
  {
    title: "Drahé a neefektivní školení",
    description:
      "Tradiční školení jsou drahá, jednorázová a těžko měřitelná. Efekt vyprchá za pár týdnů a investice se nevrátí.",
  },
];

const managerFeatures = [
  {
    icon: BarChart3,
    title: "Dashboard výkonnosti týmu",
    description:
      "Přehledný dashboard s klíčovými metrikami celého týmu. Sledujte průměrné skóre, aktivitu a trendy na jednom místě.",
  },
  {
    icon: Users,
    title: "Sledování jednotlivých makléřů",
    description:
      "Detailní profil každého makléře s historií hovorů, silnými stránkami a oblastmi ke zlepšení.",
  },
  {
    icon: Headphones,
    title: "Knihovna nahrávek",
    description:
      "Přístup ke všem tréninkovým hovorům vašeho týmu. Poslechněte si nejlepší i nejhorší hovory a sdílejte příklady.",
  },
  {
    icon: ClipboardList,
    title: "Přiřazení tréninkového programu",
    description:
      "Vytvářejte a přiřazujte tréninkové plány jednotlivým makléřům. Nastavte cíle a sledujte jejich plnění.",
  },
  {
    icon: LineChart,
    title: "Srovnávací analytika",
    description:
      "Porovnávejte výkonnost makléřů, identifikujte nejlepší praktiky a replikujte úspěch napříč týmem.",
  },
  {
    icon: FileDown,
    title: "Export reportů",
    description:
      "Generujte týdenní a měsíční reporty o výkonnosti týmu. Exportujte data pro firemní porady a hodnocení.",
  },
];

const teamMembers = [
  { initials: "MV", name: "Markéta V.", role: "Senior makléř", rate: "94 %" },
  { initials: "TK", name: "Tomáš K.", role: "Makléř", rate: "87 %" },
  { initials: "LS", name: "Lucie S.", role: "Junior makléř", rate: "72 %" },
  { initials: "PN", name: "Petr N.", role: "Makléř", rate: "68 %" },
];

export default function ProManageryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4">Pro manažery</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-800 tracking-tight">
                Posuňte celý tým na{" "}
                <GradientText>novou úroveň</GradientText>
              </h1>
              <p className="mt-6 text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                Kompletní přehled o výkonnosti vašeho týmu. Sledujte pokrok,
                identifikujte slabiny a trénujte makléře efektivněji než
                kdykoliv předtím.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Domluvit demo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/cenik">
                  <Button variant="outline" size="lg">
                    Zobrazit ceník
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Výzvy"
              title="Problémy, které řešíte denně"
              subtitle="Jako manažer realitní kanceláře čelíte výzvám, na které tradiční nástroje nestačí."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {painPoints.map((point, index) => (
              <ScrollReveal key={point.title} delay={index * 0.05}>
                <Card className="h-full border-red-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <X className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {point.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {point.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CRM Dashboard Preview Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Dashboard"
              title="Manažerský přehled na jednom místě"
              subtitle="Vše, co potřebujete vědět o výkonnosti vašeho týmu, na přehledném dashboardu."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card className="mt-12 max-w-5xl mx-auto overflow-hidden border-neutral-200">
              <CardContent className="p-6 sm:p-8">
                {/* Team Summary Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-100">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Přehled týmu
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Únor 2026 - 4 aktivní makléři
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        80 %
                      </p>
                      <p className="text-xs text-neutral-500">
                        Průměrná úspěšnost
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        +12 %
                      </p>
                      <p className="text-xs text-neutral-500">
                        Oproti minulému měsíci
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {teamMembers.map((member) => (
                    <div
                      key={member.initials}
                      className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold mx-auto">
                        {member.initials}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-neutral-800">
                        {member.name}
                      </p>
                      <p className="text-xs text-neutral-500">{member.role}</p>
                      <p className="mt-2 text-lg font-bold text-primary-600">
                        {member.rate}
                      </p>
                      <p className="text-xs text-neutral-400">Úspěšnost</p>
                    </div>
                  ))}
                </div>

                {/* Performance Summary Bar */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">
                    Výkonnost týmu dle kategorie
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Cold calling", value: 68 },
                      { label: "Práce s námitkami", value: 75 },
                      { label: "Closing", value: 62 },
                      { label: "Follow-up", value: 82 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-neutral-600">
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold text-neutral-800">
                            {item.value} %
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </Container>
      </section>

      {/* Key Features for Managers Section */}
      <section className="py-16 sm:py-20 bg-neutral-50/50">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="Funkce"
              title="Nástroje pro efektivní vedení"
              subtitle="Vše, co potřebujete pro řízení a rozvoj vašeho obchodního týmu."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.05}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <IconBox>
                      <feature.icon className="w-6 h-6" />
                    </IconBox>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ROI Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeader
              badge="ROI"
              title="Návratnost investice"
              subtitle="Srovnejte tradiční přístup ke školení s ELITE AI a rozhodněte se na základě dat."
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional Training */}
            <ScrollReveal delay={0.05}>
              <Card className="h-full border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <CardTitle>Tradiční školení</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: DollarSign,
                        label: "Náklady",
                        value: "50 000 - 150 000 Kč/rok",
                        detail: "Externí školitelé, pronájem prostor, materiály",
                      },
                      {
                        icon: Clock,
                        label: "Dostupnost",
                        value: "1-2x ročně",
                        detail: "Jednorázové workshopy s omezeným efektem",
                      },
                      {
                        icon: Target,
                        label: "Měřitelnost",
                        value: "Minimální",
                        detail: "Žádná data o skutečném dopadu na výsledky",
                      },
                      {
                        icon: TrendingUp,
                        label: "Konzistence",
                        value: "Nízká",
                        detail: "Efekt vyprchá za 2-4 týdny po školení",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg"
                      >
                        <item.icon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-neutral-800">
                              {item.label}:
                            </span>
                            <span className="text-sm font-semibold text-red-600">
                              {item.value}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* ELITE AI */}
            <ScrollReveal delay={0.1}>
              <Card className="h-full border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <CardTitle>ELITE AI</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: DollarSign,
                        label: "Náklady",
                        value: "Od 1 290 Kč/měsíc/makléř",
                        detail: "Zlomek ceny tradičního školení s lepšími výsledky",
                      },
                      {
                        icon: Clock,
                        label: "Dostupnost",
                        value: "24/7, 365 dní v roce",
                        detail: "Trénink kdykoliv, odkudkoliv, bez čekání",
                      },
                      {
                        icon: Target,
                        label: "Měřitelnost",
                        value: "Kompletní data",
                        detail: "Detailní analytika každého hovoru a trendy v čase",
                      },
                      {
                        icon: TrendingUp,
                        label: "Konzistence",
                        value: "Průběžné zlepšování",
                        detail: "Měřitelný pokrok již po 2 týdnech pravidelného tréninku",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 p-3 bg-green-50/50 rounded-lg"
                      >
                        <item.icon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-neutral-800">
                              {item.label}:
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {item.value}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-neutral-900">
        <Container>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Připraveni posunout svůj tým?
              </h2>
              <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                Domluvte si nezávaznou demo prezentaci a zjistěte, jak ELITE AI
                pomůže právě vašemu týmu.
              </p>
              <div className="mt-8">
                <Link href="/demo">
                  <Button size="lg" className="group">
                    Domluvit demo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

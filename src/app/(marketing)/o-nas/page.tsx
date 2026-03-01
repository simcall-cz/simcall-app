import { Users, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
    {
        name: "Filip Mojik",
        role: "Majitel",
        initials: "FM",
        description:
            "Zakladatel a vizionář SimCall. Zodpovědný za celkový směr firmy a strategické rozhodování.",
    },
    {
        name: "Trung Le",
        role: "Spolumajitel",
        initials: "TL",
        description:
            "Spoluzakladatel SimCall. Zaměřuje se na technologický rozvoj a inovace platformy.",
    },
    {
        name: "Marek Černý",
        role: "Marketing specialista",
        initials: "MČ",
        description:
            "Stará se o marketingovou strategii, kampaně a budování značky SimCall na trhu.",
    },
    {
        name: "Mario Stránský",
        role: "Obchodní manažer",
        initials: "MS",
        description:
            "Řídí obchodní vztahy, péči o klienty a rozvoj nových partnerství.",
    },
];

const values = [
    {
        icon: Target,
        title: "Zaměření na výsledky",
        description:
            "Vše, co děláme, je podloženo daty. Měříme reálný dopad na výkonnost makléřů.",
    },
    {
        icon: Lightbulb,
        title: "Inovace",
        description:
            "Neustále vylepšujeme naši AI technologii, aby trénink byl co nejrealističtější.",
    },
    {
        icon: Users,
        title: "Podpora komunity",
        description:
            "Budujeme komunitu makléřů, kteří se vzájemně inspirují a posouvají vpřed.",
    },
    {
        icon: TrendingUp,
        title: "Měřitelný růst",
        description:
            "Naši klienti v průměru zvyšují úspěšnost hovorů o 34 % během prvních 3 měsíců.",
    },
];

export default function ONasPage() {
    return (
        <section className="py-16 sm:py-24">
            <Container>
                {/* Page Header */}
                <ScrollReveal>
                    <SectionHeader
                        badge="O nás"
                        title="Tým SimCall"
                        subtitle="Česká firma, která mění způsob, jakým se realitní makléři připravují na hovory."
                    />
                </ScrollReveal>

                {/* Mission */}
                <ScrollReveal>
                    <div className="mt-12 max-w-3xl mx-auto text-center">
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            SimCall vznikl s jasnou vizí — dát realitním makléřům nástroj,
                            který jim pomůže trénovat telefonní hovory kdykoli a kdekoli.
                            Využíváme nejmodernější AI technologie k vytvoření realistických
                            simulací, díky kterým si makléři budují sebevědomí a zlepšují své
                            výsledky.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Team Section */}
                <div className="mt-20">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold text-neutral-800 text-center">
                            Náš tým
                        </h2>
                        <p className="mt-3 text-neutral-500 text-center max-w-xl mx-auto">
                            Lidé, kteří stojí za SimCall
                        </p>
                    </ScrollReveal>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <ScrollReveal key={member.name} delay={index * 0.1}>
                                <Card className="h-full text-center">
                                    <CardContent className="pt-8 pb-6">
                                        {/* Avatar */}
                                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
                                            <span className="text-2xl font-bold text-white">
                                                {member.initials}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <h3 className="mt-5 text-lg font-bold text-neutral-800">
                                            {member.name}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-primary-500">
                                            {member.role}
                                        </p>
                                        <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                                            {member.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Values Section */}
                <div className="mt-20">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold text-neutral-800 text-center">
                            Naše hodnoty
                        </h2>
                        <p className="mt-3 text-neutral-500 text-center max-w-xl mx-auto">
                            Principy, kterými se řídíme každý den
                        </p>
                    </ScrollReveal>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <ScrollReveal key={value.title} delay={index * 0.1}>
                                <Card className="h-full">
                                    <CardContent className="pt-6 pb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                                            <value.icon className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <h3 className="mt-4 text-base font-bold text-neutral-800">
                                            {value.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

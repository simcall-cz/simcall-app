import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const plans = [
  {
    name: "Solo",
    price: "od 990 Kč",
    period: "/měsíc",
    description: "Pro jednotlivé makléře",
    features: ["Až 50 agentů", "100–1 000 minut/měsíc", "AI analýza a scoring"],
    highlighted: false,
    href: "/checkout?plan=solo&tier=0",
  },
  {
    name: "Team",
    price: "od 7 490 Kč",
    period: "/měsíc",
    description: "Pro firmy a týmy",
    features: ["Manager dashboard", "Správa celého týmu", "Sdílený pool minut"],
    highlighted: true,
    href: "/checkout?plan=team&tier=0",
  },
  {
    name: "Enterprise",
    price: "Na míru",
    period: "",
    description: "Kompletní řešení",
    features: ["White-label branding", "Vlastní AI agenti", "Dedikovaný manažer"],
    highlighted: false,
    href: "/domluvit-schuzku",
  },
];

export function PricingTeaser() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
      {plans.map((plan, index) => (
        <ScrollReveal key={plan.name} delay={index * 0.05}>
          <div
            className={`relative rounded-2xl p-5 sm:p-6 h-full flex flex-col transition-shadow hover:shadow-lg ${
              plan.highlighted
                ? "bg-neutral-900 text-white border-2 border-primary-500 shadow-lg"
                : "bg-white border border-neutral-200"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Nejoblíbenější</Badge>
              </div>
            )}

            <div className={plan.highlighted ? "pt-1" : ""}>
              <h3
                className={`font-semibold text-sm ${
                  plan.highlighted ? "text-white/70" : "text-neutral-500"
                }`}
              >
                {plan.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-2xl sm:text-3xl font-bold ${
                    plan.highlighted ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-white/40" : "text-neutral-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              <p
                className={`mt-1 text-sm ${
                  plan.highlighted ? "text-white/50" : "text-neutral-500"
                }`}
              >
                {plan.description}
              </p>
            </div>

            <ul className="mt-4 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check
                    className={`w-3.5 h-3.5 shrink-0 ${
                      plan.highlighted ? "text-primary-400" : "text-green-500"
                    }`}
                  />
                  <span
                    className={
                      plan.highlighted ? "text-white/70" : "text-neutral-600"
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link href={plan.href} className="mt-5 block">
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full group"
                size="sm"
              >
                {plan.highlighted ? "Vybrat Team" : plan.name === "Enterprise" ? "Domluvit schůzku" : "Vybrat Solo"}
                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

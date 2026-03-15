"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, ArrowRight, MessageSquare } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { faqItems } from "@/data/faq";
import { Button } from "@/components/ui/button";

const categories = [
  { key: "all", label: "Vše" },
  { key: "general", label: "Obecné" },
  { key: "technology", label: "Technologie" },
  { key: "pricing", label: "Ceník" },
  { key: "security", label: "Bezpečnost" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 bg-neutral-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="text-center max-w-2xl mx-auto relative">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                FAQ
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                Vše, co potřebujete vědět o SimCall
              </h1>
              <p className="mt-4 text-lg text-neutral-400">
                Odpovědi na nejčastější otázky o SimCall.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* CONTENT */}
      <section className="py-12 sm:py-20">
        <Container>
          {/* Category Filter */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    setActiveCategory(category.key);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.key
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* FAQ Accordion */}
          <div className="mt-10 max-w-3xl mx-auto space-y-2.5">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={`${activeCategory}-${index}`} delay={index * 0.03}>
                <div
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${openIndex === index
                    ? "border-primary-200 bg-primary-50/30 shadow-sm"
                    : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                  >
                    <span className="font-medium text-neutral-800 pr-4 text-sm sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${openIndex === index ? "rotate-180 text-primary-500" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm text-neutral-500 leading-relaxed border-t border-primary-100/50 pt-3">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact CTA */}
          <ScrollReveal delay={0.2}>
            <div className="mt-16 text-center bg-neutral-50 border border-neutral-100 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">
                Nenašli jste odpověď?
              </h3>
              <p className="mt-2 text-neutral-500 text-sm">
                Napište nám nebo domluvte schůzku a my vám odpovíme do 24 hodin.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/kontakt">
                  <Button className="group">
                    Napsat dotaz
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <a
                  href="mailto:simcallcz@gmail.com"
                  className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  simcallcz@gmail.com
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}

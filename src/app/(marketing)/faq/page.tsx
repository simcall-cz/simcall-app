"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
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
    <section className="py-16 sm:py-24">
      <Container>
        {/* Page Header */}
        <ScrollReveal>
          <SectionHeader
            badge="FAQ"
            title="Časté dotazy"
            subtitle="Odpovědi na nejčastější otázky o SimCall"
          />
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => {
                  setActiveCategory(category.key);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category.key
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={`${activeCategory}-${index}`} delay={index * 0.05}>
              <div className="bg-white border border-neutral-100 rounded-xl shadow-card overflow-hidden">
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50"
                >
                  <span className="font-medium text-neutral-800 pr-4">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 text-neutral-500 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Contact CTA */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 text-center bg-neutral-50 rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-neutral-800">
              Nenašli jste odpověď?
            </h3>
            <p className="mt-3 text-neutral-500">
              Neváhejte nás kontaktovat. Rádi vám pomůžeme s jakýmkoliv dotazem.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontakt">
                <Button>Kontaktujte nás</Button>
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
  );
}

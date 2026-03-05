"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Clock, CheckCircle, ArrowRight, Calendar } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactFormSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Zadejte platný e-mail"),
  subject: z.string().min(1, "Vyberte předmět zprávy"),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const subjectOptions = [
  { value: "", label: "Vyberte předmět" },
  { value: "obecny-dotaz", label: "Obecný dotaz" },
  { value: "zajem-o-demo", label: "Zájem o demo" },
  { value: "technicka-podpora", label: "Technická podpora" },
  { value: "fakturace", label: "Fakturace" },
  { value: "partnerstvi", label: "Partnerství" },
];

export default function KontaktPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "kontakt",
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });
      if (!res.ok) throw new Error("Chyba při odesílání");
      setIsSubmitted(true);
    } catch {
      setSubmitError(true);
    }
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
                Kontakt
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                Kontaktujte nás
              </h1>
              <p className="mt-4 text-lg text-neutral-400">
                Odpovídáme do 24 hodin. Rádi pomůžeme.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* CONTENT */}
      <section className="py-12 sm:py-20">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 max-w-5xl mx-auto">
            {/* Left info */}
            <div className="lg:col-span-2 space-y-5">
              <ScrollReveal>
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-400 mb-0.5">E-mail</p>
                    <a
                      href="mailto:simcallcz@gmail.com"
                      className="text-sm font-semibold text-neutral-800 hover:text-primary-500 transition-colors"
                    >
                      simcallcz@gmail.com
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-400 mb-0.5">Provozní doba</p>
                    <p className="text-sm font-semibold text-neutral-800">Po–Pá: 9:00–18:00</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="p-5 rounded-2xl border border-primary-100 bg-primary-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-semibold text-neutral-800">Enterprise zákazníci</p>
                  </div>
                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                    Pro velké realitní kanceláře nabízíme white-label a vlastní AI agenty.
                    Domluvte si schůzku.
                  </p>
                  <Link href="/domluvit-schuzku">
                    <Button size="sm" variant="outline" className="w-full group border-primary-200 text-primary-600 hover:bg-primary-100">
                      Domluvit schůzku
                      <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right form */}
            <ScrollReveal delay={0.1} className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">Zpráva odeslána!</h3>
                    <p className="mt-2 text-neutral-500 text-sm">
                      Děkujeme. Ozveme se vám co nejdříve, nejpozději do 24 hodin.
                    </p>
                    <Link href="/" className="mt-6 inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
                      Zpět na hlavní stránku
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : submitError ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                      <ArrowRight className="w-8 h-8 text-red-500 rotate-180" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">Něco se pokazilo</h3>
                    <p className="mt-2 text-neutral-500 text-sm">
                      Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nás kontaktujte na simcallcz@gmail.com.
                    </p>
                    <button
                      onClick={() => setSubmitError(false)}
                      className="mt-6 inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                    >
                      Zkusit znovu
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <h2 className="text-xl font-bold text-neutral-800 mb-6">Napište nám</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Jméno a příjmení
                        </label>
                        <Input id="name" placeholder="Jan Novák" {...register("name")} />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                          E-mail
                        </label>
                        <Input id="email" type="email" placeholder="jan@firma.cz" {...register("email")} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Předmět
                      </label>
                      <select
                        id="subject"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full text-sm"
                        {...register("subject")}
                      >
                        {subjectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Zpráva
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Jak vám můžeme pomoci?"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder:text-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full resize-none text-sm"
                        {...register("message")}
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Odesílám..." : "Odeslat zprávu"}
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  );
}

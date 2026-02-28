"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Zadejte platný e-mail"),
  subject: z.string().min(1, "Vyberte předmět zprávy"),
  message: z.string().min(10, "Zpráva musí mít alespoň 10 znaků"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "E-mail",
    value: "info@eliteai.cz",
    href: "mailto:info@eliteai.cz",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+420 123 456 789",
    href: "tel:+420123456789",
  },
  {
    icon: MapPin,
    label: "Adresa",
    value: "Václavské náměstí 1, 110 00 Praha 1",
    href: null,
  },
];

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        {/* Page Header */}
        <ScrollReveal>
          <SectionHeader
            badge="Kontakt"
            title="Kontaktujte nás"
            subtitle="Rádi vám pomůžeme s jakýmkoliv dotazem"
          />
        </ScrollReveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <ScrollReveal direction="left">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">
                Spojte se s námi
              </h2>
              <p className="mt-3 text-neutral-500 leading-relaxed">
                Rádi vám pomůžeme s jakýmkoliv dotazem ohledně naší platformy.
                Vyberte si způsob komunikace, který vám vyhovuje.
              </p>

              {/* Contact Info Cards */}
              <div className="mt-8 space-y-4">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-400">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-neutral-800 hover:text-primary-500 transition-colors font-medium"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-neutral-800 font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-sm font-medium text-neutral-400 mb-3">
                  Sledujte nás
                </p>
                <div className="flex items-center gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="flex items-center gap-2 text-neutral-600 hover:text-primary-500 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="mt-8 flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                <Clock className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-400">
                    Provozní doba
                  </p>
                  <p className="text-neutral-800 font-medium">
                    Po-Pá: 9:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side - Contact Form */}
          <ScrollReveal direction="right">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Napište nám</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="mt-4 text-xl font-bold text-neutral-800">
                      Zpráva odeslána!
                    </h3>
                    <p className="mt-2 text-neutral-500">
                      Děkujeme za vaši zprávu. Ozveme se vám co nejdříve.
                    </p>
                    <Link
                      href="/"
                      className="mt-6 inline-block text-primary-500 hover:text-primary-600 font-medium transition-colors"
                    >
                      Vrátit se na hlavní stránku
                    </Link>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Jméno a příjmení
                      </label>
                      <Input
                        id="name"
                        placeholder="Jan Novák"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        E-mail
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jan@firma.cz"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Předmět
                      </label>
                      <select
                        id="subject"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full"
                        {...register("subject")}
                      >
                        {subjectOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Zpráva
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Jak vám můžeme pomoci?"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder:text-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full resize-none"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Odesílám..." : "Odeslat zprávu"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

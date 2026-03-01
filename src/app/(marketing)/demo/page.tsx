"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, CreditCard, Clock, XCircle } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const demoFormSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  email: z.string().email("Zadejte platný e-mail"),
  phone: z.string().min(9, "Zadejte platné telefonní číslo"),
  company: z.string().min(2, "Zadejte název společnosti"),
  teamSize: z.enum(["1", "2-5", "6-15", "16-50", "50+"]),
  role: z.enum(["makler", "manazer", "majitel"]),
  message: z.string().optional(),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

const benefits = [
  "15minutová ukázka platformy",
  "Vyzkoušíte si hovor s AI agentem",
  "Uvidíte detailní analýzu hovoru",
  "Bez závazků a zdarma",
];

const trustBadges = [
  { icon: CreditCard, label: "Bez kreditní karty" },
  { icon: XCircle, label: "Zrušíte kdykoliv" },
  { icon: Clock, label: "Do 24h vás kontaktujeme" },
];

export default function DemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      teamSize: "1",
      role: "makler",
    },
  });

  const onSubmit = async (_data: DemoFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Value Proposition */}
          <ScrollReveal direction="left">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">
                Vyzkoušejte SimCall
              </h1>
              <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
                Získejte přístup k demo verzi a přesvědčte se sami
              </p>

              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-neutral-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap gap-6">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 text-sm text-neutral-500"
                  >
                    <badge.icon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right Side - Form */}
          <ScrollReveal direction="right">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Žádost o demo</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="mt-4 text-xl font-bold text-neutral-800">
                      Děkujeme za zájem!
                    </h3>
                    <p className="mt-2 text-neutral-500">
                      Ozveme se vám do 24 hodin.
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

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Telefon
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+420 123 456 789"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Společnost
                      </label>
                      <Input
                        id="company"
                        placeholder="Název vaší společnosti"
                        {...register("company")}
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.company.message}
                        </p>
                      )}
                    </div>

                    {/* Team Size */}
                    <div>
                      <label
                        htmlFor="teamSize"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Velikost týmu
                      </label>
                      <select
                        id="teamSize"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full"
                        {...register("teamSize")}
                      >
                        <option value="1">1 osoba</option>
                        <option value="2-5">2-5 osob</option>
                        <option value="6-15">6-15 osob</option>
                        <option value="16-50">16-50 osob</option>
                        <option value="50+">50+ osob</option>
                      </select>
                    </div>

                    {/* Role */}
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Vaše role
                      </label>
                      <select
                        id="role"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full"
                        {...register("role")}
                      >
                        <option value="makler">Makléř</option>
                        <option value="manazer">Manažer</option>
                        <option value="majitel">Majitel kanceláře</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Zpráva{" "}
                        <span className="text-neutral-400">(volitelné)</span>
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Máte nějaké dotazy nebo požadavky?"
                        className="bg-white border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder:text-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-colors w-full resize-none"
                        {...register("message")}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Odesílám..." : "Odeslat žádost o demo"}
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

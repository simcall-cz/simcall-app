import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Stránka nenalezena | SimCall",
  description:
    "Omlouváme se, ale stránka kterou hledáte neexistuje. Vraťte se na hlavní stránku SimCall.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 sm:py-24">
          <Container>
            <div className="text-center max-w-lg mx-auto">
              <p className="text-8xl font-bold text-neutral-200 select-none">
                404
              </p>
              <h1 className="mt-6 text-3xl font-bold text-neutral-800 tracking-tight">
                Stránka nenalezena
              </h1>
              <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
                Omlouváme se, ale stránka kterou hledáte neexistuje.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                  <Button size="lg">Zpět na hlavní stránku</Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="outline" size="lg">
                    Kontaktujte nás
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

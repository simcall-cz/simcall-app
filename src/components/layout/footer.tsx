import Link from "next/link";
import { Container } from "@/components/shared/container";

const footerLinks = {
  produkt: {
    title: "Produkt",
    links: [
      { label: "Funkce", href: "/funkce" },

      { label: "Ceník", href: "/cenik" },
    ],
  },
  spolecnost: {
    title: "Společnost",
    links: [
      { label: "O nás", href: "/o-nas" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Blog", href: "/blog" },
    ],
  },
  kontakt: {
    title: "Kontakt",
    links: [
      { label: "simcallcz@gmail.com", href: "mailto:simcallcz@gmail.com" },
      { label: "+420 123 456 789", href: "tel:+420123456789" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <Container>
        <div className="py-10 sm:py-16">
          {/* Top Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-0.5">
                <span className="text-xl font-bold text-white">Sim</span>
                <span className="text-xl font-bold text-primary-500">Call</span>
              </Link>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                Trénink hovorů s AI pro realitní makléře. Zlepšete své prodejní
                dovednosti s moderní technologií.
              </p>
            </div>

            {/* Link Columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} SimCall. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/ochrana-soukromi"
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Ochrana soukromí
            </Link>
            <Link
              href="/obchodni-podminky"
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Obchodní podmínky
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

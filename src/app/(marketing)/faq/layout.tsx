import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Časté dotazy | ELITE AI",
  description:
    "Odpovědi na nejčastější otázky o ELITE AI platformě. Zjistěte vše o funkcích, cenách, technologii a bezpečnosti.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

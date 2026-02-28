import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo | ELITE AI",
  description:
    "Vyzkoušejte ELITE AI zdarma. Získejte přístup k demo verzi a přesvědčte se o síle AI tréninku pro realitní makléře.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

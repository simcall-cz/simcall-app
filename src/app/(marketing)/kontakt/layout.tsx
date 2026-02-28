import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | ELITE AI",
  description:
    "Kontaktujte tým ELITE AI. Rádi vám pomůžeme s jakýmkoliv dotazem ohledně naší platformy pro trénink realitních makléřů.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

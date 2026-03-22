import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ceník",
    description: "Vyberte si balíček SimCall podle svých potřeb. Solo, Team nebo Enterprise. Cenově dostupný AI trénink hovorů pro realitní makléře.",
};

export default function CenikLayout({ children }: { children: React.ReactNode }) {
    return children;
}

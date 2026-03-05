import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ochrana soukromí",
    description: "Zásady ochrany osobních údajů služby SimCall — jak zpracováváme vaše data.",
};

export default function OchranaSoukromiLayout({ children }: { children: React.ReactNode }) {
    return children;
}

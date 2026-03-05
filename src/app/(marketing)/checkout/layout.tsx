import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout",
    description: "Dokončete objednávku SimCall — vyberte balíček a vyplňte fakturační údaje.",
    robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Děkujeme",
    description: "Děkujeme za objednávku SimCall! Váš účet je připraven.",
    robots: { index: false, follow: false },
};

export default function DekujemeLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Simulátor",
    description: "Vyzkoušejte si AI simulátor hovorů — trénujte prodejní dovednosti s realistickými AI klienty bez rizika.",
};

export default function AiSimulatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}

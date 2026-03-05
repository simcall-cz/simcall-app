import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Obchodní podmínky",
    description: "Obchodní podmínky služby SimCall — podmínky užívání, platby a storno.",
};

export default function ObchodniPodminkyLayout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "O nás | SimCall",
    description:
        "Poznejte tým SimCall. Jsme česká firma, která pomáhá realitním makléřům zlepšovat jejich prodejní dovednosti pomocí AI technologií.",
};

export default function ONasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

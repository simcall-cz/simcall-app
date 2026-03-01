import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SimCall | Trénink hovorů s AI pro realitní makléře",
  description:
    "Zlepšete své prodejní dovednosti s AI tréninkem hovorů. Realistické simulace, okamžitá zpětná vazba a personalizované lekce pro realitní makléře.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}

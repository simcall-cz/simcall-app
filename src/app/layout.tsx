import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthRecoveryRedirect } from "@/components/auth/AuthRecoveryRedirect";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://simcall.cz"),
  title: {
    default: "SimCall | Trénink hovorů s AI pro realitní makléře",
    template: "%s | SimCall",
  },
  description:
    "Zlepšete své prodejní dovednosti s AI tréninkem hovorů. Realistické simulace, okamžitá zpětná vazba a personalizované lekce pro realitní makléře.",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "SimCall",
    title: "SimCall | Trénink hovorů s AI pro realitní makléře",
    description:
      "Zlepšete své prodejní dovednosti s AI tréninkem hovorů. Realistické simulace, okamžitá zpětná vazba a personalizované lekce pro realitní makléře.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SimCall | Trénink hovorů s AI",
    description: "AI trénink hovorů pro realitní makléře — realistické simulace a okamžitá zpětná vazba.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        <AuthRecoveryRedirect />
        {children}
      </body>
    </html>
  );
}

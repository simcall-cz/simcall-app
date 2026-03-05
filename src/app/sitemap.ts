import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://simcall.cz";
    const now = new Date();

    return [
        { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/funkce`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/cenik`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },

        { url: `${baseUrl}/o-nas`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/domluvit-schuzku`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/obchodni-podminky`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/ochrana-soukromi`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/prihlaseni`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/registrace`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ];
}

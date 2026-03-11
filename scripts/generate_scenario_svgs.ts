import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const SUPABASE_URL = "https://ujvmzylsbblqpqbpbapq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdm16eWxzYmJscXBxYnBiYXBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM3OTk2MywiZXhwIjoyMDg3OTU1OTYzfQ.k3sMRmre4IZV1IwuMhj_0KYh6rhi32u7jWLzXseGgRE";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const getRandomImage = (type: string) => {
    const houses = [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80"
    ];
    const industrial = [
        "https://images.unsplash.com/photo-1580982335198-d143daee8269?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1587293852726-70cdb56c2836?auto=format&fit=crop&w=400&q=80"
    ];
    const fallback = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80";

    if (type.includes('industrial') || type.toLowerCase().includes('dílna') || type.toLowerCase().includes('autoservis')) {
        return industrial[Math.floor(Math.random() * industrial.length)];
    }
    if (type.includes('stavební pozemek') || type.includes('pozemek')) {
        return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80"; // field
    }
    return houses[Math.floor(Math.random() * houses.length)];
};

function generateSrealitySVG(jmeno: string, cena: string, lokalita: string, typ: string) {
    const imgUrl = getRandomImage(typ);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="100%" height="100%">
        <rect width="600" height="300" fill="#f8f9fa" />
        <rect x="20" y="20" width="560" height="260" rx="8" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
        
        <!-- Header -->
        <rect x="20" y="20" width="560" height="50" rx="8" fill="#cc0000" />
        <rect x="20" y="50" width="560" height="20" fill="#cc0000" />
        <text x="40" y="52" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#ffffff">Sreality.cz</text>
        
        <!-- Content -->
        <!-- Image -->
        <image href="${imgUrl}" x="40" y="90" height="150" width="220" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 4px)" />
        
        <!-- Details -->
        <text x="280" y="110" font-family="Arial, sans-serif" font-weight="bold" font-size="18" fill="#333333">Prodej - ${typ.substring(0, 30)}${typ.length > 30 ? '...' : ''}</text>
        <text x="280" y="135" font-family="Arial, sans-serif" font-size="14" fill="#666666">${lokalita}</text>
        
        <text x="280" y="170" font-family="Arial, sans-serif" font-weight="bold" font-size="24" fill="#cc0000">${cena}</text>
        
        <rect x="280" y="195" width="260" height="1" fill="#eeeeee" />
        
        <text x="280" y="220" font-family="Arial, sans-serif" font-size="13" fill="#888888">Inzerent (Majitel):</text>
        <text x="280" y="240" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#333333">${jmeno}</text>
        
        <rect x="420" y="215" width="120" height="30" rx="4" fill="#cc0000" />
        <text x="480" y="235" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff" text-anchor="middle">Zobrazit kontakt</text>
    </svg>`;
}

function generateFormSVG(jmeno: string, cena: string, lokalita: string, typ: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="100%" height="100%">
        <rect width="600" height="300" fill="#f0f2f5" />
        <rect x="100" y="20" width="400" height="260" rx="12" fill="#ffffff" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.08))" />
        
        <text x="300" y="60" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="#1a1a1a" text-anchor="middle">Nová poptávka z webu</text>
        <rect x="270" y="75" width="60" height="3" rx="1.5" fill="#3b82f6" />
        
        <!-- Fields -->
        <text x="140" y="110" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#666666">JMÉNO KLIENTA</text>
        <rect x="140" y="120" width="320" height="36" rx="4" fill="#f8f9fa" stroke="#e5e7eb" stroke-width="1" />
        <text x="155" y="143" font-family="Arial, sans-serif" font-size="14" fill="#111827">${jmeno}</text>
        
        <text x="140" y="175" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#666666">TYP NEMOVITOSTI A LOKALITA</text>
        <rect x="140" y="185" width="320" height="60" rx="4" fill="#f8f9fa" stroke="#e5e7eb" stroke-width="1" />
        <text x="155" y="208" font-family="Arial, sans-serif" font-size="13" fill="#111827">${typ}</text>
        <text x="155" y="228" font-family="Arial, sans-serif" font-size="13" fill="#111827">Lokalita: ${lokalita}</text>
        
        <!-- Status Badge -->
        <rect x="420" y="38" width="60" height="24" rx="12" fill="#dcfce7" />
        <text x="450" y="55" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#166534" text-anchor="middle">NOVÝ</text>
    </svg>`;
}

function generateKatastrSVG(jmeno: string, cena: string, lokalita: string, typ: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="100%" height="100%">
        <rect width="600" height="300" fill="#eef2f6" />
        <rect x="30" y="30" width="540" height="240" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
        
        <!-- Header -->
        <rect x="30" y="30" width="540" height="46" rx="4" fill="#1e293b" />
        <rect x="30" y="60" width="540" height="16" fill="#1e293b" />
        <text x="50" y="58" font-family="'Courier New', Courier, monospace" font-weight="bold" font-size="18" fill="#ffffff">🏢 KN - Nahlížení do katastru</text>
        
        <!-- Content List -->
        <text x="50" y="105" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748b">INFORMACE O POZEMKU / STAVBĚ</text>
        <rect x="50" y="115" width="500" height="1" fill="#e2e8f0" />
        
        <text x="50" y="140" font-family="Arial, sans-serif" font-size="13" fill="#475569">Vlastnické právo:</text>
        <text x="200" y="140" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">${jmeno}</text>
        
        <text x="50" y="170" font-family="Arial, sans-serif" font-size="13" fill="#475569">Způsob využití:</text>
        <text x="200" y="170" font-family="Arial, sans-serif" font-size="13" fill="#0f172a">${typ.substring(0, 45)}${typ.length > 45 ? '...' : ''}</text>
        
        <text x="50" y="200" font-family="Arial, sans-serif" font-size="13" fill="#475569">Katastrální území:</text>
        <text x="200" y="200" font-family="Arial, sans-serif" font-size="13" fill="#0f172a">${lokalita}</text>
        
        <text x="50" y="230" font-family="Arial, sans-serif" font-size="13" fill="#475569">Omezení pr. vztahu:</text>
        <text x="200" y="230" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ef4444">Zástavní právo smluvní / Ostatní</text>
        
        <rect x="440" y="210" width="80" height="30" rx="4" fill="#3b82f6" />
        <text x="480" y="230" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Detail LV</text>
    </svg>`;
}

function generateRecommendationSVG(jmeno: string, cena: string, lokalita: string, typ: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="100%" height="100%">
        <rect width="600" height="300" fill="#f3f4f6" />
        
        <!-- Phone outline -->
        <rect x="150" y="10" width="300" height="280" rx="24" fill="#ffffff" stroke="#e5e7eb" stroke-width="4" />
        
        <!-- Header -->
        <rect x="150" y="10" width="300" height="60" rx="24" fill="#075e54" />
        <rect x="150" y="40" width="300" height="30" fill="#075e54" />
        <circle cx="180" cy="40" r="16" fill="#ffffff" opacity="0.2" />
        <text x="210" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#ffffff">Zákazník (Pavel)</text>
        
        <!-- Chat bubbles -->
        <!-- Received -->
        <rect x="170" y="90" width="220" height="40" rx="12" fill="#e5e5ea" />
        <text x="185" y="115" font-family="Arial, sans-serif" font-size="13" fill="#000000">Ahoj, pamatuješ si na mě?</text>
        
        <!-- Sent -->
        <rect x="280" y="140" width="150" height="40" rx="12" fill="#dcf8c6" />
        <text x="295" y="165" font-family="Arial, sans-serif" font-size="13" fill="#000000">Jasně Pavle, jak žiješ?</text>
        
        <!-- Received -->
        <rect x="170" y="190" width="260" height="85" rx="12" fill="#e5e5ea" />
        <text x="185" y="215" font-family="Arial, sans-serif" font-size="13" fill="#000000">Dobrý, prosímtě můj známý</text>
        <text x="185" y="235" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#000000">${jmeno}</text>
        <text x="185" y="255" font-family="Arial, sans-serif" font-size="13" fill="#000000">prodává: ${typ.substring(0, 20)}...</text>
    </svg>`;
}

async function main() {
    const agentiDir = path.join(__dirname, '../agenti');
    const outDir = path.join(__dirname, '../public/scenarios/generated');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const files = fs.readdirSync(agentiDir).filter(f => f.endsWith('.txt'));

    // Sources tracking
    const SOURCES = [
        { type: "form", gen: generateFormSVG, cat: "hot-lead" },
        { type: "sreality", gen: generateSrealitySVG, cat: "warm-lead" },
        { type: "recommendation", gen: generateRecommendationSVG, cat: "hot-lead" },
        { type: "cold", gen: generateKatastrSVG, cat: "cold-lead" },
    ];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = fs.readFileSync(path.join(agentiDir, file), 'utf8');

        // Extract values
        const nameMatch = content.match(/Jmeno:\s*(.+)/);
        const jmeno = nameMatch ? nameMatch[1].trim() : `Agent ${i}`;

        const typMatch = content.match(/Typ:\s*(.+)/);
        const typ = typMatch ? typMatch[1].trim() : "Nemovitost";

        const lokalitaMatch = content.match(/Lokalita:\s*(.+)/);
        const lokalita = lokalitaMatch ? lokalitaMatch[1].trim() : "Neznámá";

        const cenaMatch = content.match(/Cena:\s*(.+)/);
        const cena = cenaMatch ? cenaMatch[1].trim() : "Dohodou";

        const agentSlug = slugify(jmeno);
        const agentIdDb = `agent-${agentSlug}`;
        const scenarioIdDb = `scenario-${agentSlug}`;

        // Pick source style based on index (same as upload script to be consistent)
        // Wait, the user might want explicitly matching ones, let's read standard hints if available
        let sourceMode = SOURCES[i % SOURCES.length];

        if (content.toLowerCase().includes("sreality") || content.toLowerCase().includes("bazoš")) {
            sourceMode = SOURCES[1]; // sreality
        } else if (content.toLowerCase().includes("webu") || content.toLowerCase().includes("formulář")) {
            sourceMode = SOURCES[0]; // form
        } else if (content.toLowerCase().includes("doporučení") || content.toLowerCase().includes("známý")) {
            sourceMode = SOURCES[2]; // recommendation
        } else if (content.toLowerCase().includes("katastr") || content.toLowerCase().includes("cold call")) {
            sourceMode = SOURCES[3]; // cold
        }

        const svgCode = sourceMode.gen(jmeno, cena, lokalita, typ);
        const svgPath = path.join(outDir, `${agentSlug}.svg`);

        fs.writeFileSync(svgPath, svgCode);

        // Update DB to point to this exact SVG
        const dbPath = `/scenarios/generated/${agentSlug}.svg`;
        await supabase.from('scenarios').update({ image_url: dbPath }).eq('id', scenarioIdDb);

        console.log(`Generated SVG and updated DB for: ${jmeno} (${sourceMode.type})`);
    }
}

main().catch(console.error);

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Parsed from .env.local
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MALE_VOICE_ID = "uYFJyGaibp4N2VwYQshk"; // Adam
const FEMALE_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Bella (placeholder, should verify female voice)

// Replaces accented chars to create safe IDs
const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const SOURCES = [
    { img: "/scenarios/form.png", cat: "hot-lead", descBase: "Získán z formuláře na webu." },
    { img: "/scenarios/sreality.png", cat: "warm-lead", descBase: "Reakce na inzerát (Sreality/Bezrealitky)." },
    { img: "/scenarios/recommendation.png", cat: "hot-lead", descBase: "Doporučení od bývalého klienta." },
    { img: "/scenarios/cold.png", cat: "cold-lead", descBase: "Slepé volání podle katastru." },
];

async function getVoices() {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY }
    });
    return await res.json();
}

async function deleteAllAgents() {
    console.log("Fetching existing ElevenLabs agents...");
    const res = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY }
    });
    const data = await res.json();
    const agents = data.agents || [];

    for (const agent of agents) {
        console.log(`Deleting ${agent.name} (${agent.agent_id})...`);
        await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agent.agent_id}`, {
            method: 'DELETE',
            headers: { "xi-api-key": ELEVENLABS_API_KEY }
        });
    }
    console.log("All existing agents deleted.");
}

async function createElevenLabsAgent(name: string, voiceId: string, prompt: string, firstMessage: string) {
    const payload = {
        name: name,
        conversation_config: {
            agent: {
                prompt: { prompt },
                first_message: firstMessage,
                language: "cs"
            },
            tts: {
                model_id: "eleven_turbo_v2_5",
                voice_id: voiceId
            },
            conversation: {
                max_duration_seconds: 900
            }
        }
    };

    const res = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
        method: "POST",
        headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create agent ${name}: ${err}`);
    }

    const data = await res.json();
    return data.agent_id;
}

async function main() {
    console.log("Starting agent upload...");

    // Find a good female voice if available
    const voicesData = await getVoices();
    const voices = voicesData.voices || [];
    const femaleVoice = voices.find((v: any) => (v.labels?.language === 'cs' || v.labels?.language === 'cz') && v.labels?.gender === 'female');
    const femaleVoiceId = femaleVoice ? femaleVoice.voice_id : "Xb7hH8MSALEjdEVA51vA"; // Alice fallback

    await deleteAllAgents();

    const agentiDir = path.join(__dirname, '../agenti');
    const files = fs.readdirSync(agentiDir).filter(f => f.endsWith('.txt'));

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = fs.readFileSync(path.join(agentiDir, file), 'utf8');

        // Parse Data
        const nameMatch = content.match(/Jmeno:\s*(.+)/);
        const jmeno = nameMatch ? nameMatch[1].trim() : `Agent ${i}`;

        const pohlaviMatch = content.match(/Pohlavi:\s*(.+)/);
        const isFemale = pohlaviMatch && pohlaviMatch[1].toLowerCase().includes('žen');
        const voiceId = isFemale ? femaleVoiceId : MALE_VOICE_ID;

        const levelMatch = content.match(/Level:\s*(\d+)/);
        let difficulty: "easy" | "medium" | "hard" = "medium";
        let levelNum = 5;
        if (levelMatch) {
            levelNum = parseInt(levelMatch[1]);
            if (levelNum <= 3) difficulty = "easy";
            else if (levelNum >= 7) difficulty = "hard";
        }

        const firstMsgMatch = content.match(/── PRVNI ZPRAVA ──\n(.+)/);
        const firstMsg = firstMsgMatch ? firstMsgMatch[1].trim() : "Ano, prosím?";

        const systemPromptParts = content.split(/============================================================\s*SYSTEM PROMPT.*============================================================/);
        let systemPrompt = systemPromptParts.length > 1 ? systemPromptParts[1].trim() : content;

        // Remove "INTERNÍ BRIEF" and everything after it
        const cutoffIndex = systemPrompt.indexOf('INTERNÍ BRIEF');
        if (cutoffIndex !== -1) {
            systemPrompt = systemPrompt.substring(0, cutoffIndex).trim();
        }

        const nazevMatch = content.match(/Nazev:\s*(.+)/);
        const scenarNazev = nazevMatch ? nazevMatch[1].trim() : `${jmeno} - Call`;

        const situaceMatch = content.match(/Situace:\s*(.+)/);
        const situace = situaceMatch ? situaceMatch[1].trim() : "Běžný hovor";

        const archetypMatch = content.match(/Archetyp:\s*(.+)/);
        const archetyp = archetypMatch ? archetypMatch[1].trim() : "Zákazník";

        // Pick Source
        const source = SOURCES[i % SOURCES.length];
        const agentNameWithLevel = `[${jmeno} - Obtížnost ${levelNum}]`;

        console.log(`Creating ${agentNameWithLevel} in ElevenLabs...`);
        const agentIdEl = await createElevenLabsAgent(agentNameWithLevel, voiceId, systemPrompt, firstMsg);

        const initials = jmeno.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        const agentIdDb = `agent-${slugify(jmeno)}`;
        const scenarioIdDb = `scenario-${slugify(jmeno)}`;

        // DB Insert Agent
        console.log(`Inserting ${jmeno} to Supabase...`);
        await supabase.from('agents').upsert({
            id: agentIdDb,
            name: agentNameWithLevel,
            personality: archetyp,
            description: `Profil: ${archetyp}`,
            difficulty: difficulty,
            avatar_initials: initials,
            elevenlabs_agent_id: agentIdEl,
            example_scenario: situace
        });

        // DB Insert Scenario
        await supabase.from('scenarios').upsert({
            id: scenarioIdDb,
            title: scenarNazev,
            description: `Od kud: ${source.descBase}\n\n${situace}`,
            category: source.cat,
            difficulty: difficulty,
            objectives: ["Zjistit situaci klienta", "Navázat vztah", "Nabídnout řešení a schůzku"],
            agent_id: agentIdDb
        });
    }

    console.log("DONE! Vše nahráno.");
}

main().catch(console.error);

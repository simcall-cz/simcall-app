/**
 * Script pro vložení 19 agentů a jejich scénářů do Supabase.
 * ElevenLabs Agent IDs fetched automatically from API.
 * 
 * Spuštění: node scripts/seed-19-agents.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ═══════════════════════════════════════════
// AGENTI s ElevenLabs Agent IDs
// ═══════════════════════════════════════════
const agents = [
  { id: "agent-eva-tomanova", name: "Eva Tomanová", personality: "Sociální typ", description: "Zahraniční majitelka, HOT lead, obtížnost 1", difficulty: "easy", avatar_initials: "ET", traits: ["Přátelská", "Sdílná", "Nadšená", "Zvědavá"], elevenlabs_agent_id: "agent_6901kke6xwvve2qb51g58qaamh1w" },
  { id: "agent-karin-horackova", name: "Karin Horáčková", personality: "Přátelská ale nezávazná", description: "Doporučení od známého, HOT lead, obtížnost 1", difficulty: "easy", avatar_initials: "KH", traits: ["Přátelská", "Otevřená", "Nezávazná", "Trpělivá"], elevenlabs_agent_id: "agent_7201kke6yxddfn8benn82xrt1emz" },
  { id: "agent-karin-pitrova", name: "Karin Pitrová", personality: "Dominantní expert", description: "Návrat po čase, HOT lead, obtížnost 1", difficulty: "easy", avatar_initials: "KP", traits: ["Dominantní", "Sebevědomá", "Odborná", "Rozhodná"], elevenlabs_agent_id: "agent_5701kke6yz5aew6rka0xesjb8stf" },
  { id: "agent-samuel-orel", name: "Samuel Orel", personality: "Dominantní expert", description: "Prodej i koupě, HOT lead, obtížnost 1", difficulty: "easy", avatar_initials: "SO", traits: ["Dominantní", "Sebevědomý", "Analytický", "Přímý"], elevenlabs_agent_id: "agent_8001kke6z94vey3renqk3y239jez" },
  { id: "agent-milada-kejvalova", name: "Milada Kejvalová", personality: "Přátelská ale opatrná", description: "Návrat po čase, HOT lead, obtížnost 2", difficulty: "easy", avatar_initials: "MK", traits: ["Přátelská", "Opatrná", "Formální", "Zvědavá"], elevenlabs_agent_id: "agent_7001kke6z54kfqnt2etm8ygg2cy5" },
  { id: "agent-adam-kohout", name: "Adam Kohout", personality: "Přepečlivý perfekcionista", description: "Výběrové řízení, WARM lead, obtížnost 3", difficulty: "easy", avatar_initials: "AK", traits: ["Perfekcionista", "Opatrný", "Zvědavý", "Váhavý"], elevenlabs_agent_id: "agent_0601kke6xkghenyab7yrbnznpg0t" },
  { id: "agent-hildegarda-kovarova", name: "Hildegarda Kovářová", personality: "Nedůvěřivá paranoidní", description: "Sondování trhu, WARM lead, obtížnost 3", difficulty: "easy", avatar_initials: "HK", traits: ["Nedůvěřivá", "Paranoidní", "Opatrná", "Podezřívavá"], elevenlabs_agent_id: "agent_7401kke6xze8f95sxcpt65j694ff" },
  { id: "agent-ruzena-ruzickova", name: "Růžena Růžičková", personality: "Sociální typ", description: "Dotaz ze soc. sítí, WARM lead, obtížnost 4", difficulty: "medium", avatar_initials: "RR", traits: ["Sociální", "Hodnotící", "Věcná", "Váhavá"], elevenlabs_agent_id: "agent_8601kke6z7sfe368manfpnfrbs96" },
  { id: "agent-leos-musil", name: "Leoš Musil", personality: "Skeptický realista", description: "Reakce na leták, WARM lead, obtížnost 4", difficulty: "medium", avatar_initials: "LM", traits: ["Skeptický", "Realistický", "Přímý", "Rozhodný"], elevenlabs_agent_id: "agent_1901kke6z22wfnz8wv04f1hcm7q8" },
  { id: "agent-eduard-langer", name: "Eduard Langer", personality: "Nedůvěřivý paranoidní", description: "Follow-up po e-mailu, COLD lead, obtížnost 5", difficulty: "medium", avatar_initials: "EL", traits: ["Nedůvěřivý", "Paranoidní", "Opatrný", "Skeptický"], elevenlabs_agent_id: "agent_0501kke6xvbjf03sa0wxee9fhawp" },
  { id: "agent-ilona-tykalova", name: "Ilona Tykalová", personality: "Přátelská ale nezávazná", description: "Slepé volání z katastru, COLD lead, obtížnost 5", difficulty: "medium", avatar_initials: "IT", traits: ["Přátelská", "Nezávazná", "Podezřívavá", "Opatrná"], elevenlabs_agent_id: "agent_6101kke6y2kcff88d8tfnc4ksfvf" },
  { id: "agent-leona-neumannova", name: "Leona Neumannová", personality: "Chronická vyjednavačka", description: "Exspirace inzerátu, COLD lead, obtížnost 6", difficulty: "medium", avatar_initials: "LN", traits: ["Vyjednávačka", "Přímá", "Skeptická", "Nátlaková"], elevenlabs_agent_id: "agent_2501kke6z0nvfges0c5gy1h9mkdg" },
  { id: "agent-miroslava-balounova", name: "Miroslava Balounová", personality: "Chronická vyjednavačka", description: "B2B akvizice, COLD lead, obtížnost 6", difficulty: "medium", avatar_initials: "MB", traits: ["Vyjednávačka", "Formální", "Odmítavá", "Skeptická"], elevenlabs_agent_id: "agent_1201kke6z6jmfmzr84y95663hn9n" },
  { id: "agent-ales-navratil", name: "Aleš Navrátil", personality: "Pesimista", description: "Samoprodejce FSBO, COLD lead, obtížnost 7", difficulty: "hard", avatar_initials: "AN", traits: ["Pesimistický", "Odmítavý", "Nedůvěřivý", "Přímý"], elevenlabs_agent_id: "agent_1001kke6xpz0fhqbawqhewhnzr5s" },
  { id: "agent-andrea-kohoutova", name: "Andrea Kohoutová", personality: "Nedůvěřivá paranoidní", description: "B2B akvizice developer, COLD lead, obtížnost 8", difficulty: "hard", avatar_initials: "AKo", traits: ["Paranoidní", "Odmítavá", "Nedůvěřivá", "Přímá"], elevenlabs_agent_id: "agent_7801kke6xr82ezs9vj9nks9470wx" },
  { id: "agent-agata-kralova", name: "Agáta Králová", personality: "Zaneprázdněný manažer", description: "Samoprodejce FSBO, COLD lead, obtížnost 9", difficulty: "hard", avatar_initials: "AKr", traits: ["Zaneprázdněná", "Přímá", "Netrpělivá", "Odmítavá"], elevenlabs_agent_id: "agent_5201kke6xnnhe2zv4kxkeehw766z" },
  { id: "agent-andrea-spackova", name: "Andrea Špačková", personality: "Tichý typ", description: "Follow-up po e-mailu, COLD lead, obtížnost 9", difficulty: "hard", avatar_initials: "AS", traits: ["Tichá", "Odměřená", "Strozá", "Uzavřená"], elevenlabs_agent_id: "agent_8401kke6xshqeqf83ve2pzbmtw9x" },
  { id: "agent-marie-mrazkova", name: "Marie Mrázková", personality: "Nedůvěřivá paranoidní", description: "Follow-up po e-mailu, COLD lead, obtížnost 9", difficulty: "hard", avatar_initials: "MM", traits: ["Paranoidní", "Nedůvěřivá", "Odmítavá", "Podezřívavá"], elevenlabs_agent_id: "agent_0901kke6z3g8e08asx91fbz3t409" },
  { id: "agent-frantiska-jelinkova", name: "Františka Jelínková", personality: "Nedůvěřivá paranoidní", description: "Exspirace inzerátu, COLD lead, obtížnost 10", difficulty: "hard", avatar_initials: "FJ", traits: ["Paranoidní", "Odmítavá", "Agresivní", "Nedůvěřivá"], elevenlabs_agent_id: "agent_3201kke6xy52fk782jfh2qtyzhq9" },
];

// ═══════════════════════════════════════════
// SCÉNÁŘE
// ═══════════════════════════════════════════
const scenarios = [
  { id: "scenario-eva-tomanova", title: "Zahraniční majitel", description: "Eva žije v zahraničí a potřebuje prodat zděděný byt na dálku.", category: "hot-lead", difficulty: "easy", objectives: ["Zdůraznit vzdálený prodej", "Vysvětlit plnou moc", "Navrhnout video call", "Domluvit termín"], agent_id: "agent-eva-tomanova" },
  { id: "scenario-karin-horackova", title: "Doporučení od známého", description: "Karin volá díky doporučení od spokojeného zákazníka.", category: "hot-lead", difficulty: "easy", objectives: ["Zmínit doporučujícího", "Poděkovat za důvěru", "Přejít k věci", "Domluvit schůzku"], agent_id: "agent-karin-horackova" },
  { id: "scenario-karin-pitrova", title: "Návrat po čase", description: "Karin volá po 6 měsících, teď je připravená prodávat.", category: "hot-lead", difficulty: "easy", objectives: ["Navázat na CRM", "Zjistit změny", "Jednat rozhodně", "Domluvit schůzku"], agent_id: "agent-karin-pitrova" },
  { id: "scenario-samuel-orel", title: "Kulový blesk: prodej i koupě", description: "Samuel potřebuje prodat i koupit současně.", category: "hot-lead", difficulty: "easy", objectives: ["Vysvětlit provázání časů", "Nabídnout hypoteční poradenství", "Prokázat koordinaci", "Domluvit schůzku"], agent_id: "agent-samuel-orel" },
  { id: "scenario-milada-kejvalova", title: "Návrat po čase (opatrná)", description: "Milada volá po 6 měsících, stěhuje se do zahraničí.", category: "hot-lead", difficulty: "easy", objectives: ["Navázat na CRM", "Zvládnout námitku", "Prokázat zkušenost", "Domluvit schůzku"], agent_id: "agent-milada-kejvalova" },
  { id: "scenario-adam-kohout", title: "Výběrové řízení", description: "Adam porovnává makléře a chce vědět proč si vybrat vás.", category: "warm-lead", difficulty: "easy", objectives: ["Nehanit konkurenci", "Přinést reference", "Nabídnout analýzu", "Domluvit odhad"], agent_id: "agent-adam-kohout" },
  { id: "scenario-hildegarda-kovarova", title: "Sondování trhu", description: "Hildegarda se jen ptá na cenu, zatím neprodává.", category: "warm-lead", difficulty: "easy", objectives: ["Nevyvíjet tlak", "Nabídnout odhad", "Domluvit follow-up", "Udržet v CRM"], agent_id: "agent-hildegarda-kovarova" },
  { id: "scenario-ruzena-ruzickova", title: "Dotaz ze sociálních sítí", description: "Růžena komentovala FB příspěvek a napsala zprávu.", category: "warm-lead", difficulty: "medium", objectives: ["Zmínit komentář", "Odpovědět s daty", "Zjistit záměr", "Přejít ke schůzce"], agent_id: "agent-ruzena-ruzickova" },
  { id: "scenario-leos-musil", title: "Reakce na leták", description: "Leoš zavolal na číslo z letáku, je skeptický.", category: "warm-lead", difficulty: "medium", objectives: ["Ocenit zavolání", "Připomenout leták", "Nabídnout setkání", "Domluvit odhad"], agent_id: "agent-leos-musil" },
  { id: "scenario-eduard-langer", title: "Follow-up po cold e-mailu", description: "Eduard dostal e-mail před 2 týdny a neodpověděl.", category: "cold-lead", difficulty: "medium", objectives: ["Zmínit e-mail", "Být krátký", "Dát out", "Zjistit zájem"], agent_id: "agent-eduard-langer" },
  { id: "scenario-ilona-tykalova", title: "Slepé volání podle katastru", description: "Číslo dohledáno z katastru, klientka reaguje podezřívavě.", category: "cold-lead", difficulty: "medium", objectives: ["Být upřímný", "Říct proč voláte", "Přejít k hodnotě", "Překonat odpor"], agent_id: "agent-ilona-tykalova" },
  { id: "scenario-leona-neumannova", title: "Exspirace inzerátu", description: "Leoně vypršel inzerát po 3 měsících bez prodeje.", category: "cold-lead", difficulty: "medium", objectives: ["Neříkat neprodalo se", "Nabídnout analýzu", "Navrhnout změny", "Domluvit schůzku"], agent_id: "agent-leona-neumannova" },
  { id: "scenario-miroslava-balounova", title: "B2B akvizice", description: "B2B cold call na správce bytového fondu.", category: "cold-lead", difficulty: "medium", objectives: ["Zjistit decision makera", "Mluvit o úspoře", "Nabídnout audit", "Dostat se dál"], agent_id: "agent-miroslava-balounova" },
  { id: "scenario-ales-navratil", title: "Samoprodejce (FSBO)", description: "Aleš prodává sám přes inzertní portály.", category: "cold-lead", difficulty: "hard", objectives: ["Překonat odmítání", "Prokázat hodnotu", "Ukázat data", "Domluvit krok"], agent_id: "agent-ales-navratil" },
  { id: "scenario-andrea-kohoutova", title: "B2B akvizice developer", description: "B2B cold call na správce/developera.", category: "cold-lead", difficulty: "hard", objectives: ["Prokázat hodnotu", "Přežít odmítnutí", "Dostat se k decision makerovi", "Nabídnout pilotní spolupráci"], agent_id: "agent-andrea-kohoutova" },
  { id: "scenario-agata-kralova", title: "Samoprodejce (FSBO) ledový mur", description: "Agáta prodává sama, minimum času, přímý styl.", category: "cold-lead", difficulty: "hard", objectives: ["Být stručný", "Prolomit led hodnotou", "Respektovat čas", "Domluvit krok"], agent_id: "agent-agata-kralova" },
  { id: "scenario-andrea-spackova", title: "Follow-up po e-mailu (tichý typ)", description: "Andrea dostala cold e-mail, odpovídá krátce a stroze.", category: "cold-lead", difficulty: "hard", objectives: ["Zmínit e-mail", "Dát out", "Nenutit k rozhovoru", "Domluvit krok"], agent_id: "agent-andrea-spackova" },
  { id: "scenario-marie-mrazkova", title: "Follow-up po e-mailu (paranoidní)", description: "Marie je paranoidní a podezřívá ze skrytých motivů.", category: "cold-lead", difficulty: "hard", objectives: ["Zmínit e-mail", "Prokázat důvěryhodnost", "Dát out", "Posunout věci"], agent_id: "agent-marie-mrazkova" },
  { id: "scenario-frantiska-jelinkova", title: "Exspirace inzerátu (nejtěžší)", description: "Františce vypršel inzerát přes jinou RK, obtížnost 10/10.", category: "cold-lead", difficulty: "hard", objectives: ["Neříkat o neúspěchu", "Nabídnout analýzu", "Navrhnout změny", "Získat souhlas"], agent_id: "agent-frantiska-jelinkova" },
];

async function run() {
  console.log("=== Mazání starých agentů a scénářů ===");
  
  // Delete old scenarios first (foreign key)
  const oldScenarioIds = ["scenario-zbynek", "scenario-1", "scenario-2", "scenario-3", "scenario-4", "scenario-5", "scenario-6"];
  for (const sid of oldScenarioIds) {
    const { error } = await supabase.from("scenarios").delete().eq("id", sid);
    if (!error) console.log(`  Smazán scénář: ${sid}`);
  }
  
  // Delete old agents
  const oldAgentIds = ["agent-1", "agent-2", "agent-3", "agent-4", "agent-5", "agent-6", "agent-zbynek"];
  for (const aid of oldAgentIds) {
    const { error } = await supabase.from("agents").delete().eq("id", aid);
    if (!error) console.log(`  Smazán agent: ${aid}`);
  }
  
  console.log("\n=== Vkládání 19 nových agentů ===");
  for (const agent of agents) {
    const { error } = await supabase.from("agents").upsert(agent);
    if (error) {
      console.error(`✗ ${agent.name}: ${error.message}`);
    } else {
      console.log(`✓ ${agent.name} (${agent.elevenlabs_agent_id})`);
    }
  }
  
  console.log("\n=== Vkládání 19 nových scénářů ===");
  for (const scenario of scenarios) {
    const { error } = await supabase.from("scenarios").upsert(scenario);
    if (error) {
      console.error(`✗ ${scenario.title}: ${error.message}`);
    } else {
      console.log(`✓ ${scenario.title}`);
    }
  }
  
  console.log("\n=== Hotovo! Všech 19 agentů a scénářů vloženo. ===");
}

run();

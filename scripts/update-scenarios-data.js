/**
 * Script pro aktualizaci 19 scénářů v Supabase:
 *   - tips (pole 3–5 specifických rad v češtině)
 *   - control_prompt (hodnoticí prompt specifický pro každý scénář)
 *
 * Spuštění: node scripts/update-scenarios-data.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ═══════════════════════════════════════════════════════════════
// DATA PRO VŠECH 19 SCÉNÁŘŮ
// ═══════════════════════════════════════════════════════════════

const scenarioUpdates = [
  // ───────────────────────────────────────────
  // 1. Eva Tomanová — Zahraniční majitel, HOT, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-eva-tomanova",
    tips: [
      "Hned na začátku ji uklidněte, že prodej na dálku je běžný a zvládnutelný — odkažte na konkrétní zkušenost s podobným případem.",
      "Vysvětlete proces plné moci jednoduše: co je potřeba, kde ji ověřit (konzulát/apostila) a kolik to trvá.",
      "Navrhněte video call jako první schůzku — připravte si odkaz předem a pošlete ho e-mailem hned po hovoru.",
      "Zmíňte, že fotodokumentaci, home staging a prohlídky zajistíte kompletně bez její přítomnosti.",
      "Domluvte konkrétní termín video hovoru ještě během tohoto rozhovoru — neodkládejte na 'ozveme se'."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Zahraniční majitel".

KONTEXT: Eva Tomanová žije v zahraničí a zdědila byt 3+1 v Praze 21. Napsala e-mail s dotazem, zda je prodej na dálku možný. Je to HOT lead — aktivně chce prodat, jen potřebuje ujištění o procesu.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Uklidnění a empatie (20 bodů): Makléř ji ujistil, že prodej na dálku je běžný? Projevil porozumění její situaci?
2. Vysvětlení plné moci (25 bodů): Zmínil plnou moc jako nástroj? Vysvětlil základní kroky (ověření, apostila)?
3. Návrh video callu (20 bodů): Navrhl video hovor jako první schůzku? Nabídl konkrétní platformu nebo postup?
4. Domluvení termínu (25 bodů): Domluvil konkrétní den a čas? Nebo aspoň navrhl konkrétní termíny?
5. Profesionalita a tón (10 bodů): Byl přátelský, klidný a profesionální? Nepřeháněl sliby?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář. Klientka chce spolupracovat. NEPENALIZUJ za chybějící právní detaily — stačí zmínit plnou moc obecně. Hlavní je empatie, uklidnění a domluvení dalšího kroku.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 2. Karin Horáčková — Doporučení od známého, HOT, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-karin-horackova",
    tips: [
      "Hned na začátku poděkujte za důvěru a zmíňte pana Nováka jménem — to okamžitě sníží bariéru.",
      "Neprodávejte sebe příliš — důvěra je přenesená od doporučujícího, nemusíte se dokazovat.",
      "Rychle přejděte k věci: 'Co za nemovitost prodáváte? Kdy byste chtěla začít?' Klientka je připravená jednat.",
      "Nabídněte konkrétní další krok: osobní schůzku s prohlídkou nemovitosti a odhadem ceny.",
      "Zeptejte se, zda pan Novák zmínil něco konkrétního o vašich službách — to vám ukáže její očekávání."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Doporučení od známého".

KONTEXT: Karin Horáčková volá, protože ji doporučil spokojený zákazník pan Novák. Říká: „Pan Novák mi vás moc chválil, chci prodat byt." Je to HOT lead s přenesenou důvěrou.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Využití doporučení (25 bodů): Zmínil makléř pana Nováka? Poděkoval za důvěru? Navázal na doporučení přirozeně?
2. Přiměřenost prodeje sebe (15 bodů): Nepřeháněl s prodáváním sebe? Nechal přenesenou důvěru pracovat?
3. Přechod k akci (25 bodů): Rychle přešel k věci? Zeptal se na nemovitost, časový rámec, motivaci?
4. Domluvení schůzky (25 bodů): Navrhl konkrétní osobní schůzku? Domluvil termín?
5. Profesionalita a tón (10 bodů): Byl přátelský, ale profesionální? Neztrácel čas zbytečným řečněním?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář. Klientka přichází s důvěrou. Stačí poděkovat, zeptat se na základní info a domluvit schůzku. NEPENALIZUJ za chybějící analýzu trhu — ta přijde na schůzce.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 3. Karin Pitrová — Návrat po čase, HOT, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-karin-pitrova",
    tips: [
      "Okamžitě navažte na předchozí kontakt: 'Pamatuji si, mluvili jsme loni o bytě na Smíchově' — ukazuje to profesionalitu a CRM práci.",
      "Zeptejte se co se změnilo: 'Co vás přimělo se ozvat právě teď?' Odpověď odhalí skutečnou motivaci a urgenci.",
      "Klientka se vrátila sama — to je silný signál. Jednejte rozhodně a sebevědomě, neváhejte s návrhy.",
      "Připravte ji na možnou exekuci: jemně ověřte, zda je na nemovitosti vše v pořádku z právního hlediska.",
      "Navrhněte schůzku co nejdříve — 'Můžeme se sejít ještě tento týden?' Momentum je na vaší straně."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Návrat po čase".

KONTEXT: Karin Pitrová volá sama po 6 měsících. Prodává byt 3+kk na Smíchově. Říká: „Mluvili jsme loni, tehdy jsem nebyla připravená. Teď už jsem." Má skrytou exekuci na nemovitosti. Je to HOT lead, dominantní typ.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Navázání na CRM (20 bodů): Zmínil předchozí kontakt? Ukázal, že si pamatuje detaily nebo je dohledal?
2. Zjištění změn (20 bodů): Zeptal se, co se za půl roku změnilo? Zjistil motivaci a urgenci?
3. Rozhodné jednání (25 bodů): Jednal sebevědomě a rozhodně? Nepůsobil váhavě nebo nejistě?
4. Domluvení rychlé schůzky (25 bodů): Navrhl schůzku co nejdříve? Domluvil konkrétní termín?
5. Profesionalita (10 bodů): Zvládl dominantní typ klientky? Udržel si pozici experta?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář. Klientka chce prodávat. NEPENALIZUJ za to, že makléř neodhalil exekuci — to není realistické po telefonu. Hlavní je navázat na CRM, jednat rozhodně a domluvit schůzku.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 4. Samuel Orel — Prodej i koupě, HOT, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-samuel-orel",
    tips: [
      "Vysvětlete dvě strategie: prodej nejdřív a pak nákup, nebo paralelní proces s překleňovacím financováním.",
      "Nabídněte hypoteční poradenství jako součást služby — propojení s hypotečním specialistou je silný argument.",
      "Ukažte, že koordinaci dvou transakcí jste už řešili: 'Tohle děláme běžně, mám s tím zkušenost.'",
      "Zmapujte jeho finanční situaci jemně: potřebuje peníze z prodeje na nákup, nebo má vlastní zdroje?",
      "Navrhněte schůzku s konkrétním plánem: 'Sejdeme se, projdeme garsonku, probereme váš rozpočet na nový byt.'"
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Kulový blesk: prodej i koupě".

KONTEXT: Samuel Orel potřebuje prodat garsonku v Brně a zároveň koupit větší byt. Ptá se: „Slyšel jsem, že to jde zařídit najednou. Zvládnete to?" Je to HOT lead, dominantní a analytický typ.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Vysvětlení procesu (25 bodů): Vysvětlil makléř, jak se provazuje prodej a nákup? Zmínil časové varianty?
2. Hypoteční poradenství (20 bodů): Nabídl propojení s hypotečním specialistou nebo poradcem?
3. Prokázání koordinace (20 bodů): Ukázal zkušenost s řízením dvou transakcí současně?
4. Domluvení schůzky (25 bodů): Navrhl schůzku s konkrétním plánem co se bude řešit?
5. Profesionalita (10 bodů): Zvládl analytického klienta? Odpovídal věcně a konkrétně?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář. Klient chce spolupracovat. Stačí ukázat, že rozumíte procesu, a domluvit schůzku. NEPENALIZUJ za chybějící detaily o hypotékách — hlavní je zmínit možnost.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 5. Milada Kejvalová — Návrat po čase (opatrná), HOT, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-milada-kejvalova",
    tips: [
      "Navažte na předchozí kontakt klidně a přirozeně: 'Ráda vás zase slyším, pamatuji si náš rozhovor.'",
      "Pokud vyjádří nedůvěru v realitky, nezačněte se bránit — klidně přijměte a nabídněte konkrétní řešení.",
      "Zdůrazněte zkušenost s rychlým prodejem a právní jistotou — stěhuje se do zahraničí, potřebuje mít klid.",
      "Nabídněte jasný časový plán: 'Za 2 týdny můžeme mít inzerát venku, za 2–3 měsíce prodáno.'",
      "Domluvte schůzku s konkrétním plánem postupu — opatrná klientka potřebuje vidět strukturu."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Návrat po čase (opatrná)".

KONTEXT: Milada Kejvalová volá po 6 měsících. Prodává byt 2+1 v Praze 10, stěhuje se do zahraničí. Je přátelská, ale formální a opatrná. Má mírnou nedůvěru k realitkám.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Navázání na CRM (20 bodů): Zmínil předchozí kontakt? Ukázal kontinuitu vztahu?
2. Zvládnutí námitky o nedůvěře (25 bodů): Reagoval klidně na nedůvěru? Nerozhodil ho to?
3. Prokázání zkušenosti (20 bodů): Zmínil rychlý a bezpečný prodejní proces? Dal jí jistotu?
4. Domluvení schůzky (25 bodů): Domluvil schůzku s konkrétním plánem a termínem?
5. Tón a přístup (10 bodů): Respektoval její formálnější styl? Byl trpělivý a klidný?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář. Klientka chce prodávat, jen potřebuje ujištění. NEPENALIZUJ za to, že makléř neřešil detaily stěhování do zahraničí. Hlavní je navázat, uklidnit a domluvit schůzku.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 6. Adam Kohout — Výběrové řízení, WARM, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-adam-kohout",
    tips: [
      "Nikdy nehanějte konkurenci — místo toho řekněte: 'Je chytré porovnávat, oceňuji to. Dovolte mi ukázat, čím se lišíme.'",
      "Přineste konkrétní čísla: průměrnou dobu prodeje, procento dosažení požadované ceny, počet úspěšných prodejů v lokalitě.",
      "Nabídněte bezplatnou analýzu pozemku a cenový odhad — je to konkrétní hodnota, kterou konkurence nemusí nabídnout.",
      "Stavební pozemek vyžaduje specifickou znalost: zmíňte územní plán, zastavitelnost, inženýrské sítě — ukáže to expertízu.",
      "Zeptejte se: 'Co je pro vás při výběru makléře nejdůležitější?' Odpověď vám řekne, na co se zaměřit."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Výběrové řízení".

KONTEXT: Adam Kohout otevřeně porovnává makléře. Prodává stavební pozemek v Novém Boru. Ptá se: „Proč bych si měl vybrat právě vás?" Je perfekcionista, opatrný a zvědavý.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Reakce na porovnávání (20 bodů): Nehanit konkurenci? Reagoval pozitivně na to, že klient porovnává?
2. Konkrétní argumenty (25 bodů): Přinesl čísla, reference nebo konkrétní výsledky? Ne jen obecné sliby?
3. Nabídka analýzy (20 bodů): Nabídl bezplatný odhad nebo analýzu nemovitosti jako vstupní krok?
4. Domluvení dalšího kroku (25 bodů): Domluvil schůzku, odhad nebo follow-up? Posunul věci kupředu?
5. Znalost segmentu (10 bodů): Zmínil specifika stavebních pozemků? Ukázal odbornost?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář (warm lead). Klient aktivně hledá makléře. Stačí nehanit konkurenci, přinést argumenty a domluvit další krok. NEPENALIZUJ za chybějící detailní znalost lokality Nový Bor.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 7. Hildegarda Kovářová — Sondování trhu, WARM, easy
  // ───────────────────────────────────────────
  {
    id: "scenario-hildegarda-kovarova",
    tips: [
      "Nikdy nevyvíjejte tlak — klientka jen sonduje. Řekněte: 'Rozumím, to je naprosto v pořádku. Rád vám dám orientační odhad.'",
      "Nabídněte bezplatný cenový odhad bez jakéhokoli závazku — to je pro ni bezpečný první krok.",
      "Ptejte se nenásilně: 'Jen ze zvědavosti, plánujete třeba stěhování, nebo vás jen zajímá hodnota?'",
      "Domluvte follow-up za 2–3 měsíce: 'Můžu se vám ozvat na jaře, až budou nová data z trhu?'",
      "Zapište si ji do CRM s poznámkou — tato klientka může být prodávající za 3–6 měsíců."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Sondování trhu".

KONTEXT: Hildegarda Kovářová se jen ptá na cenu bytu 5+kk v Praze 14 (cca 14,5 mil Kč). Zatím neprodává, jen ji zajímá tržní hodnota. Je nedůvěřivá a paranoidní — jakýkoli tlak ji odradí.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Absence tlaku (30 bodů): Nevyvíjel makléř tlak na prodej? Respektoval, že klientka jen sonduje? Toto je klíčové kritérium.
2. Nabídka odhadu (25 bodů): Nabídl bezplatný odhad bez závazku? Představil to jako bezpečný krok?
3. Zjištění motivace (15 bodů): Jemně zjistil, proč se ptá na cenu? Nebylo to vyslýchání?
4. Plán follow-upu (20 bodů): Navrhl follow-up za čas? Domluvil způsob dalšího kontaktu?
5. Tón a trpělivost (10 bodů): Byl trpělivý, klidný a nevtíravý?

POZNÁMKA K OBTÍŽNOSTI: Toto je EASY scénář, ale vyžaduje trpělivost. Klientka NECHCE prodávat teď. Úspěch = nabídnout odhad, nevyděsit ji a domluvit follow-up. TVRDĚ PENALIZUJ jakýkoli nátlak nebo tlak na prodej.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 8. Růžena Růžičková — Dotaz ze soc. sítí, WARM, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-ruzena-ruzickova",
    tips: [
      "Zmíňte její komentář na Facebooku konkrétně: 'Viděl jsem váš dotaz pod naším příspěvkem o brněnském trhu' — personalizace buduje důvěru.",
      "Odpovězte s daty: průměrná doba prodeje v Brně, cenový vývoj, poptávka — ne obecnosti, ale čísla.",
      "Zjistěte její záměr: prodává ateliér se střešní terasou, nebo jen zvažuje? Teprve pak nabídněte službu.",
      "Přechod z chatu na schůzku udělejte přirozeně: 'Mám pro vás podrobnější analýzu, mohu vám ji představit osobně?'",
      "Respektujte, že přišla přes sociální sítě — komunikujte uvolněněji, ale profesionálně."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Dotaz ze sociálních sítí".

KONTEXT: Růžena Růžičková komentovala FB příspěvek: „Jak rychle se teď prodávají byty v Brně?" Poté napsala soukromou zprávu. Prodává ateliér se střešní terasou v Brně. Je sociální typ, hodnotící a věcná.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Personalizace a zmínění komentáře (20 bodů): Zmínil makléř její FB komentář? Navázal na konkrétní dotaz?
2. Odpověď s daty (20 bodů): Odpověděl s konkrétními daty o brněnském trhu? Ne jen obecné fráze?
3. Zjištění záměru (20 bodů): Zjistil, zda prodává nebo jen zvažuje? Zmapoval její situaci?
4. Přechod k profesionální schůzce (25 bodů): Přešel z neformálního chatu k profesionální schůzce nebo hovoru?
5. Zvládnutí 1–2 námitek (15 bodů): Zvládl případné námitky typu „jen se ptám" nebo „ještě nevím"?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář. Klientka je zaujatá, ale není rozhodnutá. Očekává se zvládnutí 1–2 námitek a přechod z online na offline. PENALIZUJ pokud makléř ignoroval FB kontext nebo mluvil příliš obecně.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 9. Leoš Musil — Reakce na leták, WARM, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-leos-musil",
    tips: [
      "Oceňte, že zavolal: 'Děkuji, že jste si našel čas zavolat. To není samozřejmost a vážím si toho.'",
      "Připomeňte konkrétní obsah letáku: 'Na tom letáku jsme psali o bezplatném odhadu pro vaši lokalitu' — ukazuje to připravenost.",
      "Na skepticismus reagujte klidně a fakty: 'Rozumím, spousta lidí má podobnou zkušenost. Mohu vám ukázat konkrétní výsledky?'",
      "Nabídněte setkání bez závazku: 'Pojďme se sejít na 20 minut, podívám se na nemovitost a řeknu vám svůj názor. Nic vás to nestojí.'",
      "Nepřesvědčujte silou — skeptik potřebuje prostor. Dejte mu možnost odmítnout."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Reakce na leták".

KONTEXT: Leoš Musil zavolal na číslo z letáku. Je skeptický: „Volám na ten leták, ale makléřům moc nevěřím. Co ode mě vlastně chcete?" Je realistický a přímý, nesnáší prodejní fráze.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Ocenění zavolání (15 bodů): Ocenil makléř, že Leoš sám zavolal? Poděkoval mu?
2. Připomenutí letáku (15 bodů): Zmínil konkrétní obsah letáku? Ukázal návaznost?
3. Zvládnutí skepticismu (25 bodů): Reagoval klidně na nedůvěru? Nepoužil agresivní prodejní techniky? Nabídl fakta místo slibů?
4. Nabídka setkání bez závazku (25 bodů): Navrhl nezávazné setkání? Domluvil konkrétní termín?
5. Respekt k odmítnutí (20 bodů): Dal Leošovi prostor? Nepoužíval manipulativní techniky?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář. Klient zavolal sám, ale je skeptický. Očekává se zvládnutí skepticismu a nabídka nezávazného setkání. PENALIZUJ agresivní prodej nebo ignorování jeho pochybností.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 10. Eduard Langer — Follow-up po cold e-mailu, COLD, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-eduard-langer",
    tips: [
      "Hned v první větě zmíňte e-mail: 'Dobrý den, pane Langere, psal jsem vám e-mail před dvěma týdny ohledně vaší nemovitosti.'",
      "Buďte stručný — neopakujte celý e-mail po telefonu. Řekněte jen podstatu v jedné větě.",
      "Dejte mu jasný out: 'Je to pro vás stále aktuální, nebo jste to už vyřešil jinak?' Snížíte tím tlak.",
      "Pokud řekne, že neměl čas, reagujte: 'Rozumím, proto volám — chtěl jsem to zjednodušit. Stačí mi 2 minuty.'",
      "Cíl není prodat po telefonu — cíl je zjistit, zda je zájem, a případně domluvit krátkou schůzku."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Follow-up po cold e-mailu".

KONTEXT: Eduard Langer dostal cold e-mail před 2 týdny a neodpověděl. Makléř volá jako follow-up. Eduard reaguje: „Ten e-mail? Jo, viděl jsem ho, ale nestíhal jsem odpovědět." Je nedůvěřivý a paranoidní.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Zmínění e-mailu (20 bodů): Zmínil makléř e-mail hned na začátku? Bylo jasné, proč volá?
2. Stručnost (20 bodů): Byl stručný? Neopakoval celý e-mail? Respektoval čas klienta?
3. Nabídnutí outu (20 bodů): Dal klientovi možnost odmítnout? Snížil tlak?
4. Zjištění zájmu (20 bodů): Zjistil, zda je zájem skutečný? Položil kvalifikační otázky?
5. Domluvení dalšího kroku (20 bodů): Domluvil schůzku, hovor nebo alespoň follow-up?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář (cold lead). Klient neodpověděl na e-mail — zájem je nejistý. Očekává se stručnost, respekt a jemné zjištění zájmu. PENALIZUJ tlačení na schůzku bez zjištění zájmu nebo přehnané opakování obsahu e-mailu.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 11. Ilona Tykalová — Slepé volání z katastru, COLD, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-ilona-tykalova",
    tips: [
      "Na otázku 'Odkud máte moje číslo?' odpovězte upřímně: 'Z veřejných zdrojů — katastru nemovitostí. Volám proto, že mám kupce pro vaši lokalitu.'",
      "Hned v první větě po představení přejděte k hodnotě: 'Mám konkrétního kupce hledajícího nemovitost ve vaší ulici.'",
      "Na odpor reagujte klidně: 'Rozumím, že je to nečekaný hovor. Chci vám jen nabídnout informaci — nemovitosti ve vaší lokalitě se teď prodávají nad tržní cenu.'",
      "Nepřesvědčujte násilím — pokud odmítá, nabídněte: 'Mohu vám nechat svůj kontakt pro případ, že by se to v budoucnu hodilo?'",
      "Máte 10 sekund na zaujmutí — nerecitujte představení, jděte rovnou k věci."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Slepé volání z katastru".

KONTEXT: Ilona Tykalová — telefonní číslo dohledáno z katastru nemovitostí. Klientka reaguje podezřívavě: „Odkud máte moje číslo?" Makléř má kupce na danou lokalitu. Ilona je přátelská, ale nezávazná a podezřívavá.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Upřímnost o zdroji čísla (20 bodů): Řekl pravdu odkud má číslo? Nevymýšlel si?
2. Rychlý přechod k hodnotě (25 bodů): Zmínil konkrétního kupce nebo hodnotu pro klientku v prvních větách?
3. Zvládnutí podezřívavosti (25 bodů): Reagoval klidně na počáteční odpor? Nepoužil manipulaci?
4. Překonání odporu (15 bodů): Dokázal překonat první odmítnutí a pokračovat v hovoru?
5. Domluvení dalšího kroku (15 bodů): Domluvil schůzku, hovor nebo alespoň zanechal kontakt?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář (cold call). Klientka nevolala sama — makléř jí volá z katastru. Očekává se upřímnost, rychlý přechod k hodnotě a zvládnutí podezřívavosti. TVRDĚ PENALIZUJ lhaní o zdroji čísla nebo agresivní přístup.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 12. Leona Neumannová — Exspirace inzerátu, COLD, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-leona-neumannova",
    tips: [
      "NIKDY neříkejte 'vidím, že se vám to neprodalo' — to klientku urazí a uzavře. Řekněte: 'Analyzoval jsem váš inzerát a mám návrh, jak to zlepšit.'",
      "Přijďte s konkrétní analýzou: cena vs. trh, kvalita fotek, text inzerátu, positioning — ukažte, že jste udělali domácí úkol.",
      "Navrhněte konkrétní změny: profesionální fotky, home staging, úprava ceny, lepší popis — ne obecná 'nová strategie'.",
      "Očekávejte vyjednávání o provizi — Leona je vyjednavačka. Mějte připravené argumenty proč vaše provize stojí za to.",
      "Nabídněte schůzku s prezentací analýzy: 'Mám pro vás připravenou analýzu na 3 stránkách, mohu vám ji ukázat?'"
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Exspirace inzerátu".

KONTEXT: Leoně Neumannové vypršel inzerát přes jinou RK po 3 měsících bez prodeje. Makléř volá s nabídkou jiného přístupu. Leona je chronická vyjednavačka — bude tlačit na provizi a podmínky.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Taktní otevření (20 bodů): Nezmínil neúspěch předchozího prodeje? Neřekl „vidím, že se to neprodalo"?
2. Konkrétní analýza (25 bodů): Přišel s konkrétními návrhy co zlepšit? Fotky, cena, popis, staging?
3. Zvládnutí vyjednávání (20 bodů): Zvládl tlak na provizi a podmínky? Udržel si pozici?
4. Domluvení schůzky (20 bodů): Domluvil schůzku s konkrétním programem (analýza inzerátu)?
5. Profesionalita pod tlakem (15 bodů): Zůstal klidný a profesionální i pod tlakem vyjednavačky?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář. Klientka je frustrovaná z neúspěchu a bude vyjednávat tvrdě. Očekává se taktní přístup a konkrétní hodnota. TVRDĚ PENALIZUJ zmínku o neúspěchu předchozího prodeje nebo neschopnost reagovat na vyjednávání.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 13. Miroslava Balounová — B2B akvizice, COLD, medium
  // ───────────────────────────────────────────
  {
    id: "scenario-miroslava-balounova",
    tips: [
      "Zjistěte kdo rozhoduje: 'Kdo ve vaší společnosti řeší prodej nemovitostí? Ráda bych mu představila náš návrh.'",
      "Mluvte jazykem businessu: úspora práce, maximalizace výnosu, snížení doby prodeje — ne o provizi makléře.",
      "Nabídněte bezplatný audit portfolia: 'Mohu zdarma zanalyzovat 2–3 vaše nemovitosti a ukázat, kde je prostor pro vyšší cenu.'",
      "Očekávejte námitku 'Máme svůj postup' — reagujte: 'Rozumím. Právě proto navrhuji audit zdarma — uvidíte, zda to přináší hodnotu.'",
      "Cíl hovoru není prodat, ale dostat se k decision makerovi — Miroslava je gatekeeperka."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „B2B akvizice".

KONTEXT: Miroslava Balounová je správce bytového fondu. Cold call s nabídkou pomoci při prodeji. Reaguje: „Tohle neřeším já, to je na vedení. A oni mají svůj postup." Je vyjednavačka, formální a odmítavá.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Zjištění decision makera (25 bodů): Zeptal se, kdo rozhoduje? Pokusil se dostat kontakt na vedení?
2. B2B jazyk (20 bodů): Mluvil o úspoře, výnosu a efektivitě? Nepoužil B2C prodejní styl?
3. Nabídka auditu (20 bodů): Nabídl audit portfolia zdarma jako vstupní krok?
4. Zvládnutí námitky „máme svůj postup" (20 bodů): Reagoval konstruktivně na odmítnutí? Neztratil nervy?
5. Posun kupředu (15 bodů): Domluvil kontakt na vedení, schůzku nebo alespoň zaslání nabídky?

POZNÁMKA K OBTÍŽNOSTI: Toto je MEDIUM scénář (B2B cold call). Očekává se B2B komunikace a zvládnutí gatekeepera. PENALIZUJ B2C přístup (mluvení o provizi místo úspoře) nebo vzdání se po prvním odmítnutí.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 14. Aleš Navrátil — Samoprodejce FSBO, COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-ales-navratil",
    tips: [
      "NIKDY nenapadejte jeho rozhodnutí prodávat sám — to ho pouze zatvrdí. Řekněte: 'Rozumím, spousta lidí to zkouší. Je to legitimní přístup.'",
      "Použijte data: 'Statisticky nemovitosti prodané s makléřem dosáhnou o 7–12 % vyšší ceny a prodají se o 40 % rychleji.'",
      "Nabídněte konzultaci bez závazku: 'Co kdybyste se zeptal na můj názor? 30 minut, žádný závazek, žádný podpis.'",
      "Zmíňte konkrétní hodnotu: právní servis, prověření kupce, marketing, profesionální fotografie — věci, které sám nezajistí.",
      "Připravte se na cynismus: 'Makléři nic nedělají a berou si za to 5 %.' Odpovězte věcně, ne defenzivně."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Samoprodejce (FSBO)".

KONTEXT: Aleš Navrátil prodává sám přes Bazoš a Sreality. Je pesimistický a aktivně odmítá makléře: „Makléři nic nedělají a berou si za to provizi." Voláte mu na jeho inzerát. Obtížnost 7/10.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Respekt k jeho rozhodnutí (15 bodů): Nenapadl jeho volbu prodávat sám? Neponižoval samoprodej?
2. Použití dat a argumentů (20 bodů): Použil statistiky nebo konkrétní data pro srovnání prodej s/bez makléře?
3. Zvládnutí cynismu a odmítání (25 bodů): Reagoval klidně na aktivní odmítání? Neztratil kontrolu? Neodpovídal defenzivně?
4. Nabídka konkrétní hodnoty (20 bodů): Zmínil konkrétní služby (právní servis, marketing, fotky)? Ne jen „já to prodám líp"?
5. Domluvení jakéhokoli kroku (20 bodů): Domluvil schůzku, konzultaci, zaslání analýzy nebo alespoň follow-up?

POZNÁMKA K OBTÍŽNOSTI: Toto je HARD scénář. Klient aktivně odmítá makléře. Očekává se pokročilé zvládnutí námitek, de-eskalace a prokázání konkrétní hodnoty. BUĎ PŘÍSNÝ — hodnoť přísněji než u easy/medium scénářů. TVRDĚ PENALIZUJ napadání klientova rozhodnutí nebo defenzivní reakce na cynismus.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 15. Andrea Kohoutová — B2B akvizice developer, COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-andrea-kohoutova",
    tips: [
      "V první větě uveďte obchodní hodnotu: 'Pomáháme developerům zkrátit dobu prodeje o 30 % a zvýšit marži.' Ne: 'Jsem makléř a rád bych vám nabídl služby.'",
      "Přežijte první odmítnutí — Andrea odmítne automaticky. Nechte ji domluvit, pak klidně pokračujte s dalším argumentem.",
      "Nabídněte pilotní spolupráci: 'Zkusme to na jednom projektu. Pokud výsledky nebudou, nic mě nedlužíte.'",
      "Mluvte jazykem developerů: ROI, doba obrátky, marže, cash flow — ne jazykem jednotlivých prodejců.",
      "Pokud říká 'To řeším sama', nabídněte: 'Rozumím. Mohu vám alespoň zaslat analýzu vašeho aktuálního portfolia? 3 stránky, 5 minut čtení.'"
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „B2B akvizice developer".

KONTEXT: Andrea Kohoutová je správce nemovitostí nebo developer. B2B cold call. Je extrémně nedůvěřivá a odmítá na první dobrou. Obtížnost 8/10. Paranoidní, odmítavá, přímá.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Okamžitá obchodní hodnota (20 bodů): Uvedl makléř obchodní hodnotu v první větě? ROI, úspora, marže?
2. Přežití prvního odmítnutí (25 bodů): Dokázal pokračovat po prvním tvrdém odmítnutí? Neztratil kontrolu?
3. B2B komunikace (15 bodů): Mluvil jazykem businessu? Nepoužil B2C prodejní styl?
4. Konkrétní návrh (20 bodů): Nabídl pilotní spolupráci, audit nebo konkrétní propozici? Ne obecné sliby?
5. Domluvení jakéhokoli kroku (20 bodů): Domluvil schůzku, zaslání analýzy nebo alespoň follow-up? Nebo získal kontakt na decision makera?

POZNÁMKA K OBTÍŽNOSTI: Toto je HARD scénář (B2B cold call na nedůvěřivého developera). BUĎ VELMI PŘÍSNÝ. Očekává se pokročilá B2B komunikace, zvládnutí extrémního odmítání a konkrétní obchodní propozice. TVRDĚ PENALIZUJ B2C přístup, vzdání se po prvním odmítnutí nebo absence konkrétní hodnoty.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 16. Agáta Králová — FSBO ledový mur, COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-agata-kralova",
    tips: [
      "Buďte extrémně stručný — máte 10 sekund. 'Dobrý den, mám kupce na nemovitost ve vaší lokalitě. Prodáváte stále?' Hotovo.",
      "Každé zbytečné slovo vás posílá blíž k zavěšení. Žádné 'Jak se máte?', žádné 'Nezaberu vám moc času.'",
      "Veďte s tvrdými daty: 'Podobná nemovitost ve vaší ulici se prodala za X Kč za Y dní.' Čísla jsou jediné, co ji zaujme.",
      "Respektujte její čas absolutně: pokud řekne 'nemám čas', nabídněte: 'Rozumím. Mohu vám za 30 sekund říct jen jednu věc?'",
      "Cíl je získat JAKÝKOLI další krok — i jen souhlas s SMS s odhadní cenou stačí."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Samoprodejce (FSBO) ledový mur".

KONTEXT: Agáta Králová prodává sama, má minimum času, přímý styl. Ledový mur. Každé slovo navíc je na škodu. Říká: „Nemám čas, co chcete?" Obtížnost 9/10. Zaneprázdněná, netrpělivá, odmítavá.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Stručnost otevření (25 bodů): Byl makléř stručný v první větě? Dostal se k podstatě do 10 sekund? KAŽDÉ zbytečné slovo = ztráta bodů.
2. Tvrdá data (20 bodů): Použil konkrétní čísla, ceny, dobu prodeje? Nebo jen obecné fráze?
3. Respekt k času (20 bodů): Respektoval její signály o nedostatku času? Neprotahoval hovor zbytečně?
4. Zvládnutí ledového odmítnutí (20 bodů): Přežil první odmítnutí? Reagoval klidně a stručně?
5. Získání jakéhokoli kroku (15 bodů): Domluvil cokoli — schůzku, SMS, e-mail, follow-up? Nebo aspoň zanechal dojem?

POZNÁMKA K OBTÍŽNOSTI: Toto je HARD scénář (obtížnost 9/10). BUĎ VELMI PŘÍSNÝ. Hlavní měřítko je STRUČNOST — makléř musí být extrémně konkrétní. TVRDĚ PENALIZUJ: dlouhé představení, prodejní fráze, ignorování signálů „nemám čas", jakékoli plýtvání slovy.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 17. Andrea Špačková — Follow-up po e-mailu (tichý typ), COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-andrea-spackova",
    tips: [
      "Zmíňte e-mail okamžitě a stručně: 'Psal jsem vám e-mail před dvěma týdny. Jen se chci zeptat, zda jste ho viděla.'",
      "Respektujte její strozí styl — odpovídejte stejně krátce. Pokud řekne 'Ano, viděla', nerozebírejte proč neodpověděla.",
      "Dejte jí jasný out: 'Má to pro vás smysl, nebo to není aktuální?' Tichý typ ocení možnost odmítnout bez vysvětlování.",
      "Nemlčte — pokud je ticho, nabídněte krátkou informaci: 'Jen pro zajímavost, nemovitosti ve vaší lokalitě se teď prodávají za...'",
      "Cíl je domluvit JAKÝKOLI krok — i jen souhlas se zasláním krátkého e-mailu s analýzou."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Follow-up po e-mailu (tichý typ)".

KONTEXT: Andrea Špačková dostala cold e-mail před 2 týdny bez odpovědi. Makléř volá. Odpovídá krátce a stroze, nechce se otevírat. Tichá, odměřená, uzavřená. Obtížnost 9/10.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Zmínění e-mailu (15 bodů): Zmínil e-mail okamžitě? Bylo jasné, proč volá?
2. Respekt ke strozímu stylu (25 bodů): Přizpůsobil se jejímu komunikačnímu stylu? Nemluvil příliš? Nebyl vtíravý?
3. Nabídnutí outu (20 bodů): Dal jí jasnou možnost odmítnout? Nesnažil se ji přemluvit násilím?
4. Zvládnutí ticha a krátkých odpovědí (20 bodů): Uměl pracovat s jejími krátkými odpověďmi? Nezahlcoval ji slovy?
5. Domluvení jakéhokoli kroku (20 bodů): Domluvil jakýkoli další krok? E-mail, SMS, krátký hovor?

POZNÁMKA K OBTÍŽNOSTI: Toto je HARD scénář. Klientka aktivně nekomunikuje. BUĎ VELMI PŘÍSNÝ. Hlavní měřítko je RESPEKT K JEJÍMU STYLU — makléř musí mluvit krátce, dát jí prostor a nesoudit ji za strozí odpovědi. TVRDĚ PENALIZUJ: zahlcování slovy, nucení k rozhovoru, ignorování jejího stylu, agresivní prodej.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 18. Marie Mrázková — Follow-up po e-mailu (paranoidní), COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-marie-mrazkova",
    tips: [
      "Zmíňte e-mail stručně a přejděte k faktům: 'Psal jsem vám ohledně nemovitosti. Mám pro vás konkrétní data z vaší lokality.'",
      "Prokažte důvěryhodnost fakty, ne sliby: 'Prodal jsem 3 nemovitosti ve vaší ulici za poslední rok' je lepší než 'Jsem profesionál'.",
      "Na paranoidní otázky ('Jak jste na mě přišel?', 'Co z toho máte?') odpovídejte klidně a přímočaře — nevyhýbejte se.",
      "Dejte jí out bez podmínek: 'Pokud to pro vás není aktuální, rozumím. Jen jsem vám chtěl dát informaci.'",
      "Nepokoušejte se ji přesvědčit v jednom hovoru — nabídněte zaslání referencí nebo analýzy e-mailem."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Follow-up po e-mailu (paranoidní)".

KONTEXT: Marie Mrázková dostala cold e-mail před 2 týdny bez odpovědi. Makléř volá. Marie je paranoidní a podezřívá ze skrytých motivů: „Proč mi voláte? Co z toho máte? Kdo vám dal moje číslo?" Obtížnost 9/10.

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Zmínění e-mailu a stručnost (15 bodů): Zmínil e-mail? Byl stručný v úvodu?
2. Prokázání důvěryhodnosti fakty (25 bodů): Použil konkrétní fakta, reference, čísla? Ne jen „jsem profesionál"?
3. Zvládnutí paranoidních otázek (25 bodů): Reagoval klidně a přímočaře na podezřívavé otázky? Nevyhýbal se?
4. Nabídnutí outu (15 bodů): Dal jí možnost odmítnout bez tlaku?
5. Domluvení jakéhokoli kroku (20 bodů): Domluvil zaslání referencí, analýzy nebo alespoň follow-up?

POZNÁMKA K OBTÍŽNOSTI: Toto je HARD scénář. Klientka je paranoidní a podezřívavá. BUĎ VELMI PŘÍSNÝ. Očekává se klidná, faktická komunikace a zvládnutí paranoidních otázek bez defenzivity. TVRDĚ PENALIZUJ: vyhýbavé odpovědi, defenzivní reakce, přehnané přesvědčování, ignorování jejích obav.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },

  // ───────────────────────────────────────────
  // 19. Františka Jelínková — Exspirace inzerátu (nejtěžší), COLD, hard
  // ───────────────────────────────────────────
  {
    id: "scenario-frantiska-jelinkova",
    tips: [
      "Absolutně NEŘÍKEJTE nic o neúspěchu: 'Vidím, že se vám nepodařilo prodat' je smrtelná věta. Řekněte: 'Analyzoval jsem trh ve vaší lokalitě a mám konkrétní návrh.'",
      "Přijďte s konkrétní analýzou připravenou předem: odhadní cena, srovnání s prodanými nemovitostmi, návrh strategie — ne obecné sliby.",
      "Připravte se na extrémní odpor: 'Makléři jsou podvodníci', 'Nechci nic slyšet', 'Nemám zájem'. Reagujte klidně, stručně a fakty.",
      "Nabídněte bezpodmínečný out: 'Rozumím, nechci vás obtěžovat. Jen jsem vám chtěl nabídnout bezplatnou analýzu. Můžu vám ji poslat?'",
      "Každá věta musí přinášet hodnotu — žádné výplňové fráze, žádné 'Jak se máte?', žádné zdlouhavé představování."
    ],
    control_prompt: `Jsi hodnotitel tréninkového hovoru realitního makléře. Hodnotíš scénář „Exspirace inzerátu (nejtěžší)".

KONTEXT: Františce Jelínkové vypršel inzerát přes jinou RK po 3 měsících bez prodeje. Obtížnost 10/10. Je paranoidní, odmítavá a agresivní. Podezírá ze skrytých motivů a každý makléř je pro ni podvodník. Říká: „Nevolejte mi, nemám zájem, makléři jsou podvodníci!"

HODNOTICÍ KRITÉRIA (celkem 100 bodů):
1. Taktní otevření bez zmínky o neúspěchu (20 bodů): Nezmínil neúspěch předchozího prodeje? Nepoužil slova jako „neprodalo", „nepovedlo", „vypršelo"?
2. Konkrétní analýza a hodnota (20 bodů): Přišel s konkrétními daty, analýzou nebo návrhem? Ne jen obecné sliby?
3. Zvládnutí extrémního odmítání (25 bodů): Přežil agresivní odmítnutí? Reagoval klidně? Neodpovídal agresivně nebo defenzivně?
4. De-eskalace a profesionalita (20 bodů): Dokázal de-eskalovat situaci? Snížil napětí? Udržel profesionální tón?
5. Získání alespoň dílčího souhlasu (15 bodů): Domluvil cokoli — zaslání analýzy, follow-up, souhlas s e-mailem? Nebo aspoň zanechal pozitivní dojem?

POZNÁMKA K OBTÍŽNOSTI: Toto je NEJTĚŽŠÍ scénář (obtížnost 10/10). BUĎ EXTRÉMNĚ PŘÍSNÝ. Makléř musí prokázat pokročilé de-eskalační schopnosti, odolnost vůči agresi a schopnost přinést hodnotu i pod tlakem. TVRDĚ PENALIZUJ: jakákoli zmínka o neúspěchu, defenzivní nebo agresivní reakce, příliš mnoho slov, vzdání se po prvním odmítnutí, obecné fráze bez hodnoty.

Výstup: Celkové skóre 0–100, stručné zdůvodnění ke každému kritériu.
NAVÍC VRAŤ: summary_good (jedna věta co makléř udělal dobře, nebo prázdný řetězec) a summary_improve (jedna věta co zlepšit, nebo prázdný řetězec)`
  },
];

// ═══════════════════════════════════════════════════════════════
// SPUŠTĚNÍ AKTUALIZACE
// ═══════════════════════════════════════════════════════════════

async function run() {
  console.log("=== Aktualizace scénářů: tips + control_prompt ===\n");

  let success = 0;
  let errors = 0;

  for (const scenario of scenarioUpdates) {
    const { error } = await supabase
      .from("scenarios")
      .update({
        tips: scenario.tips,
        control_prompt: scenario.control_prompt,
      })
      .eq("id", scenario.id);

    if (error) {
      console.error(`  ✗ ${scenario.id}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✓ ${scenario.id} (${scenario.tips.length} tips)`);
      success++;
    }
  }

  console.log(`\n=== Hotovo: ${success} úspěšných, ${errors} chyb ===`);
}

run();

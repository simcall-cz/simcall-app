import type { Scenario } from "@/types";

export const scenarios: Scenario[] = [
  // ═══════════════════════════════════════════
  // HOT LEADS (Obtížnost 1–2)
  // ═══════════════════════════════════════════
  {
    id: "scenario-eva-tomanova",
    title: "Zahraniční majitel",
    description:
      "Eva Tomanová žije v zahraničí a zdědila byt 3+1 v Praze 21. Napsala e-mail: 'Potřebuji prodat byt, ale nemůžu přijet. Je to vůbec možné?' Domluvte video call a vysvětlete plnou moc.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Zdůraznit, že zvládnete vše bez fyzické přítomnosti klientky",
      "Vysvětlit plnou moc jako nástroj pro vzdálený prodej",
      "Navrhnout video call jako první schůzku",
      "Domluvit konkrétní termín video hovoru",
    ],
    agentId: "agent-eva-tomanova",
  },
  {
    id: "scenario-karin-horackova",
    title: "Doporučení od známého",
    description:
      "Karin Horáčková volá, protože ji doporučil spokojený zákazník pan Novák. Říká: 'Pan Novák mi vás moc chválil, chci prodat byt.' Využijte přenesenou důvěru a domluvte schůzku.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Zmínit doporučujícího hned na začátku a poděkovat za důvěru",
      "Nemusíte tolik prodávat sebe, důvěra je přenesená",
      "Rychle přejít ke konkrétním krokům prodeje",
      "Domluvit osobní schůzku na konkrétní den a čas",
    ],
    agentId: "agent-karin-horackova",
  },
  {
    id: "scenario-karin-pitrova",
    title: "Návrat po čase",
    description:
      "Karin Pitrová volá sama po 6 měsících: 'Mluvili jsme loni, tehdy jsem ještě nebyla připravená. Teď už jsem.' Prodává byt 3+kk na Smíchově ve výstavbě. Jednejte rychle a konkrétně.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Podívat se do CRM co jste si zapsali, klientka to ocení",
      "Zjistit co se za půl roku změnilo v její situaci i na trhu",
      "Klientka se vrátila sama = silný signál, jednejte rozhodně",
      "Domluvit osobní schůzku ještě tento týden",
    ],
    agentId: "agent-karin-pitrova",
  },
  {
    id: "scenario-samuel-orel",
    title: "Kulový blesk: prodej i koupě",
    description:
      "Samuel Orel volá: 'Potřebuji prodat garsonku v Brně a zároveň koupit větší byt. Slyšel jsem, že to jde zařídit najednou. Zvládnete to?' Prodejte komplexní servis pro obě transakce.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Vysvětlit provázání časů: nejdřív prodat, pak kupovat, nebo paralelně",
      "Nabídnout hypoteční poradenství jako bonus",
      "Prokázat schopnost koordinace dvou transakcí",
      "Domluvit osobní schůzku s konkrétním plánem",
    ],
    agentId: "agent-samuel-orel",
  },
  {
    id: "scenario-milada-kejvalova",
    title: "Návrat po čase (opatrná)",
    description:
      "Milada Kejvalová volá po 6 měsících. Prodává opuštěný byt 2+1 v Praze 10. Am přátelská, ale formálnější. Stěhuje se do zahraničí a potřebuje rychlý proces s právní jistotou.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Navázat na předchozí kontakt z CRM a zjistit změny",
      "Zvládnout mírnou námitku o nedůvěře v realitky",
      "Prokázat zkušenost s rychlým a bezpečným prodejem",
      "Domluvit schůzku s konkrétním plánem postupu",
    ],
    agentId: "agent-milada-kejvalova",
  },
  // ═══════════════════════════════════════════
  // WARM LEADS (Obtížnost 3–4)
  // ═══════════════════════════════════════════
  {
    id: "scenario-adam-kohout",
    title: "Výběrové řízení: porovnávám makléře",
    description:
      "Adam Kohout otevřeně říká: 'Mluvím ještě se dvěma dalšími makléři, vybírám si. Proč bych si měl vybrat právě vás?' Prodává stavební pozemek v Novém Boru. Odlište se od konkurence.",
    category: "warm-lead",
    difficulty: "easy",
    objectives: [
      "Nehanit konkurenci, mluvit o vlastních výsledcích",
      "Přinést konkrétní čísla a reference, ne obecné sliby",
      "Nabídnout osobní schůzku s analýzou nemovitosti",
      "Domluvit bezplatný odhad nebo follow-up",
    ],
    agentId: "agent-adam-kohout",
  },
  {
    id: "scenario-hildegarda-kovarova",
    title: "Sondování trhu: jen se ptám",
    description:
      "Hildegarda Kovářová kontaktovala makléře přes portál: 'Jen se chci zeptat kolik by můj byt mohl stát. Zatím nic neprodávám, jen mě to zajímá.' Byt 5+kk v Praze 14 za 14,5 mil Kč.",
    category: "warm-lead",
    difficulty: "easy",
    objectives: [
      "Nevyvíjet tlak, klientka to okamžitě vycítí a odejde",
      "Nabídnout bezplatný odhad jako první krok bez závazků",
      "Domluvit follow-up za 2 až 3 měsíce, klientka ještě zraje",
      "Udržet klienta v CRM pro budoucí kontakt",
    ],
    agentId: "agent-hildegarda-kovarova",
  },
  {
    id: "scenario-ruzena-ruzickova",
    title: "Dotaz ze sociálních sítí",
    description:
      "Růžena Růžičková komentovala příspěvek na Facebooku: 'Jak rychle se teď prodávají byty v Brně?' Poté napsala soukromou zprávu. Prodává ateliér se střešní terasou v Brně.",
    category: "warm-lead",
    difficulty: "medium",
    objectives: [
      "Zmínit její komentář na Facebooku, bude příjemně překvapena",
      "Odpovědět upřímně s konkrétními daty z lokality Brno",
      "Zjistit zda prodává nebo kupuje, pak nabídnout pomoc",
      "Přejít z neformálního chatu k profesionální schůzce",
    ],
    agentId: "agent-ruzena-ruzickova",
    imageUrl: "/scenarios/ruzena-facebook.png",
  },
  {
    id: "scenario-leos-musil",
    title: "Reakce na leták",
    description:
      "Leoš Musil zavolal na číslo z letáku ve schránce: 'Volám na ten leták, ale makléřům moc nevěřím. Co ode mě vlastně chcete?' Je skeptický a nevěří slibům.",
    category: "warm-lead",
    difficulty: "medium",
    objectives: [
      "Ocenit, že zavolal, to samo o sobě není samozřejmost",
      "Připomenout konkrétní obsah letáku, ukáže to připravenost",
      "Nabídnout osobní setkání bez závazku jako první krok",
      "Domluvit bezplatný odhad nebo schůzku",
    ],
    agentId: "agent-leos-musil",
    imageUrl: "/scenarios/leos-letak.png",
  },
  // ═══════════════════════════════════════════
  // COLD LEADS (Obtížnost 5–10)
  // ═══════════════════════════════════════════
  {
    id: "scenario-eduard-langer",
    title: "Follow-up po cold e-mailu",
    description:
      "Eduard Langer dostal cold e-mail před 2 týdny bez odpovědi. Voláte jako follow-up. Eduard reaguje: 'Ten e-mail? Jo, viděl jsem ho, ale nestíhal jsem odpovědět.' Zjistěte, zda je zájem skutečný.",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Zmínit e-mail hned: 'Psal jsem vám před 2 týdny...'",
      "Být krátký, respektovat jeho čas, neopakovat celý e-mail",
      "Dát mu out: 'Je to pro vás stále aktuální?'",
      "Posunout věci kupředu nebo si jasně zjistit zájem",
    ],
    agentId: "agent-eduard-langer",
  },
  {
    id: "scenario-ilona-tykalova",
    title: "Slepé volání podle katastru",
    description:
      "Ilona Tykalová: telefonní číslo dohledáno z katastru nemovitostí. Klientka reaguje podezřívavě: 'Odkud máte moje číslo?' Máte kupce na danou lokalitu.",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Být upřímný odkud máte číslo, klientka to stejně zjistí",
      "Hned v první větě říct proč voláte: máte kupce na lokalitu",
      "Přejít k hodnotě dřív než klientka stihne zavěsit",
      "Překonat první odpor a domluvit další krok",
    ],
    agentId: "agent-ilona-tykalova",
  },
  {
    id: "scenario-leona-neumannova",
    title: "Exspirace inzerátu: ležák",
    description:
      "Leoně Neumannové právě vypršel inzerát přes jinou RK po 3 měsících. Nemovitost se neprodala. Voláte s nabídkou jiného přístupu. Je vyjednavačka a tlačí na podmínky.",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Neříkat 'vidím že se vám to neprodalo', to bolí a zavře ji",
      "Říct: 'Analyzoval jsem váš inzerát a mám nápad jak to zlepšit'",
      "Navrhnout konkrétní změny: cena, fotky, popis, načasování",
      "Domluvit schůzku s analýzou jejího předchozího inzerátu",
    ],
    agentId: "agent-leona-neumannova",
    imageUrl: "/scenarios/leona-inzerat.png",
  },
  {
    id: "scenario-miroslava-balounova",
    title: "B2B akvizice: správce nebo developer",
    description:
      "Miroslava Balounová je správce bytového fondu. Voláte s nabídkou pomoci při prodeji. Reaguje: 'Tohle neřeším já, to je na vedení. A oni mají svůj postup.'",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Zjistit kdo je zodpovědný za prodej nemovitostí",
      "Mluvit o úspoře práce a maximalizaci výnosu, ne o provizi",
      "Nabídnout audit portfolia zdarma jako vstupní krok",
      "Dostat se k decision makerovi",
    ],
    agentId: "agent-miroslava-balounova",
  },
  {
    id: "scenario-ales-navratil",
    title: "Samoprodejce (FSBO)",
    description:
      "Aleš Navrátil prodává sám přes Bazoš a Sreality bez makléře. Voláte mu. Je pesimistický a věří, že prodej skončí špatně. Aktivně odmítá spolupráci s makléři.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Překonat aktivní odmítání a cynismus",
      "Prokázat konkrétní přidanou hodnotu oproti samoprodeji",
      "Ukázat data o rychlosti a ceně prodejů s makléřem vs. bez",
      "Domluvit schůzku nebo alespoň follow-up hovor",
    ],
    agentId: "agent-ales-navratil",
    imageUrl: "/scenarios/ales-inzerat.png",
  },
  {
    id: "scenario-andrea-kohoutova",
    title: "B2B akvizice: developer",
    description:
      "Andrea Kohoutová je správce nemovitostí nebo developer. B2B cold call. Je extrémně nedůvěřivá a odmítá na první dobrou. Potřebujete prokázat okamžitou hodnotu.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Prokázat okamžitou obchodní hodnotu v první větě",
      "Přežít první vlnu odmítnutí bez ztráty kontroly",
      "Dostat se k decision makerovi s konkrétním návrhem",
      "Nabídnout pilotní spolupráci nebo audit zdarma",
    ],
    agentId: "agent-andrea-kohoutova",
  },
  {
    id: "scenario-agata-kralova",
    title: "Samoprodejce (FSBO): ledový mur",
    description:
      "Agáta Králová prodává sama přes inzertní portály. Má minimum času, přímý styl a nesnáší plýtvání. Ledový mur. Každé slovo navíc může být na škodu.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Být extrémně stručný a konkrétní od první věty",
      "Prolomit led jasnou hodnotou, ne prodejními frázemi",
      "Respektovat její čas a nepřidávat zbytečná slova",
      "Domluvit jakýkoli další krok, i jen follow-up hovor",
    ],
    agentId: "agent-agata-kralova",
    imageUrl: "/scenarios/agata-inzerat.png",
  },
  {
    id: "scenario-andrea-spackova",
    title: "Follow-up po cold e-mailu (tichý typ)",
    description:
      "Andrea Špačková dostala cold e-mail před 2 týdny bez odpovědi. Teď voláte. Odpovídá krátce a stroze, nechce se otevírat. Každé slovo navíc může být na škodu.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Zmínit e-mail okamžitě a respektovat její strozí styl",
      "Dát jí možnost odmítnout: 'Má to pro vás smysl?'",
      "Nenutit ji k rozhovoru, počkat na její tempo",
      "Domluvit jakýkoli další krok",
    ],
    agentId: "agent-andrea-spackova",
  },
  {
    id: "scenario-marie-mrazkova",
    title: "Follow-up po cold e-mailu (paranoidní)",
    description:
      "Marie Mrázková dostala cold e-mail před 2 týdny bez odpovědi. Teď voláte. Je paranoidní a podezřívá ze skrytých motivů. Potřebujete prokázat důvěryhodnost fakty.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Zmínit e-mail a být krátký, neopakovat celý obsah",
      "Prokázat důvěryhodnost fakty a referencemi, ne sliby",
      "Dát jí out a respektovat případné odmítnutí",
      "Posunout věci kupředu pokud je zájem skutečný",
    ],
    agentId: "agent-marie-mrazkova",
  },
  {
    id: "scenario-frantiska-jelinkova",
    title: "Exspirace inzerátu: nejnáročnější",
    description:
      "Františce Jelínkové právě vypršel inzerát přes jinou RK po 3 měsících bez prodeje. Obtížnost 10/10. Podezírá ze skrytých motivů a každý makléř je pro ni podvodník.",
    category: "cold-lead",
    difficulty: "hard",
    objectives: [
      "Neříkat že vidíte její neúspěšný inzerát, to ji uzavře",
      "Nabídnout konkrétní analýzu proč se to neprodalo",
      "Navrhnout konkrétní změny: cena, fotky, popis, načasování",
      "Získat alespoň dílčí souhlas s dalším krokem",
    ],
    agentId: "agent-frantiska-jelinkova",
    imageUrl: "/scenarios/frantiska-inzerat.png",
  },
];

import type { FAQ } from "@/types";

export const faqItems: FAQ[] = [
  // General (4)
  {
    question: "Co je SimCall a jak funguje?",
    answer:
      "SimCall je tréninková platforma pro realitní makléře, která využívá pokročilou umělou inteligenci k simulaci reálných telefonních hovorů. Trénujete s AI agenty, kteří představují různé typy klientů, a po každém hovoru získáte detailní zpětnou vazbu a doporučení ke zlepšení.",
    category: "general",
  },
  {
    question: "Pro koho je SimCall určen?",
    answer:
      "SimCall je navržen primárně pro realitní makléře, kteří chtějí zlepšit své dovednosti v cold callingu a telefonní komunikaci. Platforma je vhodná jak pro začínající makléře, kteří si chtějí vybudovat sebevědomí, tak pro zkušené profesionály, kteří chtějí zdokonalit svůj přístup. Nabízíme také řešení pro manažery realitních kanceláří, kteří chtějí trénovat celý tým.",
    category: "general",
  },
  {
    question: "Jak se liší trénink s AI od reálného hovoru?",
    answer:
      "Naši AI agenti jsou navrženi tak, aby co nejvěrněji simulovali reálné klienty. Reagují přirozeně, mají vlastní osobnosti, námitky a komunikační styly. Hlavní výhoda oproti reálným hovorům je, že můžete trénovat bez stresu, opakovat scénáře a získat okamžitou zpětnou vazbu. Není to náhrada za reálnou praxi, ale výborný doplněk, který vás připraví na různé situace.",
    category: "general",
  },
  {
    question: "Kolik času denně bych měl věnovat tréninku?",
    answer:
      "Doporučujeme 15-30 minut denně, tedy 2-3 tréninkové hovory. Pravidelnost je důležitější než délka. Naši nejúspěšnější uživatelé trénují každé ráno před tím, než začnou volat reálným klientům. Už po 2 týdnech pravidelného tréninku uvidíte měřitelné zlepšení ve vašich výsledcích.",
    category: "general",
  },

  // Technology (4)
  {
    question: "Jakou technologii AI hlasových agentů používáte?",
    answer:
      "Využíváme nejmodernější jazykové modely a technologii syntézy řeči optimalizovanou pro český jazyk. Naši AI agenti rozumí kontextu, reagují na vaše odpovědi v reálném čase a přizpůsobují svůj komunikační styl podle průběhu hovoru. Technologie je neustále vylepšována na základě zpětné vazby uživatelů.",
    category: "technology",
  },
  {
    question: "Funguje platforma v češtině?",
    answer:
      "Ano, SimCall je plně lokalizována do českého jazyka. AI agenti mluví česky s přirozeným přízvukem, všechny scénáře reflektují český realitní trh a zpětná vazba je kompletně v češtině. Pracujeme na tom, aby komunikace byla co nejpřirozenější a odpovídala reálným situacím na českém trhu.",
    category: "technology",
  },
  {
    question: "Jaké technické požadavky jsou potřeba?",
    answer:
      "K používání SimCall potřebujete pouze moderní webový prohlížeč (Chrome, Firefox, Safari nebo Edge), stabilní internetové připojení a mikrofon. Aplikace funguje na počítači, tabletu i mobilním telefonu. Není potřeba instalovat žádný software. Doporučujeme používat sluchátka s mikrofonem pro nejlepší kvalitu hovoru.",
    category: "technology",
  },
  {
    question: "Jak přesná je analýza hovorů?",
    answer:
      "Naše AI analýza hodnotí více než 20 parametrů každého hovoru, včetně tónu hlasu, tempa řeči, použitých technik, práce s námitkami a celkové struktury hovoru. Přesnost rozpoznávání řeči v češtině je nad 95 %. Analýza identifikuje i výplňová slova, přerušení a momenty váhání. Zpětná vazba je konzistentní a objektivní.",
    category: "technology",
  },

  // Pricing (4)
  {
    question: "Mohu si SimCall vyzkoušet zdarma?",
    answer:
      "Ano, nabízíme 14denní bezplatnou zkušební verzi plánu Professional bez nutnosti zadávat platební údaje. Během zkušební doby máte plný přístup ke všem AI agentům, scénářům a analytickým nástrojům. Po uplynutí zkušební doby se můžete rozhodnout, který plán vám vyhovuje.",
    category: "pricing",
  },
  {
    question: "Jaké jsou platební podmínky?",
    answer:
      "Nabízíme měsíční a roční fakturaci. U roční fakturace ušetříte přibližně 15 % oproti měsíční platbě. Přijímáme platební karty, bankovní převody a firemní faktury. Předplatné můžete kdykoliv zrušit, a to bez jakýchkoliv poplatků nebo sankcí.",
    category: "pricing",
  },
  {
    question: "Mohu kdykoliv změnit nebo zrušit předplatné?",
    answer:
      "Ano, plán můžete kdykoli upgradovat, downgradovat nebo zrušit přímo z nastavení vašeho účtu. Při upgradu se rozdíl v ceně rozpočítá na zbývající období. Při zrušení máte přístup do konce zaplaceného období. Nevyžadujeme žádnou minimální dobu závazku.",
    category: "pricing",
  },
  {
    question: "Nabízíte slevy pro větší týmy?",
    answer:
      "Ano, pro týmy nad 5 členů nabízíme individuální cenovou nabídku v rámci plánu Enterprise. Čím větší tým, tím výhodnější cena na uživatele. Kontaktujte nás pro nezávaznou konzultaci a kalkulaci přesné ceny pro váš tým. Nabízíme také speciální podmínky pro franšízové sítě.",
    category: "pricing",
  },

  // Security (4)
  {
    question: "Jak jsou chráněna moje data a nahrávky?",
    answer:
      "Bezpečnost dat je naší prioritou. Veškerá data jsou šifrována jak při přenosu (TLS 1.3), tak v úložišti (AES-256). Nahrávky hovorů jsou uloženy v zabezpečeném cloudovém prostředí na serverech v EU. Přístup k datům je striktně omezen a chráněn vícefaktorovou autentizací.",
    category: "security",
  },
  {
    question: "Je SimCall v souladu s GDPR?",
    answer:
      "Ano, plně dodržujeme nařízení GDPR. Zpracováváme pouze data nezbytná pro provoz služby. Máte plnou kontrolu nad svými daty, včetně práva na jejich export a smazání. Nahrávky hovorů jsou automaticky anonymizovány a můžete požádat o jejich kompletní vymazání kdykoli.",
    category: "security",
  },
  {
    question: "Kdo má přístup k mým tréninkovým hovorům?",
    answer:
      "K vašim nahrávkám máte přístup pouze vy a váš manažer (pokud používáte týmový plán a dáte k tomu souhlas). Žádná třetí strana nemá přístup k obsahu vašich hovorů. AI analýza probíhá automaticky a anonymně. Nahrávky nepoužíváme k trénování AI modelů bez vašeho výslovného souhlasu.",
    category: "security",
  },
  {
    question: "Jaké bezpečnostní certifikace máte?",
    answer:
      "Naše infrastruktura je provozována na certifikovaných cloudových službách s certifikacemi ISO 27001, SOC 2 Type II a provádíme pravidelné bezpečnostní audity. Penetrační testy provádíme čtvrtletně s nezávislou bezpečnostní firmou. Máme implementovány standardní bezpečnostní postupy včetně monitoringu a incident response plánu.",
    category: "security",
  },
];

import type { FAQ } from "@/types";

export const faqItems: FAQ[] = [
  // General (4)
  {
    question: "Co je SimCall a jak funguje?",
    answer:
      "SimCall je tréninková platforma pro realitní makléře. Zavoláte AI agentovi, který simuluje reálného klienta, reaguje přirozeně, má vlastní osobnost a námitky. Po každém hovoru dostanete detailní AI analýzu s konkrétními doporučeními ke zlepšení.",
    category: "general",
  },
  {
    question: "Pro koho je SimCall určen?",
    answer:
      "Primárně pro realitní makléře, ať už začínající, kteří si chtějí vybudovat sebevědomí při cold callingu, tak zkušené profesionály, kteří chtějí zlepšit svůj přístup. Plán Team je určen pro realitní kanceláře, které chtějí systematicky trénovat celý tým a sledovat pokrok zaměstnanců.",
    category: "general",
  },
  {
    question: "Mohu si SimCall vyzkoušet zdarma?",
    answer:
      "Ano. Po registraci získáte zdarma 30 tréninkových minut a přístup ke 2 AI agentům. Díky tomu si můžete vyzkoušet, jak platforma funguje, ještě než se rozhodnete pro placený balíček.",
    category: "general",
  },
  {
    question: "Jak se liší trénink s AI od reálného hovoru?",
    answer:
      "AI agenti reagují v reálném čase, mají různé osobnosti a scénáře odpovídají českému realitnímu trhu. Hlavní výhoda je, že můžete trénovat bez stresu, opakovat scénáře a dostanete okamžitou zpětnou vazbu. Není to náhrada za praxi, ale výborná příprava.",
    category: "general",
  },

  // Technology (4)
  {
    question: "Funguje platforma v češtině?",
    answer:
      "Ano, SimCall je kompletně v češtině. AI agenti mluví česky, scénáře reflektují český realitní trh a zpětná vazba je v češtině. Neustále pracujeme na tom, aby konverzace byla co nejpřirozenější.",
    category: "technology",
  },
  {
    question: "Jaké technické požadavky jsou potřeba?",
    answer:
      "Stačí moderní webový prohlížeč (Chrome, Firefox, Safari nebo Edge), stabilní internet a mikrofon. Funguje na počítači, tabletu i mobilu bez nutnosti cokoliv instalovat. Doporučujeme sluchátka s mikrofonem pro nejlepší kvalitu.",
    category: "technology",
  },
  {
    question: "Jak funguje AI analýza hovoru?",
    answer:
      "Po každém hovoru AI analyzuje váš výkon, hodnotí práci s námitkami, strukturu hovoru, tempo řeči a použité techniky. Dostanete konkrétní skóre, silné stránky i oblasti ke zlepšení s personalizovanými doporučeními.",
    category: "technology",
  },
  {
    question: "Kolik AI agentů je k dispozici?",
    answer:
      "Počet agentů závisí na vašem balíčku od 5 agentů v nejmenším Solo balíčku až po stovky v největších. Každý agent má jinou osobnost, obtížnost a scénář. Ve free verzi máte k dispozici 2 agenty pro vyzkoušení.",
    category: "technology",
  },

  // Pricing (4)
  {
    question: "Jak funguje ceník a platby?",
    answer:
      "Nabízíme balíčky Solo (pro jednotlivce, od 990 Kč/měs) a Team (pro firmy, od 7 490 Kč/měs). Platíte měsíčně za zvolený počet minut. Můžete platit kartou online nebo bankovním převodem na fakturu. Balíček lze kdykoliv změnit nebo zrušit.",
    category: "pricing",
  },
  {
    question: "Co je ve free verzi zdarma?",
    answer:
      "Po registraci dostanete 10 minut a přístup k 1 AI agentovi úplně zdarma. Můžete si vyzkoušet celý průběh — hovor, přepis, AI analýzu a doporučení. Žádná platební karta není potřeba.",
    category: "pricing",
  },
  {
    question: "Mohu kdykoliv změnit nebo zrušit balíček?",
    answer:
      "Ano, balíček můžete kdykoli upgradovat na vyšší nebo zrušit z nastavení účtu. Při zrušení máte přístup do konce zaplaceného období. Žádné skryté poplatky ani závazky.",
    category: "pricing",
  },
  {
    question: "Nabízíte Enterprise řešení pro velké týmy?",
    answer:
      "Ano. Enterprise plán zahrnuje Whitelabel branding, vlastní AI agenty a scénáře na míru, dedikovaného account manažera a individuální počet minut a agentů. Cena je dohodou, proto si domluvte nezávaznou schůzku a připravíme nabídku přímo pro vás.",
    category: "pricing",
  },

  // Security (4)
  {
    question: "Jak jsou chráněna moje data a nahrávky?",
    answer:
      "Veškerá data jsou šifrována při přenosu i v úložišti. Nahrávky hovorů jsou uloženy v zabezpečeném cloudovém prostředí na serverech v EU. Přístup k datům je striktně omezen.",
    category: "security",
  },
  {
    question: "Je SimCall v souladu s GDPR?",
    answer:
      "Ano, plně dodržujeme GDPR. Zpracováváme pouze data nezbytná pro provoz služby. Máte plnou kontrolu nad svými daty včetně práva na export a smazání. Nahrávky můžete kdykoliv vymazat.",
    category: "security",
  },
  {
    question: "Kdo má přístup k mým tréninkovým hovorům?",
    answer:
      "K nahrávkám máte přístup pouze vy. Pokud používáte Team plán, váš manažer vidí pouze souhrnné statistiky a analýzy a nemá přístup k samotným nahrávkám, pokud k tomu nedáte souhlas. Žádná třetí strana k vašim hovorům přístup nemá.",
    category: "security",
  },
  {
    question: "Používáte moje nahrávky k trénování AI?",
    answer:
      "Ne. Vaše nahrávky nepoužíváme k trénování AI modelů bez vašeho výslovného souhlasu. AI analýza probíhá automaticky a data z hovorů slouží výhradně pro vaši zpětnou vazbu.",
    category: "security",
  },
];

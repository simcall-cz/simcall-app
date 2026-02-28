import type { Lesson } from "@/types/dashboard";

export const lessons: Lesson[] = [
  // Beginner (3)
  {
    id: "lesson-1",
    title: "Základy cold callingu",
    description:
      "Naučte se strukturu efektivního cold callu od prvního slova po uzavření. Pochopte psychologii prvního kontaktu a jak překonat strach z telefonování.",
    difficulty: "beginner",
    category: "Cold calling",
    duration: "25 min",
    completed: true,
    progress: 100,
  },
  {
    id: "lesson-2",
    title: "Jak se profesionálně představit",
    description:
      "Naučte se vytvořit silný první dojem za prvních 15 sekund hovoru. Představení, důvod volání a přechod k otázkám. Nacvičte si svůj elevator pitch.",
    difficulty: "beginner",
    category: "Komunikace",
    duration: "20 min",
    completed: true,
    progress: 100,
  },
  {
    id: "lesson-3",
    title: "Aktivní naslouchání a kladení otázek",
    description:
      "Zjistěte, jak správně naslouchat klientovi a klást otázky, které odhalí jeho skutečné potřeby. Otevřené vs. uzavřené otázky a technika trychtýře.",
    difficulty: "beginner",
    category: "Komunikace",
    duration: "30 min",
    completed: true,
    progress: 100,
  },

  // Intermediate (3)
  {
    id: "lesson-4",
    title: "Práce s námitkami",
    description:
      "Naučte se identifikovat a překonávat nejčastější námitky klientů: 'nemám čas', 'prodám sám', 'provize je moc vysoká'. Technika feel-felt-found a další metody.",
    difficulty: "intermediate",
    category: "Námitky",
    duration: "35 min",
    completed: true,
    progress: 100,
  },
  {
    id: "lesson-5",
    title: "Vybudování hodnoty a diferenciace",
    description:
      "Jak prezentovat svou jedinečnou hodnotu klientovi. Proč by si měl vybrat právě vás? Naučte se artikulovat své konkurenční výhody a prezentovat výsledky.",
    difficulty: "intermediate",
    category: "Prodejní dovednosti",
    duration: "40 min",
    completed: false,
    progress: 65,
  },
  {
    id: "lesson-6",
    title: "Techniky uzavírání schůzek",
    description:
      "Ovládněte různé techniky uzavírání: alternativní uzavření, předpokládané uzavření, uzavření shrnutím. Kdy a jak požádat o schůzku tak, aby klient řekl ano.",
    difficulty: "intermediate",
    category: "Prodejní dovednosti",
    duration: "35 min",
    completed: false,
    progress: 30,
  },

  // Advanced (3)
  {
    id: "lesson-7",
    title: "Vyjednávání o provizi jako profík",
    description:
      "Pokročilé techniky vyjednávání provize. Jak obhájit svou hodnotu, nabídnout flexibilní struktury odměn a najít win-win řešení s náročnými klienty.",
    difficulty: "advanced",
    category: "Vyjednávání",
    duration: "45 min",
    completed: false,
    progress: 10,
  },
  {
    id: "lesson-8",
    title: "Práce s investory a portfoliem",
    description:
      "Jak komunikovat se zkušenými investory, rozumět jejich potřebám, mluvit jejich jazykem a nabídnout přidanou hodnotu v podobě portfoliového přístupu.",
    difficulty: "advanced",
    category: "Specializace",
    duration: "50 min",
    completed: false,
    progress: 0,
  },
  {
    id: "lesson-9",
    title: "Psychologie prodeje nemovitostí",
    description:
      "Hloubková analýza psychologických principů v prodeji: kotvení, sociální důkaz, reciprocita, urgence a jak je eticky využít při prodeji nemovitostí.",
    difficulty: "advanced",
    category: "Psychologie",
    duration: "55 min",
    completed: false,
    progress: 0,
  },
];

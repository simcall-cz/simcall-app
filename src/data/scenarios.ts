import type { Scenario } from "@/types";

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    title: "První kontakt s horkým leadem",
    description:
      "Klient vyplnil formulář na vašem webu a chce prodat nemovitost. Zavolejte mu do 5 minut a dohodněte si schůzku. Klíčové je rychlé reagování a profesionální přístup.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Představit se a navázat kontakt do 30 sekund",
      "Zjistit základní informace o nemovitosti",
      "Dohodnout osobní schůzku do 48 hodin",
      "Získat kontaktní údaje pro follow-up",
    ],
    agentId: "agent-2",
  },
  {
    id: "scenario-2",
    title: "Cold call z doporučení",
    description:
      "Voláte potenciálnímu klientovi, kterého vám doporučil jeho kolega. Klient neočekává váš hovor a nemá zájem o služby makléře. Vzbuďte jeho zájem.",
    category: "cold-lead",
    difficulty: "medium",
    objectives: [
      "Zmínit doporučení a navázat důvěru",
      "Překonat počáteční odmítnutí",
      "Vzbudit zájem o tržní analýzu nemovitosti",
      "Dohodnout alespoň krátkou schůzku nebo follow-up hovor",
    ],
    agentId: "agent-4",
  },
  {
    id: "scenario-3",
    title: "Obhajoba proti konkurenci",
    description:
      "Klientka porovnává vaši nabídku s dalšími 4 makléři. Musíte ji přesvědčit, že právě vy jste tou nejlepší volbou. Připravte si argumenty a odlište se.",
    category: "competitive",
    difficulty: "medium",
    objectives: [
      "Zjistit, co nabízí konkurence",
      "Prezentovat unikátní hodnotu vašich služeb",
      "Vysvětlit marketingovou strategii pro její nemovitost",
      "Uzavřít exkluzivní smlouvu",
    ],
    agentId: "agent-3",
  },
  {
    id: "scenario-4",
    title: "Vyjednávání o provizi",
    description:
      "Zkušený podnikatel chce snížit vaši provizi na minimum. Musíte obhájit hodnotu svých služeb a najít kompromis, který je výhodný pro obě strany.",
    category: "negotiation",
    difficulty: "hard",
    objectives: [
      "Vyslechnout požadavky klienta na provizi",
      "Prezentovat hodnotu za stanovenou provizi",
      "Nabídnout flexibilní strukturu odměny",
      "Dosáhnout dohody bez nadměrné slevy",
    ],
    agentId: "agent-6",
  },
  {
    id: "scenario-5",
    title: "Získání exkluzivní zakázky",
    description:
      "Skeptická majitelka nemovitosti zvažuje, zda vůbec potřebuje makléře. Měla špatné zkušenosti v minulosti. Přesvědčte ji o vaší profesionalitě.",
    category: "listing",
    difficulty: "hard",
    objectives: [
      "Zjistit důvody předchozí špatné zkušenosti",
      "Adresovat konkrétní obavy klientky",
      "Prezentovat reference a úspěšné případy",
      "Podepsat exkluzivní zprostředkovatelskou smlouvu",
    ],
    agentId: "agent-1",
  },
  {
    id: "scenario-6",
    title: "Práce s nerozhodným klientem",
    description:
      "Klientka chce prodat, ale neustále odkládá rozhodnutí. Toto je váš třetí hovor s ní. Pomozte jí překonat strach a posunout se vpřed.",
    category: "negotiation",
    difficulty: "hard",
    objectives: [
      "Identifikovat hlavní strach nebo blok",
      "Poskytnout data o aktuálním stavu trhu",
      "Navrhnout krok po kroku postup",
      "Získat závazek k dalšímu konkrétnímu kroku",
    ],
    agentId: "agent-5",
  },
  {
    id: "scenario-7",
    title: "Rychlý prodej pod tlakem",
    description:
      "Klientka potřebuje prodat byt do 6 týdnů. Je ve stresu a chce okamžitou akci. Ukažte jí, že to zvládnete, a dohodněte se na dalších krocích.",
    category: "hot-lead",
    difficulty: "easy",
    objectives: [
      "Uklidnit klientku a ukázat profesionalitu",
      "Představit plán rychlého prodeje",
      "Dohodnout se na realistické ceně",
      "Naplánovat focení a inzerci do 48 hodin",
    ],
    agentId: "agent-9",
  },
  {
    id: "scenario-8",
    title: "Prezentace pro investora",
    description:
      "Zkušený investor hledá makléře pro správu portfolia. Testuje vaše znalosti trhu, investičních strategií a schopnost dlouhodobé spolupráce.",
    category: "listing",
    difficulty: "hard",
    objectives: [
      "Prokázat znalost investičního trhu nemovitostí",
      "Prezentovat analýzu jeho portfolia",
      "Navrhnout strategii prodeje vybraných nemovitostí",
      "Dohodnout podmínky dlouhodobé spolupráce",
    ],
    agentId: "agent-10",
  },
  {
    id: "scenario-9",
    title: "Empatický přístup k citlivé situaci",
    description:
      "Klientka prodává byt po rozvodu. Je emocionálně rozrušená a potřebuje makléře, který ji provede procesem s pochopením a citem.",
    category: "listing",
    difficulty: "medium",
    objectives: [
      "Prokázat empatii a porozumění situaci",
      "Získat důvěru klientky",
      "Zjistit praktické požadavky na prodej",
      "Navrhnout citlivý, ale efektivní plán prodeje",
    ],
    agentId: "agent-7",
  },
  {
    id: "scenario-10",
    title: "Technicky orientovaná prezentace",
    description:
      "IT manažer chce data, statistiky a digitální řešení. Připravte si analytickou prezentaci a ukažte, že umíte pracovat s moderními nástroji.",
    category: "competitive",
    difficulty: "medium",
    objectives: [
      "Prezentovat cenovou mapu a statistiku prodejů",
      "Ukázat digitální marketingovou strategii",
      "Vysvětlit proces prodeje krok za krokem s daty",
      "Dohodnout spolupráci na základě měřitelných cílů",
    ],
    agentId: "agent-8",
  },
];

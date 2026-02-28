-- ============================================
-- ELITE AI - Seed Data
-- ============================================

-- ============================================
-- Agents
-- ============================================

insert into agents (id, name, personality, description, difficulty, avatar_initials, traits, elevenlabs_agent_id, example_scenario) values
(
  'agent-1',
  'Jana Nováková',
  'Skeptický klient',
  'Jana je zkušená majitelka nemovitosti, která už měla špatné zkušenosti s makléři. Je nedůvěřivá, klade těžké otázky a hledá důkazy o vaší kompetenci. Musíte si získat její důvěru.',
  'hard',
  'JN',
  '["Nedůvěřivá", "Analytická", "Přímočará", "Náročná na detaily", "Porovnává reference"]',
  null,
  'Jana prodává byt 3+1 v Praze a zvažuje, zda vůbec potřebuje makléře. Přesvědčte ji o vaší hodnotě.'
),
(
  'agent-2',
  'Petr Svoboda',
  'Horký lead',
  'Petr aktivně hledá makléře pro prodej svého rodinného domu. Je motivovaný, ale chce rychlé jednání a jasné odpovědi. Ideální klient, pokud ho nepropásnete.',
  'easy',
  'PS',
  '["Motivovaný", "Rozhodný", "Časově omezený", "Přímý", "Orientovaný na výsledek"]',
  'agent_7701kjft1mnxfc3brzedqrk5gvjk',
  'Petr právě vyplnil formulář na vašem webu. Chce prodat dům do 3 měsíců kvůli stěhování za prací.'
),
(
  'agent-3',
  'Marie Dvořáková',
  'Porovnávač makléřů',
  'Marie oslovila 5 různých realitních kanceláří a systematicky porovnává nabídky. Zajímá ji provize, marketing, reference a konkrétní plán prodeje.',
  'medium',
  'MD',
  '["Systematická", "Porovnává nabídky", "Zaměřená na hodnotu", "Vyjednává provizi", "Chce konkrétní čísla"]',
  null,
  'Marie prodává luxusní vilu a potřebuje makléře, který se odliší od konkurence. Má už 3 nabídky.'
),
(
  'agent-4',
  'Tomáš Černý',
  'Cold lead',
  'Tomáš neuvažuje o prodeji, ale vlastní investiční byt. Je zaneprázdněný, nemá čas a nemá pocit, že makléře potřebuje. Musíte vzbudit jeho zájem.',
  'medium',
  'TČ',
  '["Nezainteresovaný", "Zaneprázdněný", "Stručný", "Odmítavý", "Racionální"]',
  null,
  'Voláte Tomášovi po doporučení od jeho kolegy. Nemá tušení, kdo jste, a nemá čas na telefonát.'
),
(
  'agent-5',
  'Eva Procházková',
  'Nerozhodný klient',
  'Eva chce prodat byt, ale neustále odkládá rozhodnutí. Bojí se špatného načasování trhu, nevýhodného prodeje a celkově se nedokáže rozhodnout.',
  'hard',
  'EP',
  '["Nerozhodná", "Úzkostlivá", "Odkládá rozhodnutí", "Potřebuje jistotu", "Ptá se stále dokola"]',
  null,
  'Eva se s vámi baví už potřetí. Pokaždé říká, že si to ještě rozmyslí. Pomozte jí překonat strach.'
),
(
  'agent-6',
  'Karel Veselý',
  'Vyjednávač provize',
  'Karel je podnikatel, který se snaží vyjednat co nejnižší provizi. Je zkušený vyjednavač, zná tržní sazby a tlačí na slevy. Musíte obhájit hodnotu svých služeb.',
  'hard',
  'KV',
  '["Tvrdý vyjednavač", "Orientovaný na cenu", "Zkušený v obchodu", "Porovnává provize", "Sebejistý"]',
  null,
  'Karel chce prodat komerční prostor, ale požaduje provizi maximálně 2 %. Standardní sazba je 4 %.'
),
(
  'agent-7',
  'Lucie Králová',
  'Emocionální prodejce',
  'Lucie prodává byt po rozvodu a celá situace je pro ni emocionálně náročná. Potřebuje empatického makléře, který ji provede procesem s citem.',
  'medium',
  'LK',
  '["Emocionální", "Citlivá", "Potřebuje empatii", "Nepraktická", "Váhavá"]',
  null,
  'Lucie vám volá, protože se dozvěděla, že musí prodat společný byt. Je rozrušená a potřebuje oporu.'
),
(
  'agent-8',
  'Martin Horák',
  'Technický klient',
  'Martin je IT manažer, který přistupuje k prodeji nemovitosti analyticky. Chce data, statistiky, srovnání tržních cen a digitální řešení.',
  'medium',
  'MH',
  '["Analytický", "Datově orientovaný", "Technicky zdatný", "Logický", "Chce statistiky"]',
  null,
  'Martin chce vidět cenovou mapu, statistiku prodejů v lokalitě a váš marketingový plán v digitálu.'
),
(
  'agent-9',
  'Alena Benešová',
  'Spěchající klient',
  'Alena potřebuje prodat byt rychle kvůli finanční situaci. Nemá čas na dlouhé vysvětlování, chce okamžitou akci a rychlý výsledek.',
  'easy',
  'AB',
  '["Spěchající", "Orientovaná na rychlost", "Přímočará", "Stresovaná", "Rozhodná"]',
  null,
  'Alena potřebuje prodat byt do 6 týdnů. Chce vědět, jestli to zvládnete, a co pro to uděláte hned.'
),
(
  'agent-10',
  'Jiří Marek',
  'Zkušený investor',
  'Jiří vlastní portfolio nemovitostí a hledá makléře pro dlouhodobou spolupráci. Je náročný, ale loajální ke kvalitním partnerům. Testuje vaše znalosti trhu.',
  'hard',
  'JM',
  '["Zkušený", "Znalý trhu", "Strategický", "Testuje znalosti", "Hledá partnera"]',
  null,
  'Jiří má 8 bytů k pronájmu a zvažuje prodej 3 z nich. Hledá makléře, který rozumí investičním nemovitostem.'
);

-- ============================================
-- Scenarios
-- ============================================

insert into scenarios (id, title, description, category, difficulty, objectives, agent_id) values
(
  'scenario-1',
  'První kontakt s horkým leadem',
  'Klient vyplnil formulář na vašem webu a chce prodat nemovitost. Zavolejte mu do 5 minut a dohodněte si schůzku. Klíčové je rychlé reagování a profesionální přístup.',
  'hot-lead',
  'easy',
  '["Představit se a navázat kontakt do 30 sekund", "Zjistit základní informace o nemovitosti", "Dohodnout osobní schůzku do 48 hodin", "Získat kontaktní údaje pro follow-up"]',
  'agent-2'
),
(
  'scenario-2',
  'Cold call z doporučení',
  'Voláte potenciálnímu klientovi, kterého vám doporučil jeho kolega. Klient neočekává váš hovor a nemá zájem o služby makléře. Vzbuďte jeho zájem.',
  'cold-lead',
  'medium',
  '["Zmínit doporučení a navázat důvěru", "Překonat počáteční odmítnutí", "Vzbudit zájem o tržní analýzu nemovitosti", "Dohodnout alespoň krátkou schůzku nebo follow-up hovor"]',
  'agent-4'
),
(
  'scenario-3',
  'Obhajoba proti konkurenci',
  'Klientka porovnává vaši nabídku s dalšími 4 makléři. Musíte ji přesvědčit, že právě vy jste tou nejlepší volbou. Připravte si argumenty a odlište se.',
  'competitive',
  'medium',
  '["Zjistit, co nabízí konkurence", "Prezentovat unikátní hodnotu vašich služeb", "Vysvětlit marketingovou strategii pro její nemovitost", "Uzavřít exkluzivní smlouvu"]',
  'agent-3'
),
(
  'scenario-4',
  'Vyjednávání o provizi',
  'Zkušený podnikatel chce snížit vaši provizi na minimum. Musíte obhájit hodnotu svých služeb a najít kompromis, který je výhodný pro obě strany.',
  'negotiation',
  'hard',
  '["Vyslechnout požadavky klienta na provizi", "Prezentovat hodnotu za stanovenou provizi", "Nabídnout flexibilní strukturu odměny", "Dosáhnout dohody bez nadměrné slevy"]',
  'agent-6'
),
(
  'scenario-5',
  'Získání exkluzivní zakázky',
  'Skeptická majitelka nemovitosti zvažuje, zda vůbec potřebuje makléře. Měla špatné zkušenosti v minulosti. Přesvědčte ji o vaší profesionalitě.',
  'listing',
  'hard',
  '["Zjistit důvody předchozí špatné zkušenosti", "Adresovat konkrétní obavy klientky", "Prezentovat reference a úspěšné případy", "Podepsat exkluzivní zprostředkovatelskou smlouvu"]',
  'agent-1'
),
(
  'scenario-6',
  'Práce s nerozhodným klientem',
  'Klientka chce prodat, ale neustále odkládá rozhodnutí. Toto je váš třetí hovor s ní. Pomozte jí překonat strach a posunout se vpřed.',
  'negotiation',
  'hard',
  '["Identifikovat hlavní strach nebo blok", "Poskytnout data o aktuálním stavu trhu", "Navrhnout krok po kroku postup", "Získat závazek k dalšímu konkrétnímu kroku"]',
  'agent-5'
),
(
  'scenario-7',
  'Rychlý prodej pod tlakem',
  'Klientka potřebuje prodat byt do 6 týdnů. Je ve stresu a chce okamžitou akci. Ukažte jí, že to zvládnete, a dohodněte se na dalších krocích.',
  'hot-lead',
  'easy',
  '["Uklidnit klientku a ukázat profesionalitu", "Představit plán rychlého prodeje", "Dohodnout se na realistické ceně", "Naplánovat focení a inzerci do 48 hodin"]',
  'agent-9'
),
(
  'scenario-8',
  'Prezentace pro investora',
  'Zkušený investor hledá makléře pro správu portfolia. Testuje vaše znalosti trhu, investičních strategií a schopnost dlouhodobé spolupráce.',
  'listing',
  'hard',
  '["Prokázat znalost investičního trhu nemovitostí", "Prezentovat analýzu jeho portfolia", "Navrhnout strategii prodeje vybraných nemovitostí", "Dohodnout podmínky dlouhodobé spolupráce"]',
  'agent-10'
),
(
  'scenario-9',
  'Empatický přístup k citlivé situaci',
  'Klientka prodává byt po rozvodu. Je emocionálně rozrušená a potřebuje makléře, který ji provede procesem s pochopením a citem.',
  'listing',
  'medium',
  '["Prokázat empatii a porozumění situaci", "Získat důvěru klientky", "Zjistit praktické požadavky na prodej", "Navrhnout citlivý, ale efektivní plán prodeje"]',
  'agent-7'
),
(
  'scenario-10',
  'Technicky orientovaná prezentace',
  'IT manažer chce data, statistiky a digitální řešení. Připravte si analytickou prezentaci a ukažte, že umíte pracovat s moderními nástroji.',
  'competitive',
  'medium',
  '["Prezentovat cenovou mapu a statistiku prodejů", "Ukázat digitální marketingovou strategii", "Vysvětlit proces prodeje krok za krokem s daty", "Dohodnout spolupráci na základě měřitelných cílů"]',
  'agent-8'
);

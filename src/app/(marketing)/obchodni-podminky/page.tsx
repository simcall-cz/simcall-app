import { Container } from "@/components/shared/container";

export const metadata = {
  title: "Obchodní podmínky | SimCall",
  description: "Všeobecné obchodní podmínky platformy SimCall pro trénink hovorů s AI.",
};

export default function ObchodniPodminkyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-900 py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="inline-block text-xs font-medium text-neutral-400 tracking-widest uppercase mb-3">
              Právní dokumenty
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Všeobecné obchodní podmínky (VOP)</h1>
            <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
              Platné a účinné od 25. 3. 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-neutral prose-sm sm:prose-base prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-4">
            
            <p className="font-semibold lead">
              Tyto Všeobecné obchodní podmínky (dále jen „<strong>VOP</strong>“) upravují vzájemná práva a povinnosti mezi poskytovatelem jakožto provozovatelem webové aplikace SimCall a uživatelem této aplikace („<strong>Uživatel</strong>“). Tyto VOP se řídí právem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník (dále jen „<strong>NOZ</strong>“), a zákonem č. 634/1992 Sb., o ochraně spotřebitele, ve znění pozdějších předpisů.
            </p>

            <h2>1. Úvodní ustanovení a definice pojmů</h2>
            <p>
              1.1 <strong>Poskytovatel:</strong> Filip Mojik, IČO: 17501750, se sídlem Jižní 2020, Rychvald 735 32, Česká republika. Kontaktní údaje – e-mail: simcallcz@gmail.com (dále též jen „<strong>Provozovatel</strong>“).
            </p>
            <p>
              1.2 <strong>Služba (Platforma):</strong> Webová aplikace provozovaná Provozovatelem dostupná na internetové adrese simcall.cz, která využívá umělou inteligenci k tréninku prodejních, nákupních a jiných asertivních konverzací.
            </p>
            <p>
              1.3 <strong>Uživatel:</strong> Fyzická nebo právnická osoba, která uzavřela s Provozovatelem smlouvu o poskytování Služeb.<br/>
              <strong>Podnikatelem</strong> je osoba, která samostatně vykonává výdělečnou činnost, nebo nakupuje služby za účelem svého podnikání (typicky zadáním IČO při registraci či objednávce).<br/>
              <strong>Spotřebitelem</strong> je fyzická osoba, která mimo rámec své podnikatelské činnosti uzavírá Smlouvu s Provozovatelem.
            </p>
            <p>
              1.4 <strong>Předmět Smlouvy:</strong> Užívání digitálního obsahu a služeb prostřednictvím vzdáleného přístupu (SaaS) a udělení omezené, odvolatelné, nepřenosné, nevýhradní licence k užívání Platformy.
            </p>

            <h2>2. Založení účtu a uzavření smlouvy</h2>
            <p>
              2.1 Využívání placených funkcí Služby je podmíněno provedením registrace a vytvořením uživatelského účtu.
            </p>
            <p>
              2.2 K uzavření smlouvy dochází okamžikem úspěšné registrace nebo závazným odsouhlasením příslušného tarifu z nabídky a odesláním platby. Uživatel při registraci stvrzuje, že se s těmito VOP a pravidly pro ochranu osobních údajů plně seznámil.
            </p>
            <p>
              2.3 Uživatel je povinen uvádět výhradně pravdivé a aktuální údaje. Provozovatel je oprávněn přístup Uživateli omezit nebo jeho účet zablokovat, zjistí-li poskytnutí nepravdivých údajů či obcházení limitů (např. zneužití bezplatného Demo plánu duplicitními účty).
            </p>

            <h2>3. Tarifní plány a cenové podmínky</h2>
            <p>
              3.1 Aktuální specifikace objemu minut, funkcí a ceny u tarifních plánů jsou dostupné na internetové adrese simcall.cz/cenik a v klientském účtu (sekce „Můj balíček“).
            </p>
            <p>
              3.2 Provozovatel je oprávněn ceny a rozsah služeb jednostranně měnit s platností na následující nová zúčtovací období; o změně tarifů informuje Uživatele vždy s dostatečným předstihem.
            </p>
            <p>
              3.3 V rámci tarifu má Uživatel přidělený omezený počet kreditů („<strong>Minut</strong>“) pro volání s AI. Nevyužité minuty primárně propadají k poslednímu dni daného fakturačního období s obnovením nového limitu po úhradě další platební periody, pokud aktuální pravidla v sekci Ceník výslovně nestanoví jinak.
            </p>
            
            <h2>4. Poskytování služeb, Platba a Odstoupení od smlouvy</h2>
            <p>
              4.1 <strong>Platby:</strong> Probíhají formou automaticky obnovovaného předplatného přes platební portál provozovaný třetí stranou (zpravidla Stripe). Zrušení opakované platby provádí Uživatel přímo v aplikaci v sekci Můj balíček.
            </p>
            <p>
              4.2 <strong>Odstoupení Spotřebitele a poměrná úhrada:</strong> Uživatel, který je Spotřebitelem, má právo odstoupit od Smlouvy bez udání důvodu ve lhůtě 14 dnů od jejího uzavření. Pokud Spotřebitel během objednávkového procesu výslovně požádal o započetí poskytování Služeb (okamžité připsání minut) před uplynutím této lhůty, má Provozovatel v případě platného odstoupení nárok na úhradu poměrné části sjednané ceny za plnění poskytnuté do okamžiku odstoupení. Poměrná část se vypočítá ze skutečně vyčerpaných minut. V případě úplného vyčerpání zakoupených minut činí poměrná část 100 % ceny a Spotřebiteli nevzniká nárok na vrácení zaplacené částky.
            </p>
            <p>
              4.3 <strong>Pravidla pro Podnikatele (B2B):</strong> Uživatel, který je Podnikatelem, nemá právo na odstoupení od Smlouvy a vrácení sjednané ceny. Zaplacené poplatky za předplatné jsou u Podnikatelů konečné a nevratné.
            </p>
            <p>
              4.4 <strong>Ukončení užívání (Downgrade/Cancellation):</strong> Uživatel může předplatné kdykoli zrušit v sekci „Můj balíček“. Nebude mu zúčtováno další období. Již zaplacený přístup a zbývající minuty z aktuálního období zůstanou funkční až do konce fakturačního cyklu.
            </p>

            <h2>5. Práva a povinnosti Uživatele a ochrana platformy</h2>
            <p>
              5.1 Uživatel je oprávněn užívat Službu výhradně v souladu s těmito VOP a platnými právními předpisy.
            </p>
            <p>
              5.2 <strong>Zakázané jednání:</strong> Je výslovně zakázáno ohrožovat stabilitu serverů Provozovatele; využívat automatizované skripty k těžbě dat (mimo povolené API); požadovat v konverzacích s AI protiprávní či extrémistický obsah; redistribuovat či poskytovat účet dalším neoprávněným osobám.
            </p>
            <p>
              5.3 Při hrubém porušení povinností může Provozovatel zablokovat přístup k účtu a odstranit Uživatelova data.
            </p>
            <p>
              5.4 Uživatel bere na vědomí, že konverzace s umělou inteligencí jsou v systému Služby ukládány pro analytické účely a pro zobrazení historického záznamu Uživateli.
            </p>

            <h2>6. Odpovědnost Provozovatele a Reklamace</h2>
            <p>
              6.1 <strong>Omezení odpovědnosti (B2B):</strong> U Smluv uzavřených s Podnikateli se Služba poskytuje ve stavu „jak stojí a leží“ (as is). Provozovatel neodpovídá za případné přímé i nepřímé škody plynoucí z aplikování postřehů z AI v reálném nasazení. Odpovědnost za újmu vůči Podnikateli se omezuje na částku odpovídající uhrazené roční sazbě za Službu; odpovědnost za ušlý zisk Podnikatele je zcela vyloučena.
            </p>
            <p>
              6.2 <strong>Odpovědnost (B2C):</strong> Práva Spotřebitele na náhradu újmy a práva z vadného plnění se řídí výhradně platnými právními předpisy (zejména § 2389a a násl. NOZ) a nelze je předem omezit.
            </p>
            <p>
              6.3 <strong>Reklamace:</strong> Má-li digitální obsah nebo Služba vadu, uplatní Uživatel reklamaci bezodkladně e-mailem na adresu simcallcz@gmail.com. Reklamace Spotřebitele bude vyřízena nejpozději do 30 dnů od jejího uplatnění. Za vadu Služby se nepovažuje selhání API či modelu třetí strany mimo kontrolu Poskytovatele.
            </p>

            <h2>7. Ochrana Osobních údajů</h2>
            <p>
              7.1 Informace k ochraně osobních údajů Uživatelů podle nařízení GDPR naleznete v dokumentu na adrese <a href="/ochrana-soukromi" className="text-amber-500 underline">simcall.cz/ochrana-soukromi</a>.
            </p>
            <p>
              7.2 Poskytovatel chrání osobní údaje Uživatelů a uchovává historii plateb (zástupnou tokenizací). Hesla jsou kryptograficky zajištěna.
            </p>

            <h2>8. Závěrečná ustanovení</h2>
            <p>
              8.1 <strong>Soudní příslušnost:</strong> Veškerá ujednání se řídí právním řádem České republiky. Pro případné spory mezi Provozovatelem a Podnikatelem se sjednává místní příslušnost soudu podle sídla Provozovatele. U Spotřebitelů se soudní příslušnost řídí zákonem (obvykle dle bydliště spotřebitele).
            </p>
            <p>
              8.2 <strong>Mimosoudní řešení (ADR):</strong> Případné spory mezi Poskytovatelem a Spotřebitelem lze řešit mimosoudně prostřednictvím České obchodní inspekce se sídlem Štěpánská 44, 110 00 Praha 1 (web: www.coi.cz).
            </p>
            <p>
              8.3 <strong>Změna VOP:</strong> Provozovatel je oprávněn znění VOP jednostranně měnit. Nové znění je oznámeno e-mailem nebo notifikací s předstihem nejméně 14 dnů. Uživatel má právo změnu VOP odmítnout a z tohoto důvodu Smlouvu bez sankce vypovědět do data nabytí účinnosti nových VOP.
            </p>
            <p>
              8.4 Tyto Všeobecné obchodní podmínky nabývají platnosti a účinnosti k 25. 3. 2026.
            </p>

          </div>
        </Container>
      </section>
    </>
  );
}

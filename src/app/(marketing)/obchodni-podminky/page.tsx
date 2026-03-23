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
              Platné a účinné od 1. 3. 2026
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
              1.2 <strong>Službou (Platformou)</strong> se rozumí webová aplikace provozovaná Provozovatelem dostupná prostřednictvím webového rozhraní na internetové adrese <strong>simcall.cz</strong>, která využívá umělou inteligenci k tréninku prodejních, nákupních a jiných (i specificky definovatelných) asertivních konverzací (dále jen „<strong>Platforma</strong>“ nebo „<strong>Služba</strong>“). Webovým rozhraním se rozumí webová stránka simcall.cz.
            </p>
            <p>
              1.3 <strong>Uživatel</strong> je fyzická (podnikající i nepodnikající) nebo právnická osoba, která uzavřela s Provozovatelem smlouvu o poskytování Služeb (dále jen „<strong>Smlouva</strong>“). Podnikatelem je jedinečná osoba, která samostatně vykonává výdělečnou činnost, nebo nakupuje výrobky či užívá služby za účelem svého podnikání. Spotřebitelem je fyzická osoba, která mimo rámec své podnikatelské činnosti nebo mimo rámec samostatného výkonu svého povolání uzavírá Smlouvu s Provozovatelem („<strong>Spotřebitel</strong>“).
            </p>
            <p>
              1.4 Předmětem Smlouvy je užívání digitálního obsahu prostřednictvím vzdáleného přístupu (SaaS – Software as a Service) a udělení omezené, odvolatelné, nepřenosné, nevýhradní licence k užívání Platformy.
            </p>

            <h2>2. Založení účtu a uzavření smlouvy</h2>
            <p>
              2.1 Využívání placených funkcí Služby je podmíněno provedením registrace a vytvořením uživatelského účtu na rozhraní Platformy.  
            </p>
            <p>
              2.2 K uzavření kupní smlouvy a smlouvy o poskytování digitálního obsahu dochází okamžikem úspěšné registrace nebo, v případě placené Služby, závazným odsouhlasením příslušného tarifu z nabídky a odesláním objednávky („kliknutím na tlačítko pro závaznou platbu“). Uživatel při registraci potvrzuje, že se s těmito VOP a pravidly pro ochranu osobních údajů plně seznámil a souhlasí s nimi.
            </p>
            <p>
              2.3 Uživatel je povinen při registraci uvádět výhradně pravdivé, úplné a aktuální údaje. Jakékoli ztráty způsobené uvedením neplatných nebo zfalšovaných údajů nese výhradně Uživatel. Provozovatel si vyhrazuje právo přístup Uživateli odmítnout, omezit nebo jeho účet zablokovat/trvale smazat, zjistí-li účelové zamlčování skutečností či poskytnutí nepravdivých údajů (např. zneužití bezplatného Demo plánu zakládáním duplicitních účtů).  
            </p>

            <h2>3. Tarifní plány a cenové podmínky</h2>
            <p>
              3.1 Služba je poskytována v bezplatné verzi s omezeným obsahem („<strong>Demo tarif</strong>“) i v rozšířených placených verzích (např. „<strong>Solo</strong>“, „<strong>Team</strong>“). Aktuální specifikace objemu dat/minut, funkcí a ceny u jednotlivých tarifních plánů jsou dostupné na internetové adrese simcall.cz/cenik a přímo v klientském účtu (Záložka „Ceník“ či „Můj balíček“). 
            </p>
            <p>
              3.2 Ceny placených tarifů jsou finální a uvedené vždy jasně v CZK. Provozovatel si vyhrazuje právo cenovou relaci i rozsah služeb jednostranně měnit s platností na následující nová zúčtovací období; o změně tarifů informuje Uživatele vždy s dostatečným předstihem (zpravidla e-mailem, nebo notifikací uvnitř aplikace). 
            </p>
            <p>
              3.3 V rámci vybraného tarifu má Uživatel definovaný omezený počet přidělených kreditů (tj. „<strong>Minut</strong>“) pro volání s AI, počet scénářů, počet asistentů a případně počet dalších uživatelských profilů v týmu. Nevyužité minuty se do dalšího období (měsíce) **převádí / nepřevádí** dle nastevení balíčku, primárně propadají k poslednímu dni daného fakturačního období s obnovením nového limitu po úhradě další platební periody, pokud aktuální pravidla v sekci Ceník nestanoví jinak.
            </p>
            
            <h2>4. Poskytování digitálního obsahu, Platba a NEVRATNOST (No-Refund Policy)</h2>
            <p>
              4.1 Veškeré platby probíhají formou automaticky obnovovaného měsíčního (nebo jiného periodického) předplatného přes platební portál provozovaný třetí stranou (zpravidla Stripe). Peněžní instituce zpracovávající platbu má vlastní Podmínky. Provozovatel nemá přístup ke kompletním údajům o platební kartě Uživatele. Zrušení opakované platby je plně v rukou Uživatele z prostředí aplikace v sekci Můj balíček.
            </p>
            <p>
              4.2 <strong>VÝSLOVNÝ SOUHLAS S DODÁNÍM DIGITÁLNÍHO OBSAHU A ZTRÁTA PRÁVA NA ODSTOUPENÍ OD SMLOUVY (ZÁKAZ REFUNDŮ):</strong> Uživatel bere na vědomí, a souhlasem s těmito VOP před odesláním platby či objednávky projevuje výslovný souhlas, že okamžikem připsání platby mu je ihned automaticky zpřístupněn zakoupený nehmotný digitální obsah i zakoupený kredit (minuty pro AI volání). V souladu s <strong>ustanovením § 1837 písm. l) občanského zákoníku</strong> tímto Uživatel (i v pozici Spotřebitele) bere na vědomí, že udělením souhlasu s okamžitým dodáním digitálního obsahu před uplynutím zákonné 14denní lhůty formou automatizovaného přidělení služeb **ZTRÁCÍ PRÁVO NA ODSTOUPENÍ OD SMLOUVY VE 14DENNÍ LHŮTĚ a žádné platby nejsou v žádném případě a výši vratné**. 
            </p>
            <p>
              4.3 Vzhledem k okamžitému doručení digitální hodnoty po zaplacení provozovatel <strong>v žádném případě peníze zpět nevrací a refundace nevyřizuje</strong>. Výjimkou je prokazatelně neoprávněná platba duplicitně inkasovaná technickou chybou. Odůvodnění „služba mi nevyhovuje“, „nepoužil jsem zakoupené minuty“, nebo „zapomněl jsem zrušit předplatné“ neopravňuje k vrácení platby.
            </p>
            <p>
              4.4 Ukončení užívání (Downgrade/Cancellation): Uživatel může placený tarif či předplatné kdykoli zrušit ze sekce „Můj balíček“. Pokud tak učiní, nebude mu zúčtováno další období. Již zaplacený přístup a zbývající minuty z aktuálního, probíhajícího období ovšem nevyprší – zůstanou funkční až do jeho konce a propadnou úderem data fakturační obnovy.
            </p>

            <h2>5. Práva a povinnosti uživatele a zneužití platformy</h2>
            <p>
              5.1 Uživatel je oprávněn užívat Službu výhradně v souladu s těmito VOP a platnými právními předpisy ČR a zeměmi EU. 
            </p>
            <p>
              5.2 Je výslovně zakázáno:
            </p>
            <ul className="list-disc pl-5">
              <li>užívat Službu způsobem, který by mohl ohrozit bezpečnost, kapacitní stabilitu, či vést k poškození sítě nebo serverů Provozovatele,</li>
              <li>obcházet ochranu rozhraní Služby, reverzní inženýrství nebo využívat roboty či automatizované skripty k „scrapování“ dat (API volání je dovoleno jen, je-li to v tarifu Služby programaticky povoleno a dokumentováno),</li>
              <li>požadovat v konverzacích s AI protiprávní, extrémistický, nebezpečný nebo hluboce ofenzivní obsah, poškozující práva třetích stran,</li>
              <li>prodej, stahování (download) systémových hlášení, redistribuce či poskytování účtu dalším neoprávněným osobám pod záminkou sdílení (mimo licencované uživatele dojednané v tarifu „Team / Enterprise“).</li>
            </ul>
            <p>
              5.3 V případě hrubého nebo soustavného porušení povinností může Provozovatel zablokovat přístup bez nároku na kompenzaci platby a neprodleně odstranit veškerá Uživatelova data.
            </p>
            <p>
              5.4 Uživatel v placeném i neplaceném režimu výslovně bere na vědomí, že konverzace s umělou inteligencí jsou v systému Služby ukládány pro analytické účely a pro zobrazení historického záznamu.
            </p>

            <h2>6. Práva a povinnosti Provozovatele; Reklamace; Vyloučení odpovědnosti</h2>
            <p>
              6.1 Provozovatel garantuje maximální snahu o zachování plné dostupnosti serverů. Přesto se Uživatel bere na vědomí, že software (Služba) je dodáván ve stavu, „v jakém stojí a leží" (“<strong>as is</strong>”). Občasné nutné výpadky údržbového či technického rázu nenesou záruku odškodného a nevzniká nárok na slevu ani reklamaci.
            </p>
            <p>
              6.2 Z technologické podstaty (Generativní AI třetích stran - např. modelů třetích dodavatelů jako OpenAI) nezaručuje poskytovatel naprostou věcnou, logickou a absolutní správnost odpovědí či průběhu hovorů. Výstupy, jež Uživatel pomocí asistentů vyprodukuje, slouží výhradně pro edukativní ráz. Poskytovatel neodpovídá za přímé i nepřímé škody ani zisky, plynoucí z aplikování postřehů na reálném obchodním nasazení.
            </p>
            <p>
              6.3 Celková smluvní odpovědnost Provozovatele za případnou újmu a škodu vzniklou straně Uživatele při užívání Služby se v maximálním rozsahu připuštěném právním řádem ČR omezuje na částku odpovídající uhrazené roční sazbě za využívanou službu. Odpovědnost za ušlý zisk a ztrátu chráněných dat Uživatele je vyloučena zcela.
            </p>
            <p>
              6.4 Práva z vadného plnění ohledně digitálního obsahu uplatní Uživatel vždy bezodkladně emailem na adresu simcallcz@gmail.com, a provozovatel má na odstranění vady 30 dní. Za vadu se nepovažuje selhání API služby třetí strany mimo kontrolu Poskytovatele ani neznalost využití softwaru ze strany Uživatele. Vzhledem ke specifikaci Služby není aplikovatelná materiální oprava vady; oprávněná a nevyřešená reklamace však může vyústit v adekvátní slevu či doplňkové minuty kreditu. Neúspěšné vrácení peněz (tzv. chargeback) provedené Uživatelem v neoprávněném rozporu s touto smlouvou a obchodními podmínkami bude vymáháno se započtením nákladů na takový výkon práva (vč. právního zastoupení).
            </p>

            <h2>7. Ochrana Osobních údajů (Privacy Policy / GDPR)</h2>
            <p>
              7.1 Informace k ochraně osobních údajů Uživatelů podle nařízení GDPR a jiných norem naleznete v samostatném dokumentu na adrese <a href="/ochrana-soukromi" className="text-amber-500 underline">simcall.cz/ochrana-soukromi</a>. Souhlasem s těmito VOP Uživatel stvrzuje, že se rovněž seznámil s textem Ochrany osobních údajů.
            </p>
            <p>
              7.2 Poskytovatel chrání osobní a kontaktní údaje Uživatelů. Hesla k databázím jsou kryptograficky zajištěna, poskytovatel uchovává historii plateb (vždy jen idenitifikátor a údaje o transakci formou zástupné tokenizace přes Stripe), a provozuje statistiku využití.
            </p>

            <h2>8. Závěrečná ustanovení</h2>
            <p>
              8.1 Veškerá ujednání mezi Provozovatelem a Uživatelem se řídí právním řádem České republiky. Pokud má v právním vztahu účast zahraniční Služba nebo osoba, strany si sjednaly, že se případný mimosmluvní či smluvní poměr řídí právem ČR a soudem příslušným pro spory je věcně i místně soud Provozovatele.
            </p>
            <p>
              8.2 Případné spory mezi Poskytovatelem (Provozovatelem) a Spotřebitelem, pocházející ze smluv na poskytování služeb, lze přednostně řešit mimosoudně. Subjektem <strong>mimosoudního řešení spotřebitelských sporů</strong> je Česká obchodní inspekce se sídlem Štěpánská 44, 110 00 Praha 1, (web pro návrh elektronicky: www.coi.cz / adr.coi.cz).
            </p>
            <p>
              8.3 Provozovatel smí VOP u dlouhodobých smluv po logickém uvážení a vzhledem k rozvoji software 1x (a vícekrát) za kalendářní rok upravit v potřebné formální míře. Nové znění VOP je oznámeno Uživateli zasláním formou odkazu notifikací při užívání a platností nabývá nejpozději 14 dnů po publikaci (zveřejnění). Pokud uživatel do té doby Službu nezruší (nepřestane používat a neukončí Smlouvu), považují se nové VOP za oboustranně odsouhlasené a řádně závazné.
            </p>
            <p>
              8.4 Tyto Všeobecné obchodní podmínky nabývají platnosti a účinnosti k 1. 3. 2026.
            </p>

          </div>
        </Container>
      </section>
    </>
  );
}

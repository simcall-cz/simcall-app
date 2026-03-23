import { Container } from "@/components/shared/container";

export const metadata = {
  title: "Ochrana soukromí | SimCall",
  description: "Zásady ochrany osobních údajů platformy SimCall.",
};

export default function OchranaSoukromiPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-900 py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <span className="inline-block text-xs font-medium text-neutral-400 tracking-widest uppercase mb-3">
              Právní dokumenty
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Ochrana soukromí a osobních údajů</h1>
            <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
              Zásady zpracování osobních údajů (GDPR) — platné a účinné od 1. 3. 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-neutral prose-sm sm:prose-base prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:mb-4">
            
            <p className="font-semibold lead">
              Tyto zásady ochrany osobních údajů vysvětlují, jakým způsobem jsou shromažďovány, zpracovávány a chráněny Vaše osobní údaje při využívání platformy SimCall na webových stránkách simcall.cz, a to v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů (dále jen „<strong>GDPR</strong>“).
            </p>

            <h2>1. Kdo je správcem Vašich údajů?</h2>
            <p>
              Správcem osobních údajů je <strong>Filip Mojik</strong>, se sídlem Jižní 2020, Rychvald 735 32, IČO: 17501750 (dále jen „<strong>Správce</strong>“). 
            </p>
            <p>
              V případě jakýchkoli dotazů týkajících se zpracování Vašich osobních údajů nebo pro uplatnění Vašich práv nás můžete kontaktovat e-mailem na adrese: <strong>simcallcz@gmail.com</strong>.
            </p>

            <h2>2. Jaké osobní údaje zpracováváme?</h2>
            <p>Správce zpracovává údaje, které nám sami při využívání služeb poskytnete, nebo které jsou generovány Vaší aktivitou na platformě:</p>
            <ul className="list-disc pl-5">
              <li><strong>Základní identifikační a kontaktní údaje:</strong> jméno, příjmení a e-mailová adresa (získané při registraci a kontaktu s podporou).</li>
              <li><strong>Údaje uživatelského profilu:</strong> přihlašovací e-mail, heslo (zabezpečené a silně kryptograficky zahashované, ke kterému Správce nemá přístup).</li>
              <li><strong>Fakturační údaje:</strong> jméno/název firmy, IČO, DIČ, fakturační adresa a telefonní číslo (v případě zakoupení placených tarifů).</li>
              <li><strong>Platební údaje:</strong> číslo objednávky, stav platby. <em>Pozn.: Správce nemá přístup k číslům Vašich platebních karet. Veškeré karetní operace spravuje zabezpečený platební procesor Stripe, se kterým jsme technologicky propojeni jen na úrovni anonymních transakčních tokenů (ID plateb).</em></li>
              <li><strong>Audio nahrávky, přepisy a data z AI hovorů:</strong> hlasové komunikace se simulovanou AI asistentkou (audiostopa a její následný textový přepis), vygenerovaná zpětná vazba na Váš hovor.</li>
              <li><strong>Technické a analytické údaje:</strong> IP adresa, typ zařízení a prohlížeče, logy přístupu a časy přihlášení, chybová hlášení (shromažďovaná pro zajištění správného běhu platformy).</li>
            </ul>

            <h2>3. Za jakým účelem údaje zpracováváme a na jakém právním základu?</h2>
            <p>
              Zpracování Vašich osobních údajů probíhá vždy na základě přesně vymezených účelů a oprávněných právních základů:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Poskytování služby a plnění smlouvy:</strong> Vytvoření uživatelského účtu, vyřízení objednávky předplatného, umožnění tréninku hovorů formou generativní AI a zajištění podpory uživatelů. (<em>Právní základ: Čl. 6 odst. 1 písm. b) GDPR – plnění smlouvy.</em>)
              </li>
              <li>
                <strong>Vedení účetnictví a daní:</strong> Zpracování fakturačních a platebních údajů za účelem správy zaplacených předplatných a archivace účetních dokladů dle platné legislativy. (<em>Právní základ: Čl. 6 odst. 1 písm. c) GDPR – plnění právní povinnosti.</em>)
              </li>
              <li>
                <strong>Zlepšování služeb a bezpečnost (Oprávněný zájem):</strong> Analýza technických chyb, prevence podvodů (např. automatické zakládání duplicitních demo účtů), ochrana před kybernetickými útoky, a využívání analýz (např. z agregovaných dat hovorů) k tréninku a zlepšování modelů AI agentů a aplikování plynulejšího uživatelského zážitku. (<em>Právní základ: Čl. 6 odst. 1 písm. f) GDPR – oprávněný zájem Správce.</em>)
              </li>
            </ul>

            <h2>4. Kdo jsou příjemci Vašich údajů (třetí strany)?</h2>
            <p>
              Pro zajištění funkční aplikace a co nejlepších služeb využíváme technologie následujících prověřených partnerů (zpracovatelů), kterým mohou být osobní údaje zpřístupněny v nezbytně nutném rozsahu. Správce databáze neprodává třetím stranám pro marketingové účely:
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Supabase Inc.</strong> – Poskytovatel infrastruktury cloudové databáze a správy identity. Datacentry jsou alokována buď v USA s ochranou (DPA) či přímo v EU.</li>
              <li><strong>Stripe Inc.</strong> – Globální procesor pro zajištění online plateb kartou a fakturaci. Stripe jedná v pozici samostatného správce karetních dat.</li>
              <li><strong>OpenAI L.L.C / ElevenLabs Inc.</strong> – Poskytovatelé Large Language modelů (LLM) a syntézy hlasu, přes jejichž API probíhá reálný převod hlasu na text a generování odpovědí umělé inteligence během Vašeho tréninku.</li>
              <li><strong>Resend Inc.</strong> – Systém pro transakční odesílání ověřovacích e-mailů, faktur a notifikací.</li>
              <li><strong>Vercel Inc.</strong> – Hostingová platforma zajišťující rychlé doručování aplikace (frontend i backend API serverů).</li>
            </ul>
            <p>
              Při využívání platformy nedochází k předávání údajů do třetích zemí beze smyslu a zajištění standardních smluvních doložek Evropské komise a rámce Data Privacy Framework u dodavatelů sídlících v USA.
            </p>

            <h2>5. Doba uchovávání údajů</h2>
            <p>
              Zpracováváme data po dobu absolutně nutnou k naplnění účelů zpracování. Konkrétně:
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Klientské profily a transakční data z hovorů (historie tréninků):</strong> Uchovávány primárně po dobu existence Vašeho aktivního uživatelského účtu na platformě, abyste měli k Vaší historii hovorů stálý přístup. Při smazání účtu (Vaším požadavkem či po dlouhé odmlce propadnutí dle VOP) smažeme tyto údaje bezpečně, nejpozději však do 30 dní.</li>
              <li><strong>Fakturační / Účetní údaje:</strong> Uchováváme z důvodů plnění legislativních norem ČR archivačních povinností po dobu 10 let.</li>
              <li><strong>Logy, analytika, IP adresy:</strong> Krátkodobě pro bezpečnostní diagnostiku zpravidla od 30 do 90 dní.</li>
            </ul>

            <h2>6. Soubory Cookies</h2>
            <p>
              Ke správnému chodu aplikace potřebujeme uchovávat na Vašem zařízení technické soubory – tzv. <strong>„Nezbytné (Basic) Cookies“</strong>. Používáme je výhradně k tomu, abyste mohli zůstat přihlášeni k Vašemu zabezpečenému účtu, aniž byste se museli na každé obrazovce logovat znovu. Na tyto striktně technické cookies se dle zákona nepotřebuje explicitní souhlas z uživatelské "cookie lišty". Webová prezentace neprodává reklamní prostor ani nesleduje váš pohyb marketingovými trackery z kategorií (Marketing) bez vyžádání.
            </p>

            <h2>7. Vaše práva vyplývající z GDPR</h2>
            <p>Jako uživatel a subjekt údajů máte plné spektrum práv, pro jejichž uplatnění nám stačí napsat z e-mailu přidruženého k účtu na <strong>simcallcz@gmail.com</strong>.</p>
            <ul className="list-disc pl-5">
              <li><strong>Právo na přístup k údajům (čl. 15):</strong> Máte právo vědět, jaké údaje o Vás vedeme a případně dostat jejich kopii.</li>
              <li><strong>Právo na opravu (čl. 16):</strong> Zjistíte-li nepřesnost, máte právo nás žádat o opravu či doplnění.</li>
              <li><strong>Právo na výmaz / „být zapomenut“ (čl. 17):</strong> Pokud účel přešel svému konci a neblokují to jiné zákony, smažeme na Vaši výzvu z databáze veškeré osobní vazby, hovory i profilové údaje.</li>
              <li><strong>Právo omezit zpracování a právo na námitku (čl. 18 a 21):</strong> Můžete se ohradit proti formě zpracování, typicky pokud zpracováváme data formou Vašeho "oprávněného zájmu".</li>
              <li><strong>Právo na přenositelnost údajů (čl. 20):</strong> Data Vám na požádání vydáme do strukturovaného strojitelného formátu (např. JSON/CSV).</li>
            </ul>
            <p>
              Jestliže se domníváte, že jsme ve zpracování nejednali s péčí řádného hospodáře a byla pošlapána Vaše práva, máte navíc možnost iniciovat stížnost dozorovému úřadu, kterým je v ČR Úřad pro ochranu osobních údajů (<strong>www.uoou.cz</strong>).
            </p>

            <h2>8. Aktualizace podmínek</h2>
            <p>
              Za účelem zvyšování zabezpečení, zohlednění nových integrací s umělou inteligencí či modernizací legislativy práva GDPR si Správce vyhrazuje oprávnění zásady doplňovat a aktualizovat. Aktuální plátné znění uživatel nalezne vždy trvale k nahlédnutí i k případnému stažení přímo na adrese simcall.cz/ochrana-soukromi. U podstatných změn o tom dáme Uživatelům s aktivními balíčky vědět v předstihu např. zasláním e-mailové výzvy či notifikace v administraci platformy.
            </p>

          </div>
        </Container>
      </section>
    </>
  );
}

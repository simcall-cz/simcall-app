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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Ochrana soukromí</h1>
            <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
              Zásady zpracování osobních údajů — platné od 1. 3. 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-neutral prose-sm sm:prose-base">

            <h2>1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je SimCall s.r.o., se sídlem v České republice
              (dále jen „správce"). Kontaktní e-mail pro záležitosti ochrany osobních údajů:
              simcallcz@gmail.com.
            </p>

            <h2>2. Rozsah zpracovávaných údajů</h2>
            <p>Správce zpracovává následující osobní údaje:</p>
            <ul>
              <li><strong>Identifikační údaje:</strong> jméno a příjmení, e-mailová adresa, telefonní číslo.</li>
              <li><strong>Přihlašovací údaje:</strong> e-mail a heslo (heslo je uloženo v šifrované podobě).</li>
              <li><strong>Fakturační údaje:</strong> název firmy, IČO, DIČ, fakturační adresa (u placených plánů).</li>
              <li><strong>Údaje o využívání služby:</strong> záznamy hovorů s AI agenty, přepisy, hodnocení, statistiky pokroku.</li>
              <li><strong>Technické údaje:</strong> IP adresa, typ prohlížeče, čas přístupu (automaticky zaznamenávané).</li>
              <li><strong>Platební údaje:</strong> platby jsou zpracovávány třetí stranou (Stripe) — správce neuchovává údaje o platebních kartách.</li>
            </ul>

            <h2>3. Účel zpracování</h2>
            <p>Osobní údaje jsou zpracovávány pro tyto účely:</p>
            <ul>
              <li><strong>Poskytování služby:</strong> provoz platformy, přihlašování, trénink hovorů, zpětná vazba, statistiky.</li>
              <li><strong>Správa účtu:</strong> správa uživatelského profilu a předplatného.</li>
              <li><strong>Fakturace:</strong> vystavování faktur a evidence plateb.</li>
              <li><strong>Zlepšování služby:</strong> analýza využívání pro optimalizaci funkcí a uživatelského rozhraní.</li>
              <li><strong>Komunikace:</strong> zasílání důležitých oznámení souvisejících se službou.</li>
              <li><strong>Plnění právních povinností:</strong> vedení účetnictví, daňové povinnosti.</li>
            </ul>

            <h2>4. Právní základ zpracování</h2>
            <p>Zpracování osobních údajů je založeno na následujících právních základech dle čl. 6 odst. 1 nařízení GDPR:</p>
            <ul>
              <li><strong>Plnění smlouvy</strong> (čl. 6 odst. 1 písm. b) — údaje nezbytné pro poskytování služby.</li>
              <li><strong>Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f) — zlepšování služby, prevence zneužití.</li>
              <li><strong>Plnění právních povinností</strong> (čl. 6 odst. 1 písm. c) — účetnictví, daňové povinnosti.</li>
              <li><strong>Souhlas</strong> (čl. 6 odst. 1 písm. a) — v případě zasílání marketingových sdělení (pouze s výslovným souhlasem).</li>
            </ul>

            <h2>5. Doba uchování údajů</h2>
            <ul>
              <li><strong>Údaje o účtu:</strong> po dobu trvání účtu a 30 dní po jeho zrušení.</li>
              <li><strong>Záznamy hovorů a přepisy:</strong> po dobu trvání účtu.</li>
              <li><strong>Fakturační údaje:</strong> 10 let dle zákona o účetnictví (zákon č. 563/1991 Sb.).</li>
              <li><strong>Technické logy:</strong> 90 dní.</li>
            </ul>
            <p>
              Po uplynutí doby uchování jsou údaje bezpečně smazány nebo anonymizovány.
            </p>

            <h2>6. Příjemci osobních údajů</h2>
            <p>Osobní údaje mohou být sdíleny s následujícími třetími stranami:</p>
            <ul>
              <li><strong>Supabase Inc.</strong> — hosting databáze a autentizace (servery v EU).</li>
              <li><strong>ElevenLabs Inc.</strong> — poskytování AI hlasových agentů pro tréninkové hovory.</li>
              <li><strong>OpenAI Inc.</strong> — analýza hovorů a generování zpětné vazby.</li>
              <li><strong>Stripe Inc.</strong> — zpracování plateb kartou.</li>
              <li><strong>Vercel Inc.</strong> — hosting webové aplikace.</li>
            </ul>
            <p>
              Se všemi zpracovateli jsou uzavřeny příslušné smlouvy o zpracování osobních
              údajů v souladu s čl. 28 GDPR. U zpracovatelů mimo EU je přenos údajů
              zabezpečen standardními smluvními doložkami dle rozhodnutí Evropské komise.
            </p>

            <h2>7. Práva subjektu údajů</h2>
            <p>Podle nařízení GDPR máte následující práva:</p>
            <ul>
              <li><strong>Právo na přístup</strong> (čl. 15) — získat informace o zpracovávaných údajích.</li>
              <li><strong>Právo na opravu</strong> (čl. 16) — požádat o opravu nepřesných údajů.</li>
              <li><strong>Právo na výmaz</strong> (čl. 17) — požádat o smazání údajů za zákonných podmínek.</li>
              <li><strong>Právo na omezení zpracování</strong> (čl. 18) — požádat o omezení zpracování.</li>
              <li><strong>Právo na přenositelnost</strong> (čl. 20) — získat údaje ve strojově čitelném formátu.</li>
              <li><strong>Právo vznést námitku</strong> (čl. 21) — namítat proti zpracování na základě oprávněného zájmu.</li>
              <li><strong>Právo odvolat souhlas</strong> — kdykoli odvolat souhlas se zpracováním, pokud je souhlas právním základem.</li>
            </ul>
            <p>
              Pro uplatnění svých práv kontaktujte správce na simcallcz@gmail.com. Správce
              vyřídí žádost bez zbytečného odkladu, nejpozději do 30 dnů.
            </p>
            <p>
              Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních údajů
              (www.uoou.cz).
            </p>

            <h2>8. Cookies a sledovací technologie</h2>
            <p>
              Platforma SimCall používá nezbytné technické cookies pro zajištění funkčnosti
              služby (přihlášení, uložení relace). Tyto cookies nelze odmítnout, protože
              jsou nezbytné pro provoz služby.
            </p>
            <p>
              Analytické nebo marketingové cookies nejsou v současnosti používány. V případě
              budoucího zavedení bude uživatel požádán o souhlas.
            </p>

            <h2>9. Zabezpečení údajů</h2>
            <p>
              Správce přijal technická a organizační opatření k zajištění bezpečnosti
              osobních údajů, zejména:
            </p>
            <ul>
              <li>Šifrování dat při přenosu (HTTPS/TLS).</li>
              <li>Šifrování hesel pomocí standardních hašovacích algoritmů.</li>
              <li>Řízení přístupu na principu nejmenších oprávnění.</li>
              <li>Pravidelné zálohování databáze.</li>
              <li>Monitoring bezpečnostních incidentů.</li>
            </ul>

            <h2>10. Změny zásad ochrany soukromí</h2>
            <p>
              Správce si vyhrazuje právo tyto zásady aktualizovat. O podstatných změnách
              bude uživatel informován e-mailem nebo oznámením v platformě nejméně 14 dní
              před nabytím účinnosti.
            </p>

            <h2>11. Kontakt</h2>
            <p>
              V případě dotazů ohledně zpracování osobních údajů se obraťte na:<br />
              E-mail: simcallcz@gmail.com
            </p>

          </div>
        </Container>
      </section>
    </>
  );
}

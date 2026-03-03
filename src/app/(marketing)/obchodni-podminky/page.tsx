import { Container } from "@/components/shared/container";

export const metadata = {
  title: "Obchodní podmínky | SimCall",
  description: "Obchodní podmínky platformy SimCall pro trénink hovorů s AI.",
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Obchodní podmínky</h1>
            <p className="mt-3 text-neutral-400 max-w-xl mx-auto">
              Platné od 1. 3. 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-neutral prose-sm sm:prose-base">

            <h2>1. Úvodní ustanovení</h2>
            <p>
              1.1. Tyto obchodní podmínky (dále jen „podmínky") upravují práva a povinnosti
              smluvních stran při poskytování služby SimCall (dále jen „služba") prostřednictvím
              webové platformy dostupné na adrese simcall.cz.
            </p>
            <p>
              1.2. Poskytovatelem služby je SimCall s.r.o., se sídlem v České republice
              (dále jen „poskytovatel"). Kontaktní e-mail: simcallcz@gmail.com.
            </p>
            <p>
              1.3. Uživatelem je každá fyzická nebo právnická osoba, která využívá službu
              (dále jen „uživatel").
            </p>
            <p>
              1.4. Tyto podmínky se řídí zákonem č. 89/2012 Sb., občanský zákoník, ve znění
              pozdějších předpisů, a zákonem č. 634/1992 Sb., o ochraně spotřebitele.
            </p>

            <h2>2. Popis služby</h2>
            <p>
              2.1. SimCall je online platforma pro trénink prodejních hovorů s využitím
              technologie umělé inteligence. Služba umožňuje uživatelům simulovat telefonní
              hovory s AI agenty, získávat zpětnou vazbu a sledovat svůj pokrok.
            </p>
            <p>
              2.2. Služba je poskytována v rámci zvolených tarifních plánů (Demo, Solo, Team),
              jejichž aktuální specifikace a ceník jsou uvedeny na stránce simcall.cz/cenik.
            </p>

            <h2>3. Registrace a uživatelský účet</h2>
            <p>
              3.1. Pro využívání služby je nutná registrace a vytvoření uživatelského účtu.
              Uživatel je povinen uvést pravdivé a úplné údaje.
            </p>
            <p>
              3.2. Uživatel odpovídá za zabezpečení svých přihlašovacích údajů a za veškeré
              aktivity provedené prostřednictvím svého účtu.
            </p>
            <p>
              3.3. Poskytovatel si vyhrazuje právo zrušit nebo pozastavit účet uživatele
              v případě porušení těchto podmínek.
            </p>

            <h2>4. Tarifní plány a platby</h2>
            <p>
              4.1. Služba je dostupná v bezplatné verzi (Demo) s omezeným počtem hovorů
              a v placených verzích (Solo, Team) s rozšířeným obsahem a funkcemi.
            </p>
            <p>
              4.2. Veškeré ceny jsou uvedeny včetně DPH a jsou platné dle aktuálního ceníku
              na webu poskytovatele.
            </p>
            <p>
              4.3. Platba za placené tarify probíhá předem na měsíční bázi, a to platební
              kartou prostřednictvím platební brány Stripe nebo bankovním převodem na základě
              vystavené faktury se splatností 14 dní.
            </p>
            <p>
              4.4. Předplatné se automaticky obnovuje na začátku každého fakturačního období,
              dokud uživatel předplatné nezruší.
            </p>
            <p>
              4.5. V případě prodlení s platbou si poskytovatel vyhrazuje právo omezit
              přístup ke službě do uhrazení dlužné částky.
            </p>

            <h2>5. Práva a povinnosti uživatele</h2>
            <p>
              5.1. Uživatel má právo využívat službu v rozsahu zvoleného tarifního plánu.
            </p>
            <p>
              5.2. Uživatel se zavazuje nepoužívat službu k protiprávním účelům, nešířit
              škodlivý obsah a nezneužívat systém automatizovanými skripty.
            </p>
            <p>
              5.3. Uživatel bere na vědomí, že konverzace s AI agenty jsou zaznamenávány
              za účelem poskytování zpětné vazby a zlepšování služby.
            </p>

            <h2>6. Práva a povinnosti poskytovatele</h2>
            <p>
              6.1. Poskytovatel se zavazuje zajistit dostupnost služby v rozsahu odpovídajícím
              aktuálním technickým možnostem, s výjimkou plánované údržby a okolností
              vyšší moci.
            </p>
            <p>
              6.2. Poskytovatel nenese odpovědnost za přerušení služby způsobené třetími
              stranami (poskytovatelé hostingu, platební brány, AI služby).
            </p>
            <p>
              6.3. Poskytovatel si vyhrazuje právo službu kdykoli aktualizovat, upravit její
              funkce nebo rozsah nabídky.
            </p>

            <h2>7. Odstoupení od smlouvy a reklamace</h2>
            <p>
              7.1. Uživatel-spotřebitel má právo odstoupit od smlouvy do 14 dnů od uzavření
              smlouvy bez udání důvodu, a to zasláním písemného oznámení na e-mail
              simcallcz@gmail.com.
            </p>
            <p>
              7.2. V případě, že uživatel již službu v rámci 14denní lhůty aktivně využíval,
              poskytovatel má právo účtovat poměrnou část ceny za skutečně poskytnuté služby.
            </p>
            <p>
              7.3. Placené předplatné lze kdykoli zrušit s platností ke konci aktuálního
              fakturačního období. Již uhrazené předplatné se nevrací, pokud není dohodnuto
              jinak.
            </p>
            <p>
              7.4. Reklamace kvality služby je možné uplatnit e-mailem na simcallcz@gmail.com.
              Poskytovatel se zavazuje reklamaci vyřídit do 30 dnů.
            </p>

            <h2>8. Odpovědnost a omezení</h2>
            <p>
              8.1. Služba je poskytována „tak, jak je" (as is). Poskytovatel negarantuje
              konkrétní výsledky tréninku ani zlepšení prodejních dovedností uživatele.
            </p>
            <p>
              8.2. Celková odpovědnost poskytovatele za škody je omezena na výši uhrazené
              ceny za službu v posledních 12 měsících.
            </p>
            <p>
              8.3. Poskytovatel nenese odpovědnost za nepřímé, následné nebo zvláštní škody
              vzniklé v souvislosti s užíváním služby.
            </p>

            <h2>9. Ochrana osobních údajů</h2>
            <p>
              9.1. Zpracování osobních údajů se řídí samostatným dokumentem Ochrana soukromí,
              dostupným na simcall.cz/ochrana-soukromi, a příslušnými právními předpisy,
              zejména nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
            </p>

            <h2>10. Změna podmínek</h2>
            <p>
              10.1. Poskytovatel si vyhrazuje právo tyto podmínky jednostranně změnit.
              O změně bude uživatel informován e-mailem nebo oznámením v rámci platformy
              nejméně 14 dní před nabytím účinnosti změn.
            </p>
            <p>
              10.2. Pokud uživatel se změnami nesouhlasí, má právo smlouvu vypovědět
              ke dni účinnosti změn.
            </p>

            <h2>11. Závěrečná ustanovení</h2>
            <p>
              11.1. Tyto podmínky nabývají účinnosti dnem 1. 3. 2026.
            </p>
            <p>
              11.2. Vztahy neupravené těmito podmínkami se řídí platnými právními předpisy
              České republiky.
            </p>
            <p>
              11.3. Případné spory budou řešeny přednostně dohodou, v případě nedohody
              příslušným soudem České republiky.
            </p>
            <p>
              11.4. Je-li nebo stane-li se některé ustanovení těchto podmínek neplatným
              nebo neúčinným, nedotýká se to platnosti ostatních ustanovení.
            </p>

          </div>
        </Container>
      </section>
    </>
  );
}

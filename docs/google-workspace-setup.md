# Návod: Propojení Google Workspace (Placený Google) se SimCall

Aby mohl náš robot (Service Account) generovat **Google Meet** odkazy vaším jménem, musíte mu k tomu dát povolení ve vašem novém Google Workspace účtu (funkce Domain-Wide Delegation).

### Krok 1: Zjištění Client ID robota
1. Běžte do [Google Cloud Console](https://console.cloud.google.com/) pod svým původním účtem (kde jste robota zakládal).
2. Vlevo v menu klikněte na **IAM & Admin** -> **Service Accounts**.
3. Uvidíte robota `meet-bot@...`. Zkopírujte si jeho **OAuth 2 Client ID** (Je to dlouhé číslo, např. `102837461928374...`). Bývá zobrazeno v detailech účtu.

### Krok 2: Povolení v Google Workspace (Admin kalendářů)
1. Přihlaste se do [Administrace Google Workspace](https://admin.google.com/) pod svým novým Workspace účtem (např. `info@simcall.cz`).
2. V menu vlevo jděte na **Security (Zabezpečení)** -> **Access and data control (Přístup a ovládání dat)** -> **API controls (Ovládací prvky API)**.
3. Sjeďte úplně dolů a klikněte na **Manage Domain Wide Delegation (Spravovat delegování v celé doméně)**.
4. Klikněte na **Add new (Přidat nové)**.
5. Do pole **Client ID (ID klienta)** vložte to dlouhé číslo robota z Kroku 1.
6. Do pole **OAuth scopes (Rozsahy OAuth)** vložte přesně toto:
   `https://www.googleapis.com/auth/calendar`
7. Klikněte na **Authorize (Oprávnit)**.

### Krok 3: Úprava kalendáře
1. Běžte do [Google Kalendáře](https://calendar.google.com/) pod vaším novým Workspace účtem.
2. Najeďte vlevo na svůj primární kalendář, klikněte na 3 tečky a dejte **Nastavení a sdílení**.
3. Sjeďte na sekci **Sdílení s konkrétními lidmi** a přidejte tam e-mail robota: `meet-bot@simcall-meet.iam.gserviceaccount.com` (Ujistěte se, že má právo "Provádět změny událostí").

### Krok 4: Nahrání nového emailu do aplikace
S robotem už hýbat nemusíte (klíče zůstávají stejné). Jediné, co musíme udělat, je říct aplikaci, jaký e-mail z Workspace má pro schůzky "převzít".
Otevřete si v našem editoru soubor `.env.local` a nahoru přihoďte:

```env
GOOGLE_WORKSPACE_EMAIL="vas.novy.email@simcall.cz"
```

A to je vše! Dejte mi pak vědět a já budu pokračovat tvorbou formuláře na web.

# SimCall — Architektura projektu

> AI telefonni trenink pro obchodni tymy. Uzivatele si volaji s AI agenty v simulovanych scenariich a dostavaji zpetnou vazbu.

---

## Tech Stack

| Oblast | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Jazyk | TypeScript 5 |
| Databaze | Supabase (PostgreSQL + Auth + Storage) |
| AI hovory | ElevenLabs Conversational AI (SDK v0.14) |
| Platby | Stripe (subscriptions) |
| Emaily | Resend + React Email |
| Notifikace | Discord Webhooks |
| Kalendar | Google Calendar API + Calendly |
| Grafy | Recharts |
| Animace | Framer Motion |
| Styling | Tailwind CSS v4 |
| Ikony | Lucide React |
| Hosting | Vercel |

---

## Struktura slozek

```
simcall-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth stranky (prihlaseni, registrace, nove-heslo)
│   │   ├── (dashboard)/        # Chranene stranky (dashboard, admin, manager)
│   │   ├── (marketing)/        # Verejne stranky (homepage, cenik, faq, kontakt...)
│   │   └── api/                # API endpointy (14 domen)
│   ├── components/
│   │   ├── auth/               # Login/register formulare
│   │   ├── booking/            # BookingForm (schuzky)
│   │   ├── call/               # ActiveCall, CriticalMoment, EvalCategories
│   │   ├── layout/             # Navbar, Sidebar, Footer, DashboardTopbar
│   │   ├── marketing/          # Hero, Pricing, Mockupy
│   │   ├── shared/             # Sdilene komponenty
│   │   └── ui/                 # Badge, Button, Card, Input
│   ├── data/                   # Staticka data (lekce, cenik, FAQ)
│   ├── emails/                 # React Email sablony (9 sablon)
│   ├── hooks/                  # useTrainingCall, useCallHistory
│   ├── lib/                    # Utility knihovny
│   │   ├── auth.ts             # Autentizace (getAuthHeaders, getUserFromRequest, verifyAdmin, safeInt)
│   │   ├── supabase.ts         # Supabase klient (singleton)
│   │   ├── stripe.ts           # Stripe helper (singleton)
│   │   ├── notifications.ts    # Discord + in-app notifikace
│   │   ├── resend.ts           # Email klient
│   │   ├── google-calendar.ts  # Google Calendar integrace
│   │   ├── rate-limit.ts       # In-memory API rate limiting
│   │   ├── adapters.ts         # Data adaptery
│   │   └── prompts/            # AI evaluacni prompty
│   ├── styles/                 # Globalni CSS
│   ├── types/                  # TypeScript definice
│   └── middleware.ts           # Auth middleware (token + DB role overeni)
├── supabase/migrations/        # DB migrace
├── public/                     # Staticke soubory
└── docs/                       # Dokumentace
```

---

## Databazove tabulky

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  auth.users (Supabase Auth)                                │
│    └── profiles (id, email, full_name, role, plan_role)     │
│          ├── plan_role: demo | solo | team | admin          │
│          ├── company_id → companies                         │
│          └── subscription_id → subscriptions                │
│                                                             │
│  agents (id, name, personality, difficulty, traits,         │
│          elevenlabs_agent_id, category)                     │
│    └── scenarios (id, title, category, difficulty,          │
│                   objectives, agent_id)                     │
│                                                             │
│  calls (id, user_id, agent_id, scenario_id,                │
│         conversation_id, duration_seconds, success_rate,    │
│         audio_url, status)                                  │
│    ├── transcripts (speaker, text, timestamp_label,         │
│    │                highlight, sort_order)                  │
│    ├── feedback (overall_score, strengths, improvements,    │
│    │             filler_words, recommendations)             │
│    └── call_disputes (reason, message, status,              │
│                       admin_note, refunded_seconds)         │
│                                                             │
│  subscriptions (user_id, plan, tier, status,                │
│                 stripe_customer_id, stripe_subscription_id, │
│                 calls_used, calls_limit, agents_limit,      │
│                 seconds_used)                               │
│                                                             │
│  companies (name, owner_id, subscription_id)                │
│    └── company_members (company_id, user_id, role)          │
│                                                             │
│  support_tickets (ticket, odpoved, status)                  │
│                                                             │
│  form_submissions (type, status, name, email, message...)   │
│                                                             │
│  Storage: call-recordings (bucket pro audio nahravky)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Uzivatelske role

| Role | Popis | Pristup |
|---|---|---|
| `demo` | Bezplatny uzivatel (limit 3 hovory) | /dashboard |
| `solo` | Solo predplatitel | /dashboard |
| `team` | Clen tymu | /dashboard |
| `team_manager` | Manager tymu | /dashboard + /manager |
| `admin` | Administrator | /dashboard + /admin |

---

## Stranky — User Dashboard (`/dashboard`)

| Cesta | Soubor | Popis |
|---|---|---|
| `/dashboard` | `page.tsx` | Hlavni prehled (statistiky, posledni hovory, trenink) |
| `/dashboard/trenink` | `trenink/page.tsx` | Zahajeni hovoru (vyber agenta + scenare) |
| `/dashboard/hovory` | `hovory/page.tsx` | Historie hovoru + detail modal + reklamace |
| `/dashboard/lekce` | `lekce/page.tsx` | Vyukove lekce |
| `/dashboard/statistiky` | `statistiky/page.tsx` | Grafy a statistiky |
| `/dashboard/profil` | `profil/page.tsx` | Uzivatelsky profil |
| `/dashboard/balicek` | `balicek/page.tsx` | Sprava predplatneho |
| `/dashboard/podpora` | `podpora/page.tsx` | Support tikety |

---

## Stranky — Admin (`/admin`)

| Cesta | Popis |
|---|---|
| `/admin` | Dashboard (prehled statistik) |
| `/admin/uzivatele` | Sprava uzivatelu |
| `/admin/hovory` | Vsechny hovory |
| `/admin/agenti` | Sprava AI agentu |
| `/admin/platby` | Prehled plateb |
| `/admin/refundace` | Reklamace hovoru (schvaleni/zamitnuti + refund minut) |
| `/admin/podpora` | Support tikety |
| `/admin/dotazy` | Kontaktni formulare |
| `/admin/schuzky` | Objednane schuzky |
| `/admin/upozorneni` | Nastaveni notifikaci |

---

## Stranky — Manager (`/manager`)

| Cesta | Popis |
|---|---|
| `/manager` | Team dashboard |
| `/manager/tym` | Sprava clenu tymu |
| `/manager/makler` | Detail maklere |

---

## Stranky — Marketing (verejne)

| Cesta | Popis |
|---|---|
| `/` | Homepage |
| `/cenik` | Cenik |
| `/funkce` | Funkce platformy |
| `/demo` | Demo hovor |
| `/faq` | Caste otazky |
| `/kontakt` | Kontaktni formular |
| `/o-nas` | O nas |
| `/domluvit-schuzku` | Rezervace schuzky (Calendly) |
| `/checkout` | Platebni stranka |
| `/obchodni-podminky` | Obchodni podminky |
| `/ochrana-soukromi` | Ochrana soukromi |

---

## API Endpointy

### Hovory
| Metoda | Cesta | Popis |
|---|---|---|
| POST | `/api/calls` | Vytvoreni hovoru + ziskani signed URL |
| PATCH | `/api/calls/[id]` | Aktualizace hovoru (status, conversation_id, feedback) |
| GET | `/api/calls/[id]` | Detail hovoru |
| POST | `/api/calls/[id]/dispute` | Uzivatel nahlasi reklamaci |
| GET | `/api/calls/[id]/dispute` | Stav reklamace |

### Admin
| Metoda | Cesta | Popis |
|---|---|---|
| GET | `/api/admin/users` | Seznam uzivatelu |
| GET | `/api/admin/calls` | Vsechny hovory |
| GET | `/api/admin/stats` | Statistiky |
| GET | `/api/admin/payments` | Prehled plateb |
| GET | `/api/admin/disputes` | Seznam reklamaci |
| PATCH | `/api/admin/disputes/[id]` | Schvaleni/zamitnuti reklamace |
| GET/PUT | `/api/admin/agents` | Sprava agentu |
| GET | `/api/admin/tickets` | Support tikety |
| GET | `/api/admin/forms` | Kontaktni formulare |
| GET | `/api/admin/meetings` | Schuzky |
| GET | `/api/admin/subscriptions` | Predplatne |
| PATCH | `/api/admin/notifications` | Nastaveni notifikaci |
| POST | `/api/admin/verify` | Overeni admin pristupu |
| GET | `/api/admin/availability` | Dostupnost |

### Uzivatel
| Metoda | Cesta | Popis |
|---|---|---|
| GET | `/api/me` | Profil aktualniho uzivatele |
| GET | `/api/agents` | Seznam agentu |
| GET | `/api/lessons` | Seznam lekci |
| POST | `/api/tickets` | Vytvoreni support tiketu |
| POST | `/api/booking` | Rezervace schuzky |
| POST | `/api/forms` | Odeslani formulare |
| POST | `/api/notify` | Notifikace |
| POST | `/api/subscribe` | Vytvoreni predplatneho |
| GET | `/api/subscription` | Detail predplatneho |

### Platby
| Metoda | Cesta | Popis |
|---|---|---|
| POST | `/api/stripe/checkout` | Vytvoreni checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| POST | `/api/stripe/portal` | Customer portal |

### Email
| Metoda | Cesta | Popis |
|---|---|---|
| POST | `/api/email` | Odeslani emailu |

---

## Hlavni flow — Hovor

```
Uzivatel vybere agenta + scenar
        │
        ▼
POST /api/calls  ──────────────>  Supabase: vytvor call zaznam
        │                         ElevenLabs: ziskej signed URL
        │                         Kontrola limitu minut
        ▼
conversation.startSession()  ──>  WebRTC spojeni s ElevenLabs
        │
        ▼
  [AKTIVNI HOVOR]  ────────────>  Timer + isMuted state
        │                         (SDK v0.14 nema mute API)
        ▼
conversation.endSession()  ────>  Ukonci WebRTC
        │
        ▼
PATCH /api/calls/[id]  ────────>  Uloz duration, status
        │                         ElevenLabs: stahni audio + transcript
        │                         AI evaluace (OpenAI prompt)
        │                         Uloz do: transcripts, feedback
        ▼
  [VYSLEDKY]  ─────────────────>  Skore, silne stranky, doporuceni
```

---

## Hlavni flow — Reklamace

```
Uzivatel: "Nahlasit problem"  ──>  POST /api/calls/[id]/dispute
        │                          Discord notifikace adminovi
        ▼
Admin: /admin/refundace  ─────────>  GET /api/admin/disputes
        │                            Prehrani nahravky
        ▼
Admin rozhodne:
  ├── "Schvalit + vratit minuty"  ──>  PATCH (refund=true) → odecte seconds_used
  ├── "Schvalit bez refundace"    ──>  PATCH (refund=false)
  └── "Zamitnout"                 ──>  PATCH (status=rejected)
        │
        ▼
In-app notifikace uzivateli  ──────>  support_tickets zaznam
```

---

## Autentizace

```
Supabase Auth (email + heslo, bcrypt pres GoTrue)
        │
        ▼
middleware.ts  ─────>  Kontrola tokenu z cookies/headers
        │              Route protection: /dashboard, /admin, /manager
        │              Admin: email match + DB role check (profiles.role)
        ▼
lib/auth.ts  ──────>  getAuthHeaders(): pripravi Bearer token
                       getUserFromRequest(): extrahuje usera z requestu
                       verifyAdmin(): kontrola JWT + DB role
                       safeInt(): validace numerickych parametru
```

**Admin pristup:** Dvoustupnove overeni — `ADMIN_EMAIL` env match v middleware + `profiles.role === "admin"` check v DB. API endpointy pouzivaji `verifyAdmin()` z `lib/auth.ts`.

---

## Notifikace

| Kanal | Kdy |
|---|---|
| Discord webhook | Novy hovor, novy tiketa, nova reklamace, novy kontaktni formular |
| In-app (support_tickets) | Admin odpoved na tiketa, vysledek reklamace |
| Email (Resend) | Registrace, objednavka, kontaktni formular, odpoved na tiket |

---

## Email sablony (React Email)

| Sablona | Popis |
|---|---|
| `WelcomeEmail` | Uvitaci email po registraci |
| `AccountCreatedEmail` | Potvrzeni uctu |
| `OrderConfirmationEmail` | Potvrzeni objednavky |
| `UpgradeConfirmationEmail` | Potvrzeni upgradu |
| `DowngradeScheduledEmail` | Naplanany downgrade |
| `ContactFormEmail` | Admin notifikace o novem kontaktu |
| `ContactAutoReplyEmail` | Auto-reply uzivateli |
| `MeetingConfirmationEmail` | Potvrzeni schuzky |
| `TicketResponseEmail` | Odpoved na support tiket |

---

## Env promenne

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Google Calendar
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=

# Notifikace
DISCORD_WEBHOOK_URL=

# Admin
ADMIN_EMAIL=

# App
NEXT_PUBLIC_SITE_URL=              # Trusted base URL for redirects (required)
NEXT_PUBLIC_SITE_PASSWORD=         # Site gate password
```

---

## Bezpecnost

| Opatreni | Detail |
|---|---|
| Hesla | Supabase Auth (bcrypt pres GoTrue), aplikace se hesel nikdy nedotyka |
| API chybove zpravy | Genericke zpravy v odpovedi (`"Internal server error"`), detaily jen v `console.error` |
| Stripe presmerovani | Pouziva `NEXT_PUBLIC_SITE_URL`, nikdy `Origin` header z requestu |
| Admin pristup | Dvoustupnove overeni: email match + DB `profiles.role === "admin"` |
| User ID | Vzdy z JWT tokenu, nikdy z `body.userId` |
| Rate limiting | In-memory limiter na verejne endpointy (booking, forms, subscribe) |
| Citlive udaje | Vsechny tokeny/klice v env promennych, zadne hardcoded v kodu |
| Vstupni validace | `safeInt()` pro numericke parametry, Zod pro formulare |

---

## Dulezite konvence

- **Jazyk UI:** Cestina (URL i popisky)
- **Jazyk kodu:** Anglictina (promenne, funkce, API)
- **Supabase klient:** Vzdy `createServerClient()` (service role) pro API mutace, `createBrowserClient()` (anon key) pro klientske cteni
- **Auth headers:** `getAuthHeaders()` z `lib/auth.ts` pro vsechny fetch volani
- **Admin overeni:** `verifyAdmin()` kontrola (JWT + DB role) na zacatku kazdeho admin API
- **Chybove zpravy:** NIKDY nevracet `error.message` v API odpovedi — vzdy genericke zpravy
- **Presmerovani:** NIKDY nepouzivat `request.headers.get("origin")` — vzdy `process.env.NEXT_PUBLIC_SITE_URL`
- **User ID:** NIKDY neprijimat z body requestu — vzdy z JWT pres `getUserFromRequest()`
- **Notifikace:** Discord pro admina, in-app (support_tickets) pro uzivatele
- **Styling:** Tailwind CSS v4, design system pres `components/ui/`
- **Ikonky:** Lucide React (bez emoji v UI)
- **Singletony:** Stripe a Supabase klienty na urovni modulu (bezpecne pro Vercel serverless)

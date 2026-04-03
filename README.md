# SimCall

> AI phone training platform for sales teams. Users practice calls with AI agents in simulated scenarios and receive real-time feedback.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI Calls | ElevenLabs Conversational AI |
| Payments | Stripe (subscriptions + checkout) |
| Email | Resend + React Email |
| Notifications | Discord Webhooks + in-app |
| Calendar | Google Calendar API + Calendly |
| Styling | Tailwind CSS v4, Framer Motion |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file (see `docs/architecture.md` for the full list):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ELEVENLABS_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
DISCORD_WEBHOOK_URL=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_PASSWORD=

# Google Calendar (optional)
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, password reset
│   ├── (dashboard)/     # Protected pages (dashboard, admin, manager)
│   ├── (marketing)/     # Public pages (homepage, pricing, FAQ)
│   └── api/             # 14 API route groups
├── components/          # UI components (auth, call, layout, marketing, ui)
├── emails/              # 9 React Email templates
├── hooks/               # useTrainingCall, useCallHistory
├── lib/                 # Core utilities (auth, supabase, stripe, rate-limit)
├── styles/              # Global CSS
├── types/               # TypeScript definitions
└── middleware.ts        # Route protection (auth + role checks)
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Documentation

- [Architecture](docs/architecture.md) — Full technical architecture
- [Google Workspace Setup](docs/google-workspace-setup.md) — Calendar API integration

## Security

- All passwords hashed by Supabase Auth (bcrypt via GoTrue)
- API routes return generic error messages (no internal details leaked)
- Stripe routes use `NEXT_PUBLIC_SITE_URL` for redirects (no `Origin` header)
- Admin middleware checks both email match AND database role
- Rate limiting on public endpoints (booking, forms)
- Input sanitization with Zod validation
- Site gate password stored in environment variable

# CLAUDE.md — SimCall Development Guide

## Quick Reference

- **Framework:** Next.js 15 App Router, TypeScript 5, Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Payments:** Stripe subscriptions
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Project Conventions

### Language
- **UI text:** Czech (URLs and labels in Czech, e.g. `/dashboard/hovory`)
- **Code:** English (variables, functions, API routes)
- **Error messages in API responses:** Czech for user-facing Stripe routes, English for all other routes

### Architecture Patterns

- **Supabase client:** Use `createServerClient()` (service role) for API mutations; `createBrowserClient()` for client-side reads
- **Auth:** `getUserFromRequest(request)` from `lib/auth.ts` for all API routes; never trust `body.userId`
- **Admin verification:** `verifyAdmin(request)` checks JWT + DB `profiles.role === "admin"` — used in all `/api/admin/*` routes
- **Middleware:** `src/middleware.ts` protects `/dashboard`, `/admin`, `/manager` routes with token verification + role checks (including DB role for admin)
- **Rate limiting:** `lib/rate-limit.ts` in-memory limiter — wrap public endpoints with `rateLimit()`
- **Singletons:** Stripe and Supabase clients are module-level singletons (safe for Vercel serverless, but requires dev server restart if keys rotate)

### Security Rules (CRITICAL)

1. **Never expose `error.message` in API responses.** Always return generic messages like `"Internal server error"` or `"Failed to load X"`. Log the real error with `console.error()`.
2. **Never use `request.headers.get("origin")` for redirect URLs.** Use `process.env.NEXT_PUBLIC_SITE_URL` instead.
3. **Never accept user IDs from request bodies** for authenticated operations. Always derive from JWT via `getUserFromRequest()`.
4. **Never hardcode secrets in source code.** Use environment variables.
5. **Validate numeric inputs** with `safeInt()` helper from `lib/auth.ts`.

### File Organization

```
src/app/api/           → API routes (14 domains)
src/app/(auth)/        → Auth pages (login, register)
src/app/(dashboard)/   → Protected user/admin/manager pages
src/app/(marketing)/   → Public marketing pages
src/components/        → React components by feature
src/emails/            → React Email templates (9 templates)
src/hooks/             → Custom React hooks
src/lib/               → Core utilities and integrations
src/lib/prompts/       → AI evaluation prompts for call scoring
src/types/             → TypeScript type definitions
src/middleware.ts       → Auth + route protection middleware
docs/                  → Project documentation
supabase/migrations/   → Database migrations
```

### Key Files

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Auth helpers: `getUserFromRequest`, `verifyAdmin`, `getAuthHeaders`, `safeInt` |
| `src/lib/supabase.ts` | Supabase browser client singleton |
| `src/lib/stripe.ts` | Stripe client + helpers (checkout, portal, webhook handling) |
| `src/lib/rate-limit.ts` | In-memory rate limiter for public endpoints |
| `src/lib/notifications.ts` | Discord webhook + in-app notification system |
| `src/lib/resend.ts` | Resend email client |
| `src/middleware.ts` | Route protection: token verification, admin role check, manager role check |

### User Roles

| Role | Access |
|---|---|
| `demo` | `/dashboard` (3 call limit) |
| `solo` | `/dashboard` (paid subscriber) |
| `team` | `/dashboard` (team member) |
| `team_manager` | `/dashboard` + `/manager` |
| `admin` | `/dashboard` + `/admin` (email + DB role verified) |

### Environment Variables

All secrets are managed via Vercel environment variables. See `docs/architecture.md` for the complete list. Key additions from security audit:
- `NEXT_PUBLIC_SITE_PASSWORD` — Site gate password
- `NEXT_PUBLIC_SITE_URL` — Trusted base URL for redirects (replaces `Origin` header usage)
- `DISCORD_WEBHOOK_URL` — Moved from hardcoded to env var

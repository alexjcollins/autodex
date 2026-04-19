# Autodex — MVP Plan

## Context

Autodex is a "Pokédex for special cars" — a global directory of iconic marques (Ferrari, Porsche, Aston Martin, etc.) that lets users track cars they own (garage) and cars they aspire to own (wishlist / poster cars). This plan covers the first shippable MVP: a universal Expo app (iOS-first, web-capable) that authenticates users via WorkOS, renders a curated directory of ~40 cars sourced from Supabase, and lets users add entries to their garage and wishlist. Savings tools, YouTube aggregation, and review aggregation are explicitly out-of-scope for this pass and stubbed for follow-up work.

Visual direction: heavily inspired by Apple's Invites app — large hero imagery with blurred backdrops, bold rounded typography, spring-animated cards, modal drag-to-dismiss, glassy surfaces via `expo-blur`, and generous whitespace.

## User Decisions Captured

- **Database:** Supabase (Postgres + Storage for car images)
- **Scope:** Core loop only — auth, discover, car detail, garage, wishlist. Savings/YouTube/reviews stubbed.
- **Seed:** Curated JSON of ~40 iconic cars, hand-written specs.
- **Platform:** iOS-first; web works but not polished.
- **Auth:** WorkOS (user will supply keys in the morning)

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Expo SDK 52 + Expo Router v4 | Universal (iOS/Android/web) + typed file routes + API routes |
| Language | TypeScript (strict) | Type safety across API and client |
| Auth | WorkOS AuthKit via `expo-auth-session` | User requirement; AuthKit handles hosted flows |
| DB | Supabase Postgres | User choice; also gives Storage + CDN for images |
| ORM | Drizzle ORM + `postgres` client | Typed queries, migrations, runs server-side in Expo API routes |
| Data fetching | TanStack Query v5 | Cache, optimistic updates, mutations |
| Styling | NativeWind v4 (Tailwind for RN) | Universal styling, iOS-native feel achievable |
| Animation | `react-native-reanimated` + `moti` | Spring physics for Invites-style motion |
| Icons | `lucide-react-native` + SF Symbols via `expo-symbols` | SF Symbols on iOS for native feel |
| Blur | `expo-blur` | iOS-native glass surfaces |
| Images | `expo-image` | Perf + caching + blurhash |
| State | Zustand (UI state only) | Server state lives in TanStack Query |
| Env | `expo-constants` + `.env.local` | Safe env handling |

## Project Layout

Single-package Expo app (no monorepo — YAGNI for MVP):

```
autodex/
├── app/                        # Expo Router routes (universal)
│   ├── _layout.tsx             # Root providers: Query, Auth, Theme
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── callback.tsx        # WorkOS OAuth callback
│   ├── (tabs)/
│   │   ├── _layout.tsx         # iOS-style tab bar with blur
│   │   ├── index.tsx           # Discover (directory)
│   │   ├── garage.tsx          # My Garage
│   │   ├── wishlist.tsx        # Poster Cars
│   │   └── profile.tsx
│   ├── car/
│   │   └── [id].tsx            # Car detail (modal presentation)
│   └── api/                    # Expo Router API routes
│       ├── auth/
│       │   ├── sign-in+api.ts  # Kick off WorkOS flow
│       │   └── callback+api.ts # Exchange code → session
│       ├── cars+api.ts         # List/filter cars
│       ├── cars/[id]+api.ts
│       ├── garage+api.ts
│       └── wishlist+api.ts
├── components/
│   ├── CarCard.tsx             # Invites-style hero card
│   ├── CarDetailHeader.tsx     # Parallax hero with blur
│   ├── SpecRow.tsx
│   ├── TabBarBlur.tsx
│   ├── SectionHeader.tsx
│   └── EmptyState.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── client.ts           # Server-only DB client
│   │   └── seed.ts             # Runs curated JSON into DB
│   ├── auth/
│   │   ├── workos.ts           # Server-side WorkOS client
│   │   ├── session.ts          # Signed cookie session (iron-session style)
│   │   └── context.tsx         # React auth context
│   ├── api-client.ts           # Typed fetch wrapper
│   └── theme.ts                # Colors, type scale, radii
├── data/
│   └── cars.seed.json          # ~40 curated iconic cars
├── assets/
│   └── images/                 # Logos, placeholders
├── drizzle/                    # Generated migrations
├── app.json                    # Expo config (iOS bundle id, deep links)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.example                # WORKOS_*, SUPABASE_*, SESSION_SECRET
```

## Data Model (`lib/db/schema.ts`)

```
users            id (uuid, pk), workos_id (text, uniq), email, name, avatar_url, created_at
brands           id, slug, name, country, logo_url
cars             id, brand_id (fk), slug, name, generation, year_start, year_end,
                 body_style, drivetrain, transmission, engine_config, displacement_cc,
                 horsepower_hp, torque_nm, zero_to_sixty_s, top_speed_mph, weight_kg,
                 production_units, msrp_usd, market_value_usd, hero_image_url,
                 gallery_urls (jsonb), blurb (text), rarity ('iconic'|'rare'|'common'),
                 tags (text[]), created_at
garage_entries   id, user_id (fk), car_id (fk), acquired_at, notes, unique(user_id,car_id)
wishlist_entries id, user_id (fk), car_id (fk), priority (int), target_price_usd,
                 target_date (date, nullable), notes, unique(user_id,car_id)

-- stubs for future work (tables created but unused in UI):
savings_goals    id, wishlist_entry_id, target_amount_usd, monthly_contribution_usd,
                 current_amount_usd
videos           id, car_id, youtube_id, title, channel, published_at
reviews          id, car_id, source, excerpt, url, rating
```

Indexes on `cars.brand_id`, `cars.rarity`, `garage_entries.user_id`, `wishlist_entries.user_id`.

## Auth Flow (WorkOS)

1. `/sign-in` button → opens `expo-auth-session` with WorkOS AuthKit URL (`https://api.workos.com/user_management/authorize`).
2. Redirect URI: `autodex://auth/callback` (mobile) / `https://<host>/api/auth/callback` (web).
3. `api/auth/callback+api.ts` exchanges `code` for a WorkOS user via `workos.userManagement.authenticateWithCode`.
4. Upsert into `users` table, issue signed JWT cookie (`jose`) with 30-day TTL.
5. Client reads `/api/me` to hydrate auth context. Protected routes redirect to `/sign-in` if unauthenticated.

Env vars (user supplies in morning): `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_REDIRECT_URI`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`.

Placeholder values committed in `.env.example`; `.env.local` stays gitignored.

## Core Screens (Invites-inspired)

1. **Discover (`app/(tabs)/index.tsx`)** — full-bleed scroll. Top: large "Autodex" title with blur-behind header. Horizontal brand pills row. Vertically-stacked `CarCard`s (hero image, blurred gradient backdrop derived from dominant color, bold model name, 3 key stats row).
2. **Car Detail (`app/car/[id].tsx`)** — presented as modal (`presentation: 'modal'`) with drag-to-dismiss. Parallax hero, then sticky title bar after scroll. Sections: Stats grid, Story blurb, Tags, "Add to Garage" / "Add to Wishlist" CTAs. Videos/Reviews sections rendered as empty placeholders stating "Coming soon".
3. **Garage (`app/(tabs)/garage.tsx`)** — grid of owned cars; empty state encourages discovery.
4. **Wishlist (`app/(tabs)/wishlist.tsx`)** — list with priority indicators; savings progress shown as stub bar.
5. **Profile (`app/(tabs)/profile.tsx`)** — avatar, name, email, sign-out.

Design tokens (`lib/theme.ts`): SF Pro Display via `expo-font` on iOS, fallback system. Radii `12 / 20 / 28`. Colors: warm off-black bg, accent extracted per-card.

## Implementation Order

1. **Scaffold** — `npx create-expo-app` with router template; install deps; configure TS strict, NativeWind, Reanimated Babel plugin, Expo Router typed routes.
2. **DB + schema** — Drizzle schema, generate migration, apply to Supabase, wire `lib/db/client.ts`.
3. **Seed** — `data/cars.seed.json` (~40 cars across Ferrari, Porsche, Aston Martin, Lamborghini, McLaren, BMW M, Mercedes AMG, Audi RS, Lotus, Alpine). Each with hand-sourced hero image URL (linked, not downloaded), specs, blurb. `lib/db/seed.ts` idempotent upsert. Script runnable via `pnpm seed`.
4. **Auth scaffolding** — WorkOS server client, session cookie helpers, `/api/auth/*` routes, `sign-in` screen, auth context.
5. **API routes** — `GET /api/cars`, `GET /api/cars/[id]`, `POST/DELETE /api/garage`, `POST/DELETE /api/wishlist`, `GET /api/me`.
6. **Theme + components** — `lib/theme.ts`, `CarCard`, `TabBarBlur`, `SectionHeader`, `EmptyState`.
7. **Screens** — Discover → Car Detail → Garage → Wishlist → Profile (in that order).
8. **Polish pass** — haptics on card tap (`expo-haptics`), spring transitions, empty states, loading skeletons.
9. **Docs** — `README.md` with setup steps for the user to follow in the morning (Supabase project, WorkOS app, env vars, `pnpm db:push`, `pnpm seed`, `pnpm ios`).

## Files That Will Be Created (Critical)

- `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/garage.tsx`, `app/(tabs)/wishlist.tsx`, `app/(tabs)/profile.tsx`
- `app/car/[id].tsx`, `app/(auth)/sign-in.tsx`
- `app/api/cars+api.ts`, `app/api/cars/[id]+api.ts`, `app/api/garage+api.ts`, `app/api/wishlist+api.ts`, `app/api/auth/callback+api.ts`, `app/api/auth/sign-in+api.ts`, `app/api/me+api.ts`
- `lib/db/schema.ts`, `lib/db/client.ts`, `lib/db/seed.ts`
- `lib/auth/workos.ts`, `lib/auth/session.ts`, `lib/auth/context.tsx`
- `lib/theme.ts`, `lib/api-client.ts`
- `components/CarCard.tsx`, `components/CarDetailHeader.tsx`, `components/TabBarBlur.tsx`, `components/SpecRow.tsx`, `components/EmptyState.tsx`
- `data/cars.seed.json`
- `app.json`, `package.json`, `tsconfig.json`, `tailwind.config.js`, `babel.config.js`, `.env.example`, `.gitignore`, `README.md`, `drizzle.config.ts`

## What I Can Finish Tonight vs Needs User in Morning

**Can finish without credentials:**
- Full project scaffold, schema, seed JSON, all UI screens with mocked data provider, theme, navigation, components, API route handlers written but untested against live DB.

**Needs user to plug in Tuesday morning:**
- Supabase project URL + keys → run migration + seed.
- WorkOS API key + client ID + redirect URI → test auth flow.
- (Optional) custom iOS bundle identifier.

Until keys are provided, I'll wire the app to read from a local in-memory/JSON fallback when `DATABASE_URL` is absent, so the UI is fully demoable without any external service.

## Verification Plan

1. `pnpm install` succeeds; `pnpm typecheck` clean.
2. `pnpm ios` boots on iOS simulator; app shows sign-in screen.
3. With fallback mode (no env): tapping "Continue as Guest" (dev-only button) enters the app; Discover renders ~40 cars; Car Detail opens as modal; Add to Garage/Wishlist persists in-memory and reflects in Garage/Wishlist tabs.
4. Once user adds real env vars in morning: `pnpm db:push && pnpm seed` populates Supabase; WorkOS sign-in round-trips; garage/wishlist persist across launches.
5. `pnpm web` renders the same app in a browser (layout unpolished but functional).

## Explicit Non-Goals (Deferred)

- Savings/budgeting tools (schema exists, no UI)
- YouTube aggregation (schema exists, placeholder in UI)
- Review aggregation (schema exists, placeholder in UI)
- Spec finder / configurator
- Social features (friends' garages)
- Admin CRUD for cars (seed-only for MVP)
- Push notifications
- Android polish, web polish

## Risks & Mitigations

- **WorkOS Expo integration quirks** — fallback guest mode ensures the app is demoable while we debug the OAuth round-trip in the morning.
- **Expo API routes are still labelled experimental** — if they misbehave on mobile, I'll switch to a thin `hono` server hosted on the same origin for web and called directly from mobile; route handlers will port 1:1.
- **Image hotlinks** — MVP links to manufacturer press imagery URLs; if any 404, swap for Unsplash/Supabase Storage in follow-up.

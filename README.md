# Autodex

A Pokédex for special cars. Browse a global directory of iconic marques (Ferrari, Porsche, Aston Martin…), track cars you own, and save the ones you're chasing.

Built with Expo Router (universal iOS / Android / web), WorkOS for auth, Supabase Postgres, and NativeWind for an iOS-native look & feel inspired by Apple's Invites app.

## Status

First MVP pass. The core loop is wired end-to-end:

- Auth gate with WorkOS sign-in and a guest-mode fallback
- Discover tab with a curated set of cars + brand filter pills
- Car detail modal (drag-to-dismiss) with hero, specs grid, and add-to-garage / add-to-wishlist actions
- Garage and Wishlist tabs with empty states and live counts
- Profile with sign-out

Savings tools, YouTube aggregation, and review aggregation are intentionally stubbed — schema is ready, UI shows placeholders.

## Running it

This project uses [Bun](https://bun.sh) as its package manager and script runner.

```bash
bun install
cp .env.example .env.local   # fill in when credentials are ready
bun ios                # iOS simulator
bun web                # web
```

`bun ios` / `bun web` / `bun start` map to the corresponding Expo CLI scripts. If you don't have Bun yet: `curl -fsSL https://bun.sh/install | bash`.

Without any env vars the app runs in **fallback mode**:
- No WorkOS → "Continue as guest" button signs you in on-device.
- No `DATABASE_URL` → a small inline dataset of iconic cars is served from memory, and garage/wishlist persist for the lifetime of the dev server.

## Environment variables (set when you get to a computer)

See `.env.example`. Copy to `.env.local` and fill:

- `DATABASE_URL` — Supabase Postgres connection string (pooled)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`
- `WORKOS_REDIRECT_URI` — defaults to `autodex://auth/callback` for native; add a web URL if you want web sign-in
- `SESSION_SECRET` — 32+ random bytes (`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
- `EXPO_PUBLIC_API_URL` — only needed if you host the API separately from the Expo dev server

Once those are in place:

```bash
bun db:push   # apply Drizzle schema to Supabase
```

## Project layout

```
app/
  _layout.tsx             # root providers + auth gate
  (auth)/sign-in.tsx
  (tabs)/
    _layout.tsx           # blurred iOS-style tab bar
    index.tsx             # Discover
    garage.tsx
    wishlist.tsx
    profile.tsx
  car/[id].tsx            # modal detail sheet
  api/
    cars+api.ts
    cars/[id]+api.ts
    garage+api.ts
    wishlist+api.ts
    me+api.ts
    auth/sign-in+api.ts
    auth/callback+api.ts
    auth/sign-out+api.ts
components/
  CarCard.tsx
  SpecRow.tsx
  TabBarBlur.tsx
  EmptyState.tsx
lib/
  api-client.ts
  theme.ts
  auth/{workos,session,context}.ts
  db/{schema,client}.ts
  data/{fallback,store}.ts   # in-memory demo data
docs/
  MVP_PLAN.md
```

## Design direction

iOS-native, heavily inspired by Apple's Invites app:
- Large hero imagery with gradient overlays
- Bold rounded typography with SF Pro
- Blurred tab bar (`expo-blur`)
- Spring-animated card entrances via `moti` / `react-native-reanimated`
- Haptics on card taps and successful add actions
- Modal presentation with slide-from-bottom animation for car detail

## Roadmap

- Replace fallback data with curated seed of ~40 iconic cars in `data/cars.seed.json` + `lib/db/seed.ts`
- Wire Drizzle-backed API routes behind a `isDbConfigured` check
- Savings / budgeting for wishlist items
- YouTube Data API aggregation per car
- Curated review excerpts (Evo / Top Gear / Car & Driver)
- Spec configurator ("find me the right 997 Turbo")
- Social: follow friends' garages

## License

Private / all rights reserved.

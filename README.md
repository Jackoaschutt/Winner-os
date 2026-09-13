# WINNER OS

> Find the products. Find the ads. Find the opportunity.

A free ecommerce intelligence platform — inspired by the *workflow* of tools
like Kalodata, Minea, Dropship.io and AdSpy, built from scratch with
original branding, UI and code. It takes a beginner from **product idea →
validation → winning product → winning ads → creative angle → store
research → test plan**, in one dark, premium dashboard.

"WINNER OS" is a placeholder name — rebrand freely (see `app/layout.tsx`
metadata and `components/layout/Sidebar.tsx` for the two places the name
appears in-app).

---

## 1. What was built

A full Next.js 14 (App Router) + TypeScript + Tailwind application:

- **Landing page** — hero, animated dashboard preview, workflow section, free-forever pricing block.
- **Auth + onboarding** — demo-mode sign up/login, 3-step onboarding (goal, region, experience level).
- **Dashboard / command center** — greeting header, live stat rollups, four ranked product rails (Trending / Fastest Growing / Highest Revenue / AI Opportunities), a Next Best Action banner, Today's Opportunities grid, and a draggable Three.js "Product Intelligence Sphere."
- **Product Discovery** — natural-language + AI-routed search, quick filters (country, category, price, growth, competition, ad count), sortable results.
- **Product Detail** — Overview, Demand (interactive Recharts with 7D–180D ranges and 5 metrics), Ads, Creatives, Stores, Reviews, and AI Analysis tabs; Opportunity Score ring with a "Why this score?" breakdown; a full AI research report generator with a TEST / WATCH / AVOID verdict.
- **Ad Spy** — search + filters (platform, active days, product), ad preview cards, a Winning Ad badge (score ≥ 75), and a per-ad "Why might this be working?" AI breakdown.
- **Creatives** — a Creative Analyzer (paste ad copy → structural breakdown → 3 original hooks/primary texts/headlines/CTAs/UGC concepts/video scripts, never a verbatim copy) and a Creative Vault with the 10 folders from the spec.
- **Store Spy** — domain lookup, a full store breakdown (what's working / not working / what to copy / what to improve / opportunity), plus a browsable store directory and per-store best-sellers.
- **Competitor Intelligence** — track any store, see generated recent-activity alerts (price/product/offer/creative changes).
- **Trend Radar** — product/category/market trends with momentum, competition and opportunity scores, a lifecycle stage, and a 30-day sparkline.
- **AI Researcher** — a structured conversational interface (not walls of prose) that filters and ranks the live product set from plain-English queries.
- **Watchlist** — save/sort products by opportunity, growth, competition, ad count, or trend length.
- **Product Comparison** — compare up to 4 products side-by-side with an AI winner pick and reasoning.
- **My Tests (Test Lab)** — real unit-economics math (margin, break-even ROAS/CPA, potential profit/loss) plus a "Build My Test" 5-day test-plan generator (creative → hook → audience → kill losers → scale winners) with budgets and KPIs per day.
- **Settings** — account info, current data mode, and AI provider status.
- **Global Cmd+K search**, collapsible sidebar, mobile bottom nav + slide-out menu, "What does this mean?" tooltips on advanced metrics, and consistent Actual/Estimated/AI-generated/Demo data labeling throughout.

## 2. What's functional

Everything listed above is wired to real interaction — every button either
does something (filters, saves state, generates a report, calculates
numbers) or navigates somewhere real. Nothing is a dead click. State that
should persist (watchlist, saved tests, tracked competitors, your profile)
survives a refresh via `localStorage` (see `lib/state/useAppStore.ts`).

The **Opportunity Score**, **unit-economics calculator**, and **lifecycle /
trend classification** are real, deterministic formulas — not random numbers
— in `lib/analytics/`. The demo dataset is generated once from those same
formulas so a product's revenue, sales, growth, competition, and score all
imply each other consistently (`lib/data/generate.ts`).

## 3. What uses demo data

**Everything ships in `DATA_PROVIDER_MODE=demo` by default** (see
`.env.example`). That means:

- 100 products across 20 categories, 100 ads, 30 stores, 50 saved
  creatives, and 15 trends — generated once per server process from a fixed
  seed, so numbers are stable and internally consistent, not fabricated
  noise.
- Every card, chart, and table that shows this data carries a visible
  **"Demo dataset"** badge (`components/ui/DataLabel.tsx`).
- The **AI features** (Ad breakdowns, Creative Analyzer, Research Reports,
  Test Plans, AI Researcher) run on a **rule-based "demo AI"** in
  `lib/ai/features.ts` when no AI provider key is configured. Output is
  labeled **"AI-generated (demo)"**. It's genuinely structured and
  data-driven (built from the actual product/ad stats), just not a live
  LLM call.

Nothing fabricates a metric that isn't derivable from the shared demo
dataset — a product's revenue, sales, and price are always mutually
consistent (see `buildHistory()` in `lib/data/generate.ts`).

## 4. What's required for live data

Nothing is required to run the app — it works with zero keys. To move
pieces off demo data:

| Feature | What to add |
|---|---|
| Real product/ad/store data | Implement the methods on `LiveDataProvider` in `lib/data/provider.ts` (adapters for TikTok Creative Center, Meta Ad Library, a Shopify/store analysis service, a supplier feed, etc.), then set `DATA_PROVIDER_MODE=live`. |
| Live AI (Anthropic / OpenAI / Gemini) | Set `AI_PROVIDER` + the matching API key in `.env.local` (see `.env.example`). `lib/ai/provider.ts` already implements all three HTTP calls. |
| Real auth + persistence | Follow `lib/auth/README.md` to wire Supabase auth and move `watchlist`/`tests`/`competitors`/`profile` from `localStorage` into the tables in `supabase/schema.sql`. |
| Meta Ad Library search | Add `META_AD_LIBRARY_ACCESS_TOKEN` and implement the adapter in `getAds()` / `getAdsForProduct()`. |

## 5. Commands to run locally

```bash
npm install
cp .env.example .env.local   # optional — the app runs fine with none of these set
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## 6. Environment variables

See `.env.example` for the full list with comments. Summary:

- `DATA_PROVIDER_MODE` — `demo` (default) or `live`.
- `AI_PROVIDER` + `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` — optional, enables live AI.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — optional, only needed once you wire up real auth/DB per `lib/auth/README.md`.
- `META_AD_LIBRARY_ACCESS_TOKEN`, `TIKTOK_CREATIVE_CENTER_API_KEY`, `GOOGLE_TRENDS_API_KEY` — optional, for live data adapters.

## 7. Deployment (Vercel)

```bash
npm install -g vercel   # if you don't already have it
vercel login
vercel                  # first deploy, follow the prompts
vercel --prod           # promote to production
```

Or connect the repo in the Vercel dashboard for git-based deploys. Either
way, add any `.env.local` values you want live (Settings → Environment
Variables) before deploying — the app runs fine with none set.

---

## Project structure

```
app/                    Next.js App Router pages
  (app)/                Authenticated routes (dashboard, products, ad-spy, ...)
  login/, onboarding/   Public auth flow
  page.tsx              Landing page
components/
  ui/                   Design-system primitives (Card, Badge, Button, Tabs, ScoreRing, ...)
  layout/               Sidebar, Topbar, mobile nav, Cmd+K command palette
  products/, ads/, stores/, creatives/, trends/, competitors/, researcher/, tests/, watchlist/
  three/                Product Intelligence Sphere (Three.js)
lib/
  data/                 Types-first data provider (demo generator + live adapter stubs)
  analytics/            Opportunity Score, lifecycle classification, test-lab math
  ai/                   AI provider abstraction (Claude/OpenAI/Gemini) + feature functions
  state/                Zustand store (session, watchlist, tests, competitors, compare tray)
  auth/                 Notes for swapping in real Supabase auth
types/                  Shared normalized types (Product, Ad, Store, Trend, ...)
supabase/schema.sql     Reference schema for moving off demo mode
```

## Design notes

Dark, glass-panel, red/orange-accent design system defined in
`tailwind.config.ts` and `app/globals.css` (`.glass-panel`, `.glow-border`,
`.text-gradient`, `.accent-gradient`). No external font is fetched at build
time (keeps the build network-independent) — swap the `font-family` in
`app/globals.css` for `next/font/google`'s Inter once you're building in an
environment with normal internet access, if you want the exact spec'd font.

No fake claims anywhere in the copy ("guaranteed," "100% winning," etc.) —
only "opportunity," "signal," and "potential" language, per the brief.

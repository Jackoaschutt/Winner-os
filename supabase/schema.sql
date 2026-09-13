-- WINNER OS — reference schema for moving off demo mode onto Supabase.
-- This is not applied automatically. Run it against a Supabase project
-- (via the SQL editor, the Supabase CLI, or the Supabase MCP tools) when
-- you're ready to back auth + persistence with a real database.
--
-- Row Level Security is enabled everywhere a user should only see their
-- own rows. Adjust policies to match your actual auth setup.

-- ---------------------------------------------------------------------
-- Users / profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  goal text,
  region text,
  experience text check (experience in ('Beginner', 'Intermediate', 'Advanced')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles are self-readable" on public.profiles for select using (auth.uid() = id);
create policy "profiles are self-writable" on public.profiles for update using (auth.uid() = id);
create policy "profiles are self-insertable" on public.profiles for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------
-- Catalog data (populated by your live data adapters, not per-user)
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  momentum int
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  image text,
  category_id text references public.categories (id),
  price numeric,
  supplier_cost numeric,
  currency text,
  revenue numeric,
  revenue_trend_30d numeric,
  sales int,
  growth numeric,
  ad_count int,
  creator_count int,
  store_count int,
  days_trending int,
  competition numeric,
  opportunity_score int,
  opportunity_breakdown jsonb,
  trend text,
  lifecycle text,
  country text,
  launch_date date,
  tags text[],
  description text,
  review_signals jsonb,
  data_label text default 'estimated',
  created_at timestamptz not null default now()
);

create table if not exists public.product_metrics (
  id bigint generated always as identity primary key,
  product_id text references public.products (id) on delete cascade,
  date date not null,
  revenue numeric,
  sales int,
  search_interest numeric,
  ad_activity numeric,
  competition_index numeric,
  unique (product_id, date)
);

create table if not exists public.stores (
  id text primary key,
  name text not null,
  domain text not null,
  category text,
  country text,
  product_count int,
  estimated_traffic int,
  ad_count int,
  best_sellers text[],
  pricing_notes text,
  trust_signals text[],
  upsells text[],
  founded text,
  strengths text[],
  weaknesses text[],
  opportunity text,
  data_label text default 'estimated'
);

create table if not exists public.ads (
  id text primary key,
  product_id text references public.products (id) on delete set null,
  brand text,
  platform text,
  media_type text,
  thumbnail text,
  copy text,
  headline text,
  cta text,
  launch_date date,
  active_days int,
  likes int,
  comments int,
  shares int,
  estimated_spend numeric,
  country text,
  creative_score int,
  winning_score int,
  angle text,
  hook text,
  data_label text default 'estimated'
);

create table if not exists public.trends (
  id text primary key,
  name text not null,
  type text check (type in ('product', 'category', 'market')),
  momentum int,
  competition int,
  opportunity int,
  age_days int,
  lifecycle text,
  related_product_ids text[]
);

-- ---------------------------------------------------------------------
-- Per-user data
-- ---------------------------------------------------------------------
create table if not exists public.watchlists (
  user_id uuid references auth.users (id) on delete cascade,
  product_id text references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
alter table public.watchlists enable row level security;
create policy "watchlist is self-scoped" on public.watchlists for all using (auth.uid() = user_id);

create table if not exists public.competitors (
  user_id uuid references auth.users (id) on delete cascade,
  store_id text references public.stores (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, store_id)
);
alter table public.competitors enable row level security;
create policy "competitors is self-scoped" on public.competitors for all using (auth.uid() = user_id);

create table if not exists public.saved_creatives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  ad_id text references public.ads (id) on delete cascade,
  folder text,
  tags text[],
  notes text,
  saved_at timestamptz not null default now()
);
alter table public.saved_creatives enable row level security;
create policy "saved_creatives is self-scoped" on public.saved_creatives for all using (auth.uid() = user_id);

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  product_id text references public.products (id) on delete set null,
  inputs jsonb not null,
  results jsonb not null,
  plan jsonb,
  status text default 'planning' check (status in ('planning', 'testing', 'won', 'killed')),
  created_at timestamptz not null default now()
);
alter table public.tests enable row level security;
create policy "tests is self-scoped" on public.tests for all using (auth.uid() = user_id);

create table if not exists public.research_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  product_id text references public.products (id) on delete cascade,
  report jsonb not null,
  verdict text check (verdict in ('TEST', 'WATCH', 'AVOID')),
  created_at timestamptz not null default now()
);
alter table public.research_reports enable row level security;
create policy "research_reports is self-scoped" on public.research_reports for all using (auth.uid() = user_id);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  kind text, -- 'creative_analysis' | 'ad_breakdown' | 'research_report' | 'test_plan' | 'chat'
  input jsonb,
  output jsonb,
  provider text,
  created_at timestamptz not null default now()
);
alter table public.ai_generations enable row level security;
create policy "ai_generations is self-scoped" on public.ai_generations for all using (auth.uid() = user_id);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  query text not null,
  filters jsonb,
  created_at timestamptz not null default now()
);
alter table public.saved_searches enable row level security;
create policy "saved_searches is self-scoped" on public.saved_searches for all using (auth.uid() = user_id);

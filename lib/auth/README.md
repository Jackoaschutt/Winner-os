# Swapping in real Supabase auth

The current build ships **demo-mode auth** so the product works with zero
configuration: `app/login/page.tsx` accepts any email (no password check)
and stores a session in the client-side Zustand store
(`lib/state/useAppStore.ts`, persisted to `localStorage`).

To replace it with real Supabase auth:

1. `npm install @supabase/supabase-js @supabase/ssr`
2. Create a Supabase client helper (`lib/supabase/server.ts` and
   `lib/supabase/client.ts`) using `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`.
3. Apply `supabase/schema.sql` to your project (via the Supabase SQL editor,
   CLI, or the Supabase MCP tools) — it includes a `profiles` table shaped
   like `UserProfile` in `types/index.ts`, plus RLS policies.
4. Replace `app/login/page.tsx`'s `login()` call with
   `supabase.auth.signInWithPassword` / `signUp`, and add a Google OAuth
   button with `supabase.auth.signInWithOAuth({ provider: "google" })`.
5. Replace `components/auth/AuthGate.tsx`'s client-side session check with a
   server-side check (middleware or a server component reading the Supabase
   session cookie) so protected routes are enforced server-side, not just
   redirected client-side.
6. Move `watchlist`, `tests`, `competitors` and `profile` out of the
   Zustand-persisted `localStorage` store and into Supabase tables
   (`watchlists`, `tests`, `competitors`, `profiles`) so they sync across
   devices. The shapes already match — see `supabase/schema.sql`.

Nothing else in the app needs to change: every page reads the current user
through the same `useAppStore` selectors, so as long as the store is fed by
Supabase instead of `localStorage`, the rest of the UI is unaffected.

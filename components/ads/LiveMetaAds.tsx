"use client";

import { useEffect, useState } from "react";
import { Search, ExternalLink, AlertCircle, Loader2, Radio } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";
import { MetaAd } from "@/lib/ads/metaAdLibrary";

const COUNTRIES: { code: string; label: string }[] = [
  { code: "AU", label: "Australia" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
];

type ApiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; kind: "no_token" | "no_results" | "api_error"; detail?: string }
  | { status: "ok"; ads: MetaAd[] };

export function LiveMetaAds({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState("AU");
  const [state, setState] = useState<ApiState>({ status: "idle" });

  async function runSearch(q: string, c: string) {
    if (!q.trim()) return;
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/meta-ads?q=${encodeURIComponent(q)}&country=${c}&limit=9`);
      const json = await res.json();
      if (json.error) {
        setState({ status: "error", kind: json.error, detail: json.errorDetail });
      } else {
        setState({ status: "ok", ads: json.ads });
      }
    } catch (e: any) {
      setState({ status: "error", kind: "api_error", detail: e?.message });
    }
  }

  // Auto-run once if we were handed a starting query (e.g. jumped here from a product page).
  useEffect(() => {
    if (initialQuery.trim()) runSearch(initialQuery, country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel mb-6 rounded-xl2 border border-accent/20 p-5 shadow-glass">
      <div className="mb-3 flex items-center gap-2">
        <Radio size={15} className="text-accent-soft" />
        <h2 className="text-sm font-semibold text-white">Live Meta Ad Library</h2>
        <Badge tone="good" className="text-[10px]">Real ads, not estimates</Badge>
      </div>
      <p className="mb-4 text-xs text-white/40">
        Pulled straight from Meta's own Ad Library API — real advertisers, real copy, and the actual creative
        (image or video) playing exactly as it runs, embedded below.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch(query, country)}
            placeholder="Brand, page name, or product keyword..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-accent/50"
          />
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border border-white/10 bg-base-900 px-3 py-2.5 text-sm text-white"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
        <button
          onClick={() => runSearch(query, country)}
          disabled={!query.trim() || state.status === "loading"}
          className="accent-gradient shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {state.status === "loading" ? <Loader2 size={15} className="animate-spin" /> : "Search"}
        </button>
      </div>

      <div className="mt-5">
        {state.status === "idle" && (
          <p className="py-6 text-center text-xs text-white/30">
            Search a brand or product above to pull its real, currently-running (or recently-run) Meta ads.
          </p>
        )}

        {state.status === "loading" && (
          <p className="flex items-center justify-center gap-2 py-10 text-sm text-white/40">
            <Loader2 size={16} className="animate-spin" /> Querying Meta's Ad Library...
          </p>
        )}

        {state.status === "error" && state.kind === "no_token" && (
          <div className="flex items-start gap-3 rounded-lg border border-warn/30 bg-warn/10 p-4 text-xs text-white/70">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-warn" />
            <div>
              <p className="mb-1 font-medium text-white">No Meta Ad Library access token configured</p>
              <p>
                Add <code className="rounded bg-black/30 px-1 py-0.5">META_AD_LIBRARY_ACCESS_TOKEN</code> to your
                environment variables (Vercel → Settings → Environment Variables, or{" "}
                <code className="rounded bg-black/30 px-1 py-0.5">.env.local</code> for local dev) — see{" "}
                <code className="rounded bg-black/30 px-1 py-0.5">.env.example</code>. Get a token from{" "}
                <a
                  href="https://developers.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-soft underline"
                >
                  developers.facebook.com
                </a>{" "}
                → create an app → add the Marketing API product → generate a token with <code className="rounded bg-black/30 px-1 py-0.5">ads_read</code>.
              </p>
            </div>
          </div>
        )}

        {state.status === "error" && state.kind === "no_results" && (
          <p className="py-8 text-center text-sm text-white/40">
            No ads found on Meta for that search. Try a broader term, a different country, or the exact brand name.
          </p>
        )}

        {state.status === "error" && state.kind === "api_error" && (
          <div className="flex items-start gap-3 rounded-lg border border-bad/30 bg-bad/10 p-4 text-xs text-white/70">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-bad" />
            <div>
              <p className="mb-1 font-medium text-white">Meta's API returned an error</p>
              <p>{state.detail || "Unknown error — check your access token is valid and hasn't expired."}</p>
            </div>
          </div>
        )}

        {state.status === "ok" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.ads.map((ad) => (
              <div key={ad.id} className="overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{ad.pageName}</p>
                    <p className="text-[11px] text-white/40">
                      {ad.isActive ? "Still running" : `Ended ${ad.stopDate ? formatDate(ad.stopDate) : ""}`}
                      {ad.startDate ? ` · started ${formatDate(ad.startDate)}` : ""}
                    </p>
                  </div>
                  <a
                    href={ad.snapshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on Meta Ad Library"
                    className="shrink-0 text-white/40 hover:text-white"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <iframe
                  src={ad.snapshotUrl}
                  title={`Meta ad from ${ad.pageName}`}
                  loading="lazy"
                  className="h-[520px] w-full border-0 bg-black"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
                {ad.bodyText && <p className="line-clamp-2 p-3 text-xs text-white/60">{ad.bodyText}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

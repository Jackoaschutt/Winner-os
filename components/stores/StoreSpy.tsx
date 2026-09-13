"use client";

import { useMemo, useState } from "react";
import { Store } from "@/types";
import { Search, Store as StoreIcon, Globe } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCompact } from "@/lib/utils/format";
import Link from "next/link";

export function StoreSpy({ stores }: { stores: Store[] }) {
  const [query, setQuery] = useState("");
  const [lookup, setLookup] = useState("");
  const [matched, setMatched] = useState<Store | null | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!query) return stores;
    const q = query.toLowerCase();
    return stores.filter((s) => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [stores, query]);

  function handleLookup() {
    if (!lookup.trim()) return;
    const q = lookup.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const found = stores.find((s) => s.domain.toLowerCase() === q || s.domain.toLowerCase().includes(q));
    setMatched(found || null);
  }

  return (
    <div>
      <div className="glass-panel mb-6 rounded-xl2 p-6 shadow-glass">
        <h1 className="mb-1 text-xl font-semibold text-white">Store Spy</h1>
        <p className="mb-4 text-sm text-white/45">Enter a domain to pull a breakdown, or browse tracked stores below.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Globe size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-accent/50"
            />
          </div>
          <Button onClick={handleLookup}>Analyze Store</Button>
        </div>
        {matched === null && (
          <p className="mt-3 text-xs text-warn">No tracked store matches that domain yet in this demo dataset — try one from the list below.</p>
        )}
        {matched && (
          <div className="mt-4">
            <StoreBreakdownCard store={matched} />
          </div>
        )}
      </div>

      <div className="mb-4 relative">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tracked stores..."
          className="w-full max-w-sm rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-accent/50"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link key={s.id} href={`/stores/${s.id}`} className="glass-panel block rounded-xl2 p-5 shadow-glass transition-transform hover:-translate-y-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StoreIcon size={15} className="text-accent-soft" />
                <p className="text-sm font-semibold text-white">{s.name}</p>
              </div>
              <Badge tone="neutral">{s.country}</Badge>
            </div>
            <p className="mb-3 text-xs text-white/40">{s.domain}</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/40">
              <div><p className="font-semibold text-white/80">{s.productCount}</p>products</div>
              <div><p className="font-semibold text-white/80">{formatCompact(s.estimatedTraffic)}</p>traffic/mo</div>
              <div><p className="font-semibold text-white/80">{s.adCount}</p>active ads</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function StoreBreakdownCard({ store }: { store: Store }) {
  return (
    <div className="glass-panel rounded-xl2 p-5 shadow-glass">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{store.name}</p>
          <p className="text-xs text-white/40">{store.domain}</p>
        </div>
        <Badge tone="neutral">{store.category}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-good">What this store is doing well</p>
          <ul className="space-y-1 text-sm text-white/65">{store.strengths.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-warn">What this store is doing badly</p>
          <ul className="space-y-1 text-sm text-white/65">{store.weaknesses.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent-soft">What I would copy</p>
          <ul className="space-y-1 text-sm text-white/65">{store.strengths.slice(0, 2).map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">What I would improve</p>
          <ul className="space-y-1 text-sm text-white/65">{store.weaknesses.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/35">Potential Opportunity</p>
        <p className="mt-1 text-sm text-white/70">{store.opportunity}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
        <Info label="Pricing" value={store.pricingNotes} />
        <Info label="Trust Signals" value={store.trustSignals.join(", ")} />
        <Info label="Upsells" value={store.upsells.join(", ")} />
        <Info label="Founded" value={store.founded} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/35">{label}</p>
      <p className="mt-0.5 text-white/65">{value}</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Store } from "@/types";
import { useAppStore } from "@/lib/state/useAppStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { generateAlertsForStore } from "@/lib/data/alerts";
import { formatCompact, formatDate } from "@/lib/utils/format";
import { Plus, Check, Tag, DollarSign, Package, Film } from "lucide-react";

const iconFor = { price: DollarSign, product: Package, offer: Tag, creative: Film };

export function CompetitorTracker({ stores }: { stores: Store[] }) {
  const competitors = useAppStore((s) => s.competitors);
  const toggleCompetitor = useAppStore((s) => s.toggleCompetitor);
  const [query, setQuery] = useState("");

  const tracked = stores.filter((s) => competitors.includes(s.id));
  const candidates = useMemo(() => {
    const q = query.toLowerCase();
    return stores.filter((s) => !competitors.includes(s.id) && (!q || s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q))).slice(0, 8);
  }, [stores, competitors, query]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-white">Competitor Intelligence</h1>
      <p className="mb-6 text-sm text-white/45">Track stores to watch for pricing, product and creative changes.</p>

      {tracked.length > 0 && (
        <div className="mb-8 space-y-4">
          {tracked.map((store) => {
            const alerts = generateAlertsForStore(store);
            return (
              <div key={store.id} className="glass-panel rounded-xl2 p-5 shadow-glass">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{store.name}</p>
                    <p className="text-xs text-white/40">{store.domain} · {store.category} · {store.country}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone="neutral">{formatCompact(store.estimatedTraffic)} traffic/mo</Badge>
                    <Button size="sm" variant="ghost" onClick={() => toggleCompetitor(store.id)}>Untrack</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {alerts.map((a) => {
                    const Icon = iconFor[a.type];
                    return (
                      <div key={a.id} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-xs">
                        <Icon size={13} className="shrink-0 text-accent-soft" />
                        <span className="text-white/70">{a.message}</span>
                        <span className="ml-auto shrink-0 text-white/30">{formatDate(a.date)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-panel rounded-xl2 p-5 shadow-glass">
        <h2 className="mb-3 text-sm font-semibold text-white">Add a competitor to track</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stores..."
          className="mb-4 w-full max-w-sm rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/50"
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleCompetitor(s.id)}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-white/70 hover:border-white/20"
            >
              <span className="truncate">{s.name}</span>
              <Plus size={14} className="shrink-0 text-white/30" />
            </button>
          ))}
        </div>
        {tracked.length === 0 && candidates.length === 0 && <p className="text-sm text-white/30">No stores available.</p>}
      </div>
    </div>
  );
}

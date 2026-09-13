"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import { useAppStore } from "@/lib/state/useAppStore";
import { formatCurrency, formatCompact, formatPct } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Button } from "@/components/ui/Button";
import { Layers, Sparkles, X } from "lucide-react";
import Image from "next/image";

const ROWS: { key: keyof Product | "margin"; label: string; format: (p: Product) => string }[] = [
  { key: "price", label: "Price", format: (p) => formatCurrency(p.price) },
  { key: "margin", label: "Margin", format: (p) => `${Math.round(((p.price - p.supplierCost) / p.price) * 100)}%` },
  { key: "revenue", label: "Revenue / mo", format: (p) => formatCompact(p.revenue) },
  { key: "growth", label: "Growth", format: (p) => formatPct(p.growth) },
  { key: "competition", label: "Competition", format: (p) => `${p.competition}/100` },
  { key: "adCount", label: "Ad Activity", format: (p) => `${p.adCount} ads` },
  { key: "opportunity" as any, label: "Opportunity Score", format: (p) => `${p.opportunity.score}/100` },
];

export function CompareView({ products }: { products: Product[] }) {
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState("");

  const selected = products.filter((p) => compareIds.includes(p.id));
  const winner = useMemo(() => {
    if (selected.length < 2) return null;
    return [...selected].sort((a, b) => b.opportunity.score - a.opportunity.score)[0];
  }, [selected]);

  const candidates = products.filter((p) => !compareIds.includes(p.id) && (!query || p.name.toLowerCase().includes(query.toLowerCase()))).slice(0, 8);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Product Comparison</h1>
          <p className="text-sm text-white/45">Select up to 4 products to compare side by side.</p>
        </div>
        <Button variant="outline" onClick={() => setShowPicker((v) => !v)}>
          <Layers size={14} /> Add Product
        </Button>
      </div>

      {showPicker && (
        <div className="glass-panel mb-6 rounded-xl2 p-4 shadow-glass">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="mb-3 w-full max-w-sm rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {candidates.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleCompare(p.id)}
                disabled={compareIds.length >= 4}
                className="truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white/70 hover:border-white/20 disabled:opacity-30"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length === 0 ? (
        <div className="glass-panel rounded-xl2 p-16 text-center shadow-glass">
          <p className="text-sm text-white/40">No products selected. Add products from Discovery or above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <td className="w-32" />
                {selected.map((p) => (
                  <td key={p.id} className="px-2">
                    <div className="glass-panel relative rounded-xl2 p-4 text-center shadow-glass">
                      <button onClick={() => toggleCompare(p.id)} className="absolute right-2 top-2 text-white/30 hover:text-white">
                        <X size={13} />
                      </button>
                      <div className="relative mx-auto mb-2 h-16 w-16 overflow-hidden rounded-lg bg-base-800">
                        <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" unoptimized />
                      </div>
                      <p className="line-clamp-1 text-xs font-medium text-white">{p.name}</p>
                      {winner?.id === p.id && <Badge tone="good" className="mt-2">Winner</Badge>}
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="px-2 py-1.5 text-xs font-medium text-white/40">{row.label}</td>
                  {selected.map((p) => (
                    <td key={p.id} className="rounded-lg bg-white/5 px-3 py-2 text-center text-sm text-white/80">
                      {row.key === ("opportunity" as any) ? (
                        <div className="flex justify-center"><ScoreRing score={p.opportunity.score} size={40} strokeWidth={3.5} /></div>
                      ) : (
                        row.format(p)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {winner && (
            <div className="glass-panel glow-border mt-6 rounded-xl2 p-5 shadow-glass">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={15} className="text-accent-soft" />
                <p className="text-sm font-semibold text-white">WINNER: {winner.name}</p>
              </div>
              <p className="text-sm text-white/60">
                Why: {winner.name} leads on Opportunity Score ({winner.opportunity.score}/100), driven by{" "}
                {winner.opportunity.breakdown.demand >= 60 ? "strong demand" : "reasonable demand"} and{" "}
                {winner.opportunity.breakdown.competition <= 50 ? "comparatively low competition" : "a competitive but active market"}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

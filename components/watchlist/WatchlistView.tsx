"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import { useAppStore } from "@/lib/state/useAppStore";
import { ProductCard } from "@/components/products/ProductCard";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SORTS = [
  { key: "opportunity", label: "Highest Opportunity" },
  { key: "growth", label: "Fastest Growth" },
  { key: "competition", label: "Lowest Competition" },
  { key: "adCount", label: "Most Ads" },
  { key: "daysTrending", label: "Longest Running Ads" },
] as const;

export function WatchlistView({ products }: { products: Product[] }) {
  const watchlist = useAppStore((s) => s.watchlist);
  const [sortBy, setSortBy] = useState<(typeof SORTS)[number]["key"]>("opportunity");

  const items = useMemo(() => {
    let pool = products.filter((p) => watchlist.includes(p.id));
    switch (sortBy) {
      case "growth": pool.sort((a, b) => b.growth - a.growth); break;
      case "competition": pool.sort((a, b) => a.competition - b.competition); break;
      case "adCount": pool.sort((a, b) => b.adCount - a.adCount); break;
      case "daysTrending": pool.sort((a, b) => b.daysTrending - a.daysTrending); break;
      default: pool.sort((a, b) => b.opportunity.score - a.opportunity.score);
    }
    return pool;
  }, [products, watchlist, sortBy]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Watchlist</h1>
          <p className="text-sm text-white/45">{items.length} saved products</p>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="rounded-lg border border-white/10 bg-base-900 px-3 py-2 text-sm text-white">
          {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel flex flex-col items-center rounded-xl2 p-16 text-center shadow-glass">
          <Eye size={22} className="mb-3 text-white/20" />
          <p className="mb-4 text-sm text-white/40">Nothing saved yet. Add products from Discovery to track them here.</p>
          <Button href="/products">
            Discover products <ArrowRight size={14} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

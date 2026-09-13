"use client";

import { useMemo, useState } from "react";
import { Ad, Platform, Product } from "@/types";
import { AdCard } from "@/components/ads/AdCard";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PLATFORMS: Platform[] = ["Meta", "TikTok", "Instagram", "Google"];

export function AdSpy({ ads, products, initialProductId }: { ads: Ad[]; products: Product[]; initialProductId?: string }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [minDays, setMinDays] = useState(0);
  const [sortBy, setSortBy] = useState<"winning" | "recent" | "spend">("winning");
  const [productFilter, setProductFilter] = useState(initialProductId || "");

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const filtered = useMemo(() => {
    let pool = ads.filter((a) => {
      const product = productMap.get(a.productId);
      if (query) {
        const q = query.toLowerCase();
        const matches =
          a.brand.toLowerCase().includes(q) ||
          a.copy.toLowerCase().includes(q) ||
          product?.name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (platform && a.platform !== platform) return false;
      if (a.activeDays < minDays) return false;
      if (productFilter && a.productId !== productFilter) return false;
      return true;
    });
    switch (sortBy) {
      case "recent":
        pool = pool.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
        break;
      case "spend":
        pool = pool.sort((a, b) => b.estimatedSpend - a.estimatedSpend);
        break;
      default:
        pool = pool.sort((a, b) => b.winningScore - a.winningScore);
    }
    return pool;
  }, [ads, query, platform, minDays, productFilter, sortBy, productMap]);

  return (
    <div>
      <div className="glass-panel mb-6 rounded-xl2 p-6 shadow-glass">
        <h1 className="mb-1 text-xl font-semibold text-white">Ad Spy</h1>
        <p className="mb-4 text-sm text-white/45">Search by product, brand, or keyword. Longevity is the strongest signal — an ad still running is an ad that's working.</p>
        <div className="relative mb-4">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product, brand, or keyword..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-accent/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={platform === ""} onClick={() => setPlatform("")}>All Platforms</FilterChip>
          {PLATFORMS.map((p) => (
            <FilterChip key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</FilterChip>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-base-900 px-2 py-1.5 text-xs text-white"
            >
              <option value="">All products</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-white/10 bg-base-900 px-2 py-1.5 text-xs text-white"
            >
              <option value="winning">Sort: Winning Score</option>
              <option value="recent">Sort: Most Recent</option>
              <option value="spend">Sort: Est. Spend</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-white/40">Min active days: {minDays}</label>
          <input type="range" min={0} max={90} value={minDays} onChange={(e) => setMinDays(Number(e.target.value))} className="w-full max-w-xs accent-accent" />
        </div>
      </div>

      <p className="mb-3 text-sm text-white/45">{filtered.length} ads found</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((ad) => (
          <AdCard key={ad.id} ad={ad} product={productMap.get(ad.productId)} />
        ))}
      </div>
      {filtered.length === 0 && <p className="py-20 text-center text-white/30">No ads match those filters.</p>}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active ? "border-accent/50 bg-accent/15 text-accent-soft" : "border-white/10 text-white/50 hover:text-white/80"
      )}
    >
      {children}
    </button>
  );
}

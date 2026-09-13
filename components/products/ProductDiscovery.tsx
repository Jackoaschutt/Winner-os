"use client";

import { useMemo, useState } from "react";
import { Category, Country, Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { routeResearcherQuery } from "@/lib/ai/features";

const COUNTRIES: Country[] = ["Australia", "United States", "United Kingdom", "Canada", "Germany", "France"];

const EXAMPLES = [
  "Find me low competition beauty products",
  "Find products under $30 with rising demand",
  "Find products with lots of Meta ads",
  "Find products trending in Australia",
];

export function ProductDiscovery({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [country, setCountry] = useState<Country | "">("");
  const [category, setCategory] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState(150);
  const [minGrowth, setMinGrowth] = useState(-60);
  const [maxCompetition, setMaxCompetition] = useState(100);
  const [minAds, setMinAds] = useState(0);
  const [sortBy, setSortBy] = useState<"opportunity" | "growth" | "revenue" | "adCount">("opportunity");

  const aiResult = useMemo(() => {
    if (!aiMode || !query.trim()) return null;
    return routeResearcherQuery(query, products);
  }, [aiMode, query, products]);

  const filtered = useMemo(() => {
    let pool = [...products];
    if (aiResult?.productIds) {
      const idSet = new Set(aiResult.productIds);
      pool = pool.filter((p) => idSet.has(p.id));
    } else if (query.trim() && !aiMode) {
      const q = query.toLowerCase();
      pool = pool.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (country) pool = pool.filter((p) => p.country === country);
    if (category) pool = pool.filter((p) => p.category === category);
    pool = pool.filter((p) => p.price <= maxPrice && p.growth >= minGrowth && p.competition <= maxCompetition && p.adCount >= minAds);

    switch (sortBy) {
      case "growth":
        pool.sort((a, b) => b.growth - a.growth);
        break;
      case "revenue":
        pool.sort((a, b) => b.revenue - a.revenue);
        break;
      case "adCount":
        pool.sort((a, b) => b.adCount - a.adCount);
        break;
      default:
        pool.sort((a, b) => b.opportunity.score - a.opportunity.score);
    }
    return pool;
  }, [products, query, aiMode, aiResult, country, category, maxPrice, minGrowth, maxCompetition, minAds, sortBy]);

  return (
    <div>
      <div className="glass-panel mb-6 rounded-xl2 p-6 shadow-glass">
        <h1 className="mb-1 text-xl font-semibold text-white">Find Your Next Winner</h1>
        <p className="mb-4 text-sm text-white/45">Search plainly, or use filters for precision. All results ranked by Opportunity Score.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-accent/50"
            />
          </div>
          <button
            onClick={() => setAiMode((v) => !v)}
            className={cn(
              "shrink-0 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
              aiMode ? "border-accent/50 bg-accent/15 text-accent-soft" : "border-white/10 bg-white/5 text-white/50"
            )}
          >
            AI Search {aiMode ? "on" : "off"}
          </button>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/60 hover:text-white"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuery(ex);
                setAiMode(true);
              }}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/40 hover:border-white/20 hover:text-white/70"
            >
              {ex}
            </button>
          ))}
        </div>
        {aiResult && (
          <p className="mt-3 text-xs text-accent-soft">✦ {aiResult.summary}</p>
        )}

        {filtersOpen && (
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 md:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value as Country | "")} className="w-full rounded-lg border border-white/10 bg-base-900 px-2 py-2 text-sm text-white">
                <option value="">Any</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-white/10 bg-base-900 px-2 py-2 text-sm text-white">
                <option value="">Any</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Max price: ${maxPrice}</label>
              <input type="range" min={10} max={150} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Min growth: {minGrowth}%</label>
              <input type="range" min={-60} max={95} value={minGrowth} onChange={(e) => setMinGrowth(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Max competition: {maxCompetition}</label>
              <input type="range" min={0} max={100} value={maxCompetition} onChange={(e) => setMaxCompetition(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Min ad count: {minAds}</label>
              <input type="range" min={0} max={60} value={minAds} onChange={(e) => setMinAds(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-white/40">Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full rounded-lg border border-white/10 bg-base-900 px-2 py-2 text-sm text-white">
                <option value="opportunity">Opportunity Score</option>
                <option value="growth">Growth</option>
                <option value="revenue">Revenue</option>
                <option value="adCount">Ad Count</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCountry(""); setCategory(""); setMaxPrice(150); setMinGrowth(-60); setMaxCompetition(100); setMinAds(0);
                }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
              >
                <X size={12} /> Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-white/45">{filtered.length} products</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center text-white/30">
          <p>No products match those filters yet.</p>
        </div>
      )}
    </div>
  );
}

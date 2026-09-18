"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatCompact, formatPct } from "@/lib/utils/format";
import { useAppStore } from "@/lib/state/useAppStore";
import { Eye, Radar, Sparkles, Layers, Crown, Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Ranked "TOP 1 / TOP 2 / TOP 3" ribbon, Kalodata-style — first place gets a crown, 2nd/3rd a medal. */
function RankRibbon({ rank }: { rank: number }) {
  const Icon = rank === 1 ? Crown : Award;
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg",
        rank === 1 ? "accent-gradient" : "bg-base-800/90 border border-white/15"
      )}
    >
      <Icon size={11} className={rank === 1 ? "text-white" : "text-accent-soft"} />
      Top {rank}
    </div>
  );
}

export function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const watchlisted = useAppStore((s) => s.isWatchlisted(product.id));
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const compareIds = useAppStore((s) => s.compareIds);
  const toggleCompare = useAppStore((s) => s.toggleCompare);

  return (
    <div className="glass-panel group flex flex-col overflow-hidden rounded-xl2 shadow-glass transition-transform hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-base-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 280px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {rank && rank <= 3 ? <RankRibbon rank={rank} /> : <TrendBadge trend={product.trend} />}
        </div>
        <div className="absolute right-2 top-2">
          <div className="rounded-full border border-white/10 bg-black/60 p-1 shadow-lg backdrop-blur-sm">
            <ScoreRing score={product.opportunity.score} size={42} strokeWidth={3.5} />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-[11px] uppercase tracking-wide text-white/35">{product.category}</p>
        <Link href={`/products/${product.id}`} className="mb-1.5 line-clamp-1 text-sm font-semibold text-white hover:text-accent-soft">
          {product.name}
        </Link>
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="font-semibold text-white">{formatCurrency(product.price, product.currency)}</span>
          <span className={cn("text-xs font-medium", product.growth >= 0 ? "text-good" : "text-bad")}>
            {formatPct(product.growth)}
          </span>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
          <div className="border-r border-white/10">
            <p className="text-[10px] uppercase tracking-wide text-white/35">Revenue</p>
            <p className="text-sm font-semibold text-white/85">{formatCompact(product.revenue)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-white/35">Items Sold</p>
            <p className="text-sm font-semibold text-white/85">{formatCompact(product.sales)}</p>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-center gap-3 text-[11px] text-white/40">
          <span>{product.adCount} ads</span>
          <span className="text-white/15">·</span>
          <span>{product.storeCount} stores</span>
          <span className="text-white/15">·</span>
          <span>{product.daysTrending}d trending</span>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          <Button href={`/products/${product.id}`} size="sm" variant="secondary" className="flex-1">
            View
          </Button>
          <Button href={`/ad-spy?product=${product.id}`} size="sm" variant="outline" title="View Ads">
            <Radar size={13} />
          </Button>
          <Button
            size="sm"
            variant={watchlisted ? "primary" : "outline"}
            onClick={(e) => {
              e.preventDefault();
              toggleWatchlist(product.id);
            }}
            title="Add to Watchlist"
          >
            <Eye size={13} />
          </Button>
          <Button
            size="sm"
            variant={compareIds.includes(product.id) ? "primary" : "outline"}
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            title="Add to Compare"
          >
            <Layers size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}

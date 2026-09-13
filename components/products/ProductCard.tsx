"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatCompact, formatPct } from "@/lib/utils/format";
import { useAppStore } from "@/lib/state/useAppStore";
import { Eye, Radar, Sparkles, Layers } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
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
          <TrendBadge trend={product.trend} />
        </div>
        <div className="absolute right-2 top-2">
          <div className="rounded-full bg-black/50 p-1 backdrop-blur">
            <ScoreRing score={product.opportunity.score} size={40} strokeWidth={3.5} />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-[11px] uppercase tracking-wide text-white/35">{product.category}</p>
        <Link href={`/products/${product.id}`} className="mb-2 line-clamp-1 text-sm font-semibold text-white hover:text-accent-soft">
          {product.name}
        </Link>
        <div className="mb-3 flex items-center gap-3 text-xs text-white/50">
          <span className="font-medium text-white/80">{formatCurrency(product.price)}</span>
          <span>{formatCompact(product.revenue)} rev/mo</span>
          <span className={product.growth >= 0 ? "text-good" : "text-bad"}>{formatPct(product.growth)}</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-[11px] text-white/40">
          <div>
            <p className="font-semibold text-white/80">{product.adCount}</p>
            ads
          </div>
          <div>
            <p className="font-semibold text-white/80">{product.storeCount}</p>
            stores
          </div>
          <div>
            <p className="font-semibold text-white/80">{product.daysTrending}d</p>
            trending
          </div>
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

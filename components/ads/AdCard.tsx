"use client";

import Image from "next/image";
import { Ad } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Heart, MessageCircle, Share2, Flame, Sparkles } from "lucide-react";
import { formatCompact, formatCurrency } from "@/lib/utils/format";
import { useState } from "react";
import { analyzeAd, AdBreakdown } from "@/lib/ai/features";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";

export function AdCard({ ad, product }: { ad: Ad; product?: Product }) {
  const [breakdown, setBreakdown] = useState<AdBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const isWinning = ad.winningScore >= 75;

  async function handleWhy() {
    if (!product) return;
    setLoading(true);
    const result = await analyzeAd(ad, product);
    setBreakdown(result);
    setLoading(false);
  }

  return (
    <div className="glass-panel overflow-hidden rounded-xl2 shadow-glass">
      <div className="relative aspect-[4/5] bg-base-800">
        <Image src={ad.thumbnail} alt={ad.headline} fill sizes="280px" className="object-cover" unoptimized />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
          <Badge tone="neutral">{ad.platform}</Badge>
          {isWinning && (
            <Badge tone="bad" className="gap-1">
              <Flame size={11} /> Winning Ad {ad.winningScore}
            </Badge>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-xs font-semibold text-white">🔥 RUNNING {ad.activeDays} DAYS</p>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs font-medium text-white/50">{ad.brand}</p>
        <p className="mb-2 line-clamp-2 text-sm text-white/85">{ad.copy}</p>
        <div className="mb-3 flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1"><Heart size={11} /> {formatCompact(ad.likes)}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} /> {formatCompact(ad.comments)}</span>
          <span className="flex items-center gap-1"><Share2 size={11} /> {formatCompact(ad.shares)}</span>
        </div>
        <div className="mb-3 flex items-center justify-between text-xs">
          <Badge tone="neutral">{ad.mediaType}</Badge>
          <span className="text-white/40">Est. spend {formatCurrency(ad.estimatedSpend)}</span>
        </div>
        {product && (
          <Button size="sm" variant="outline" className="w-full" onClick={handleWhy} disabled={loading}>
            <Sparkles size={12} /> {loading ? "Analyzing..." : "Why might this be working?"}
          </Button>
        )}
        {breakdown && (
          <div className="mt-3 space-y-1.5 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
            <p><span className="text-white/40">Hook:</span> {breakdown.hook}</p>
            <p><span className="text-white/40">Problem:</span> {breakdown.problem}</p>
            {breakdown.desire && <p><span className="text-white/40">Desire:</span> {breakdown.desire}</p>}
            {breakdown.offer && <p><span className="text-white/40">Offer:</span> {breakdown.offer}</p>}
            <p><span className="text-white/40">Angle:</span> {breakdown.creativeAngle}</p>
            {breakdown.targetAudience && <p><span className="text-white/40">Audience:</span> {breakdown.targetAudience}</p>}
            {breakdown.emotionalTrigger && <p><span className="text-white/40">Trigger:</span> {breakdown.emotionalTrigger}</p>}
            <div className="pt-1"><Badge tone="accent" className="text-[10px]">{breakdown.label}</Badge></div>
          </div>
        )}
      </div>
    </div>
  );
}

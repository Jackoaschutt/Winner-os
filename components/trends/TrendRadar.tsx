"use client";

import { Trend } from "@/types";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { LifecycleBadge } from "@/components/ui/TrendBadge";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function TrendRadar({ trends }: { trends: Trend[] }) {
  const [typeFilter, setTypeFilter] = useState<"all" | Trend["type"]>("all");
  const filtered = typeFilter === "all" ? trends : trends.filter((t) => t.type === typeFilter);
  const sorted = [...filtered].sort((a, b) => b.opportunity - a.opportunity);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Trend Radar</h1>
          <p className="text-sm text-white/45">Products, categories and markets gaining or losing momentum right now.</p>
        </div>
        <div className="flex gap-1.5">
          {(["all", "product", "category", "market"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs capitalize",
                typeFilter === t ? "border-accent/50 bg-accent/15 text-accent-soft" : "border-white/10 text-white/50"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((t) => (
          <div key={t.id} className="glass-panel rounded-xl2 p-5 shadow-glass">
            <div className="mb-1 flex items-center justify-between">
              <Badge tone="neutral" className="capitalize">{t.type}</Badge>
              <LifecycleBadge lifecycle={t.lifecycle} />
            </div>
            <p className="mt-2 mb-3 text-sm font-semibold text-white">{t.name}</p>
            <div className="mb-3 h-14 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={t.history}>
                  <YAxis domain={["dataMin - 10", "dataMax + 10"]} hide />
                  <Line type="monotone" dataKey="index" stroke="#ff5a3c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <ScoreBlock label="Momentum" value={t.momentum} />
              <ScoreBlock label="Competition" value={t.competition} invert />
              <ScoreBlock label="Opportunity" value={t.opportunity} />
            </div>
            <p className="mt-3 text-xs text-white/35">Trend age: {t.ageDays} days</p>
            {t.relatedProductIds[0] && (
              <Link href={`/products/${t.relatedProductIds[0]}`} className="mt-2 inline-block text-xs text-accent-soft hover:underline">
                View related product →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBlock({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value <= 40 : value >= 60;
  return (
    <div className="rounded-lg border border-white/8 bg-white/5 py-2">
      <p className={cn("text-sm font-semibold", good ? "text-good" : "text-white/70")}>{value}</p>
      <p className="text-[10px] text-white/35">{label}</p>
    </div>
  );
}

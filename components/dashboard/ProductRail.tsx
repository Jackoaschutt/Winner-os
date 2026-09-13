import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { DataLabel } from "@/components/ui/DataLabel";
import { formatCompact, formatPct } from "@/lib/utils/format";
import { LucideIcon } from "lucide-react";
import { DATA_MODE } from "@/lib/data/provider";

export function ProductRail({
  title,
  icon: Icon,
  products,
  metricLabel = "rev/mo",
  metricFn,
}: {
  title: string;
  icon: LucideIcon;
  products: Product[];
  metricLabel?: string;
  metricFn?: (p: Product) => string;
}) {
  return (
    <div className="glass-panel rounded-xl2 p-5 shadow-glass">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-accent-soft" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <DataLabel label={DATA_MODE} />
      </div>
      <div className="space-y-2.5">
        {products.slice(0, 4).map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-white/5"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-base-800">
              <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" unoptimized />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/85">{p.name}</p>
              <p className="text-xs text-white/40">
                {metricFn ? metricFn(p) : `${formatCompact(p.revenue)} ${metricLabel}`}
              </p>
            </div>
            <ScoreRing score={p.opportunity.score} size={32} strokeWidth={3} showLabel={false} />
          </Link>
        ))}
        {products.length === 0 && <p className="py-4 text-center text-xs text-white/30">No matches yet.</p>}
      </div>
    </div>
  );
}

import { Product } from "@/types";
import { Flame, TrendingUp, DollarSign, Eye, AlertTriangle } from "lucide-react";
import { formatCompact } from "@/lib/utils/format";

export function CommandCenter({ products }: { products: Product[] }) {
  const trending = products.filter((p) => p.trend === "exploding" || p.trend === "growing").length;
  const accelerating = products.filter((p) => p.lifecycle === "Accelerating").length;
  const highMargin = products.filter((p) => p.opportunity.breakdown.marginPotential >= 70).length;
  const winningAds = products.reduce((sum, p) => sum + Math.round(p.adCount * 0.25), 0);
  const saturating = products.filter((p) => p.lifecycle === "Saturated").length;

  const stats = [
    { icon: Flame, label: "products trending", value: trending, tone: "text-accent-soft" },
    { icon: TrendingUp, label: "products accelerating", value: accelerating, tone: "text-good" },
    { icon: DollarSign, label: "high-margin opportunities", value: highMargin, tone: "text-warn" },
    { icon: Eye, label: "winning ads discovered", value: formatCompact(winningAds), tone: "text-accent-soft" },
    { icon: AlertTriangle, label: "products becoming saturated", value: saturating, tone: "text-bad" },
  ];

  return (
    <div className="glass-panel mb-6 rounded-xl2 p-5 shadow-glass">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/35">
        Ecommerce Intelligence Command Center
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-start gap-2.5">
            <s.icon size={16} className={`mt-0.5 shrink-0 ${s.tone}`} />
            <div>
              <p className="text-lg font-semibold leading-none text-white">{s.value}</p>
              <p className="mt-1 text-xs text-white/40">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

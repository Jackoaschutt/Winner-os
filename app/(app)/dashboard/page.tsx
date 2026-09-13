import { getDataProvider } from "@/lib/data/provider";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { CommandCenter } from "@/components/dashboard/CommandCenter";
import { ProductRail } from "@/components/dashboard/ProductRail";
import { NextBestAction } from "@/components/dashboard/NextBestAction";
import { IntelligenceSphere } from "@/components/three/IntelligenceSphere";
import { Flame, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import { formatPct } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/products/ProductCard";

export default async function DashboardPage() {
  const provider = getDataProvider();
  const products = await provider.getProducts();

  const trending = [...products].sort((a, b) => b.opportunity.breakdown.trendMomentum - a.opportunity.breakdown.trendMomentum);
  const fastestGrowing = [...products].sort((a, b) => b.growth - a.growth);
  const highestRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const aiOpportunities = [...products].sort((a, b) => b.opportunity.score - a.opportunity.score);

  const topOpportunities = aiOpportunities.slice(0, 5);
  const bestPick = aiOpportunities[0];

  return (
    <div>
      <GreetingHeader />
      <CommandCenter products={products} />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <ProductRail title="Trending Products" icon={Flame} products={trending} />
        <ProductRail
          title="Fastest Growing"
          icon={TrendingUp}
          products={fastestGrowing}
          metricFn={(p) => formatPct(p.growth) + " growth"}
        />
        <ProductRail title="Highest Revenue" icon={DollarSign} products={highestRevenue} />
        <ProductRail
          title="AI Opportunities"
          icon={Sparkles}
          products={aiOpportunities}
          metricFn={(p) => `Score ${p.opportunity.score}/100`}
        />
      </div>

      <NextBestAction
        action={
          bestPick
            ? `${bestPick.name} just crossed a ${bestPick.opportunity.score}/100 opportunity score — worth a closer look.`
            : "Explore Product Discovery to find your first test."
        }
        href={bestPick ? `/products/${bestPick.id}` : "/products"}
        ctaLabel="Research it"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-xl2 p-5 shadow-glass lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Today&apos;s Opportunities</h3>
            <Badge tone="accent">Top 5 by score</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {topOpportunities.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <div className="glass-panel flex flex-col overflow-hidden rounded-xl2 shadow-glass">
          <div className="p-5 pb-0">
            <h3 className="text-sm font-semibold text-white">Product Intelligence Sphere</h3>
            <p className="mt-1 text-xs text-white/40">Drag to rotate. Each point is a signal across products, categories and markets.</p>
          </div>
          <div className="h-64 flex-1">
            <IntelligenceSphere />
          </div>
        </div>
      </div>
    </div>
  );
}

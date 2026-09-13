"use client";

import { useState } from "react";
import Image from "next/image";
import { Ad, Product, Store } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { TrendBadge, LifecycleBadge } from "@/components/ui/TrendBadge";
import { formatCurrency, formatCompact, formatPct, formatDate } from "@/lib/utils/format";
import { useAppStore } from "@/lib/state/useAppStore";
import { Eye, Sparkles, InfoIcon } from "lucide-react";
import { DemandChart } from "@/components/charts/DemandChart";
import { AdCard } from "@/components/ads/AdCard";
import { InfoTip } from "@/components/ui/Tooltip";
import { explainOpportunityScore, generateResearchReport, ResearchReport } from "@/lib/ai/features";
import { DataLabel } from "@/components/ui/DataLabel";

const BREAKDOWN_LABELS: Record<string, string> = {
  demand: "Demand",
  growth: "Growth",
  adActivity: "Ad Activity",
  creativeDiversity: "Creative Potential",
  competition: "Competition",
  price: "Price Fit",
  marginPotential: "Margin Potential",
  uniqueness: "Uniqueness",
  socialProof: "Social Proof",
  trendMomentum: "Trend Momentum",
  marketSaturation: "Market Saturation",
};

export function ProductDetail({ product, ads, stores }: { product: Product; ads: Ad[]; stores: Store[] }) {
  const watchlisted = useAppStore((s) => s.isWatchlisted(product.id));
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const [whyOpen, setWhyOpen] = useState(false);
  const [explanation, setExplanation] = useState<string[] | null>(null);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  async function handleWhyScore() {
    setWhyOpen(true);
    if (!explanation) {
      const res = await explainOpportunityScore(product);
      setExplanation(res.lines);
    }
  }

  async function handleResearch() {
    setLoadingReport(true);
    const r = await generateResearchReport(product, ads, stores);
    setReport(r);
    setLoadingReport(false);
  }

  return (
    <div>
      <div className="glass-panel mb-6 rounded-xl2 p-6 shadow-glass">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl2 bg-base-800">
            <Image src={product.image} alt={product.name} fill sizes="160px" className="object-cover" unoptimized />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-white/35">{product.category}</p>
            <h1 className="mt-0.5 text-2xl font-semibold text-white">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <TrendBadge trend={product.trend} />
              <LifecycleBadge lifecycle={product.lifecycle} />
              <Badge tone="neutral">{product.country}</Badge>
              <DataLabel label={product.dataLabel} />
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-xs text-white/35">Price</p>
                <p className="font-medium text-white">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-xs text-white/35">Est. Revenue / mo</p>
                <p className="font-medium text-white">{formatCompact(product.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-white/35">Growth</p>
                <p className={product.growth >= 0 ? "font-medium text-good" : "font-medium text-bad"}>{formatPct(product.growth)}</p>
              </div>
              <div>
                <p className="text-xs text-white/35">Launched</p>
                <p className="font-medium text-white">{formatDate(product.launchDate)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={handleResearch} disabled={loadingReport}>
                <Sparkles size={14} /> {loadingReport ? "Researching..." : "Research Product"}
              </Button>
              <Button variant={watchlisted ? "primary" : "outline"} onClick={() => toggleWatchlist(product.id)}>
                <Eye size={14} /> {watchlisted ? "On Watchlist" : "Add to Watchlist"}
              </Button>
              <Button variant="outline" href={`/tests?product=${product.id}`}>
                Send to Test Lab
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 md:w-48">
            <ScoreRing score={product.opportunity.score} size={110} strokeWidth={8} />
            <p className="text-center text-xs font-medium text-white/70">{product.opportunity.label}</p>
            <button onClick={handleWhyScore} className="text-xs text-accent-soft hover:underline">
              Why this score?
            </button>
            {whyOpen && explanation && (
              <div className="mt-1 space-y-1 rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] leading-snug text-white/60">
                {explanation.map((l, i) => <p key={i}>• {l}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
          <TabsTrigger value="ads">Ads ({ads.length})</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="glass-panel rounded-xl2 p-5 shadow-glass md:col-span-2">
              <h3 className="mb-3 text-sm font-semibold text-white">Description</h3>
              <p className="text-sm text-white/60">{product.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Ads Tracked", product.adCount],
                  ["Creators", product.creatorCount],
                  ["Stores Selling", product.storeCount],
                  ["Days Trending", product.daysTrending],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-lg border border-white/8 bg-white/5 p-3 text-center">
                    <p className="text-lg font-semibold text-white">{value}</p>
                    <p className="text-xs text-white/40">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-xl2 p-5 shadow-glass">
              <h3 className="mb-3 flex items-center text-sm font-semibold text-white">
                Score Breakdown <InfoTip text="Each factor is scored 0-100 and combined into the overall Opportunity Score. Competition and Market Saturation count against the score." />
              </h3>
              <div className="space-y-2.5">
                {Object.entries(product.opportunity.breakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs text-white/50">
                      <span>{BREAKDOWN_LABELS[key] || key}</span>
                      <span className="text-white/70">{value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/8">
                      <div className="h-1.5 rounded-full accent-gradient" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="demand">
          <div className="glass-panel rounded-xl2 p-5 shadow-glass">
            <h3 className="mb-1 text-sm font-semibold text-white">Demand Analytics</h3>
            <p className="mb-4 text-xs text-white/40">
              Lifecycle stage: <LifecycleBadge lifecycle={product.lifecycle} /> — this product looks <b className="text-white/70">{product.trend}</b> right now.
            </p>
            <DemandChart history={product.history} />
          </div>
        </TabsContent>

        <TabsContent value="ads">
          {ads.length === 0 ? (
            <EmptyState text="No ads tracked for this product yet." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {ads.map((ad) => <AdCard key={ad.id} ad={ad} product={product} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="creatives">
          {ads.length === 0 ? (
            <EmptyState text="No creatives tracked yet." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {ads.slice(0, 8).map((ad) => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stores">
          {stores.length === 0 ? (
            <EmptyState text="No tracked stores selling this product yet." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {stores.map((s) => (
                <div key={s.id} className="glass-panel rounded-xl2 p-4 shadow-glass">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <Badge tone="neutral">{s.country}</Badge>
                  </div>
                  <p className="mb-2 text-xs text-white/40">{s.domain}</p>
                  <p className="text-xs text-white/55">{s.opportunity}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ReviewBlock title="Top Desires" items={product.reviewSignals.topDesires} tone="good" />
            <ReviewBlock title="Top Benefits" items={product.reviewSignals.topBenefits} tone="good" />
            <ReviewBlock title="Common Objections" items={product.reviewSignals.commonObjections} tone="warn" />
            <ReviewBlock title="Customer Language" items={product.reviewSignals.customerLanguage} tone="neutral" />
          </div>
        </TabsContent>

        <TabsContent value="ai">
          {!report ? (
            <div className="glass-panel rounded-xl2 p-10 text-center shadow-glass">
              <Sparkles size={22} className="mx-auto mb-3 text-accent-soft" />
              <p className="mb-4 text-sm text-white/50">Generate a full research report for {product.name}.</p>
              <Button onClick={handleResearch} disabled={loadingReport}>
                {loadingReport ? "Researching..." : "Research Product"}
              </Button>
            </div>
          ) : (
            <div className="glass-panel rounded-xl2 p-6 shadow-glass">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">AI Product Research Report</h3>
                <DataLabel label={report.label} />
              </div>
              <ReportSection title="Executive Summary" text={report.executiveSummary} />
              <ReportSection title="Product" text={report.product} />
              <ReportSection title="Demand" text={report.demand} />
              <ReportSection title="Market" text={report.market} />
              <ReportSection title="Competition" text={report.competition} />
              <ReportSection title="Ad Landscape" text={report.adLandscape} />
              <ReportSection title="Creative Opportunities" text={report.creativeOpportunities} />
              <ReportSection title="Customer Pain Points" text={report.customerPainPoints} />
              <ReportSection title="Pricing" text={report.pricing} />
              <ReportSection title="Margin Potential" text={report.marginPotential} />
              <ReportSection title="Risks" text={report.risks} />
              <ReportSection title="Recommendation" text={report.recommendation} />
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-white/35">Final Verdict</p>
                <div className="flex items-center gap-3">
                  <Badge tone={report.verdict === "TEST" ? "good" : report.verdict === "WATCH" ? "warn" : "bad"} className="text-sm">
                    {report.verdict}
                  </Badge>
                  <p className="text-sm text-white/60">{report.verdictReason}</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</p>
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}

function ReviewBlock({ title, items, tone }: { title: string; items: string[]; tone: "good" | "warn" | "neutral" }) {
  return (
    <div className="glass-panel rounded-xl2 p-5 shadow-glass">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Badge key={i} tone={tone}>{i}</Badge>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-xl2 p-16 text-center shadow-glass">
      <InfoIcon size={20} className="mb-2 text-white/20" />
      <p className="text-sm text-white/40">{text}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataLabel } from "@/components/ui/DataLabel";
import { analyzeCreative, CreativeAnalysis } from "@/lib/ai/features";
import { Sparkles } from "lucide-react";

export function CreativeAnalyzer() {
  const [copy, setCopy] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreativeAnalysis | null>(null);

  async function handleAnalyze() {
    if (!copy.trim()) return;
    setLoading(true);
    const res = await analyzeCreative({ copy, productName });
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="glass-panel rounded-xl2 p-6 shadow-glass">
        <h2 className="mb-1 text-sm font-semibold text-white">Paste an ad to analyze</h2>
        <p className="mb-4 text-xs text-white/40">Paste ad copy, a hook, or a script. We'll break down the structure — never copy it verbatim.</p>
        <textarea
          value={copy}
          onChange={(e) => setCopy(e.target.value)}
          rows={8}
          placeholder="Paste ad copy here..."
          className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-accent/50"
        />
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product name (optional)"
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/50"
        />
        <Button onClick={handleAnalyze} disabled={loading || !copy.trim()} className="w-full">
          <Sparkles size={14} /> {loading ? "Analyzing..." : "Analyze Creative"}
        </Button>
      </div>

      <div className="glass-panel rounded-xl2 p-6 shadow-glass">
        {!result ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center text-white/30">
            <Sparkles size={22} className="mb-3" />
            <p className="text-sm">Your breakdown and original variations will appear here.</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Breakdown</h2>
              <DataLabel label={result.label} />
            </div>
            <div className="mb-5 space-y-2 text-sm">
              <Field label="Hook" value={result.hook} />
              <Field label="Offer" value={result.offer} />
              <Field label="Angle" value={result.angle} />
              <Field label="Problem" value={result.problem} />
              <Field label="Desire" value={result.desire} />
              <Field label="Social Proof" value={result.socialProof} />
              <Field label="CTA" value={result.cta} />
              <Field label="Psychology" value={result.psychology} />
            </div>
            <div className="mb-5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/40">Video Structure</p>
              <ol className="space-y-1 text-sm text-white/60">
                {result.videoStructure.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
              </ol>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-soft">Recreate This Ad — Original Variations</p>
              <VariationGroup title="3 Alternative Hooks" items={result.variations.hooks} />
              <VariationGroup title="3 New Primary Texts" items={result.variations.primaryTexts} />
              <VariationGroup title="3 Headlines" items={result.variations.headlines} />
              <VariationGroup title="3 CTAs" items={result.variations.ctas} />
              <VariationGroup title="3 UGC Concepts" items={result.variations.ugcConcepts} />
              <VariationGroup title="3 Video Scripts" items={result.variations.videoScripts} last />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p><span className="text-xs uppercase tracking-wide text-white/35">{label}:</span> <span className="text-white/75">{value}</span></p>
  );
}

function VariationGroup({ title, items, last }: { title: string; items: string[]; last?: boolean }) {
  return (
    <div className={last ? "" : "mb-3"}>
      <p className="mb-1 text-xs font-medium text-white/50">{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/70">{it}</li>
        ))}
      </ul>
    </div>
  );
}

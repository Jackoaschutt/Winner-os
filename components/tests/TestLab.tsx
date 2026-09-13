"use client";

import { useMemo, useState } from "react";
import { Product, TestInputs, TestResults, ProductTest } from "@/types";
import { calculateTestResults } from "@/lib/analytics/testlab";
import { generateTestPlan } from "@/lib/ai/features";
import { useAppStore } from "@/lib/state/useAppStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/format";
import { FlaskConical, Sparkles, Trash2 } from "lucide-react";

const DEFAULTS: TestInputs = {
  productName: "",
  supplierCost: 12,
  sellingPrice: 39.99,
  shipping: 5,
  adBudget: 100,
  targetCPA: 15,
  expectedAOV: 45,
};

export function TestLab({ products, initialProductId }: { products: Product[]; initialProductId?: string }) {
  const preselected = products.find((p) => p.id === initialProductId);
  const [inputs, setInputs] = useState<TestInputs>(
    preselected
      ? {
          productId: preselected.id,
          productName: preselected.name,
          supplierCost: preselected.supplierCost,
          sellingPrice: preselected.price,
          shipping: 5,
          adBudget: 100,
          targetCPA: Math.max(8, Math.round(preselected.price * 0.35)),
          expectedAOV: preselected.price,
        }
      : DEFAULTS
  );
  const tests = useAppStore((s) => s.tests);
  const addTest = useAppStore((s) => s.addTest);
  const removeTest = useAppStore((s) => s.removeTest);

  const results: TestResults = useMemo(() => calculateTestResults(inputs), [inputs]);

  function update<K extends keyof TestInputs>(key: K, value: TestInputs[K]) {
    setInputs((s) => ({ ...s, [key]: value }));
  }

  function saveTest(withPlan: boolean) {
    const plan = withPlan ? generateTestPlan(inputs, results) : undefined;
    const test: ProductTest = {
      id: `test_${Date.now()}`,
      createdAt: new Date().toISOString(),
      inputs,
      results,
      plan,
      status: "planning",
    };
    addTest(test);
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-white">Product Test Lab</h1>
      <p className="mb-6 text-sm text-white/45">Model the unit economics, then build a real 5-day test plan.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-xl2 p-6 shadow-glass">
          <h2 className="mb-4 text-sm font-semibold text-white">Test Inputs</h2>
          <div className="space-y-3">
            <Field label="Product">
              <select
                value={inputs.productId || ""}
                onChange={(e) => {
                  const p = products.find((x) => x.id === e.target.value);
                  if (p) {
                    setInputs({ productId: p.id, productName: p.name, supplierCost: p.supplierCost, sellingPrice: p.price, shipping: 5, adBudget: 100, targetCPA: Math.max(8, Math.round(p.price * 0.35)), expectedAOV: p.price });
                  } else {
                    setInputs((s) => ({ ...s, productId: undefined, productName: "" }));
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-base-900 px-3 py-2 text-sm text-white"
              >
                <option value="">Custom / manual entry</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            {!inputs.productId && (
              <Field label="Product name">
                <input value={inputs.productName} onChange={(e) => update("productName", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Supplier cost"><NumberInput value={inputs.supplierCost} onChange={(v) => update("supplierCost", v)} /></Field>
              <Field label="Selling price"><NumberInput value={inputs.sellingPrice} onChange={(v) => update("sellingPrice", v)} /></Field>
              <Field label="Shipping"><NumberInput value={inputs.shipping} onChange={(v) => update("shipping", v)} /></Field>
              <Field label="Ad budget"><NumberInput value={inputs.adBudget} onChange={(v) => update("adBudget", v)} /></Field>
              <Field label="Target CPA"><NumberInput value={inputs.targetCPA} onChange={(v) => update("targetCPA", v)} /></Field>
              <Field label="Expected AOV"><NumberInput value={inputs.expectedAOV} onChange={(v) => update("expectedAOV", v)} /></Field>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => saveTest(false)}>
              <FlaskConical size={14} /> Save Test
            </Button>
            <Button className="flex-1" onClick={() => saveTest(true)}>
              <Sparkles size={14} /> Build My Test
            </Button>
          </div>
        </div>

        <div className="glass-panel rounded-xl2 p-6 shadow-glass">
          <h2 className="mb-4 text-sm font-semibold text-white">Unit Economics</h2>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Gross margin / unit" value={formatCurrency(results.grossMarginPerUnit)} />
            <Metric label="Gross margin %" value={`${results.grossMarginPct}%`} />
            <Metric label="Break-even ROAS" value={`${results.breakEvenRoas.toFixed(2)}x`} />
            <Metric label="Break-even CPA" value={formatCurrency(results.breakEvenCpa)} />
            <Metric label="Potential profit" value={formatCurrency(results.potentialProfit)} good />
            <Metric label="Potential loss" value={formatCurrency(results.potentialLoss)} bad />
            <Metric label="Recommended budget" value={formatCurrency(results.recommendedBudget)} />
            <Metric label="Recommended period" value={`${results.recommendedDays} days`} />
          </div>
        </div>
      </div>

      {tests.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-white">Saved Tests</h2>
          <div className="space-y-4">
            {tests.map((t) => (
              <div key={t.id} className="glass-panel rounded-xl2 p-5 shadow-glass">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.inputs.productName || "Untitled test"}</p>
                    <p className="text-xs text-white/40">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={t.status === "won" ? "good" : t.status === "killed" ? "bad" : "neutral"}>{t.status}</Badge>
                    <button onClick={() => removeTest(t.id)} className="text-white/30 hover:text-bad"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <Metric label="Margin/unit" value={formatCurrency(t.results.grossMarginPerUnit)} compact />
                  <Metric label="Break-even ROAS" value={`${t.results.breakEvenRoas.toFixed(2)}x`} compact />
                  <Metric label="Budget" value={formatCurrency(t.inputs.adBudget)} compact />
                  <Metric label="Target CPA" value={formatCurrency(t.inputs.targetCPA)} compact />
                </div>
                {t.plan && (
                  <div className="mt-3 grid grid-cols-1 gap-2 border-t border-white/10 pt-3 sm:grid-cols-5">
                    {t.plan.map((d) => (
                      <div key={d.day} className="rounded-lg border border-white/8 bg-white/5 p-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-accent-soft">Day {d.day}</p>
                        <p className="mb-1 text-xs font-medium text-white">{d.focus}</p>
                        <p className="mb-1 text-[10px] text-white/40">Budget: {formatCurrency(d.budget)}</p>
                        <ul className="space-y-0.5 text-[10px] text-white/50">
                          {d.actions.slice(0, 2).map((a, i) => <li key={i}>• {a}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-white/40">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/50"
    />
  );
}

function Metric({ label, value, good, bad, compact }: { label: string; value: string; good?: boolean; bad?: boolean; compact?: boolean }) {
  return (
    <div className={compact ? "rounded-lg border border-white/8 bg-white/5 p-2" : "rounded-lg border border-white/8 bg-white/5 p-3"}>
      <p className={compact ? "text-sm font-semibold text-white" : "text-lg font-semibold text-white"} style={good ? { color: "#3ddc97" } : bad ? { color: "#ff5a5a" } : undefined}>
        {value}
      </p>
      <p className="text-[10px] text-white/35">{label}</p>
    </div>
  );
}

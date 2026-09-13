"use client";

import { useState } from "react";
import { Product } from "@/types";
import { routeResearcherQuery, ResearcherAnswer } from "@/lib/ai/features";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Send } from "lucide-react";
import { DataLabel } from "@/components/ui/DataLabel";

const EXAMPLES = [
  "Find me 10 products I could test under $20.",
  "Find products with growing demand but low competition.",
  "Show me products with ads running for 30+ days.",
  "Which products are getting hotter this week?",
  "Build me a test plan.",
];

interface ChatEntry {
  query: string;
  answer: ResearcherAnswer;
  products?: Product[];
}

export function ResearcherChat({ products }: { products: Product[] }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);

  function ask(q: string) {
    if (!q.trim()) return;
    const answer = routeResearcherQuery(q, products);
    const matched = answer.productIds ? products.filter((p) => answer.productIds!.includes(p.id)) : undefined;
    setHistory((h) => [...h, { query: q, answer, products: matched }]);
    setInput("");
  }

  return (
    <div>
      <div className="glass-panel mb-6 rounded-xl2 p-6 shadow-glass text-center">
        <Sparkles size={22} className="mx-auto mb-2 text-accent-soft" />
        <h1 className="text-xl font-semibold text-white">Ask Your Ecommerce Analyst</h1>
        <p className="mx-auto mt-1 max-w-lg text-sm text-white/45">
          Ask in plain English. Answers are structured, not walls of text, and always ranked by Opportunity Score.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => ask(ex)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:border-white/20 hover:text-white/80">
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {history.map((entry, i) => (
          <div key={i}>
            <p className="mb-2 inline-block rounded-xl rounded-tr-sm bg-white/10 px-4 py-2 text-sm text-white/90">{entry.query}</p>
            <div className="glass-panel rounded-xl2 rounded-tl-sm p-4 shadow-glass">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-white/70">{entry.answer.summary}</p>
                <DataLabel label={entry.answer.label} />
              </div>
              {entry.answer.kind === "test-plan-prompt" && (
                <Button href="/tests" size="sm">Go to My Tests</Button>
              )}
              {entry.products && entry.products.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {entry.products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="sticky bottom-20 mt-6 flex items-center gap-2 rounded-xl2 border border-white/10 bg-base-900/90 p-2 shadow-glass backdrop-blur md:bottom-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
        />
        <Button type="submit" size="sm">
          <Send size={13} />
        </Button>
      </form>
    </div>
  );
}

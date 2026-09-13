"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Store, Radar, TrendingUp, FileText } from "lucide-react";
import { Product, Store as StoreType } from "@/types";
import { useAppStore } from "@/lib/state/useAppStore";

export function CommandPalette({ products, stores }: { products: Product[]; stores: StoreType[] }) {
  const open = useAppStore((s) => s.commandOpen);
  const setOpen = useAppStore((s) => s.setCommandOpen);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { products: products.slice(0, 5), stores: stores.slice(0, 3) };
    const q = query.toLowerCase();
    return {
      products: products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6),
      stores: stores.filter((s) => s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, products, stores]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 pt-24 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="glass-panel w-full max-w-xl rounded-xl2 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, stores, ads, categories..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40">ESC</kbd>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {results.products.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-white/30">Products</div>
              {results.products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    router.push(`/products/${p.id}`);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                >
                  <Package size={14} className="text-white/40" />
                  {p.name}
                  <span className="ml-auto text-xs text-white/30">{p.category}</span>
                </button>
              ))}
            </div>
          )}
          {results.stores.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-white/30">Stores</div>
              {results.stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    router.push(`/stores/${s.id}`);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                >
                  <Store size={14} className="text-white/40" />
                  {s.name}
                  <span className="ml-auto text-xs text-white/30">{s.domain}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-white/10 pt-1">
            <button onClick={() => { router.push("/ad-spy"); setOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/60 hover:bg-white/5">
              <Radar size={14} /> Go to Ad Spy
            </button>
            <button onClick={() => { router.push("/trends"); setOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/60 hover:bg-white/5">
              <TrendingUp size={14} /> Go to Trends
            </button>
            <button onClick={() => { router.push("/ai-researcher"); setOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/60 hover:bg-white/5">
              <FileText size={14} /> Ask AI Researcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

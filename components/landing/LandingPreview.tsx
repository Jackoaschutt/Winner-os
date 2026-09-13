"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/ui/ScoreRing";

const stats = [
  { icon: Flame, label: "Trending", value: "23", tone: "text-accent-soft" },
  { icon: TrendingUp, label: "Accelerating", value: "8", tone: "text-good" },
  { icon: DollarSign, label: "High margin", value: "14", tone: "text-warn" },
  { icon: Sparkles, label: "Winning ads", value: "47", tone: "text-accent-soft" },
];

export function LandingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-panel glow-border relative overflow-hidden rounded-xl2 p-4 shadow-glass md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40">Ecommerce Intelligence Command Center</p>
          <p className="text-lg font-semibold">Good morning 👋</p>
        </div>
        <div className="hidden gap-2 md:flex">
          {["7D", "30D", "90D"].map((t, i) => (
            <span key={t} className={`rounded-md px-2.5 py-1 text-xs ${i === 1 ? "bg-white/15 text-white" : "text-white/30"}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-white/5 p-4">
            <s.icon size={16} className={s.tone} />
            <p className="mt-2 text-xl font-semibold">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-4"
          >
            <div className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Portable Product #{i}</p>
              <p className="text-xs text-white/40">${(19 + i * 8).toFixed(2)} · +{40 + i * 12}% growth</p>
            </div>
            <ScoreRing score={70 + i * 8} size={44} strokeWidth={4} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

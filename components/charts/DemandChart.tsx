"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { RevenuePoint } from "@/types";
import { cn } from "@/lib/utils/cn";
import { formatCompact } from "@/lib/utils/format";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "14D", days: 14 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "180D", days: 180 },
];

const METRICS: { key: keyof RevenuePoint; label: string; color: string }[] = [
  { key: "revenue", label: "Revenue", color: "#ff5a3c" },
  { key: "sales", label: "Sales", color: "#3ddc97" },
  { key: "searchInterest", label: "Search Interest", color: "#ffc857" },
  { key: "adActivity", label: "Ad Activity", color: "#8b8ff0" },
  { key: "competitionIndex", label: "Competition", color: "#ff5a5a" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-base-800 px-3 py-2 text-xs shadow-glass">
      <p className="mb-1 text-white/40">{new Date(label).toLocaleDateString()}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? formatCompact(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export function DemandChart({ history }: { history: RevenuePoint[] }) {
  const [range, setRange] = useState(30);
  const [metric, setMetric] = useState<(typeof METRICS)[number]>(METRICS[0]);

  const data = useMemo(() => history.slice(-range), [history, range]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                metric.key === m.key ? "border-white/20 bg-white/10 text-white" : "border-white/10 text-white/40 hover:text-white/70"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                range === r.days ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              stroke="rgba(255,255,255,0.25)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={44} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric.key}
              name={metric.label}
              stroke={metric.color}
              fill="url(#fillMetric)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

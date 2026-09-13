import { Badge } from "@/components/ui/Badge";
import { Lifecycle, TrendDirection } from "@/types";
import { Flame, TrendingUp, Minus, TrendingDown, Skull, Sprout, Rocket } from "lucide-react";

const trendMap: Record<TrendDirection, { icon: any; label: string; tone: "good" | "warn" | "bad" | "neutral" }> = {
  exploding: { icon: Flame, label: "Exploding", tone: "bad" },
  growing: { icon: TrendingUp, label: "Growing", tone: "good" },
  stable: { icon: Minus, label: "Stable", tone: "neutral" },
  declining: { icon: TrendingDown, label: "Declining", tone: "warn" },
  dead: { icon: Skull, label: "Dead", tone: "neutral" },
};

export function TrendBadge({ trend }: { trend: TrendDirection }) {
  const t = trendMap[trend];
  const Icon = t.icon;
  return (
    <Badge tone={t.tone} className="gap-1">
      <Icon size={11} /> {t.label}
    </Badge>
  );
}

const lifecycleMap: Record<Lifecycle, { icon: any; tone: "good" | "warn" | "bad" | "neutral" | "accent" }> = {
  Emerging: { icon: Sprout, tone: "good" },
  Accelerating: { icon: Rocket, tone: "accent" },
  Viral: { icon: Flame, tone: "bad" },
  Mature: { icon: Minus, tone: "neutral" },
  Saturated: { icon: TrendingDown, tone: "warn" },
  Declining: { icon: TrendingDown, tone: "warn" },
  Dead: { icon: Skull, tone: "neutral" },
};

export function LifecycleBadge({ lifecycle }: { lifecycle: Lifecycle }) {
  const l = lifecycleMap[lifecycle];
  const Icon = l.icon;
  return (
    <Badge tone={l.tone} className="gap-1">
      <Icon size={11} /> {lifecycle}
    </Badge>
  );
}

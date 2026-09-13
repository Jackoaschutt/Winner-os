import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

type Tone = "neutral" | "good" | "warn" | "bad" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-white/8 text-white/70 border-white/10",
  good: "bg-good/10 text-good border-good/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  bad: "bg-bad/10 text-bad border-bad/30",
  accent: "bg-accent/15 text-accent-soft border-accent/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}

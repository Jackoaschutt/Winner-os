"use client";

import { cn } from "@/lib/utils/cn";

export function ScoreRing({
  score,
  size = 84,
  strokeWidth = 7,
  showLabel = true,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}) {
  const rounded = Math.round(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rounded / 100);
  const color = rounded >= 70 ? "#3ddc97" : rounded >= 45 ? "#ffc857" : "#ff5a5a";
  // Below this size the "/ 100" sublabel just crowds the number — drop it
  // and center a single, slightly larger figure instead.
  const compact = size < 56;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center">
          <span
            className={cn("font-semibold leading-none tabular-nums", compact ? "text-[13px]" : "text-lg")}
            style={{ color }}
          >
            {rounded}
          </span>
          {!compact && <span className="mt-0.5 text-[9px] uppercase tracking-wide text-white/40">/ 100</span>}
        </div>
      )}
    </div>
  );
}

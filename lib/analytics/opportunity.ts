import { OpportunityScore, ScoreBreakdown } from "@/types";

// Configurable weights — tune these to change how the Opportunity Score
// is calculated without touching any UI code.
export const OPPORTUNITY_WEIGHTS: Record<keyof ScoreBreakdown, number> = {
  demand: 0.16,
  growth: 0.16,
  adActivity: 0.12,
  creativeDiversity: 0.08,
  competition: -0.12, // inverted: more competition subtracts
  price: 0.06,
  marginPotential: 0.14,
  uniqueness: 0.06,
  socialProof: 0.06,
  trendMomentum: 0.1,
  marketSaturation: -0.08, // inverted
};

export function computeOpportunityScore(breakdown: ScoreBreakdown): OpportunityScore {
  let raw = 50; // neutral baseline
  for (const key of Object.keys(OPPORTUNITY_WEIGHTS) as (keyof ScoreBreakdown)[]) {
    const weight = OPPORTUNITY_WEIGHTS[key];
    const value = breakdown[key];
    // Center factor around 50 so a "neutral" 50 contributes ~0
    raw += weight * (value - 50);
  }
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  let label = "Weak opportunity";
  if (score >= 85) label = "Exceptional opportunity";
  else if (score >= 70) label = "Strong opportunity";
  else if (score >= 55) label = "Promising opportunity";
  else if (score >= 40) label = "Moderate — needs validation";
  else label = "High risk / low signal";

  const explanation: string[] = [];
  if (breakdown.demand >= 75) explanation.push(`Demand signals are strong (${breakdown.demand}/100).`);
  else if (breakdown.demand <= 40) explanation.push(`Demand signals are weak (${breakdown.demand}/100) — validate before spending.`);

  if (breakdown.growth >= 70) explanation.push(`Growth trajectory is accelerating (${breakdown.growth}/100).`);
  else if (breakdown.growth <= 35) explanation.push(`Growth has flattened or is slowing (${breakdown.growth}/100).`);

  if (breakdown.adActivity >= 75) explanation.push(`High ad activity (${breakdown.adActivity}/100) suggests other sellers are finding paid traffic profitable.`);
  else if (breakdown.adActivity <= 30) explanation.push(`Low ad activity (${breakdown.adActivity}/100) — could mean an untapped angle, or that paid social hasn't worked for it.`);

  if (breakdown.competition >= 70) explanation.push(`Competition is elevated (${breakdown.competition}/100) — differentiation will matter.`);
  else if (breakdown.competition <= 35) explanation.push(`Competition looks low (${breakdown.competition}/100), which is a meaningful edge if demand holds up.`);

  if (breakdown.marginPotential >= 70) explanation.push(`Estimated margin potential is healthy (${breakdown.marginPotential}/100).`);
  else if (breakdown.marginPotential <= 35) explanation.push(`Margin potential looks thin (${breakdown.marginPotential}/100) — model the unit economics carefully.`);

  if (breakdown.marketSaturation >= 70) explanation.push(`Market saturation is climbing (${breakdown.marketSaturation}/100) — the window may be narrowing.`);

  if (breakdown.trendMomentum >= 75) explanation.push(`Trend momentum is strong (${breakdown.trendMomentum}/100) — this is picking up speed right now.`);

  if (explanation.length === 0) explanation.push("Signals are mixed — no single factor dominates this score.");

  return { score, label, breakdown, explanation };
}

export function lifecycleFromMetrics(growth: number, daysTrending: number, saturation: number): {
  lifecycle: import("@/types").Lifecycle;
} {
  if (growth > 60 && daysTrending < 21) return { lifecycle: "Emerging" };
  if (growth > 40 && daysTrending < 60) return { lifecycle: "Accelerating" };
  if (growth > 70) return { lifecycle: "Viral" };
  if (saturation > 75) return { lifecycle: "Saturated" };
  if (growth < -20) return { lifecycle: "Declining" };
  if (growth < -50) return { lifecycle: "Dead" };
  return { lifecycle: "Mature" };
}

export function trendDirectionFromGrowth(growth: number): import("@/types").TrendDirection {
  if (growth >= 60) return "exploding";
  if (growth >= 15) return "growing";
  if (growth >= -10) return "stable";
  if (growth >= -40) return "declining";
  return "dead";
}

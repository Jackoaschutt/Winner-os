import { getAIProvider } from "@/lib/ai/provider";
import { HOOKS, ANGLES } from "@/lib/data/content-banks";
import { Ad, Product, Store, TestInputs, TestPlanDay, TestResults } from "@/types";

const provider = () => getAIProvider();
export const AI_LABEL = () => (provider().isLive ? "ai-generated" : "ai-generated (demo)");

async function tryLive(system: string, user: string): Promise<string | null> {
  const p = provider();
  if (!p.isLive) return null;
  try {
    const out = await p.complete([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return out?.trim() || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// "Why this score?"
// ---------------------------------------------------------------------------
export async function explainOpportunityScore(product: Product) {
  const live = await tryLive(
    "You are an ecommerce product research analyst.",
    `Explain the opportunity score for ${product.name}: ${JSON.stringify(product.opportunity)}`
  );
  return {
    label: AI_LABEL(),
    lines: live ? [live] : product.opportunity.explanation,
  };
}

// ---------------------------------------------------------------------------
// "Why might this ad be working?"
// ---------------------------------------------------------------------------
export interface AdBreakdown {
  hook: string;
  problem: string;
  desire: string;
  offer: string;
  creativeAngle: string;
  cta: string;
  targetAudience: string;
  emotionalTrigger: string;
  label: string;
}

export async function analyzeAd(ad: Ad, product: Product): Promise<AdBreakdown> {
  const live = await tryLive(
    "You are a direct-response creative strategist analyzing a social ad.",
    `Analyze why this ad might be working. Product: ${product.name}. Hook: ${ad.hook}. Angle: ${ad.angle}. Platform: ${ad.platform}. Active days: ${ad.activeDays}.`
  );
  if (live) {
    return {
      hook: ad.hook,
      problem: live,
      desire: "",
      offer: "",
      creativeAngle: ad.angle,
      cta: ad.cta,
      targetAudience: "",
      emotionalTrigger: "",
      label: AI_LABEL(),
    };
  }
  return {
    hook: ad.hook,
    problem: `Calls out a frustration ${product.category.toLowerCase()} buyers already feel before they've named it.`,
    desire: `Taps into wanting an easier, faster, or more satisfying version of an everyday routine.`,
    offer: `${product.name} positioned as the simple fix, reinforced by a limited-availability framing.`,
    creativeAngle: ad.angle,
    cta: `${ad.cta} — low-friction next step right after the emotional peak of the hook.`,
    targetAudience: `Likely targets ${product.country} shoppers already engaging with ${product.category.toLowerCase()} content.`,
    emotionalTrigger: ad.winningScore > 75 ? "Curiosity + social proof (it's clearly working for others)." : "Curiosity, with room to sharpen the emotional payoff.",
    label: AI_LABEL(),
  };
}

// ---------------------------------------------------------------------------
// Creative Analyzer
// ---------------------------------------------------------------------------
export interface CreativeAnalysis {
  hook: string;
  offer: string;
  angle: string;
  problem: string;
  desire: string;
  socialProof: string;
  cta: string;
  psychology: string;
  videoStructure: string[];
  variations: {
    hooks: string[];
    primaryTexts: string[];
    headlines: string[];
    ctas: string[];
    ugcConcepts: string[];
    videoScripts: string[];
  };
  label: string;
}

export async function analyzeCreative(input: { copy: string; productName?: string }): Promise<CreativeAnalysis> {
  const name = input.productName || "this product";
  const live = await tryLive(
    "You are a senior direct-response copywriter. Never copy the original ad verbatim — produce original structural variations.",
    `Analyze this ad copy and generate original variations (do not copy verbatim): "${input.copy}" for ${name}.`
  );
  const base: CreativeAnalysis = {
    hook: input.copy.split(".")[0]?.slice(0, 90) || HOOKS[0],
    offer: `${name} framed as an easy win with a limited-time angle.`,
    angle: ANGLES[Math.floor(Math.random() * ANGLES.length) % ANGLES.length],
    problem: "A daily annoyance the audience already recognizes but hasn't put a name to.",
    desire: "Wants a faster, easier, more satisfying way to solve it — with proof it actually works.",
    socialProof: "Implied through confident, first-person delivery and a casual, unscripted tone.",
    cta: "Shop Now, placed right after the emotional peak.",
    psychology: "Curiosity gap opened in the first 2 seconds, resolved just before the CTA.",
    videoStructure: [
      "0-2s: Hook / pattern interrupt",
      "2-8s: Agitate the problem",
      "8-18s: Demonstrate the product solving it",
      "18-25s: Social proof / result",
      "25-30s: CTA + urgency",
    ],
    variations: {
      hooks: [
        "I tested every version of this so you don't have to",
        "This is the one thing in my routine nobody asks about — until they see it",
        "Wait, is this actually that easy?",
      ],
      primaryTexts: [
        `${name} fixed a problem I didn't even realize I'd normalized. Here's what changed.`,
        `Genuinely didn't expect ${name.toLowerCase()} to become part of my daily routine this fast.`,
        `If you've been putting this off — here's what finally changed my mind.`,
      ],
      headlines: [
        `${name}: The Simple Fix`,
        `Why Everyone's Switching to ${name}`,
        `${name} — Selling Out Fast`,
      ],
      ctas: ["Shop Now", "See Why It's Trending", "Get Yours Today"],
      ugcConcepts: [
        "Unscripted 'first reaction' unboxing filmed on a phone",
        "Day-in-the-life showing the product used naturally, no hard sell",
        "Friend-to-friend recommendation format, casual tone",
      ],
      videoScripts: [
        "Hook: pattern interrupt question → Problem: relatable frustration → Demo: show the fix → CTA: soft, confident close.",
        "Hook: bold claim → Proof: quick before/after → Objection handling: address the obvious doubt → CTA: urgency close.",
        "Hook: 'nobody talks about this' → Story: founder or user origin story → Demo → CTA.",
      ],
    },
    label: AI_LABEL(),
  };
  if (live) {
    base.problem = live;
    base.label = AI_LABEL();
  }
  return base;
}

// ---------------------------------------------------------------------------
// Store breakdown
// ---------------------------------------------------------------------------
export async function analyzeStore(store: Store) {
  return {
    doingWell: store.strengths,
    doingBadly: store.weaknesses,
    whatToCopy: store.strengths.slice(0, 2),
    whatToImprove: store.weaknesses,
    opportunity: store.opportunity,
    label: AI_LABEL(),
  };
}

// ---------------------------------------------------------------------------
// Full product research report
// ---------------------------------------------------------------------------
export interface ResearchReport {
  executiveSummary: string;
  product: string;
  demand: string;
  market: string;
  competition: string;
  adLandscape: string;
  creativeOpportunities: string;
  customerPainPoints: string;
  pricing: string;
  marginPotential: string;
  risks: string;
  recommendation: string;
  verdict: "TEST" | "WATCH" | "AVOID";
  verdictReason: string;
  label: string;
}

export async function generateResearchReport(product: Product, ads: Ad[], stores: Store[]): Promise<ResearchReport> {
  const score = product.opportunity.score;
  const verdict: ResearchReport["verdict"] = score >= 70 ? "TEST" : score >= 50 ? "WATCH" : "AVOID";
  const verdictReason =
    verdict === "TEST"
      ? "Demand, growth, and ad activity are aligned — this clears the bar for a small paid test."
      : verdict === "WATCH"
      ? "Signals are mixed. Worth tracking for 1-2 more weeks before committing budget."
      : "Competition or saturation currently outweighs the demand signal.";

  return {
    executiveSummary: `${product.name} shows ${product.trend} demand with an opportunity score of ${score}/100 (${product.opportunity.label}). ${ads.length} tracked ads and ${stores.length} stores selling in this category.`,
    product: product.description,
    demand: `Demand score ${product.opportunity.breakdown.demand}/100. Revenue trend over the trailing period: ${product.revenueTrend30d > 0 ? "+" : ""}${product.revenueTrend30d}%. Lifecycle stage: ${product.lifecycle}.`,
    market: `Primary market: ${product.country}. Category: ${product.category}, currently at ${product.opportunity.breakdown.trendMomentum}/100 trend momentum.`,
    competition: `Competition score ${product.competition}/100 across ${product.storeCount} known stores and ${product.adCount} active ads.`,
    adLandscape: `${product.adCount} ads tracked, ${product.creatorCount} distinct creators/pages. Longest-running ad in this sample: ${Math.max(0, ...ads.map((a) => a.activeDays))} days.`,
    creativeOpportunities: `Angles seen: ${Array.from(new Set(ads.map((a) => a.angle))).slice(0, 3).join("; ") || "limited creative sample"}. Room for a differentiated hook if creative diversity is below 60.`,
    customerPainPoints: `Common objections: ${product.reviewSignals.commonObjections.join("; ")}. Language customers use: ${product.reviewSignals.customerLanguage.join(", ")}.`,
    pricing: `Priced at $${product.price.toFixed(2)} against a supplier cost of $${product.supplierCost.toFixed(2)}.`,
    marginPotential: `Estimated gross margin ${Math.round(((product.price - product.supplierCost) / product.price) * 100)}% before ad spend and shipping.`,
    risks: verdict === "AVOID" ? "Saturation and competition are the dominant risks right now." : "Standard testing risk: creative/hook may not transfer 1:1 even where demand is real.",
    recommendation:
      verdict === "TEST"
        ? "Run a small 3-5 day creative test with 2-3 angles before committing to scale budget."
        : verdict === "WATCH"
        ? "Add to watchlist and re-check in 7 days for movement in growth and ad activity."
        : "Deprioritize unless a clearly differentiated angle emerges.",
    verdict,
    verdictReason,
    label: AI_LABEL(),
  };
}

// ---------------------------------------------------------------------------
// Test plan generator
// ---------------------------------------------------------------------------
export function generateTestPlan(inputs: TestInputs, results: TestResults): TestPlanDay[] {
  const dailyBudget = Math.max(10, Math.round(inputs.adBudget / 5));
  return [
    {
      day: 1,
      focus: "Creative testing",
      actions: [
        "Launch 3-4 distinct creative concepts (not just color/text swaps)",
        "Single interest-based or broad audience to isolate creative signal",
        "Let the algorithm exit learning phase before judging results",
      ],
      budget: dailyBudget,
      kpis: ["CTR (link)", "Thumbstop rate", "CPM"],
    },
    {
      day: 2,
      focus: "Hook testing",
      actions: [
        "Pause bottom 50% of creatives by CTR",
        "Introduce 2 new hook variations on the surviving concept(s)",
        "Watch for CPA trending toward target of $" + inputs.targetCPA.toFixed(0),
      ],
      budget: dailyBudget,
      kpis: ["CPA", "Hook rate (3s view %)", "Add-to-cart rate"],
    },
    {
      day: 3,
      focus: "Audience testing",
      actions: [
        "Duplicate the winning creative across 2-3 audience segments",
        "Test broad vs. interest-based vs. lookalike (if pixel data allows)",
        "Keep budgets even across audiences for a fair read",
      ],
      budget: dailyBudget,
      kpis: ["CPA by audience", "ROAS", "Conversion rate"],
    },
    {
      day: 4,
      focus: "Kill losers",
      actions: [
        `Kill any ad set with CPA > $${(inputs.targetCPA * 1.5).toFixed(0)} and >$${(dailyBudget * 1.5).toFixed(0)} spent`,
        "Kill creatives with CTR below half the account average",
        "Reallocate freed budget to the current leader",
      ],
      budget: dailyBudget,
      kpis: ["CPA", "Spend efficiency", "Frequency"],
    },
    {
      day: 5,
      focus: "Scale winners",
      actions: [
        `Scale the winning ad set 20-30% if ROAS stays above break-even (${results.breakEvenRoas.toFixed(2)}x)`,
        "Duplicate winner into a fresh ad set rather than editing budget directly, to reset delivery",
        "Document the winning hook/angle in the Creative Vault",
      ],
      budget: Math.round(dailyBudget * 1.3),
      kpis: ["ROAS", "CPA stability at higher spend", "Profit per day"],
    },
  ];
}

// ---------------------------------------------------------------------------
// AI Researcher chat — simple, transparent intent routing over the demo
// dataset. Structured output (not a wall of prose), swappable for a live
// model call later.
// ---------------------------------------------------------------------------
export interface ResearcherAnswer {
  kind: "products" | "text" | "test-plan-prompt";
  summary: string;
  productIds?: string[];
  label: string;
}

export function routeResearcherQuery(
  query: string,
  products: Product[]
): ResearcherAnswer {
  const q = query.toLowerCase();
  let pool = [...products];

  const under = q.match(/under\s*\$?(\d+)/);
  if (under) pool = pool.filter((p) => p.price <= Number(under[1]));

  const over = q.match(/over\s*\$?(\d+)/);
  if (over) pool = pool.filter((p) => p.price >= Number(over[1]));

  if (q.includes("low competition")) pool = pool.filter((p) => p.competition <= 45);
  if (q.includes("rising demand") || q.includes("growing demand") || q.includes("hotter")) {
    pool = pool.filter((p) => p.growth >= 20);
  }
  if (q.includes("ads running") || q.includes("30+ day") || q.includes("30 day")) {
    pool = pool.filter((p) => p.daysTrending >= 30);
  }
  const categoryMatch = [
    "beauty",
    "home",
    "kitchen",
    "pet",
    "fitness",
    "baby",
    "fashion",
    "tech",
    "outdoor",
    "automotive",
    "health",
    "toys",
    "jewelry",
    "office",
    "garden",
    "sports",
    "travel",
    "pool",
    "cleaning",
    "novelty",
  ].find((c) => q.includes(c));
  if (categoryMatch) pool = pool.filter((p) => p.category.toLowerCase().includes(categoryMatch));

  pool.sort((a, b) => b.opportunity.score - a.opportunity.score);

  const limitMatch = q.match(/(\d+)\s*products?/);
  const limit = limitMatch ? Number(limitMatch[1]) : 8;
  const top = pool.slice(0, Math.min(limit, 20));

  if (q.includes("test plan") || q.includes("build me a test")) {
    return {
      kind: "test-plan-prompt",
      summary: "Head to My Tests → Build My Test to generate a full 5-day plan for a specific product.",
      label: AI_LABEL(),
    };
  }

  return {
    kind: "products",
    summary:
      top.length > 0
        ? `Found ${top.length} product${top.length === 1 ? "" : "s"} matching "${query}", ranked by Opportunity Score.`
        : `No products matched every filter in "${query}" — showing the closest matches by opportunity score instead.`,
    productIds: (top.length > 0 ? top : pool.length ? pool.slice(0, 5) : products.slice(0, 5)).map((p) => p.id),
    label: AI_LABEL(),
  };
}

// Core normalized data types for WINNER OS.
// The UI only ever consumes these shapes — never a raw provider payload —
// so swapping DATA_PROVIDER_MODE from "demo" to "live" requires no UI changes.

export type DataSourceLabel = "actual" | "estimated" | "ai-generated" | "demo";

export type Country =
  | "Australia"
  | "United States"
  | "United Kingdom"
  | "Canada"
  | "Germany"
  | "France"
  | "Global";

export type Platform = "Meta" | "TikTok" | "Instagram" | "Google";

export type CreativeFormat = "Video" | "Image" | "Carousel";

export type CTA =
  | "Shop Now"
  | "Learn More"
  | "Buy Now"
  | "Sign Up"
  | "Get Offer";

export type Lifecycle =
  | "Emerging"
  | "Accelerating"
  | "Viral"
  | "Mature"
  | "Saturated"
  | "Declining"
  | "Dead";

export type TrendDirection = "exploding" | "growing" | "stable" | "declining" | "dead";

export interface ScoreBreakdown {
  demand: number;
  growth: number;
  adActivity: number;
  creativeDiversity: number;
  competition: number; // higher = MORE competition (bad)
  price: number; // price-fit score
  marginPotential: number;
  uniqueness: number;
  socialProof: number;
  trendMomentum: number;
  marketSaturation: number; // higher = MORE saturated (bad)
}

export interface OpportunityScore {
  score: number; // 0-100
  label: string;
  breakdown: ScoreBreakdown;
  explanation: string[];
}

export interface RevenuePoint {
  date: string; // ISO date
  revenue: number;
  sales: number;
  searchInterest: number;
  adActivity: number;
  competitionIndex: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryId: string;
  price: number;
  supplierCost: number;
  currency: "AUD" | "USD";
  revenue: number; // estimated GMV, trailing 30d
  revenueTrend30d: number; // % change
  sales: number;
  growth: number; // % growth, trailing period
  adCount: number;
  creatorCount: number;
  storeCount: number;
  daysTrending: number;
  competition: number; // 0-100
  opportunity: OpportunityScore;
  trend: TrendDirection;
  lifecycle: Lifecycle;
  country: Country;
  launchDate: string;
  createdAt: string;
  tags: string[];
  description: string;
  history: RevenuePoint[]; // 180 days of consistent history
  reviewSignals: {
    topComplaints: string[];
    topDesires: string[];
    topBenefits: string[];
    commonObjections: string[];
    customerLanguage: string[];
  };
  dataLabel: DataSourceLabel;
}

export interface Ad {
  id: string;
  productId: string;
  brand: string;
  platform: Platform;
  mediaType: CreativeFormat;
  thumbnail: string;
  copy: string;
  headline: string;
  cta: CTA;
  launchDate: string;
  activeDays: number;
  likes: number;
  comments: number;
  shares: number;
  estimatedSpend: number;
  country: Country;
  creativeScore: number; // 0-100
  winningScore: number; // 0-100
  angle: string;
  hook: string;
  dataLabel: DataSourceLabel;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  category: string;
  country: Country;
  productCount: number;
  estimatedTraffic: number;
  adCount: number;
  bestSellers: string[]; // product ids
  pricingNotes: string;
  trustSignals: string[];
  upsells: string[];
  founded: string;
  strengths: string[];
  weaknesses: string[];
  opportunity: string;
  dataLabel: DataSourceLabel;
}

export type CreativeFolder =
  | "Winning Hooks"
  | "UGC"
  | "Problem/Solution"
  | "Before/After"
  | "Product Demo"
  | "Testimonial"
  | "Founder Story"
  | "Comparison"
  | "Listicle"
  | "Shock/Curiosity";

export interface SavedCreative {
  id: string;
  adId: string;
  folder: CreativeFolder;
  tags: string[];
  savedAt: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  momentum: number; // 0-100
}

export interface Trend {
  id: string;
  name: string;
  type: "product" | "category" | "market";
  momentum: number;
  competition: number;
  opportunity: number;
  ageDays: number;
  lifecycle: Lifecycle;
  history: { date: string; index: number }[];
  relatedProductIds: string[];
}

export interface Competitor {
  id: string;
  storeId: string;
  addedAt: string;
  alerts: { id: string; date: string; message: string; type: "price" | "product" | "offer" | "creative" }[];
}

export interface TestInputs {
  productId?: string;
  productName: string;
  supplierCost: number;
  sellingPrice: number;
  shipping: number;
  adBudget: number;
  targetCPA: number;
  expectedAOV: number;
}

export interface TestResults {
  grossMarginPerUnit: number;
  grossMarginPct: number;
  breakEvenRoas: number;
  breakEvenCpa: number;
  potentialProfit: number;
  potentialLoss: number;
  recommendedBudget: number;
  recommendedDays: number;
}

export interface TestPlanDay {
  day: number;
  focus: string;
  actions: string[];
  budget: number;
  kpis: string[];
}

export interface ProductTest {
  id: string;
  createdAt: string;
  inputs: TestInputs;
  results: TestResults;
  plan?: TestPlanDay[];
  status: "planning" | "testing" | "won" | "killed";
}

export interface UserProfile {
  name: string;
  email: string;
  goal?: string;
  region?: Country;
  experience?: "Beginner" | "Intermediate" | "Advanced";
  onboarded: boolean;
}

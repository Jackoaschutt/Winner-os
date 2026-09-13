import { Rng } from "@/lib/utils/random";
import { computeOpportunityScore, lifecycleFromMetrics, trendDirectionFromGrowth } from "@/lib/analytics/opportunity";
import {
  CATEGORIES,
  BRAND_PREFIXES,
  BRAND_SUFFIXES,
  HOOKS,
  ANGLES,
  OBJECTIONS,
  CUSTOMER_LANGUAGE,
  TRUST_SIGNALS,
  UPSELLS,
  COUNTRIES,
} from "@/lib/data/content-banks";
import {
  Ad,
  Category,
  CreativeFolder,
  Platform,
  CreativeFormat,
  CTA,
  Product,
  RevenuePoint,
  SavedCreative,
  Store,
  Trend,
} from "@/types";

const SEED = 1337; // fixed seed -> stable, internally-consistent demo dataset
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

function buildHistory(rng: Rng, growthPct: number, endRevenue: number, endSales: number): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  const days = 180;
  // Work backwards from "today" so the series ends at the current stats and
  // the trajectory implies the stated growth% over the trailing 30 days.
  const dailyDrift = growthPct / 100 / 30; // approx daily compounding to hit growth over 30d
  let revenue = endRevenue;
  let sales = endSales;
  let search = clamp(50 + growthPct / 2 + rng.float(-8, 8));
  let adActivity = clamp(40 + growthPct / 2.2 + rng.float(-10, 10));
  let competitionIdx = clamp(30 + growthPct / 3 + rng.float(-10, 10));

  const buffer: RevenuePoint[] = [];
  for (let i = 0; i < days; i++) {
    buffer.push({
      date: daysAgo(i),
      revenue: Math.max(50, Math.round(revenue)),
      sales: Math.max(1, Math.round(sales)),
      searchInterest: Math.round(clamp(search)),
      adActivity: Math.round(clamp(adActivity)),
      competitionIndex: Math.round(clamp(competitionIdx)),
    });
    // step backwards in time: undo the drift plus noise
    const noise = 1 + rng.float(-0.04, 0.04);
    revenue = revenue / (1 + dailyDrift) / noise;
    sales = sales / (1 + dailyDrift) / noise;
    search = clamp(search / (1 + dailyDrift * 0.6) / (1 + rng.float(-0.03, 0.03)));
    adActivity = clamp(adActivity / (1 + dailyDrift * 0.5) / (1 + rng.float(-0.03, 0.03)));
    competitionIdx = clamp(competitionIdx / (1 + dailyDrift * 0.3) / (1 + rng.float(-0.02, 0.02)));
  }
  return buffer.reverse();
}

function brandName(rng: Rng): string {
  return `${rng.pick(BRAND_PREFIXES)}${rng.pick(BRAND_SUFFIXES)}`;
}

export interface DemoDataset {
  categories: Category[];
  products: Product[];
  ads: Ad[];
  stores: Store[];
  savedCreatives: SavedCreative[];
  trends: Trend[];
}

export function generateDemoDataset(): DemoDataset {
  const rng = new Rng(SEED);

  // ---- Categories ----
  const categories: Category[] = CATEGORIES.map((c, i) => ({
    id: `cat_${i + 1}`,
    name: c.name,
    productCount: 0,
    momentum: rng.int(30, 95),
  }));

  // ---- Products (5 per category x 20 = 100) ----
  const products: Product[] = [];
  CATEGORIES.forEach((cat, catIdx) => {
    cat.items.forEach((itemName, itemIdx) => {
      const id = `prod_${catIdx + 1}_${itemIdx + 1}`;
      const price = rng.float(cat.priceRange[0], cat.priceRange[1], 2);
      const marginPct = rng.float(0.55, 0.82); // gross margin before ads
      const supplierCost = Math.round(price * (1 - marginPct) * 100) / 100;

      const growth = Math.round(rng.float(-55, 95));
      const demand = clamp(Math.round(55 + growth / 2.2 + rng.float(-12, 12)));
      const adCount = Math.max(0, Math.round(clamp(40 + growth / 1.6 + rng.float(-20, 20)) / 2));
      const storeCount = Math.max(1, Math.round(adCount / rng.float(2.2, 4)));
      const creatorCount = Math.max(0, Math.round(adCount * rng.float(0.4, 1.1)));
      const competition = clamp(Math.round(25 + adCount * 0.6 + storeCount * 0.8 + rng.float(-10, 10)));
      const daysTrending = Math.max(3, Math.round(clamp(growth, 0, 100) * rng.float(0.8, 1.6) + rng.int(5, 40)));
      const saturation = clamp(Math.round(competition * 0.6 + daysTrending / 3 + rng.float(-8, 8)));
      const creativeDiversity = clamp(Math.round(30 + adCount * 0.5 + rng.float(-10, 15)));
      const socialProof = clamp(Math.round(demand * 0.7 + rng.float(-10, 20)));
      const uniqueness = clamp(Math.round(100 - competition * 0.5 + rng.float(-15, 15)));
      const priceScore = clamp(Math.round(100 - Math.abs(price - 35) * 1.4));
      const marginScore = clamp(Math.round(marginPct * 100 + rng.float(-8, 8)));
      const trendMomentum = clamp(Math.round((demand + growth) / 2 + rng.float(-10, 10)));

      const opportunity = computeOpportunityScore({
        demand,
        growth: clamp(50 + growth / 1.5),
        adActivity: clamp(Math.round(adCount * 1.4)),
        creativeDiversity,
        competition,
        price: priceScore,
        marginPotential: marginScore,
        uniqueness,
        socialProof,
        trendMomentum,
        marketSaturation: saturation,
      });

      const { lifecycle } = lifecycleFromMetrics(growth, daysTrending, saturation);
      const trend = trendDirectionFromGrowth(growth);

      // revenue derived from demand+price+adCount so the numbers imply each other
      const baseUnits = Math.round(150 + demand * 18 + adCount * 12 + rng.float(-200, 400));
      const sales = Math.max(20, baseUnits);
      const revenue = Math.round(sales * price);

      const country = rng.pick(COUNTRIES);

      const product: Product = {
        id,
        name: itemName,
        image: `https://picsum.photos/seed/${id}/600/600`,
        category: cat.name,
        categoryId: `cat_${catIdx + 1}`,
        price,
        supplierCost,
        currency: "USD",
        revenue,
        revenueTrend30d: growth,
        sales,
        growth,
        adCount,
        creatorCount,
        storeCount,
        daysTrending,
        competition,
        opportunity,
        trend,
        lifecycle,
        country,
        launchDate: daysAgo(daysTrending + rng.int(10, 120)),
        createdAt: daysAgo(daysTrending),
        tags: [cat.name.split(" ")[0], trend, lifecycle],
        description: `${itemName} — a ${cat.name.toLowerCase()} product currently showing ${trend} demand signals across paid social.`,
        history: buildHistory(rng, growth, revenue / 30, sales / 30),
        reviewSignals: {
          topComplaints: rng.pickMany(OBJECTIONS, 2),
          topDesires: rng.pickMany(CUSTOMER_LANGUAGE, 3),
          topBenefits: rng.pickMany(CUSTOMER_LANGUAGE, 3),
          commonObjections: rng.pickMany(OBJECTIONS, 2),
          customerLanguage: rng.pickMany(CUSTOMER_LANGUAGE, 4),
        },
        dataLabel: "demo",
      };
      products.push(product);
      categories[catIdx].productCount += 1;
    });
  });

  // ---- Stores (30) ----
  const stores: Store[] = [];
  for (let i = 0; i < 30; i++) {
    const cat = rng.pick(CATEGORIES);
    const name = brandName(rng);
    const domain = `${name.toLowerCase()}.com`;
    const catProducts = products.filter((p) => p.category === cat.name);
    const bestSellers = rng.pickMany(catProducts, Math.min(4, catProducts.length)).map((p) => p.id);
    const adCount = rng.int(2, 60);
    stores.push({
      id: `store_${i + 1}`,
      name,
      domain,
      category: cat.name,
      country: rng.pick(COUNTRIES),
      productCount: rng.int(15, 220),
      estimatedTraffic: rng.int(2000, 400000),
      adCount,
      bestSellers,
      pricingNotes: rng.bool()
        ? "Anchors price against a crossed-out 'was' price with a bundle discount."
        : "Flat pricing, relies on bundle upsells rather than discounting.",
      trustSignals: rng.pickMany(TRUST_SIGNALS, 3),
      upsells: rng.pickMany(UPSELLS, 2),
      founded: `${rng.int(2018, 2025)}`,
      strengths: [
        "Fast, clear above-the-fold value proposition",
        "Strong UGC-style product imagery",
        "Reviews widget placed near the buy box",
      ].slice(0, rng.int(1, 3)),
      weaknesses: [
        "Checkout has too many optional fields",
        "Shipping times not shown until checkout",
        "Limited cross-sell on product pages",
      ].slice(0, rng.int(1, 2)),
      opportunity: "Room to differentiate on shipping transparency and a sharper hero angle.",
      dataLabel: "demo",
    });
  }

  // ---- Ads (100) ----
  const ads: Ad[] = [];
  const platforms: Platform[] = ["Meta", "TikTok", "Instagram", "Google"];
  const formats: CreativeFormat[] = ["Video", "Image", "Carousel"];
  const ctas: CTA[] = ["Shop Now", "Learn More", "Buy Now", "Sign Up", "Get Offer"];
  for (let i = 0; i < 100; i++) {
    const product = rng.pick(products);
    const activeDays = Math.max(1, Math.round(clamp(product.growth, 0, 100) * rng.float(0.5, 1.3) + rng.int(1, 25)));
    const engagementBase = clamp(product.opportunity.breakdown.demand + rng.float(-15, 15));
    const likes = Math.round(engagementBase * rng.float(15, 60));
    const comments = Math.round(likes * rng.float(0.02, 0.08));
    const shares = Math.round(likes * rng.float(0.01, 0.05));
    const estimatedSpend = Math.round(activeDays * rng.float(80, 650));
    const creativeScore = clamp(Math.round(engagementBase * 0.6 + rng.float(-10, 25)));
    const winningScore = clamp(
      Math.round(activeDays * 0.6 + (likes + comments * 3 + shares * 2) / 500 + creativeScore * 0.3)
    );
    ads.push({
      id: `ad_${i + 1}`,
      productId: product.id,
      brand: rng.pick(stores).name,
      platform: rng.pick(platforms),
      mediaType: rng.pick(formats),
      thumbnail: `https://picsum.photos/seed/${`ad_${i + 1}`}/500/620`,
      copy: `${rng.pick(HOOKS)} ${product.name} has been on repeat in my routine.`,
      headline: `${product.name} — ${rng.bool() ? "Selling Fast" : "Limited Restock"}`,
      cta: rng.pick(ctas),
      launchDate: daysAgo(activeDays),
      activeDays,
      likes,
      comments,
      shares,
      estimatedSpend,
      country: product.country,
      creativeScore,
      winningScore,
      angle: rng.pick(ANGLES),
      hook: rng.pick(HOOKS),
      dataLabel: "demo",
    });
  }

  // ---- Saved Creatives (50) ----
  const folders: CreativeFolder[] = [
    "Winning Hooks",
    "UGC",
    "Problem/Solution",
    "Before/After",
    "Product Demo",
    "Testimonial",
    "Founder Story",
    "Comparison",
    "Listicle",
    "Shock/Curiosity",
  ];
  const savedCreatives: SavedCreative[] = [];
  const chosenAds = rng.pickMany(ads, 50);
  chosenAds.forEach((ad, i) => {
    savedCreatives.push({
      id: `sc_${i + 1}`,
      adId: ad.id,
      folder: rng.pick(folders),
      tags: rng.pickMany(["hook", "ugc", "demo", "testimonial", "angle", "cta"], 2),
      savedAt: daysAgo(rng.int(0, 60)),
    });
  });

  // ---- Trends (15) ----
  const trends: Trend[] = [];
  for (let i = 0; i < 15; i++) {
    const type = rng.pick(["product", "category", "market"] as const);
    let name = "";
    let relatedProductIds: string[] = [];
    if (type === "product") {
      const p = rng.pick(products);
      name = p.name;
      relatedProductIds = [p.id];
    } else if (type === "category") {
      const c = rng.pick(categories);
      name = c.name;
      relatedProductIds = products.filter((p) => p.categoryId === c.id).slice(0, 5).map((p) => p.id);
    } else {
      name = `${rng.pick(COUNTRIES)} market surge`;
      relatedProductIds = rng.pickMany(products, 4).map((p) => p.id);
    }
    const momentum = rng.int(35, 98);
    const competition = rng.int(15, 90);
    const opportunity = clamp(Math.round(momentum * 0.6 + (100 - competition) * 0.4));
    const ageDays = rng.int(3, 90);
    const { lifecycle } = lifecycleFromMetrics(momentum - 40, ageDays, competition);
    const history = Array.from({ length: 30 }).map((_, d) => ({
      date: daysAgo(29 - d),
      index: clamp(Math.round(momentum - (29 - d) * rng.float(0.5, 1.8) + rng.float(-6, 6))),
    }));
    trends.push({
      id: `trend_${i + 1}`,
      name,
      type,
      momentum,
      competition,
      opportunity,
      ageDays,
      lifecycle,
      history,
      relatedProductIds,
    });
  }

  return { categories, products, ads, stores, savedCreatives, trends };
}

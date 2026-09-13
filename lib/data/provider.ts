import { Ad, Category, Product, SavedCreative, Store, Trend } from "@/types";
import { generateDemoDataset } from "@/lib/data/generate";

export interface DataProvider {
  mode: "demo" | "live";
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getAds(): Promise<Ad[]>;
  getAdsForProduct(productId: string): Promise<Ad[]>;
  getStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  getCategories(): Promise<Category[]>;
  getTrends(): Promise<Trend[]>;
  getSavedCreatives(): Promise<SavedCreative[]>;
}

// ---------------------------------------------------------------------------
// Demo provider — generated once per server process, fully self-consistent.
// ---------------------------------------------------------------------------
let cached: ReturnType<typeof generateDemoDataset> | null = null;
function dataset() {
  if (!cached) cached = generateDemoDataset();
  return cached;
}

class DemoDataProvider implements DataProvider {
  mode: "demo" = "demo";
  async getProducts() {
    return dataset().products;
  }
  async getProduct(id: string) {
    return dataset().products.find((p) => p.id === id);
  }
  async getAds() {
    return dataset().ads;
  }
  async getAdsForProduct(productId: string) {
    return dataset().ads.filter((a) => a.productId === productId);
  }
  async getStores() {
    return dataset().stores;
  }
  async getStore(id: string) {
    return dataset().stores.find((s) => s.id === id);
  }
  async getCategories() {
    return dataset().categories;
  }
  async getTrends() {
    return dataset().trends;
  }
  async getSavedCreatives() {
    return dataset().savedCreatives;
  }
}

// ---------------------------------------------------------------------------
// Live provider — adapters go here. Each method should call the relevant
// external API (TikTok Creative Center, Meta Ad Library, Shopify storefront
// scraping/partner API, a supplier feed, etc.), normalize the response into
// the shared types in /types, and return it. Until real credentials +
// adapters are wired up, this throws so it's obvious the switch isn't wired
// rather than silently returning nothing.
// ---------------------------------------------------------------------------
class LiveDataProvider implements DataProvider {
  mode: "live" = "live";
  private notImplemented(name: string): never {
    throw new Error(
      `[WINNER OS] DATA_PROVIDER_MODE=live but no live adapter is implemented for ${name}(). ` +
        `Wire it up in lib/data/provider.ts, or set DATA_PROVIDER_MODE=demo.`
    );
  }
  async getProducts(): Promise<Product[]> {
    this.notImplemented("getProducts");
  }
  async getProduct(): Promise<Product | undefined> {
    this.notImplemented("getProduct");
  }
  async getAds(): Promise<Ad[]> {
    this.notImplemented("getAds");
  }
  async getAdsForProduct(): Promise<Ad[]> {
    this.notImplemented("getAdsForProduct");
  }
  async getStores(): Promise<Store[]> {
    this.notImplemented("getStores");
  }
  async getStore(): Promise<Store | undefined> {
    this.notImplemented("getStore");
  }
  async getCategories(): Promise<Category[]> {
    this.notImplemented("getCategories");
  }
  async getTrends(): Promise<Trend[]> {
    this.notImplemented("getTrends");
  }
  async getSavedCreatives(): Promise<SavedCreative[]> {
    this.notImplemented("getSavedCreatives");
  }
}

let provider: DataProvider | null = null;
export function getDataProvider(): DataProvider {
  if (!provider) {
    const mode = process.env.DATA_PROVIDER_MODE === "live" ? "live" : "demo";
    provider = mode === "live" ? new LiveDataProvider() : new DemoDataProvider();
  }
  return provider;
}

export const DATA_MODE: "demo" | "live" =
  process.env.DATA_PROVIDER_MODE === "live" ? "live" : "demo";

import { getDataProvider } from "@/lib/data/provider";
import { AdSpy } from "@/components/ads/AdSpy";

export default async function AdSpyPage({ searchParams }: { searchParams: { product?: string } }) {
  const provider = getDataProvider();
  const [ads, products] = await Promise.all([provider.getAds(), provider.getProducts()]);
  return <AdSpy ads={ads} products={products} initialProductId={searchParams.product} />;
}

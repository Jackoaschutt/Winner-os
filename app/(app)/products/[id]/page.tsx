import { getDataProvider } from "@/lib/data/provider";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const provider = getDataProvider();
  const product = await provider.getProduct(params.id);
  if (!product) notFound();

  const [ads, allStores] = await Promise.all([provider.getAdsForProduct(product.id), provider.getStores()]);
  const stores = allStores.filter((s) => s.bestSellers.includes(product.id));

  return <ProductDetail product={product} ads={ads} stores={stores} />;
}

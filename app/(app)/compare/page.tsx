import { getDataProvider } from "@/lib/data/provider";
import { CompareView } from "@/components/products/CompareView";

export default async function ComparePage() {
  const provider = getDataProvider();
  const products = await provider.getProducts();
  return <CompareView products={products} />;
}

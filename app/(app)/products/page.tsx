import { getDataProvider } from "@/lib/data/provider";
import { ProductDiscovery } from "@/components/products/ProductDiscovery";

export default async function ProductsPage() {
  const provider = getDataProvider();
  const [products, categories] = await Promise.all([provider.getProducts(), provider.getCategories()]);
  return <ProductDiscovery products={products} categories={categories} />;
}

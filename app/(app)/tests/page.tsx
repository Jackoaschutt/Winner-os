import { getDataProvider } from "@/lib/data/provider";
import { TestLab } from "@/components/tests/TestLab";

export default async function TestsPage({ searchParams }: { searchParams: { product?: string } }) {
  const provider = getDataProvider();
  const products = await provider.getProducts();
  return <TestLab products={products} initialProductId={searchParams.product} />;
}

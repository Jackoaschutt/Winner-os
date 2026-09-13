import { getDataProvider } from "@/lib/data/provider";
import { notFound } from "next/navigation";
import { StoreBreakdownCard } from "@/components/stores/StoreSpy";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StoreDetailPage({ params }: { params: { id: string } }) {
  const provider = getDataProvider();
  const store = await provider.getStore(params.id);
  if (!store) notFound();

  const allProducts = await provider.getProducts();
  const bestSellers = allProducts.filter((p) => store.bestSellers.includes(p.id));

  return (
    <div>
      <Link href="/stores" className="mb-4 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70">
        <ArrowLeft size={13} /> Back to Store Spy
      </Link>
      <StoreBreakdownCard store={store} />
      {bestSellers.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-white">Best Sellers</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

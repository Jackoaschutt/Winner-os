import { getDataProvider } from "@/lib/data/provider";
import { WatchlistView } from "@/components/watchlist/WatchlistView";

export default async function WatchlistPage() {
  const provider = getDataProvider();
  const products = await provider.getProducts();
  return <WatchlistView products={products} />;
}

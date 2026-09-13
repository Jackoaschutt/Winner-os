import { getDataProvider } from "@/lib/data/provider";
import { CompetitorTracker } from "@/components/competitors/CompetitorTracker";

export default async function CompetitorsPage() {
  const provider = getDataProvider();
  const stores = await provider.getStores();
  return <CompetitorTracker stores={stores} />;
}

import { getDataProvider } from "@/lib/data/provider";
import { StoreSpy } from "@/components/stores/StoreSpy";

export default async function StoresPage() {
  const provider = getDataProvider();
  const stores = await provider.getStores();
  return <StoreSpy stores={stores} />;
}

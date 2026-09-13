import { getDataProvider } from "@/lib/data/provider";
import { ResearcherChat } from "@/components/researcher/ResearcherChat";

export default async function AIResearcherPage() {
  const provider = getDataProvider();
  const products = await provider.getProducts();
  return <ResearcherChat products={products} />;
}

import { getDataProvider } from "@/lib/data/provider";
import { TrendRadar } from "@/components/trends/TrendRadar";

export default async function TrendsPage() {
  const provider = getDataProvider();
  const trends = await provider.getTrends();
  return <TrendRadar trends={trends} />;
}

import { getDataProvider } from "@/lib/data/provider";
import { CreativeAnalyzer } from "@/components/creatives/CreativeAnalyzer";
import { CreativeVault } from "@/components/creatives/CreativeVault";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default async function CreativesPage() {
  const provider = getDataProvider();
  const [ads, saved] = await Promise.all([provider.getAds(), provider.getSavedCreatives()]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-white">Creatives</h1>
      <p className="mb-6 text-sm text-white/45">Analyze what makes an ad work, generate original variations, and organize what you've found.</p>
      <Tabs defaultValue="analyzer">
        <TabsList>
          <TabsTrigger value="analyzer">Creative Analyzer</TabsTrigger>
          <TabsTrigger value="vault">Creative Vault</TabsTrigger>
        </TabsList>
        <TabsContent value="analyzer">
          <CreativeAnalyzer />
        </TabsContent>
        <TabsContent value="vault">
          <CreativeVault saved={saved} ads={ads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

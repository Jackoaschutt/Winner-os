import { AppShell } from "@/components/layout/AppShell";
import { getDataProvider } from "@/lib/data/provider";
import { AuthGate } from "@/components/auth/AuthGate";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const provider = getDataProvider();
  const [products, stores] = await Promise.all([provider.getProducts(), provider.getStores()]);

  return (
    <AuthGate>
      <AppShell products={products} stores={stores}>
        {children}
      </AppShell>
    </AuthGate>
  );
}

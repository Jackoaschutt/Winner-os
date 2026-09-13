"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Product, Store } from "@/types";

export function AppShell({
  children,
  products,
  stores,
}: {
  children: ReactNode;
  products: Product[];
  stores: Store[];
}) {
  return (
    <div className="flex min-h-screen bg-base-950 bg-grid-fade">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
      </div>
      <MobileNav />
      <CommandPalette products={products} stores={stores} />
    </div>
  );
}

"use client";

import { Search, Bell } from "lucide-react";
import { useAppStore } from "@/lib/state/useAppStore";
import Link from "next/link";

export function Topbar() {
  const session = useAppStore((s) => s.session);
  const setCommandOpen = useAppStore((s) => s.setCommandOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/8 bg-base-950/70 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={() => setCommandOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/40 hover:border-white/20"
      >
        <Search size={14} />
        Search products, ads, stores...
        <kbd className="ml-auto rounded border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white">
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-full accent-gradient text-xs font-semibold text-white"
        >
          {(session?.name || "G").slice(0, 1).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}

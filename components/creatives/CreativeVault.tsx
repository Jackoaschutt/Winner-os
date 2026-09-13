"use client";

import { useMemo, useState } from "react";
import { Ad, CreativeFolder, SavedCreative } from "@/types";
import { AdCard } from "@/components/ads/AdCard";
import { cn } from "@/lib/utils/cn";

const FOLDERS: CreativeFolder[] = [
  "Winning Hooks", "UGC", "Problem/Solution", "Before/After", "Product Demo",
  "Testimonial", "Founder Story", "Comparison", "Listicle", "Shock/Curiosity",
];

export function CreativeVault({ saved, ads }: { saved: SavedCreative[]; ads: Ad[] }) {
  const [folder, setFolder] = useState<CreativeFolder | "All">("All");
  const adMap = useMemo(() => new Map(ads.map((a) => [a.id, a])), [ads]);

  const filtered = folder === "All" ? saved : saved.filter((s) => s.folder === folder);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFolder("All")}
          className={cn("rounded-full border px-3 py-1.5 text-xs", folder === "All" ? "border-accent/50 bg-accent/15 text-accent-soft" : "border-white/10 text-white/50")}
        >
          All ({saved.length})
        </button>
        {FOLDERS.map((f) => {
          const count = saved.filter((s) => s.folder === f).length;
          return (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={cn("rounded-full border px-3 py-1.5 text-xs", folder === f ? "border-accent/50 bg-accent/15 text-accent-soft" : "border-white/10 text-white/50")}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((s) => {
          const ad = adMap.get(s.adId);
          if (!ad) return null;
          return <AdCard key={s.id} ad={ad} />;
        })}
      </div>
      {filtered.length === 0 && <p className="py-16 text-center text-white/30">No creatives saved in this folder yet.</p>}
    </div>
  );
}

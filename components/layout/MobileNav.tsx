"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Package,
  Radar,
  Sparkles,
  FlaskConical,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { X } from "lucide-react";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/ad-spy", label: "Ad Spy", icon: Radar },
  { href: "/ai-researcher", label: "AI", icon: Sparkles },
  { href: "/tests", label: "Tests", icon: FlaskConical },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 bg-base-950/95 py-2 backdrop-blur-xl md:hidden">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
                active ? "text-accent" : "text-white/40"
              )}
            >
              <Icon size={19} />
              {t.label}
            </Link>
          );
        })}
        <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-white/40">
          <Menu size={19} />
          More
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-base-950">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} className="text-white/60">
                <X size={20} />
              </button>
            </div>
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}

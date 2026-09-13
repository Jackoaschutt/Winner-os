"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/lib/state/useAppStore";
import {
  LayoutDashboard,
  Package,
  Radar,
  Bookmark,
  Store,
  TrendingUp,
  Users,
  Eye,
  Sparkles,
  FlaskConical,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Zap,
  Film,
  Layers,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/ad-spy", label: "Ad Spy", icon: Radar },
  { href: "/creatives", label: "Creatives", icon: Film },
  { href: "/stores", label: "Stores", icon: Store },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/watchlist", label: "Watchlist", icon: Eye },
  { href: "/compare", label: "Compare", icon: Layers },
  { href: "/ai-researcher", label: "AI Researcher", icon: Sparkles },
  { href: "/tests", label: "My Tests", icon: FlaskConical },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggle = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 flex-col border-r border-white/8 bg-base-950/80 backdrop-blur-xl",
        mobile ? "flex w-64" : "hidden md:flex",
        !mobile && (collapsed ? "w-[76px]" : "w-64")
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient shadow-glow">
          <Zap size={16} className="text-white" fill="white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-white">
            WINNER<span className="text-accent"> OS</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className={cn(active && "text-accent")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <button
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-white/40 hover:bg-white/5 hover:text-white/70"
        >
          {collapsed ? <ChevronsRight size={16} /> : (<><ChevronsLeft size={16} /> Collapse</>)}
        </button>
      </div>
    </aside>
  );
}

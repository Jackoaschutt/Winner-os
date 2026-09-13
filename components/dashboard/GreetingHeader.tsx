"use client";

import { useAppStore } from "@/lib/state/useAppStore";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader() {
  const profile = useAppStore((s) => s.profile);
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-white">
        {greeting()}{profile?.name ? `, ${profile.name}` : ""} 👋
      </h1>
      <p className="text-sm text-white/45">Here&apos;s what&apos;s happening in ecommerce right now.</p>
    </div>
  );
}

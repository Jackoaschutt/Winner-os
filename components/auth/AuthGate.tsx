"use client";

import { useAppStore } from "@/lib/state/useAppStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Zap } from "lucide-react";

// Demo-mode auth guard. Real Supabase auth would replace this with a
// server-side session check (see /lib/auth/README.md), but the redirect
// contract for the rest of the app stays identical either way.
export function AuthGate({ children }: { children: ReactNode }) {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!profile?.onboarded) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, session, profile, router]);

  if (!hasHydrated || !session || !profile?.onboarded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 animate-pulse-slow items-center justify-center rounded-xl accent-gradient shadow-glow">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <p className="text-xs text-white/40">Loading WINNER OS...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

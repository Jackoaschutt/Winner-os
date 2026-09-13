"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state/useAppStore";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";
import Link from "next/link";

// Demo-mode auth: any email/password combination signs in locally. This is
// intentionally simple so the product works with zero configuration — see
// README.md "Swapping in real Supabase auth" for the drop-in replacement.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const login = useAppStore((s) => s.login);
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    login(email);
    router.push(profile?.onboarded ? "/dashboard" : "/onboarding");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 bg-grid-fade px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl accent-gradient shadow-glow">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <h1 className="text-lg font-semibold">Welcome to WINNER OS</h1>
          <p className="text-center text-sm text-white/40">
            Demo mode — enter any email to continue. No password verification, no card required.
          </p>
        </div>

        <div className="glass-panel rounded-xl2 p-6 shadow-glass">
          <div className="mb-5 flex rounded-lg bg-white/5 p-1 text-sm">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md py-1.5 ${mode === "signup" ? "bg-white/15 text-white" : "text-white/40"}`}
            >
              Sign up
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-1.5 ${mode === "login" ? "bg-white/15 text-white" : "text-white/40"}`}
            >
              Log in
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-white/40">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent/50"
              />
            </div>
            <Button type="submit" className="w-full">
              {mode === "signup" ? "Create free account" : "Log in"}
            </Button>
          </form>
          <Button variant="outline" className="mt-3 w-full" onClick={() => { login("demo@winner-os.app", "Demo User"); router.push("/onboarding"); }}>
            Continue with demo account
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-white/25">
          <Link href="/" className="hover:text-white/50">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

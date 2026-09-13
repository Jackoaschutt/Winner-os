"use client";

import { useAppStore } from "@/lib/state/useAppStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { DATA_MODE } from "@/lib/data/provider";

export default function SettingsPage() {
  const session = useAppStore((s) => s.session);
  const profile = useAppStore((s) => s.profile);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-white">Settings</h1>

      <div className="glass-panel mb-4 rounded-xl2 p-6 shadow-glass">
        <h2 className="mb-4 text-sm font-semibold text-white">Account</h2>
        <div className="space-y-2 text-sm">
          <Row label="Email" value={session?.email || "—"} />
          <Row label="Goal" value={profile?.goal || "—"} />
          <Row label="Region" value={profile?.region || "—"} />
          <Row label="Experience" value={profile?.experience || "—"} />
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => { logout(); router.push("/login"); }}>
          Log out
        </Button>
      </div>

      <div className="glass-panel mb-4 rounded-xl2 p-6 shadow-glass">
        <h2 className="mb-4 text-sm font-semibold text-white">Data Source</h2>
        <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/5 p-3">
          <div>
            <p className="text-sm text-white/80">Current mode</p>
            <p className="text-xs text-white/40">Controlled by DATA_PROVIDER_MODE in your environment.</p>
          </div>
          <Badge tone={DATA_MODE === "demo" ? "neutral" : "good"} className="uppercase">{DATA_MODE}</Badge>
        </div>
        <p className="mt-3 text-xs text-white/40">
          To connect live data, implement the adapters in <code className="rounded bg-white/10 px-1">lib/data/provider.ts</code> and set{" "}
          <code className="rounded bg-white/10 px-1">DATA_PROVIDER_MODE=live</code>.
        </p>
      </div>

      <div className="glass-panel rounded-xl2 p-6 shadow-glass">
        <h2 className="mb-4 text-sm font-semibold text-white">AI Provider</h2>
        <p className="text-xs text-white/40">
          Set <code className="rounded bg-white/10 px-1">AI_PROVIDER</code> to <code className="rounded bg-white/10 px-1">anthropic</code>,{" "}
          <code className="rounded bg-white/10 px-1">openai</code>, or <code className="rounded bg-white/10 px-1">gemini</code>, along with the
          matching API key, to move AI Researcher, Creative Analyzer and Research Reports off demo mode.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-white/40">{label}</span>
      <span className="text-white/80">{value}</span>
    </div>
  );
}

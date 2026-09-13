"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/state/useAppStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { Country } from "@/types";

const GOALS = [
  "Find winning products",
  "Dropship",
  "Build a Shopify store",
  "Run Meta Ads",
  "Run TikTok Ads",
  "Affiliate marketing",
  "Product research",
  "Agency",
];
const REGIONS: Country[] = ["Australia", "United States", "United Kingdom", "Canada", "Germany", "Global"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string>();
  const [region, setRegion] = useState<Country>();
  const [experience, setExperience] = useState<(typeof LEVELS)[number]>();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const session = useAppStore((s) => s.session);
  const router = useRouter();

  const steps = [
    {
      title: "What are you trying to do?",
      render: () => (
        <div className="grid grid-cols-2 gap-2.5">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                goal === g ? "border-accent/60 bg-accent/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      ),
      valid: !!goal,
    },
    {
      title: "Where are you selling?",
      render: () => (
        <div className="grid grid-cols-2 gap-2.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                region === r ? "border-accent/60 bg-accent/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      ),
      valid: !!region,
    },
    {
      title: "Experience level?",
      render: () => (
        <div className="grid grid-cols-1 gap-2.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setExperience(l)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                experience === l ? "border-accent/60 bg-accent/10 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      ),
      valid: !!experience,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 bg-grid-fade px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "accent-gradient" : "bg-white/10")} />
          ))}
        </div>
        <div className="glass-panel rounded-xl2 p-6 shadow-glass">
          <p className="mb-1 text-xs text-white/40">
            Step {step + 1} of {steps.length}
          </p>
          <h1 className="mb-5 text-lg font-semibold">{current.title}</h1>
          {current.render()}
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button
              size="sm"
              disabled={!current.valid}
              onClick={() => {
                if (isLast) {
                  completeOnboarding({
                    name: session?.name || "there",
                    email: session?.email || "",
                    goal,
                    region,
                    experience,
                    onboarded: true,
                  });
                  router.push("/dashboard");
                } else {
                  setStep((s) => s + 1);
                }
              }}
            >
              {isLast ? "Enter WINNER OS" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

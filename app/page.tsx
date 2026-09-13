import Link from "next/link";
import { ArrowRight, Flame, Radar, Film, Store, Sparkles, FlaskConical, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { Badge } from "@/components/ui/Badge";

const WORKFLOW = [
  { icon: Flame, title: "Product Discovery", desc: "Find products with real demand, growth, and margin signal — not guesses." },
  { icon: Radar, title: "Ad Spy", desc: "See the ads already running for a product, how long, and how well they're performing." },
  { icon: Film, title: "Creative Intelligence", desc: "Break down why an ad works, then generate original variations to test." },
  { icon: Store, title: "Store Spy", desc: "Reverse-engineer what a competing store does well — and where it's weak." },
  { icon: Sparkles, title: "AI Research", desc: "Ask a question, get a structured research report with a clear verdict." },
  { icon: FlaskConical, title: "Test Lab", desc: "Turn a product into a real 5-day test plan with budgets, KPIs and kill rules." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-950 bg-grid-fade text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient shadow-glow">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            WINNER<span className="text-accent"> OS</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          <a href="#workflow" className="hover:text-white">Product</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button href="/login" variant="ghost" size="sm">Log in</Button>
          <Button href="/login" size="sm">Start for free</Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16 text-center md:pt-24">
        <Badge tone="accent" className="mx-auto mb-6 w-fit">Free ecommerce intelligence platform</Badge>
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Find products worth selling{" "}
          <span className="text-gradient">before everyone else.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-white/60 md:text-lg">
          Research products, spy on winning ads, analyze competitors and build your next ecommerce
          test — all from one free intelligence platform.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/login" size="lg" className="w-full sm:w-auto">
            Start for free <ArrowRight size={16} />
          </Button>
          <Button href="/login" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore demo
          </Button>
        </div>
        <p className="mt-4 text-xs text-white/30">No credit card. Free forever, genuinely.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <LandingPreview />
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">From idea to test in minutes.</h2>
          <p className="mt-2 text-white/50">Discover → Validate → Spy → Analyze → Test → Scale.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW.map((w) => (
            <div key={w.title} className="glass-panel rounded-xl2 p-6 shadow-glass transition-transform hover:-translate-y-1">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                <w.icon size={18} className="text-accent-soft" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold">{w.title}</h3>
              <p className="text-sm text-white/50">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-6 pb-28">
        <div className="glass-panel glow-border rounded-xl2 p-8 text-center md:p-14">
          <h2 className="text-2xl font-semibold md:text-3xl">Genuinely free to start.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/55">
            Product discovery, AI research, and your watchlist — free, no fake paywalls. Pro and
            Agency tiers add unlimited research, advanced ad spy and team workspaces later.
          </p>
          <Button href="/login" size="lg" className="mt-6">
            Start for free <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/8 px-6 py-8 text-center text-xs text-white/30">
        WINNER OS — a working name. All data in this build is clearly labeled Demo, Estimated, or
        AI-generated. No guarantees of income or results are made or implied.
      </footer>
    </div>
  );
}

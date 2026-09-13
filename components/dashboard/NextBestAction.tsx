import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NextBestAction({
  title = "Next best action",
  action,
  href,
  ctaLabel = "Go",
}: {
  title?: string;
  action: string;
  href: string;
  ctaLabel?: string;
}) {
  return (
    <div className="glass-panel glow-border flex items-center justify-between gap-4 rounded-xl2 p-4 shadow-glass">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-accent-soft">{title}</p>
        <p className="mt-0.5 text-sm text-white/85">{action}</p>
      </div>
      <Button href={href} size="sm" className="shrink-0">
        {ctaLabel} <ArrowRight size={13} />
      </Button>
    </div>
  );
}

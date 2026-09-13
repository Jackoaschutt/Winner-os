import { Badge } from "@/components/ui/Badge";
import { DataSourceLabel } from "@/types";

const copy: Record<DataSourceLabel, string> = {
  actual: "Actual",
  estimated: "Estimated",
  "ai-generated": "AI-generated",
  demo: "Demo dataset",
};

export function DataLabel({ label }: { label: DataSourceLabel | string }) {
  const key = (label as DataSourceLabel) in copy ? (label as DataSourceLabel) : "demo";
  return (
    <Badge tone={key === "demo" ? "neutral" : key === "ai-generated" ? "accent" : "neutral"} className="text-[10px]">
      {copy[key] || label}
    </Badge>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <PackageX size={28} className="mb-4 text-white/20" />
      <h1 className="mb-1 text-lg font-semibold text-white">We couldn&apos;t find that.</h1>
      <p className="mb-5 text-sm text-white/40">It may have been removed, or the link is out of date.</p>
      <Button href="/products">Back to Product Discovery</Button>
    </div>
  );
}

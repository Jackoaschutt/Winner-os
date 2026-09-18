import { NextRequest, NextResponse } from "next/server";
import { searchMetaAdLibrary } from "@/lib/ads/metaAdLibrary";

// Server-only route — this is what keeps META_AD_LIBRARY_ACCESS_TOKEN out of
// the browser. The client (components/ads/LiveMetaAds.tsx) only ever talks
// to this route, never to graph.facebook.com directly.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const country = req.nextUrl.searchParams.get("country") || "AU";
  const limit = Number(req.nextUrl.searchParams.get("limit") || 12);

  const result = await searchMetaAdLibrary(q, { country, limit });
  return NextResponse.json(result);
}

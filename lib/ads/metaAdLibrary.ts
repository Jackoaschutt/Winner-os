// Server-only integration with Meta's official Ad Library API.
// Docs: https://www.facebook.com/ads/library/api
//
// This is the real thing — no scraping, no guessing. It calls Meta's own
// `ads_archive` endpoint with your META_AD_LIBRARY_ACCESS_TOKEN and returns
// each ad's `ad_snapshot_url`, which is Meta's own hosted page that renders
// the actual creative (image or video, playable) exactly as it runs. We
// embed that page directly rather than trying to extract/host the raw
// video ourselves — Meta doesn't reliably expose a direct video file URL
// through this API, and the snapshot page is the intended, stable way to
// view an archived ad's creative.
//
// Get a token: developers.facebook.com -> create an app -> add the
// "Marketing API" product -> use a user or system-user access token that
// has ads_read (no special review needed for the Ad Library endpoint
// itself, only for the "Issues, Elections or Politics" category, which
// this app never requests). Put it in META_AD_LIBRARY_ACCESS_TOKEN.

export interface MetaAd {
  id: string;
  pageName: string;
  pageId: string;
  bodyText: string;
  linkTitle: string;
  linkCaption: string;
  snapshotUrl: string;
  startDate: string | null;
  stopDate: string | null;
  isActive: boolean;
  platforms: string[];
  impressionsRange: string | null;
  spendRange: string | null;
}

export interface MetaAdSearchResult {
  ads: MetaAd[];
  error: null | "no_token" | "no_results" | "api_error";
  errorDetail?: string;
}

const GRAPH_VERSION = "v21.0";

function tokenConfigured(): string | null {
  const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
  return token && token.trim().length > 0 ? token.trim() : null;
}

export async function searchMetaAdLibrary(
  searchTerm: string,
  opts: { country?: string; limit?: number } = {}
): Promise<MetaAdSearchResult> {
  const token = tokenConfigured();
  if (!token) return { ads: [], error: "no_token" };
  if (!searchTerm.trim()) return { ads: [], error: "no_results" };

  const country = (opts.country || "AU").toUpperCase();
  const limit = Math.min(Math.max(opts.limit ?? 12, 1), 30);

  const fields = [
    "id",
    "page_name",
    "page_id",
    "ad_creative_bodies",
    "ad_creative_link_titles",
    "ad_creative_link_captions",
    "ad_snapshot_url",
    "ad_delivery_start_time",
    "ad_delivery_stop_time",
    "publisher_platforms",
    "impressions",
    "spend",
  ].join(",");

  const params = new URLSearchParams({
    search_terms: searchTerm,
    ad_type: "ALL",
    ad_reached_countries: JSON.stringify([country]),
    ad_active_status: "ALL",
    limit: String(limit),
    fields,
    access_token: token,
  });

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/ads_archive?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 0 } });
  } catch (e: any) {
    return { ads: [], error: "api_error", errorDetail: e?.message || "Network error reaching Meta's API." };
  }

  if (!res.ok) {
    let detail = `Meta API returned HTTP ${res.status}.`;
    try {
      const body = await res.json();
      if (body?.error?.message) detail = body.error.message;
    } catch {
      // ignore — keep the generic HTTP-status message
    }
    return { ads: [], error: "api_error", errorDetail: detail };
  }

  const json = await res.json();
  const rows: any[] = Array.isArray(json?.data) ? json.data : [];

  if (rows.length === 0) return { ads: [], error: "no_results" };

  const ads: MetaAd[] = rows.map((r) => ({
    id: r.id,
    pageName: r.page_name || "Unknown page",
    pageId: r.page_id || "",
    bodyText: Array.isArray(r.ad_creative_bodies) ? r.ad_creative_bodies[0] || "" : "",
    linkTitle: Array.isArray(r.ad_creative_link_titles) ? r.ad_creative_link_titles[0] || "" : "",
    linkCaption: Array.isArray(r.ad_creative_link_captions) ? r.ad_creative_link_captions[0] || "" : "",
    snapshotUrl: r.ad_snapshot_url || "",
    startDate: r.ad_delivery_start_time || null,
    stopDate: r.ad_delivery_stop_time || null,
    isActive: !r.ad_delivery_stop_time,
    platforms: Array.isArray(r.publisher_platforms) ? r.publisher_platforms : [],
    impressionsRange: r.impressions ? `${r.impressions.lower_bound}–${r.impressions.upper_bound ?? "+"}` : null,
    spendRange: r.spend ? `${r.spend.lower_bound}–${r.spend.upper_bound ?? "+"}` : null,
  }));

  return { ads, error: null };
}

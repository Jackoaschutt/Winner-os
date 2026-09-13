import { Rng } from "@/lib/utils/random";
import { Store } from "@/types";

const ALERT_TEMPLATES: { type: "price" | "product" | "offer" | "creative"; text: string }[] = [
  { type: "price", text: "Dropped price on a best seller by ~15%" },
  { type: "product", text: "Added 2 new products to the catalog" },
  { type: "offer", text: "Launched a new bundle discount" },
  { type: "creative", text: "Started running a new video ad angle" },
  { type: "price", text: "Introduced a 'was/now' price anchor on the homepage" },
  { type: "offer", text: "Added a free-gift-with-purchase threshold" },
  { type: "creative", text: "Refreshed hero creative on the homepage" },
];

export function generateAlertsForStore(store: Store) {
  const rng = new Rng(`alerts_${store.id}`);
  const count = rng.int(1, 4);
  const chosen = rng.pickMany(ALERT_TEMPLATES, count);
  return chosen.map((t, i) => ({
    id: `${store.id}_alert_${i}`,
    date: daysAgo(rng.int(1, 21)),
    message: t.text,
    type: t.type,
  }));
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

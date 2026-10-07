import { NextResponse } from "next/server";
import { safeFetch } from "@/lib/safe";
export const runtime = "nodejs";
const dec = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).trim();
const meta = (h: string, k: string) => {
  const m = h.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*>`, "i"));
  const c = m && m[0].match(/content=["']([^"']*)["']/i);
  return c ? dec(c[1]) : "";
};
// robots.txt (User-agent: * গ্রুপের Disallow) মানা হয়
async function allowed(u: URL) {
  try {
    const r = await safeFetch(u.origin + "/robots.txt", 100000, "text/plain");
    if (r.status !== 200) return true;
    let on = false;
    for (const l of r.body.toString().split(/\r?\n/)) {
      const [k, ...v] = l.split(":"); const key = k.trim().toLowerCase(), val = v.join(":").split("#")[0].trim();
      if (key === "user-agent") on = val === "*"; else if (on && key === "disallow" && val && u.pathname.startsWith(val)) return false;
    }
    return true;
  } catch { return true; }
}
export async function GET(req: Request) {
  try {
    const u = new URL(new URL(req.url).searchParams.get("url") || "");
    if (!(await allowed(u))) return NextResponse.json({ error: "robots" }, { status: 403 });
    const r = await safeFetch(u.href);
    const h = r.body.toString("utf8");
    const img = meta(h, "og:image") || meta(h, "twitter:image");
    const title = meta(h, "og:title") || dec((h.match(/<title[^>]*>([^<]*)<\/title>/i) || [, ""])[1]);
    return NextResponse.json({
      title, description: (meta(h, "og:description") || meta(h, "description")).slice(0, 160),
      image: img ? new URL(img, u).href : "", site: meta(h, "og:site_name") || u.hostname.replace(/^www\./, ""),
      author: meta(h, "author") || meta(h, "article:author"), date: meta(h, "article:published_time"),
    });
  } catch { return NextResponse.json({ error: "fetch" }, { status: 400 }); }
}

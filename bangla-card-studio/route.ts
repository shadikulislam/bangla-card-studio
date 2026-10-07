import { safeFetch } from "@/lib/safe";
export const runtime = "nodejs";
// ছবি নিজের ডোমেইন দিয়ে দেওয়া হয়, যাতে ক্যানভাস এক্সপোর্ট ব্লক না হয়
export async function GET(req: Request) {
  try {
    const r = await safeFetch(new URL(req.url).searchParams.get("url") || "", 6_000_000, "image/*");
    if (!r.type.startsWith("image/") || r.truncated) return new Response("bad", { status: 400 });
    return new Response(r.body as any, { headers: { "content-type": r.type, "cache-control": "public, max-age=3600" } });
  } catch { return new Response("bad", { status: 400 }); }
}

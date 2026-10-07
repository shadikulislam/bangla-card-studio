import dns from "dns/promises";
import net from "net";
// প্রাইভেট/লোকাল আইপি ব্লক (SSRF প্রতিরোধ)
const priv = (ip: string) => {
  if (net.isIPv6(ip)) return ip === "::" || /^(::1|fc|fd|fe80|::ffff:(127|10|192\.168|172\.(1[6-9]|2\d|3[01])|169\.254))/i.test(ip);
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
};
export async function safeFetch(raw: string, max = 600000, accept = "text/html") {
  let u = new URL(raw);
  for (let hop = 0; hop < 4; hop++) {
    if (!/^https?:$/.test(u.protocol)) throw new Error("protocol");
    const ips = await dns.lookup(u.hostname, { all: true });
    if (!ips.length || ips.some((a) => priv(a.address))) throw new Error("blocked");
    const r = await fetch(u, { redirect: "manual", signal: AbortSignal.timeout(6000), headers: { "user-agent": "BanglaCardStudio/1.0 (link preview)", accept } });
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) { u = new URL(loc, u); continue; }
    const chunks: Uint8Array[] = []; let n = 0, truncated = false;
    const rd = r.body!.getReader();
    for (;;) { const { done, value } = await rd.read(); if (done) break; n += value.length; if (n > max) { truncated = true; rd.cancel(); break; } chunks.push(value); }
    return { status: r.status, type: r.headers.get("content-type") || "", body: Buffer.concat(chunks), truncated };
  }
  throw new Error("redirects");
}

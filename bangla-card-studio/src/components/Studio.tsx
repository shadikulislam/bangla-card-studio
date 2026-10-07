"use client";
import { useEffect, useRef, useState } from "react";
import { F, S, TPL, drawCard, detect, PLAT } from "@/lib/engine";
const SS: any = S;
type D = { i: number; p: number };
const TYPES = [["auto","অটো ডিটেক্ট"],["news","সংবাদ"],["quote","উক্তি"],["poetry","কবিতা"],["literature","সাহিত্য"],["thought","ব্যক্তিগত ভাবনা"],["announcement","ঘোষণা"],["motivational","অনুপ্রেরণা"],["islamic","ইসলামিক"],["bangladesh","বাংলাদেশ থিম"],["education","শিক্ষামূলক"],["business","ব্যবসা"],["custom","কাস্টম (সব)"]];
const PLS = [["fb","ফেসবুক ১২০০×৬৩০"],["ig","ইনস্টাগ্রাম স্কয়ার ১০৮০×১০৮০"],["igp","ইনস্টাগ্রাম পোর্ট্রেট ১০৮০×১৩৫০"],["story","স্টোরি ১০৮০×১৯২০"],["yt","ইউটিউব কমিউনিটি ১২৮০×৭২০"],["x","X / টুইটার ১৬০০×৯০০"],["custom","কাস্টম সাইজ"]];
const FONTS = [["auto","টেমপ্লেটের ডিফল্ট"],["Noto Serif Bengali","Noto Serif Bengali"],["Noto Sans Bengali","Noto Sans Bengali"],["Hind Siliguri","Hind Siliguri"],["Tiro Bangla","Tiro Bangla"],["Anek Bangla","Anek Bangla"],["Baloo Da 2","Baloo Da 2"]];
const LPS = [["tr","উপরে ডানে"],["tl","উপরে বামে"],["br","নিচে ডানে"],["bl","নিচে বামে"]];
const init = { text: "আমার জন্মভূমি, প্রিয় মাতৃভূমি বাংলাদেশ।", sub: "", cat: "", author: "", dt: "", url: "", page: "", web: "", type: "auto", pl: "fb", cw: 1080, ch: 1080, font: "auto", sc: 100, lo: 100, lp: "tr", pc: "", ac: "" };
const shuf = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const bn = (d: Date) => d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });

export default function Studio() {
  const [v, setV] = useState(init);
  const [ds, setDs] = useState<D[]>([]);
  const [sel, setSel] = useState(0);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState("");
  const [x2, setX2] = useState(false);
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);
  const pv = useRef<HTMLCanvasElement>(null);
  const set = (k: string, val: any) => setV((p) => ({ ...p, [k]: val }));
  const say = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 4500); };
  const size = (): [number, number] => {
    const [w, h] = v.pl === "custom" ? [+v.cw || 1080, +v.ch || 1080] : (PLAT as any)[v.pl];
    return [Math.min(Math.max(w, 300), 3000), Math.min(Math.max(h, 300), 3000)];
  };
  const sync = () => Object.assign(SS, { text: v.text.trim() || "এখানে আপনার লেখা", sub: v.sub.trim(), cat: v.cat.trim(), author: v.author.trim(), dt: v.dt.trim(), url: v.url.trim(), page: v.page.trim(), web: v.web.trim(), font: v.font, sc: v.sc / 100, lo: v.lo / 100, lp: v.lp, pc: v.pc || null, ac: v.ac || null });

  const loadImg = (src: string, kind: "img" | "logo") => {
    const im = new Image();
    if (!src.startsWith("data:")) im.crossOrigin = "anonymous";
    im.onload = () => { SS[kind] = im; if (kind === "logo") SS.logoData = src; setTick((t) => t + 1); };
    im.onerror = () => say("ছবি লোড করা যায়নি।");
    im.src = src;
  };
  const pick = (e: React.ChangeEvent<HTMLInputElement>, kind: "img" | "logo") => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => loadImg(String(r.result), kind); r.readAsDataURL(f);
  };
  const gen = (keep: boolean) => {
    if (!v.text.trim()) { say("অনুগ্রহ করে আগে কিছু লিখুন।"); return; }
    const ty = v.type === "auto" ? detect(v.text) : v.type, all = TPL.map((_, i) => i);
    const pool = ty === "custom" ? [] : all.filter((i) => TPL[i].ty.includes(ty));
    const order = [...shuf(pool), ...shuf(all.filter((i) => !pool.includes(i)))].slice(0, 10);
    const prev = keep && ds[sel] ? ds[sel] : null;
    let n: D[] = order.filter((i) => !prev || i !== prev.i).map((i) => ({ i, p: Math.floor(Math.random() * 3) }));
    if (prev) n = [{ i: prev.i, p: (prev.p + 1 + Math.floor(Math.random() * 2)) % 3 }, ...n].slice(0, 10);
    setDs(n); setSel(0);
  };
  const fetchUrl = async () => {
    if (!v.url.trim()) { say("আগে লিংক পেস্ট করুন।"); return; }
    say("লিংক পড়া হচ্ছে...");
    try {
      const r = await fetch("/api/article?url=" + encodeURIComponent(v.url.trim()));
      if (!r.ok) throw 0;
      const a = await r.json(); let d = "";
      if (a.date) { const t = new Date(a.date); if (!isNaN(+t)) d = bn(t); }
      setV((p) => ({ ...p, text: a.title || p.text, sub: a.description || "", author: a.author || p.author, dt: d || p.dt, cat: p.cat || a.site || "" }));
      if (a.image) loadImg("/api/image?url=" + encodeURIComponent(a.image), "img");
      say("হয়েছে। চাইলে লেখা এডিট করুন।");
    } catch { say("এই লিংক থেকে আর্টিকেল পড়া যায়নি। আপনি নিজে তথ্য দিতে পারেন।"); }
  };
  const dl = (type: "png" | "jpg") => {
    try {
      sync(); const [W, H] = size(), k = x2 ? 2 : 1, c = document.createElement("canvas");
      drawCard(c, ds[sel], W * k, H * k);
      c.toBlob((b) => {
        if (!b) return say("এক্সপোর্ট করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `bangla-card-${Date.now()}.${type}`; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      }, type === "png" ? "image/png" : "image/jpeg", 0.95);
    } catch { say("এক্সপোর্ট করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।"); }
  };
  const save = () => {
    try { localStorage.setItem("bcs", JSON.stringify({ pg: v.page, web: v.web, pc: v.pc, ac: v.ac, font: v.font, logo: SS.logoData || null })); say("ব্র্যান্ড কিট সেভ হয়েছে।"); }
    catch { say("সেভ করা যায়নি (লোগো বড় হতে পারে)।"); }
  };

  useEffect(() => {
    const s = "অআকখ বাংলা";
    Promise.all((Object.values(F) as string[]).flatMap((f) => [400, 700].map((w) => document.fonts.load(`${w} 40px "${f}"`, s))).concat(document.fonts.load('500 40px "Hind Siliguri"', s), document.fonts.load('500 40px "Noto Sans Bengali"', s)))
      .catch(() => {}).then(() => setReady(true));
    try {
      const b = JSON.parse(localStorage.getItem("bcs") || "null");
      if (b) { setV((p) => ({ ...p, page: b.pg || "", web: b.web || "", pc: b.pc || "", ac: b.ac || "", font: b.font || "auto" })); if (b.logo) loadImg(b.logo, "logo"); }
    } catch {}
  }, []);
  useEffect(() => { if (ready) gen(false); }, [ready]);
  useEffect(() => {
    if (!ready || !ds.length) return;
    sync(); const [W, H] = size();
    ds.forEach((d, k) => { const c = refs.current[k]; if (c) drawCard(c, d, W, H); });
    if (pv.current) drawCard(pv.current, ds[Math.min(sel, ds.length - 1)], W, H);
  }, [v, ds, sel, ready, tick]);

  const I = (label: string, k: string, ph?: string) => (
    <label className="f"><span>{label}</span><input value={(v as any)[k]} placeholder={ph} onChange={(e) => set(k, e.target.value)} /></label>);
  const Sl = (label: string, k: string, o: string[][]) => (
    <label className="f"><span>{label}</span><select value={(v as any)[k]} onChange={(e) => set(k, e.target.value)}>{o.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select></label>);

  return (
    <div>
      <header className="top"><h1>বাংলা কার্ড স্টুডিও</h1><p>আপনার লেখা থেকে কয়েক সেকেন্ডেই প্রফেশনাল সোশ্যাল মিডিয়া ফটোকার্ড</p></header>
      <main className="app">
        <aside className="panel">
          <section>
            <h2>১. লেখা বা লিংক</h2>
            <label className="f"><span>মূল লেখা</span><textarea value={v.text} onChange={(e) => set("text", e.target.value)} /></label>
            <div className="row"><div className="grow">{I("আর্টিকেল বা নিউজ লিংক", "url", "https://example.com/news")}</div><button type="button" onClick={fetchUrl}>লিংক থেকে আনুন</button></div>
            {I("উপশিরোনাম (ঐচ্ছিক)", "sub")}
            <div className="two">{I("ক্যাটাগরি লেবেল", "cat", "যেমন: সংবাদ")}{I("লেখক / সূত্র", "author")}</div>
            <div className="row"><div className="grow">{I("তারিখ (ঐচ্ছিক)", "dt", "৭ অক্টোবর ২০২৬")}</div><button type="button" onClick={() => set("dt", bn(new Date()))}>আজকের তারিখ</button></div>
          </section>
          <section>
            <h2>২. ধরন ও প্ল্যাটফর্ম</h2>
            <div className="two">{Sl("কনটেন্টের ধরন", "type", TYPES)}{Sl("প্ল্যাটফর্ম", "pl", PLS)}</div>
            {v.pl === "custom" && <div className="two">{I("প্রস্থ", "cw")}{I("উচ্চতা", "ch")}</div>}
            <div className="bar"><button type="button" className="p" onClick={() => gen(false)}>ডিজাইন তৈরি করুন</button><button type="button" onClick={() => gen(true)}>রিমিক্স</button></div>
          </section>
          <section>
            <h2>৩. ব্র্যান্ড ও স্টাইল</h2>
            <div className="two">{I("পেজের নাম", "page")}{I("ওয়েবসাইট", "web", "example.com")}</div>
            <div className="two">{Sl("ফন্ট", "font", FONTS)}<label className="f"><span>লেখার আকার</span><input type="range" min={60} max={130} value={v.sc} onChange={(e) => set("sc", +e.target.value)} /></label></div>
            <div className="two"><label className="f"><span>মূল রং</span><input type="color" value={v.pc || "#0a5c46"} onChange={(e) => set("pc", e.target.value)} /></label><label className="f"><span>অ্যাকসেন্ট রং</span><input type="color" value={v.ac || "#d8344a"} onChange={(e) => set("ac", e.target.value)} /></label></div>
            <div className="bar"><button type="button" onClick={() => setV((p) => ({ ...p, pc: "", ac: "" }))}>ডিফল্ট রং</button><button type="button" onClick={save}>ব্র্যান্ড কিট সেভ</button></div>
          </section>
          <section>
            <h2>৪. ছবি ও লোগো</h2>
            <div className="two"><label className="f"><span>ছবি</span><input type="file" accept="image/*" onChange={(e) => pick(e, "img")} /></label><label className="f"><span>লোগো</span><input type="file" accept="image/*" onChange={(e) => pick(e, "logo")} /></label></div>
            <div className="two">{Sl("লোগোর জায়গা", "lp", LPS)}<label className="f"><span>লোগোর স্বচ্ছতা</span><input type="range" min={20} max={100} value={v.lo} onChange={(e) => set("lo", +e.target.value)} /></label></div>
            <div className="bar"><button type="button" onClick={() => { SS.img = null; setTick((t) => t + 1); }}>ছবি সরান</button><button type="button" onClick={() => { SS.logo = null; SS.logoData = null; setTick((t) => t + 1); }}>লোগো সরান</button></div>
          </section>
        </aside>
        <div className="stage">
          <div className="pvbox"><canvas id="pv" ref={pv} aria-label="কার্ডের লাইভ প্রিভিউ" /></div>
          <div className="bar">
            <button type="button" className="p" onClick={() => dl("png")}>PNG ডাউনলোড</button>
            <button type="button" onClick={() => dl("jpg")}>JPG ডাউনলোড</button>
            <label className="chk"><input type="checkbox" checked={x2} onChange={(e) => setX2(e.target.checked)} />২x হাই-রেজোলিউশন</label>
          </div>
          <p className="msg" role="status">{msg}</p>
          <div className="gal">
            {ds.map((d, k) => (
              <button type="button" key={k} className={"th" + (k === sel ? " sel" : "")} onClick={() => setSel(k)} aria-label={TPL[d.i].n}>
                <canvas ref={(el) => { refs.current[k] = el; }} /><small>{TPL[d.i].n}</small>
              </button>))}
          </div>
        </div>
      </main>
    </div>
  );
}

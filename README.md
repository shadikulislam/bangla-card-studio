# বাংলা কার্ড স্টুডিও

বাংলা লেখা বা নিউজ লিংক থেকে সোশ্যাল মিডিয়া ফটোকার্ড বানানোর ওয়েব অ্যাপ। Next.js (App Router) + TypeScript। কার্ড ব্রাউজারেই Canvas-এ আঁকা হয়, তাই ডাটাবেস লাগে না।

## লোকাল সেটআপ
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build && npm start   # প্রোডাকশন
```

## Vercel-এ ডিপ্লয় (ফ্রি)
1. প্রজেক্ট GitHub-এ পুশ করুন।
2. vercel.com → Add New → Project → রিপোজিটরি ইমপোর্ট করে Deploy চাপুন।
3. Settings → Environment Variables-এ `NEXT_PUBLIC_APP_URL` দিন (যেমন `https://yourdomain.com`)।

## কাস্টম ডোমেইন
Vercel Project → Settings → Domains → ডোমেইন যোগ করুন, তারপর রেজিস্ট্রারে Vercel-এর দেখানো DNS রেকর্ড (A/CNAME) বসান। কোড বদলাতে হয় না।

## ফোল্ডার কাঠামো
- `src/components/Studio.tsx`: পুরো UI ও স্টেট
- `src/lib/engine.js`: কার্ড রেন্ডারিং ইঞ্জিন ও সব টেমপ্লেট (`TPL`)
- `src/lib/safe.ts`: নিরাপদ ফেচ (প্রাইভেট আইপি ব্লক, সাইজ/টাইমআউট লিমিট)
- `src/app/api/article`: লিংক থেকে শিরোনাম, বিবরণ, ছবি, সূত্র, লেখক, তারিখ (og ট্যাগ)
- `src/app/api/image`: ছবি প্রক্সি, যাতে ক্যানভাস এক্সপোর্ট ব্লক না হয়

## নতুন টেমপ্লেট যোগ করা
`src/lib/engine.js`-এর `TPL` অ্যারেতে একটি অবজেক্ট যোগ করুন:
```js
{ n:"টেমপ্লেটের নাম",
  ty:["news"],                    // কোন মোডে আসবে: news, poetry, quote, typography, bangladesh, islamic, business
  f:[F.ns, F.nb],                 // [শিরোনামের ফন্ট, বডির ফন্ট]
  p:[[bg,fg,ac],[bg,fg,ac],[bg,fg,ac]],  // ৩টি রঙের প্যালেট
  d(x,W,H,u,c,f){                 // x=ক্যানভাস, u=সাইজ-ইউনিট, c={bg,fg,ac}
    const m=64*u;
    put(x,S.text,hf(f),m,m,W-2*m,H-3*m,{max:80*u,min:30*u,col:c.fg});
    foot(x,m,H-m*.8,"left",c.fg,u,1);
  }}
```
সব মাপ `u` দিয়ে গুণ করুন যাতে সব সাইজে ঠিক থাকে। `put` লেখা নিজে থেকে মাপে বসায়।

## ফন্ট
Google Fonts (OFL লাইসেন্স) থেকে `src/app/layout.tsx`-এ লোড হয়: Noto Serif/Sans Bengali, Hind Siliguri, Tiro Bangla, Anek Bangla, Baloo Da 2। নতুন ফন্ট যোগ করতে ওই লিংকে যোগ করে `engine.js`-এর `F` ও `Studio.tsx`-এর `FONTS`-এ নাম দিন।

## নিরাপত্তা ও গোপনীয়তা
- কার্ড ও আপলোড করা ছবি ব্রাউজারেই থাকে, সার্ভারে সেভ হয় না। ব্র্যান্ড কিট শুধু ব্যবহারকারীর ব্রাউজারের localStorage-এ থাকে।
- লিংক ফিচারে সার্ভার শুধু মেটাডেটা পড়ে, পুরো আর্টিকেল সংরক্ষণ বা প্রকাশ করে না। `robots.txt` মানা হয়।
- সীমাবদ্ধতা: DNS rebinding পুরোপুরি ঠেকানো নেই, রেট লিমিটও নেই। জনপ্রিয় হলে Vercel Firewall বা রেট লিমিট যোগ করুন।

## রোডম্যাপ
ফেভারিট ও হিস্টরি, AI হেডলাইন ও সামারি, আরও টেমপ্লেট, ইউজার অ্যাকাউন্ট (Supabase)।

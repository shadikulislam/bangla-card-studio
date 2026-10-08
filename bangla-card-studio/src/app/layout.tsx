import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "বাংলা কার্ড স্টুডিও",
  description: "আপনার লেখা থেকে কয়েক সেকেন্ডেই প্রফেশনাল সোশ্যাল মিডিয়া ফটোকার্ড",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700;900&family=Noto+Sans+Bengali:wght@400;500;700;900&family=Hind+Siliguri:wght@500;600;700&family=Tiro+Bangla&family=Anek+Bangla:wght@400;700;800&family=Baloo+Da+2:wght@400;700;800&family=Galada&family=Atma:wght@500;700&family=Mina:wght@400;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}

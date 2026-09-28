import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
import couple from "@/assets/fouad-demiana.png";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  // Without an explicit URL, Next.js falls back to the Vercel deployment URL.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Fouad & Demiana | Wedding Invitation — دعوة فرح",
  description:
    "Wedding invitation of Fouad & Demiana — October 8th. دعوة فرح فؤاد و دميانة — ٨ أكتوبر.",
  keywords: ["wedding", "invitation", "فرح", "دعوة", "Fouad", "Demiana"],
  openGraph: {
    title: "Fouad & Demiana | Wedding Invitation",
    description: "October 8 — ٨ أكتوبر · شرفونا بحضوركم",
    type: "website",
    images: [
      {
        url: couple.src,
        width: couple.width,
        height: couple.height,
        alt: "Fouad & Demiana",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F3EADD",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${amiri.variable} ${tajawal.variable} ${cormorant.variable} ${jost.variable}`}
    >
      <body className="font-arSans antialiased">{children}</body>
    </html>
  );
}

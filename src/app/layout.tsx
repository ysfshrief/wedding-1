import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
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

export const metadata: Metadata = {
  title: "دعوة فرح | Fouad & Demiana",
  description:
    "دعوة فرح فؤاد و دميانة — ٨ أكتوبر. Wedding invitation of Fouad & Demiana — October 8th.",
  keywords: ["wedding", "invitation", "فرح", "دعوة", "Fouad", "Demiana"],
  openGraph: {
    title: "دعوة فرح | Fouad & Demiana",
    description: "٨ أكتوبر — شرفونا بحضوركم",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#6E1023",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${tajawal.variable} ${cormorant.variable} ${jost.variable}`}
    >
      <body className="font-arSans antialiased">{children}</body>
    </html>
  );
}

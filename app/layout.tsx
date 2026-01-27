import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TPBL 進階數據分析｜球員、RAPM、陣容",
    template: "%s｜TPBL Stats",
  },
  description:
    "TPBL 台灣職籃進階數據分析網站，提供球員 、RAPM、Lineup 與比賽效率指標。",
  metadataBase: new URL("https://tpbl-stat-site.vercel.app"),
  verification: {
    google: "rYcD2rNdiSTT8gLqjMouikhjVv9-n-vldgX7KfPO_5I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${inter.variable} ${notoSansTC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

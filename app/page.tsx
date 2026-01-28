import type { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "TPBL 進階數據分析｜球員、RAPM、陣容",
  description:
    "TPBL 台灣職籃進階數據分析網站，提供球員 、RAPM、Lineup 與比賽效率指標。",
};

export default function Home() {
  return <HomeContent />;
}

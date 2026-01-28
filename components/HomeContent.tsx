"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

export function HomeContent() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            {isZh ? "TPBL 進階數據分析平台" : "TPBL Advanced Analytics Platform"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isZh
              ? "本網站提供台灣職業籃球聯盟（TPBL）的進階數據分析，包含 RAPM、球員 、陣容 與比賽效率指標，協助球迷、教練與研究者理解場上影響力。"
              : "Advanced analytics for the Taiwan Professional Basketball League (TPBL), including RAPM, player, lineup, and efficiency metrics to help fans, coaches, and researchers understand on-court impact."}
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/players">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                {isZh ? "查看球員數據" : "View Players"}
              </Button>
            </Link>
            <Link href="/lineups">
              <Button size="lg" variant="outline">
                {isZh ? "查看陣容數據" : "View Lineups"}
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline">
                {isZh ? "比較模式" : "Compare"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

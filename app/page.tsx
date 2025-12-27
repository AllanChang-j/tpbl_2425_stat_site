import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            TPBL 進階數據平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            台灣職業籃球聯盟 (TPBL) 進階統計數據與 RAPM 分析平台
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/players">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                查看球員數據
              </Button>
            </Link>
            <Link href="/lineups">
              <Button size="lg" variant="outline">
                查看陣容數據
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline">
                比較模式
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

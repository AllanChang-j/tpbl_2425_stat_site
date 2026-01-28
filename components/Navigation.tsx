"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

export function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const navItems = [
    { href: "/players", label: language === "zh" ? "球員數據" : "Players" },
    { href: "/lineups", label: language === "zh" ? "陣容數據" : "Lineups" },
    { href: "/compare", label: language === "zh" ? "比較模式" : "Compare" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            {language === "zh" ? "TPBL 進階數據" : "TPBL Advanced Stats"}
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      pathname === item.href && "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
              <Button
                variant={language === "zh" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("zh")}
                className={cn(
                  "h-8 px-2",
                  language === "zh" && "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                中文
              </Button>
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={cn(
                  "h-8 px-2",
                  language === "en" && "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldMapping } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageProvider";

interface DataDictionaryProps {
  field: string;
  mapping: FieldMapping | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataDictionary({ field, mapping, open, onOpenChange }: DataDictionaryProps) {
  if (!mapping) return null;
  const { language } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {language === "zh" ? "欄位說明" : "Field Info"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {language === "zh" ? "中文名稱：" : "Chinese Name:"}
              </span>
              <span className="ml-2">{mapping.zh}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {language === "zh" ? "English Name：" : "English Name:"}
              </span>
              <span className="ml-2">{mapping.en}</span>
            </div>
          </div>
          
          {mapping.definition && (
            <div className="pt-2 border-t">
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  {language === "zh" ? "說明：" : "Definition:"}
                </span>
                <p className="mt-2 text-gray-600 leading-relaxed">{mapping.definition}</p>
              </div>
            </div>
          )}
          
          {!mapping.definition && (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-500 italic">
                {language === "zh"
                  ? "此欄位暫無詳細說明。"
                  : "No detailed definition available yet."}
              </div>
            </div>
          )}
          
          {mapping.formula && (
            <div className="pt-2 border-t">
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  {language === "zh" ? "計算公式：" : "Formula:"}
                </span>
                <code className="block mt-2 bg-gray-100 px-3 py-2 rounded text-xs font-mono">
                  {mapping.formula}
                </code>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


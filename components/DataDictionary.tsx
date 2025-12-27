"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldMapping } from "@/lib/constants";

interface DataDictionaryProps {
  field: string;
  mapping: FieldMapping | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataDictionary({ field, mapping, open, onOpenChange }: DataDictionaryProps) {
  if (!mapping) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mapping.zh} ({mapping.en})</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 mt-4">
              <div>
                <strong>中文名稱:</strong> {mapping.zh}
              </div>
              <div>
                <strong>英文名稱:</strong> {mapping.en}
              </div>
              {mapping.definition && (
                <div>
                  <strong>定義:</strong> {mapping.definition}
                </div>
              )}
              {mapping.formula && (
                <div>
                  <strong>公式:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{mapping.formula}</code>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


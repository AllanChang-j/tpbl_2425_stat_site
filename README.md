# TPBL Advanced Stats & RAPM Platform

台灣職業籃球聯盟 (TPBL) 進階統計數據與 RAPM 分析平台

## 功能特色

- **球員數據查詢**: 完整的球員統計數據，支援多種顯示單位（原始、每場、每36分鐘、每100回合）
- **陣容數據分析**: 分析不同陣容組合的表現（2-5人陣容）
- **比較模式**: 最多可同時比較5個球員或陣容，包含雷達圖和差異分析
- **進階篩選**: 
  - 多球隊選擇
  - 自訂條件篩選（最多5個條件）
  - 最少回合數/分鐘數/場次門檻
- **數據字典**: 點擊欄位標題的資訊圖示查看欄位定義

## 技術棧

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS + shadcn/ui
- **數據處理**: PapaParse (CSV 解析) + Zod (資料驗證)
- **圖表**: Recharts
- **表格**: @tanstack/react-table

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

### 建置生產版本

```bash
npm run build
npm start
```

## 專案結構

```
tpbl_web/
├── app/                    # Next.js App Router 頁面
│   ├── players/           # 球員數據頁面
│   ├── lineups/          # 陣容數據頁面
│   ├── compare/          # 比較模式頁面
│   └── layout.tsx         # 根布局
├── components/            # React 元件
│   ├── DataTable.tsx     # 數據表格元件
│   ├── FilterBar.tsx     # 篩選列元件
│   ├── Navigation.tsx     # 導航元件
│   └── DataDictionary.tsx # 數據字典元件
├── lib/                   # 工具函數和常數
│   ├── constants.ts      # 欄位映射和常數
│   ├── data-service.ts    # 數據載入和解析服務
│   └── utils.ts          # 工具函數
└── public/
    └── data/              # CSV 數據檔案
```

## 數據格式

數據檔案位於 `/public/data/` 目錄：

- `players_TPBL_24-25_advanced.csv`: 球員進階數據
- `lineups_TPBL_24-25_size2.csv`: 2人陣容數據
- `lineups_TPBL_24-25_size3.csv`: 3人陣容數據
- `lineups_TPBL_24-25_size4.csv`: 4人陣容數據
- `lineups_TPBL_24-25_size5.csv`: 5人陣容數據

## 設計系統

- **主色調**: Slate-900 (深灰/黑) 用於標題和主要操作，Gold (#C9A050) 用於強調
- **背景**: #F9FAFB (Gray-50) 用於頁面背景，#FFFFFF 用於內容卡片/表格
- **字體**: Inter (英文/數字)，Noto Sans TC (中文)

## 開發注意事項

1. **顯示單位邏輯**: 系統會根據選擇的單位動態選擇對應的欄位（如 `PTS_per36`），如果不存在則回退到原始值（`PTS`）
2. **客戶端渲染**: 所有數據載入和處理都在客戶端進行
3. **凍結欄位**: 表格的「排名」和「球員名稱」欄位在橫向滾動時會保持固定


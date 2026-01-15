# 文件清理腳本說明

## 問題
當使用日期命名的文件時（例如：`25-26_20260112_regular_players_rapm.csv`），如果每天生成新文件，目錄中會累積多個文件。雖然系統會自動查找最新文件，但為了保持目錄整潔，建議在上傳新文件後清理舊文件。

## 使用方法

### 方法 1: 使用清理腳本（推薦）

運行清理腳本，自動保留最新文件並刪除舊文件：

```bash
# 清理 25-26 賽季 regular 類型的文件
./scripts/cleanup-old-files.sh 25-26 regular

# 清理 25-26 賽季 playin 類型的文件
./scripts/cleanup-old-files.sh 25-26 playin

# 清理 25-26 賽季 playoff 類型的文件
./scripts/cleanup-old-files.sh 25-26 playoff
```

腳本會：
- 自動找到每個文件類型的最新版本（按日期）
- 保留最新文件
- 刪除所有舊文件

### 方法 2: 手動刪除

在上傳新文件前，手動刪除舊文件：

```bash
# 刪除舊的球員數據文件
rm public/data/25-26/regular/player/25-26_YYYYMMDD_regular_players_rapm.csv

# 刪除舊的陣容數據文件
rm public/data/25-26/regular/lineup/25-26_YYYYMMDD_regular_lineups_*.csv
```

### 方法 3: 覆蓋文件

如果使用相同的文件名上傳，舊文件會被自動覆蓋。

## 注意事項

- 清理腳本會永久刪除舊文件，請確保已備份重要數據
- 建議在上傳新文件後立即運行清理腳本
- 系統會自動查找30天內的最新文件，所以即使有舊文件存在，也會使用最新的

---
name: add-origin
description: 在咖啡豆產區圖鑑新增一個產區頁面（資料 + HTML + 名詞 + 驗收）。當使用者說「新增產區」、「加一個 ○○ 咖啡」時使用。
---

# 新增產區 SOP

開始前先讀 `CLAUDE.md`（特別是第 5、6、7、8 節）。

## 輸入
使用者提供產區名稱，例如「哥斯大黎加 塔拉珠」。資訊不足時，用常見、可查證的範圍填寫；真的無法確定的欄位，先問使用者，不要編造。

## 步驟

1. **定 slug**：`<country>-<region>`，全小寫英文、`-` 連接，例：`costa-rica-tarrazu`。確認 `origins/` 裡沒有同名檔案。
2. **寫資料**：在 `data/origins.js` 依洲別順序（非洲 → 美洲 → 亞洲，同國相鄰）插入一筆物件。
   - 欄位與格式照 `CLAUDE.md` 第 7 節；分數照第 8.3 節的 1–5 標準。
   - 陣列內容要是合法 JSON（雙引號、無尾逗號）。
3. **建頁面**：複製 `templates/origin-template.html` → `origins/<slug>.html`。
   - 替換所有 `{{...}}`；`h1` 與 `data-slug` 要和資料一致。
   - 依長度規範撰寫 `story`、`terroir`、`for-you`。
   - 術語第一次出現時連到 `../glossary.html#<id>`。
   - 刪除所有 `AI:` 註解。
4. **補名詞**：若用到辭典沒有的術語（例如「厭氧發酵」），在 `glossary.html` 對應的 `<section>` 新增 `<div class="term" id="<kebab-case>">`。若新增了處理法，同步更新 `scripts/check.py` 的 `PROCESSES` 與 `CLAUDE.md` 第 7 節。
5. **驗收**：執行 `python scripts/check.py`，直到顯示 `All checks passed`。
6. **README**：在「目前收錄」清單加一行。
7. **回報**：告訴使用者新增了哪些檔案、填了哪些「不確定、建議再查證」的欄位。

## 不要做
- 不要修改 `index.html`、`main.js`（首頁卡片與上下頁導覽會自動更新）
- 不要把海拔、分數等資料寫死在 HTML
- 不要改動其他產區的內容

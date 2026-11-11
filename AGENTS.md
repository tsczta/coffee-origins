# AGENTS.md

本專案的完整規則寫在 **[`CLAUDE.md`](CLAUDE.md)**。不論你是哪一個 AI 代理（Codex、Gemini、Copilot、Claude…），開始工作前請先完整閱讀 `CLAUDE.md`，並遵守其中的：

1. 技術限制（純靜態、不用 `fetch`、相對路徑、不引入套件）
2. 單一資料來源：結構化資料只寫在 `data/origins.js`
3. 產區頁的固定區塊順序與 `id`
4. 新增產區的標準流程（第 6 節）
5. 每次修改後執行 `python scripts/check.py`

如果 `CLAUDE.md` 與本檔案有衝突，以 `CLAUDE.md` 為準。

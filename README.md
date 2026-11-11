# 咖啡豆產區圖鑑 Coffee Origins

用一頁看懂一個咖啡產區：海拔、品種、處理法、1–5 分風味指標，以及回家怎麼沖。

**網站：** https://tsczta.github.io/coffee-origins/

這個專案的重點不只是網站本身，而是一套讓 AI 可以**照同樣規則持續擴充**的設定：

| 檔案 | 作用 |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | 專案「員工手冊」：目的、技術限制、資料夾結構、視覺風格、頁面區塊、資料格式、寫作規範、驗收清單 |
| [`AGENTS.md`](AGENTS.md) | 給 Codex / Gemini 等其他 AI 的入口，指向 `CLAUDE.md` |
| [`.claude/skills/add-origin/SKILL.md`](.claude/skills/add-origin/SKILL.md) | 「新增產區」的標準作業流程 |
| [`templates/origin-template.html`](templates/origin-template.html) | 新產區頁面的模板 |
| [`data/origins.js`](data/origins.js) | 所有產區的結構化資料（唯一來源） |
| [`scripts/check.py`](scripts/check.py) | 驗收腳本：檢查資料格式、頁面區塊、名詞連結、相對路徑 |

## 怎麼新增一個產區？

對 AI 說：

> 請先讀 CLAUDE.md，然後新增一個產區：哥斯大黎加 塔拉珠。

AI 會依照規則新增一筆資料、複製模板建立頁面、補上名詞，並跑 `python scripts/check.py` 驗收。首頁卡片和上一頁/下一頁會自動更新。

## 本機預覽

直接用瀏覽器打開 `index.html` 即可，不需要安裝任何東西。

## 目前收錄

- 非洲：衣索比亞 耶加雪菲、肯亞 涅里
- 中南美洲：哥倫比亞 薇拉、瓜地馬拉 安提瓜、巴拿馬 波奎特
- 亞洲：印尼 蘇門答臘 曼特寧

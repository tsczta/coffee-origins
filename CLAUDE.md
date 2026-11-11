# CLAUDE.md — 咖啡豆產區圖鑑（Coffee Origins）

> 這是本專案的「員工手冊」。任何 AI（Claude、Codex、Gemini…）在修改或新增內容之前，**必須先讀完這份文件**。
> `AGENTS.md` 只是指向本檔案的入口，規則以本檔為準。

---

## 1. 專案目的

一個用繁體中文介紹「世界咖啡豆產區」的靜態網站。每個產區一頁，讓剛入門的咖啡愛好者在買豆子前，能快速知道：

- 這個產區在哪裡、海拔多高、種什麼品種、用什麼處理法
- 喝起來大概是什麼味道（用統一的 1–5 分風味指標比較）
- 回家該怎麼沖

**長期目標**：之後只要跟 AI 說「新增一個產區：○○」，AI 就能依照本文件，產出風格、結構完全一致的新頁面，並自動出現在首頁。

## 2. 技術限制（不可違反）

| 規則 | 說明 |
|---|---|
| 純靜態 | 只用 HTML / CSS / 原生 JavaScript。**不要**引入 React、Vue、Tailwind、npm、建置工具。 |
| 不需伺服器 | 直接雙擊 `index.html`（`file://`）也要能正常顯示，所以**不能用 `fetch()` 讀資料**，資料以 `<script src>` 載入。 |
| 相對路徑 | 所有連結、圖片、CSS、JS 都用相對路徑（`assets/...`、`../assets/...`），才能在 GitHub Pages 子路徑下運作。 |
| 外部資源 | 只允許 Google Fonts（Noto Serif TC、Noto Sans TC）。不要加其他 CDN、追蹤碼、廣告。 |
| 單一資料來源 | 產區的「結構化資料」（海拔、品種、分數、沖煮參數…）**只寫在 `data/origins.js`**，頁面由 `assets/js/main.js` 自動渲染。HTML 頁面只放文字段落。 |

## 3. 資料夾結構

```
coffee-origins/
├── CLAUDE.md                  ← 本文件（規則）
├── AGENTS.md                  ← 給非 Claude 的 AI 的入口，指向本文件
├── README.md                  ← 給人看的專案說明
├── index.html                 ← 首頁：產區卡片牆 + 洲別篩選
├── glossary.html              ← 咖啡名詞小辭典（處理法、烘焙度…）
├── origins/                   ← 每個產區一個 HTML
│   └── <slug>.html
├── data/
│   └── origins.js             ← 全部產區的結構化資料（唯一來源）
├── assets/
│   ├── css/style.css          ← 唯一的樣式表（含設計 token）
│   └── js/main.js             ← 渲染首頁卡片、產區速覽、上一頁/下一頁
├── templates/
│   └── origin-template.html   ← 新增產區時複製這個檔案
├── scripts/
│   └── check.py               ← 驗收腳本，每次修改後都要跑
└── .claude/skills/add-origin/SKILL.md  ← 「新增產區」的標準作業流程
```

不要在根目錄新增其他資料夾；如果真的需要（例如 `assets/img/`），先在本文件的這一節補上說明。

## 4. 視覺風格

**關鍵字：** 溫暖、像咖啡館的菜單、留白多、閱讀舒服。不要花俏動畫、不要漸層霓虹、不要 emoji 當裝飾。

### 4.1 顏色（一律使用 `style.css` 的 CSS 變數，不要寫死色碼）

| 變數 | 用途 |
|---|---|
| `--bg` / `--surface` | 頁面底色（奶油色）/ 卡片底色 |
| `--ink` / `--muted` | 主要文字（深咖啡）/ 次要文字 |
| `--line` | 分隔線、卡片框線 |
| `--accent` | 連結、強調色（焙茶色） |
| `--africa` / `--americas` / `--asia` | 洲別標籤顏色，**每個洲固定一個顏色** |

深色模式已在 `style.css` 用 `prefers-color-scheme` 處理，新增元件時只要使用變數就會自動支援。

### 4.2 字體

- 標題（h1–h3）：`Noto Serif TC`（襯線，像菜單）
- 內文：`Noto Sans TC`
- 英文產區名、數字：跟隨內文字體，英文名用 `.en` class 顯示成小字灰色

### 4.3 可用元件（都已定義在 `style.css`，請重用，不要另寫一套）

| class | 用途 |
|---|---|
| `.card` | 首頁產區卡片 |
| `.tag` + `.tag--africa` 等 | 洲別標籤 |
| `.chip` | 風味關鍵字、篩選按鈕 |
| `.meter` | 1–5 分風味指標條 |
| `.facts` | 速覽表格 |
| `.callout` | 小提醒框 |
| `.prose` | 文字段落容器（控制行寬與行距） |

## 5. 頁面類型

### 5.1 首頁 `index.html`
- `<body data-page="home">`
- 卡片由 `main.js` 依 `data/origins.js` 的**陣列順序**產生，順序規則：先依洲別（非洲 → 美洲 → 亞洲），同洲內依國家名稱筆畫/拼音皆可，但要保持同國相鄰。
- 新增產區**不需要**手動改 `index.html`。

### 5.2 產區頁 `origins/<slug>.html`
- `<body data-page="origin" data-slug="<slug>">`
- 必須依照以下**固定順序**包含這些區塊（`id` 不可改名）：

| 順序 | id | 標題 | 內容來源 |
|---|---|---|---|
| 1 | `hero` | （h1 產區名） | HTML：h1 需與 `data` 中的 `name` 相同，`.en` 放 `nameEn`；洲別標籤 `data-render="tag"` 與導言 `data-render="summary"` 自動渲染 |
| 2 | `at-a-glance` | 產區速覽 | **自動渲染**（留空 `<div data-render="glance">`） |
| 3 | `story` | 產區故事 | HTML：2–3 段 |
| 4 | `terroir` | 風土與處理法 | HTML：2 段，提到的術語要連到 `glossary.html` |
| 5 | `brew` | 推薦沖煮 | **自動渲染**（留空 `<div data-render="brew">`） |
| 6 | `for-you` | 適合誰喝 | HTML：1 段 + 1 個 `<ul>`（2–3 點） |
| 7 | `origin-nav` | （上一個 / 下一個產區） | **自動渲染** |

### 5.3 名詞頁 `glossary.html`
- 每個名詞是 `<div class="term" id="<英文 kebab-case>">`，例如 `id="washed"`。
- 產區頁中第一次出現的術語用 `<a href="../glossary.html#washed">水洗</a>` 連結。
- 如果新產區用到的術語在辭典裡沒有，**先在 `glossary.html` 新增該名詞**，依中文分類放進對應的 `<section>`。

## 6. 新增一個產區（標準流程）

> 這是本專案最常做的事。詳細步驟也寫在 `.claude/skills/add-origin/SKILL.md`。

1. **決定 slug**：`<國家英文>-<產區英文>`，全小寫、用 `-` 連接，例如 `ethiopia-guji`、`costa-rica-tarrazu`。國家名有空格也轉成 `-`。
2. **加資料**：在 `data/origins.js` 的陣列中、依第 5.1 節的順序插入一筆物件，欄位見第 7 節。
3. **建頁面**：複製 `templates/origin-template.html` → `origins/<slug>.html`，把所有 `{{...}}` 佔位文字換掉，並刪除模板裡的 `<!-- AI: ... -->` 註解。
4. **補名詞**：檢查頁面用到的術語是否都在 `glossary.html`，沒有就新增。
5. **跑驗收**：`python scripts/check.py`，必須顯示 `All checks passed`。
6. **更新 README**：在 README 的「目前收錄」清單加一行。

**不用做的事**：不用改 `index.html`、不用改 `main.js`、不用改其他產區頁的上一頁/下一頁（會自動算）。

## 7. `data/origins.js` 資料格式

檔案格式是 `window.ORIGINS = [ ... ];`，**陣列內容必須是合法 JSON**（雙引號、沒有尾逗號、沒有註解），因為 `check.py` 會用 JSON 解析它。

```json
{
  "slug": "ethiopia-yirgacheffe",
  "name": "耶加雪菲",
  "nameEn": "Yirgacheffe",
  "country": "衣索比亞",
  "continent": "africa",
  "altitude": "1,750–2,200 公尺",
  "varieties": "衣索比亞原生種（Heirloom）",
  "process": ["水洗", "日曬"],
  "harvest": "10 月 – 隔年 1 月",
  "flavors": ["茉莉花", "佛手柑", "檸檬", "水蜜桃"],
  "scores": { "acidity": 4, "sweetness": 4, "body": 2, "bitterness": 1 },
  "roast": "淺焙",
  "summary": "一句話介紹，30–50 字，會出現在首頁卡片與產區頁開頭。",
  "brew": {
    "method": "手沖（V60）",
    "grind": "中細研磨",
    "ratio": "1:15",
    "temp": "92–94°C",
    "tip": "一句沖煮小提醒。"
  }
}
```

| 欄位 | 規則 |
|---|---|
| `continent` | 只能是 `africa`、`americas`、`asia`（之後若加大洋洲，要同步改 `style.css`、`main.js`、`check.py` 與本文件） |
| `process` | 陣列，用辭典中已有的中文名稱：水洗、日曬、蜜處理、濕剝 |
| `flavors` | 3–4 個風味詞，名詞為主（「茉莉花」而不是「有茉莉花香」） |
| `scores` | 四項皆為 **1–5 的整數**，標準見第 8.3 節 |
| `roast` | 淺焙 / 淺中焙 / 中焙 / 中深焙 / 深焙 擇一 |
| 數字範圍 | 用全形破折號 `–`，海拔加千分位逗號：`1,500–2,000 公尺` |

## 8. 內容寫作規範

### 8.1 語言與語氣
- 繁體中文、台灣用語（「品種」不是「品種類型」，「沖煮」不是「冲泡」，「公尺」不是「米」）。
- 像一位友善的咖啡店店員在介紹：口語但不輕浮，不用網路流行語。
- 專有名詞第一次出現時附英文，例如「藝妓（Geisha）」。

### 8.2 正確性
- 只寫**可以查證**的資訊。數字一律給範圍並寫「約」或區間，不要編造精確到個位數的數字。
- 不確定的事寫成「常見」、「多數」，不要斷言。
- 不寫特定店家、品牌的廣告，也不寫價格（會過時）。

### 8.3 風味分數標準（1–5）

| 分數 | 酸度 acidity | 甜感 sweetness | 醇厚度 body | 苦韻 bitterness |
|---|---|---|---|---|
| 1 | 幾乎感覺不到 | 偏淡 | 像茶一樣輕 | 幾乎沒有 |
| 3 | 明顯但溫和 | 有焦糖般甜感 | 像牛奶般圓潤 | 像黑巧克力 |
| 5 | 明亮尖銳如柑橘 | 像蜂蜜、果醬 | 濃稠像糖漿 | 強烈、煙燻 |

分數描述的是該產區「典型、常見烘焙度下」的表現，不是單一批豆子。

### 8.4 長度
- `story`：150–250 字；`terroir`：120–200 字；`for-you`：一段 50 字內 + 2–3 個條列。

## 9. AI 修改時的規則

**可以做：**
- 新增產區、新增名詞、修正錯字與事實錯誤。
- 在 `style.css` 新增元件，但要用既有變數，並在第 4.3 節補上說明。

**不要做：**
- 不要改區塊 `id`、不要改 `data` 欄位名稱（會讓 `main.js` 和 `check.py` 壞掉）。
- 不要把結構化資料寫死在 HTML 裡（違反單一資料來源）。
- 不要刪除既有產區，除非使用者明確要求。
- 不要一次重寫整個網站的風格；風格調整要先跟使用者確認。
- 不要引入任何套件或建置步驟。

**改了規則就更新文件：** 如果你修改了結構、欄位或元件，必須同步更新本文件對應的章節，並在第 12 節的變更紀錄加一行。

## 10. 驗收清單（每次修改後）

- [ ] `python scripts/check.py` 顯示 `All checks passed`
- [ ] 用瀏覽器打開 `index.html`，新卡片有出現、篩選按鈕能用
- [ ] 打開新產區頁，速覽表、風味條、沖煮表都有渲染，上一頁/下一頁正確
- [ ] 手機寬度（約 375px）下沒有水平捲軸
- [ ] 深色模式下文字看得清楚

## 11. 部署

- GitHub Pages：Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main`、資料夾 `/ (root)`。
- 推上 `main` 後約 1 分鐘網站會自動更新，不需要任何建置。

## 12. 變更紀錄

| 日期 | 變更 |
|---|---|
| 2026-11-11 | 建立專案：首頁、名詞頁、6 個產區、驗收腳本、add-origin skill |

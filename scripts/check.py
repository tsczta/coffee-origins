"""驗收腳本：檢查資料與頁面是否符合 CLAUDE.md 的規則。

用法：python scripts/check.py
只使用 Python 標準函式庫。
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTINENTS = {"africa", "americas", "asia"}
CONTINENT_ORDER = ["africa", "americas", "asia"]
PROCESSES = {"水洗", "日曬", "蜜處理", "濕剝"}
ROASTS = {"淺焙", "淺中焙", "中焙", "中深焙", "深焙"}
SCORES = ["acidity", "sweetness", "body", "bitterness"]
BREW = ["method", "grind", "ratio", "temp", "tip"]
REQUIRED = ["slug", "name", "nameEn", "country", "continent", "altitude", "varieties",
            "process", "harvest", "flavors", "scores", "roast", "summary", "brew"]
SECTIONS = ["hero", "at-a-glance", "story", "terroir", "brew", "for-you", "origin-nav"]
RENDER_SLOTS = ["tag", "summary", "glance", "brew", "origin-nav"]

errors = []


def err(where, msg):
    errors.append(f"[{where}] {msg}")


def load_origins():
    text = (ROOT / "data/origins.js").read_text(encoding="utf-8")
    m = re.search(r"window\.ORIGINS\s*=\s*(\[.*\])\s*;", text, re.S)
    if not m:
        err("data/origins.js", "找不到 window.ORIGINS = [...];")
        return []
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        err("data/origins.js", f"陣列不是合法 JSON：{e}")
        return []


def check_data(origins):
    seen = set()
    last_rank = -1
    for i, o in enumerate(origins):
        where = f"data #{i} {o.get('slug', '?')}"
        for k in REQUIRED:
            if k not in o:
                err(where, f"缺少欄位 {k}")
        slug = o.get("slug", "")
        if not re.fullmatch(r"[a-z]+(-[a-z]+)+", slug):
            err(where, "slug 需為 <國家>-<產區>，全小寫、以 - 連接")
        if slug in seen:
            err(where, "slug 重複")
        seen.add(slug)
        c = o.get("continent")
        if c not in CONTINENTS:
            err(where, f"continent 必須是 {sorted(CONTINENTS)}")
        else:
            rank = CONTINENT_ORDER.index(c)
            if rank < last_rank:
                err(where, "陣列順序需依洲別：非洲 → 美洲 → 亞洲")
            last_rank = rank
        for p in o.get("process", []):
            if p not in PROCESSES:
                err(where, f"處理法「{p}」不在允許清單 {sorted(PROCESSES)}")
        if o.get("roast") not in ROASTS:
            err(where, f"roast 必須是 {sorted(ROASTS)}")
        if not 3 <= len(o.get("flavors", [])) <= 4:
            err(where, "flavors 需 3–4 個")
        for s in SCORES:
            v = o.get("scores", {}).get(s)
            if not (isinstance(v, int) and 1 <= v <= 5):
                err(where, f"scores.{s} 必須是 1–5 的整數")
        for b in BREW:
            if not o.get("brew", {}).get(b):
                err(where, f"brew.{b} 不可為空")
        if "-" in o.get("altitude", "") or "~" in o.get("altitude", ""):
            err(where, "altitude 範圍請用全形破折號「–」")
        n = len(o.get("summary", ""))
        if not 25 <= n <= 60:
            err(where, f"summary 建議 30–50 字（目前 {n} 字）")


def glossary_ids():
    html = (ROOT / "glossary.html").read_text(encoding="utf-8")
    return set(re.findall(r'<div class="term" id="([^"]+)"', html))


def check_pages(origins):
    terms = glossary_ids()
    by_slug = {o["slug"]: o for o in origins if "slug" in o}
    files = {p.stem: p for p in (ROOT / "origins").glob("*.html")}

    for slug in by_slug.keys() - files.keys():
        err(f"origins/{slug}.html", "data 裡有這個產區，但頁面不存在")
    for slug in files.keys() - by_slug.keys():
        err(f"origins/{slug}.html", "頁面存在，但 data/origins.js 沒有對應資料")

    for slug, path in files.items():
        where = f"origins/{slug}.html"
        html = path.read_text(encoding="utf-8")
        o = by_slug.get(slug)
        if "{{" in html or "AI:" in html:
            err(where, "還有沒替換的 {{佔位文字}} 或 AI 註解")
        m = re.search(r'<body[^>]*data-slug="([^"]+)"', html)
        if not m or m.group(1) != slug:
            err(where, "body 的 data-slug 必須等於檔名")
        ids = re.findall(r'<section id="([^"]+)"', html)
        if ids != SECTIONS:
            err(where, f"區塊 id/順序不符，應為 {SECTIONS}，目前 {ids}")
        for slot in RENDER_SLOTS:
            if f'data-render="{slot}"' not in html:
                err(where, f'缺少 data-render="{slot}"')
        if o:
            h1 = re.search(r"<h1>(.*?)<span class=\"en\">(.*?)</span></h1>", html)
            if not h1 or h1.group(1) != o["name"] or h1.group(2) != o["nameEn"]:
                err(where, "h1 必須是 name + <span class=\"en\">nameEn</span>，且與 data 一致")
        for anchor in re.findall(r'glossary\.html#([\w-]+)', html):
            if anchor not in terms:
                err(where, f"連到不存在的名詞 glossary.html#{anchor}")
        for ref in re.findall(r'(?:href|src)="(\.\./[^"#]+)', html):
            if not (path.parent / ref).resolve().exists():
                err(where, f"相對路徑不存在：{ref}")
        if re.search(r'(?:href|src)="/(?!/)', html):
            err(where, "不可使用 / 開頭的絕對路徑（GitHub Pages 子路徑會壞）")

    for name in ["index.html", "glossary.html"]:
        html = (ROOT / name).read_text(encoding="utf-8")
        for anchor in re.findall(r'glossary\.html#([\w-]+)', html):
            if anchor not in terms:
                err(name, f"連到不存在的名詞 glossary.html#{anchor}")


def main():
    origins = load_origins()
    check_data(origins)
    check_pages(origins)
    if errors:
        print(f"Found {len(errors)} problem(s):")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    print(f"All checks passed ({len(origins)} origins).")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()

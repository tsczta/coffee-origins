// 產區結構化資料（唯一來源）。陣列內容必須是合法 JSON，規則見 CLAUDE.md 第 7 節。
window.ORIGINS = [
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
    "summary": "咖啡故鄉最有名的小鎮，水洗豆像一杯帶柑橘香的花茶，是很多人喝懂精品咖啡的第一支豆子。",
    "brew": {
      "method": "手沖（V60）",
      "grind": "中細研磨",
      "ratio": "1:15",
      "temp": "92–94°C",
      "tip": "花香很容易被高溫蓋掉，水溫寧可低一點，放涼一些再喝會更甜。"
    }
  },
  {
    "slug": "kenya-nyeri",
    "name": "涅里",
    "nameEn": "Nyeri",
    "country": "肯亞",
    "continent": "africa",
    "altitude": "1,600–2,000 公尺",
    "varieties": "SL28、SL34、Ruiru 11、Batian",
    "process": ["水洗"],
    "harvest": "主收 10–12 月，副收約 4–6 月",
    "flavors": ["黑醋栗", "葡萄柚", "番茄", "紅糖"],
    "scores": { "acidity": 5, "sweetness": 3, "body": 3, "bitterness": 2 },
    "roast": "淺中焙",
    "summary": "肯亞山腳下的產區，酸質明亮又多汁，常帶有黑醋栗與番茄般的鹹甜感，辨識度極高。",
    "brew": {
      "method": "手沖（Kalita Wave）",
      "grind": "中研磨",
      "ratio": "1:15",
      "temp": "91–93°C",
      "tip": "酸感太尖時，研磨調粗一點或縮短萃取時間，果汁感會更圓潤。"
    }
  },
  {
    "slug": "colombia-huila",
    "name": "薇拉",
    "nameEn": "Huila",
    "country": "哥倫比亞",
    "continent": "americas",
    "altitude": "1,500–2,000 公尺",
    "varieties": "Caturra、Castillo、Colombia、粉紅波旁",
    "process": ["水洗"],
    "harvest": "一年兩收（主收與副收 Mitaca）",
    "flavors": ["焦糖", "紅蘋果", "柑橘", "牛奶巧克力"],
    "scores": { "acidity": 3, "sweetness": 4, "body": 3, "bitterness": 2 },
    "roast": "中焙",
    "summary": "安地斯山脈間的高地產區，甜感飽滿、酸甜平衡，是最不容易出錯的日常好豆。",
    "brew": {
      "method": "手沖或法式濾壓壺",
      "grind": "中研磨",
      "ratio": "1:15",
      "temp": "90–92°C",
      "tip": "很適合拿來練習手沖，換器材也不容易失手，加奶做拿鐵一樣好喝。"
    }
  },
  {
    "slug": "guatemala-antigua",
    "name": "安提瓜",
    "nameEn": "Antigua",
    "country": "瓜地馬拉",
    "continent": "americas",
    "altitude": "1,500–1,700 公尺",
    "varieties": "Bourbon、Caturra、Catuaí",
    "process": ["水洗"],
    "harvest": "12 月 – 隔年 3 月",
    "flavors": ["黑巧克力", "烤堅果", "香料", "可可"],
    "scores": { "acidity": 3, "sweetness": 3, "body": 4, "bitterness": 3 },
    "roast": "中深焙",
    "summary": "被三座火山環繞的古都谷地，火山土孕育出厚實的可可與香料調性，口感扎實又乾淨。",
    "brew": {
      "method": "愛樂壓或摩卡壺",
      "grind": "中細研磨",
      "ratio": "1:13",
      "temp": "88–90°C",
      "tip": "烘焙度較深時水溫降低一點，可以減少苦澀、留下巧克力的甜。"
    }
  },
  {
    "slug": "panama-boquete",
    "name": "波奎特",
    "nameEn": "Boquete",
    "country": "巴拿馬",
    "continent": "americas",
    "altitude": "1,400–2,000 公尺",
    "varieties": "藝妓（Geisha）、Caturra、Catuaí",
    "process": ["水洗", "日曬"],
    "harvest": "12 月 – 隔年 3 月",
    "flavors": ["茉莉花", "佛手柑", "熱帶水果", "蜂蜜"],
    "scores": { "acidity": 4, "sweetness": 5, "body": 2, "bitterness": 1 },
    "roast": "淺焙",
    "summary": "巴魯火山旁的雲霧山谷，因藝妓咖啡一戰成名，喝起來像加了蜂蜜的茉莉花茶。",
    "brew": {
      "method": "手沖（V60）",
      "grind": "中細研磨",
      "ratio": "1:16",
      "temp": "92–94°C",
      "tip": "用比例稍淡的 1:16 沖，層次會更清楚；建議單喝，不加糖奶。"
    }
  },
  {
    "slug": "indonesia-sumatra-mandheling",
    "name": "曼特寧",
    "nameEn": "Mandheling",
    "country": "印尼（蘇門答臘）",
    "continent": "asia",
    "altitude": "1,100–1,600 公尺",
    "varieties": "Ateng、Tim Tim、Typica 系品種",
    "process": ["濕剝"],
    "harvest": "依產地而異，常見全年分批採收",
    "flavors": ["草本", "雪松", "黑巧克力", "泥土"],
    "scores": { "acidity": 1, "sweetness": 3, "body": 5, "bitterness": 4 },
    "roast": "深焙",
    "summary": "台灣咖啡館的老朋友，濕剝法帶來低酸、厚重、帶草本與木質的獨特風味。",
    "brew": {
      "method": "法式濾壓壺或冰滴",
      "grind": "粗研磨",
      "ratio": "1:14",
      "temp": "88–90°C",
      "tip": "厚實的口感很適合做冰咖啡或加牛奶，苦韻會轉成像黑糖的甜。"
    }
  }
];

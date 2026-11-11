// 渲染首頁卡片、產區速覽、沖煮表、上一頁/下一頁。資料來源：data/origins.js（window.ORIGINS）。
// 新增產區不需要修改本檔案，規則見 CLAUDE.md。
(function () {
  "use strict";

  var ORIGINS = window.ORIGINS || [];

  var CONTINENTS = {
    africa: "非洲",
    americas: "中南美洲",
    asia: "亞洲"
  };

  var SCORE_LABELS = [
    ["acidity", "酸度"],
    ["sweetness", "甜感"],
    ["body", "醇厚度"],
    ["bitterness", "苦韻"]
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function tag(continent) {
    return '<span class="tag tag--' + esc(continent) + '">' + esc(CONTINENTS[continent] || continent) + "</span>";
  }

  function chips(list) {
    return '<div class="chips">' + list.map(function (f) {
      return '<span class="chip">' + esc(f) + "</span>";
    }).join("") + "</div>";
  }

  function meters(scores) {
    return '<div class="meters">' + SCORE_LABELS.map(function (pair) {
      var v = scores[pair[0]];
      return '<div class="meter" role="img" aria-label="' + pair[1] + " " + v + ' / 5">' +
        "<span>" + pair[1] + '</span><span class="bar"><span style="--v:' + Number(v) + '"></span></span><b>' + v + "</b></div>";
    }).join("") + "</div>";
  }

  function factsTable(rows) {
    return '<table class="facts"><tbody>' + rows.map(function (r) {
      return "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  // ---------- 首頁 ----------
  function renderHome() {
    var grid = document.getElementById("origin-grid");
    var filters = document.getElementById("filters");
    if (!grid) return;

    var used = Object.keys(CONTINENTS).filter(function (k) {
      return ORIGINS.some(function (o) { return o.continent === k; });
    });

    var current = "all";
    try { current = localStorage.getItem("continent") || "all"; } catch (e) {}
    if (current !== "all" && used.indexOf(current) === -1) current = "all";

    function drawFilters() {
      var opts = [["all", "全部（" + ORIGINS.length + "）"]].concat(used.map(function (k) {
        var n = ORIGINS.filter(function (o) { return o.continent === k; }).length;
        return [k, CONTINENTS[k] + "（" + n + "）"];
      }));
      filters.innerHTML = opts.map(function (o) {
        return '<button type="button" class="chip" data-value="' + o[0] + '" aria-pressed="' + (o[0] === current) + '">' + esc(o[1]) + "</button>";
      }).join("");
    }

    function drawGrid() {
      var list = ORIGINS.filter(function (o) { return current === "all" || o.continent === current; });
      if (!list.length) { grid.innerHTML = '<p class="empty">這個洲別還沒有產區。</p>'; return; }
      grid.innerHTML = list.map(function (o) {
        return '<a class="card" href="origins/' + esc(o.slug) + '.html">' +
          "<div>" + tag(o.continent) + "</div>" +
          "<h3>" + esc(o.name) + '<span class="en">' + esc(o.nameEn) + "</span></h3>" +
          '<div class="meta">' + esc(o.country) + "・" + esc(o.altitude) + "・" + esc(o.process.join(" / ")) + "</div>" +
          "<p>" + esc(o.summary) + "</p>" +
          chips(o.flavors) +
          meters(o.scores) +
          "</a>";
      }).join("");
    }

    if (filters) {
      drawFilters();
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-value]");
        if (!btn) return;
        current = btn.getAttribute("data-value");
        try { localStorage.setItem("continent", current); } catch (err) {}
        drawFilters();
        drawGrid();
      });
    }
    drawGrid();
  }

  // ---------- 產區頁 ----------
  function renderOrigin(slug) {
    var idx = ORIGINS.findIndex(function (o) { return o.slug === slug; });
    if (idx === -1) {
      console.warn("[coffee-origins] data/origins.js 找不到 slug：" + slug);
      return;
    }
    var o = ORIGINS[idx];

    var heroTag = document.querySelector("[data-render='tag']");
    if (heroTag) heroTag.innerHTML = tag(o.continent);
    var lede = document.querySelector("[data-render='summary']");
    if (lede) lede.textContent = o.summary;

    var glance = document.querySelector("[data-render='glance']");
    if (glance) {
      glance.innerHTML =
        '<div class="glance">' +
          '<div class="panel"><h3>基本資料</h3>' + factsTable([
            ["國家", o.country],
            ["海拔", o.altitude],
            ["主要品種", o.varieties],
            ["處理法", o.process.join("、")],
            ["採收季", o.harvest],
            ["建議烘焙", o.roast]
          ]) + "</div>" +
          '<div class="panel"><h3>風味輪廓（1–5）</h3>' + meters(o.scores) + chips(o.flavors) + "</div>" +
        "</div>";
    }

    var brew = document.querySelector("[data-render='brew']");
    if (brew) {
      brew.innerHTML = '<div class="panel" style="max-width:40em">' + factsTable([
        ["器材", o.brew.method],
        ["研磨", o.brew.grind],
        ["粉水比", o.brew.ratio],
        ["水溫", o.brew.temp]
      ]) + '<div class="callout">' + esc(o.brew.tip) + "</div></div>";
    }

    var nav = document.querySelector("[data-render='origin-nav']");
    if (nav) {
      var prev = ORIGINS[idx - 1], next = ORIGINS[idx + 1], html = "";
      if (prev) html += '<a class="prev" href="' + esc(prev.slug) + '.html"><small>← 上一個產區</small><strong>' + esc(prev.name) + "</strong></a>";
      if (next) html += '<a class="next" href="' + esc(next.slug) + '.html"><small>下一個產區 →</small><strong>' + esc(next.name) + "</strong></a>";
      nav.innerHTML = html;
    }
  }

  var body = document.body;
  var page = body.getAttribute("data-page");
  if (page === "home") renderHome();
  if (page === "origin") renderOrigin(body.getAttribute("data-slug"));
})();

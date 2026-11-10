/* AISec123 交互：筛选 / 搜索 / 排序 / 视图 / 双语 / 暗色 / URL 状态同步。
   数据来自 data/entries.js（window.AISEC123），这里只负责渲染。
   没有构建步骤、没有依赖，改完 push 就上线。 */
(function () {
  'use strict';

  var D = window.AISEC123;
  if (!D) return;

  var root = document.documentElement;
  var body = document.body;
  var KEY = 'aisec123';
  var LS = {
    get: function (k, fb) { try { return localStorage.getItem(KEY + '-' + k) || fb; } catch (e) { return fb; } },
    set: function (k, v) { try { localStorage.setItem(KEY + '-' + k, v); } catch (e) {} }
  };

  var state = { sec: 'all', q: '', tag: '', sort: 'default', view: 'grid', aiMatches: null, aiQuery: '' };
  /* AI 搜索 Worker 域名（index.html 里 window.AISEC123_WORKER 配置）。
     留空 = 不调 LLM，搜索框退化为纯本地关键词过滤。 */
  var WORKER_BASE = (window.AISEC123_WORKER || '').replace(/\/+$/, '');
  var lang = LS.get('lang', 'zh');
  var theme = LS.get('theme', window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  /* 中文标题的真源是 index.html 的 <title>（别名关键词全在那儿），这里只在加载时
     缓存、切语言时还原，绝不另写一份 —— 之前 applyLang 把 title 硬改成「AI 安全导航」，
     Googlebot / Bingbot 渲染 JS 后拿到的就是那个，head 里布的关键词全被丢掉。 */
  var TITLE_ZH = document.title;
  var TITLE_EN = 'AISecpedia · The AI Security Encyclopedia｜Companies · Open Source · Papers · Benchmarks';
  /* 页头副标按字符均布撑满字标宽度，中英两版左右边缘对齐（见 .brand-tag）。
     英文用短版，保证自然宽度不超过字标，space-between 只加间距不压缩。 */
  var BRAND_TAG = { zh: 'AI 安全百科', en: 'Security Encyclopedia' };

  /* ── 工具函数 ─────────────────────────────────────────── */
  function $(s) { return document.querySelector(s); }

  /* 渲染逻辑全在 assets/render.js，和 scripts/gen-static.js 共用一份，
     这样预渲染进 index.html 的静态卡片和这里画出来的必然一致。
     getState 是惰性的：语言、搜索词、排序变了不用重建 renderer。 */
  var R = window.AISEC123Render.create(D, function () {
    return { lang: lang, q: state.q, sec: state.sec, tag: state.tag, sort: state.sort };
  });

  var SECS = R.SECS, byKey = R.byKey, ALL = R.ALL;
  var esc = R.esc, t = R.t, tagLabel = R.tagLabel;
  var matches = R.matches, blocksHtml = R.blocksHtml;

  /* 图标挂在 <span class="logo-mount"> 上，img 由这里逐个候选往下试。
     不用内联 onerror，是为了不往 HTML 里塞 JS，也方便 CSP。 */
  function mountLogos(scope) {
    (scope || document).querySelectorAll('.logo-mount:not([data-mounted])').forEach(function (el) {
      el.setAttribute('data-mounted', '1');
      var list;
      try { list = JSON.parse(el.getAttribute('data-try')); } catch (e) { return; }
      var img = el.querySelector('img');
      if (!list || !list.length || !img) { el.classList.add('no-logo'); return; }
      var i = 0;
      img.onerror = function () {
        i += 1;
        if (i < list.length) { img.src = list[i]; return; }
        img.onerror = null;
        el.classList.add('no-logo');
      };
      img.src = list[0];
    });
  }

  /* ── 状态 ↔ URL ───────────────────────────────────────── */
  function readUrl() {
    var p = new URLSearchParams(location.search);
    ['sec', 'q', 'tag', 'sort', 'view'].forEach(function (k) {
      var v = p.get(k);
      if (v) state[k] = v;
    });
    if (state.sec !== 'all' && !byKey[state.sec]) state.sec = 'all';
    if (['default', 'star', 'new', 'az'].indexOf(state.sort) < 0) state.sort = 'default';
    if (state.view !== 'list') state.view = 'grid';
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.sec !== 'all') p.set('sec', state.sec);
    if (state.q) p.set('q', state.q);
    if (state.tag) p.set('tag', state.tag);
    if (state.sort !== 'default') p.set('sort', state.sort);
    if (state.view !== 'grid') p.set('view', state.view);
    var qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  /* ── 渲染 ─────────────────────────────────────────────── */
  function applyLang() {
    root.lang = lang === 'en' ? 'en' : 'zh-CN';
    root.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      el.textContent = lang === 'en' ? (el.getAttribute('data-en') || el.getAttribute('data-zh')) : el.getAttribute('data-zh');
    });
    document.querySelectorAll('[data-ph-zh]').forEach(function (el) {
      el.placeholder = lang === 'en' ? (el.getAttribute('data-ph-en') || el.getAttribute('data-ph-zh')) : el.getAttribute('data-ph-zh');
    });
    document.title = lang === 'en' ? TITLE_EN : TITLE_ZH;
    var lb = $('#lang-toggle');
    if (lb) lb.textContent = lang === 'en' ? '中' : 'EN';
    renderBrandTag();
  }

  /* 副标拆成单字 span，靠 .brand-tag 的 space-between 均布撑满字标宽度。 */
  function renderBrandTag() {
    var el = $('.brand-tag');
    if (!el) return;
    var txt = BRAND_TAG[lang] || BRAND_TAG.zh;
    el.innerHTML = Array.from(txt).map(function (ch) { return '<span>' + esc(ch) + '</span>'; }).join('');
  }

  function applyTheme() {
    root.setAttribute('data-theme', theme);
    var b = $('#theme-toggle');
    if (!b) return;
    b.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"></circle><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.5"></line><line x1="12" y1="19.5" x2="12" y2="22"></line><line x1="2" y1="12" x2="4.5" y2="12"></line><line x1="19.5" y1="12" x2="22" y2="12"></line><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"></line><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"></line><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"></line><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"></line></g></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>';
  }

  function renderTimes() {
    $('#footer-updated').textContent = t('最后更新 ', 'Last updated ') + (D.updated || '');
    $('#side-updated').textContent = t('更新于 ', 'Updated ') + (D.updated || '');
  }

  function renderCats() {
    var counts = {};
    ALL.forEach(function (e) { counts[e.section] = (counts[e.section] || 0) + 1; });
    function item(key, label, n, color) {
      return '<li><button type="button" class="side-item" data-sec="' + esc(key) + '" ' +
        'style="--cat:' + esc(color || 'var(--accent)') + '" aria-selected="' + (state.sec === key) + '">' +
        '<span class="side-dot"></span><span class="side-name">' + esc(label) + '</span>' +
        '<span class="cnt">' + n + '</span></button></li>';
    }
    $('#cats').innerHTML = item('all', t('全部分类', 'All categories'), ALL.length, '') +
      SECS.map(function (s) {
        return item(s.key, lang === 'en' ? s.en : s.zh, counts[s.key] || 0, s.color);
      }).join('');
  }

  function renderList() {
    /* AI 搜索激活时，列表只展示模型挑中的条目（按模型排序），不再做关键词匹配 ——
       自然语言查询往往命中不了关键词，避免下方列表空掉。关闭面板后回到本地过滤。 */
    var hit;
    if (state.aiMatches) {
      var order = state.aiMatches;
      hit = ALL.filter(function (e) {
        if (order.indexOf(e.name) < 0) return false;
        if (state.sec !== 'all' && e.section !== state.sec) return false;
        if (state.tag && (e.tags || []).indexOf(state.tag) < 0) return false;
        return true;
      }).sort(function (a, b) { return order.indexOf(a.name) - order.indexOf(b.name); });
    } else {
      hit = ALL.filter(matches);
    }
    var cur = byKey[state.sec];
    var crumb = ['<b>' + esc(cur ? (lang === 'en' ? cur.en : cur.zh) : t('全部收录', 'Everything')) + '</b>',
                 '<span class="crumb-sep">·</span>',
                 esc(hit.length) + ' ' + esc(t('个条目', 'entries'))];
    if (state.tag) {
      crumb.push('<span class="crumb-sep">·</span>',
        '<button type="button" class="crumb-clear" data-clear="1">#' + esc(tagLabel(state.tag)) + ' ×</button>');
    }
    if (state.aiMatches) {
      crumb.push('<span class="crumb-sep">·</span>', esc(t('AI 搜索', 'AI search')) + ' "' + esc(state.aiQuery) + '"');
    } else if (state.q.trim()) {
      crumb.push('<span class="crumb-sep">·</span>', esc(t('关键词', 'for')) + ' "' + esc(state.q.trim()) + '"');
    }
    $('#crumb').innerHTML = crumb.join(' ');

    var out = blocksHtml(hit);
    $('#list').innerHTML = out.html;
    $('#empty').hidden = out.shown > 0;
    body.classList.toggle('is-list', state.view === 'list');
    mountLogos($('#list'));
  }

  /* hero 上的分类 tab：和侧栏分类同源同步，选中态跟着 state.sec。 */
  function renderHeroTabs() {
    var el = $('#hero-tabs');
    if (!el) return;
    var counts = {};
    ALL.forEach(function (e) { counts[e.section] = (counts[e.section] || 0) + 1; });
    function tab(key, label, n) {
      return '<button type="button" class="hero-tab" role="tab" data-sec="' + esc(key) +
        '" aria-selected="' + (state.sec === key) + '">' + esc(label) +
        '<span class="cnt">' + n + '</span></button>';
    }
    el.innerHTML = tab('all', t('全部', 'All'), ALL.length) +
      SECS.map(function (s) { return tab(s.key, lang === 'en' ? s.en : s.zh, counts[s.key] || 0); }).join('');
  }

  /* 首页那条品牌 logo 墙：从已收录条目里按域名去重，
     优先有 logo 的，再补精选，凑够一面就停。 */
  function renderAds() {
    var el = $('#ads');
    if (!el) return;
    var list = D.sponsors || [];
    el.innerHTML = list.map(function (a) {
      var txt = lang === 'en' ? (a.en || a.zh) : (a.zh || a.en);
      return '<a class="ad" href="' + esc(a.url) + '" target="_blank" rel="noopener noreferrer sponsored">' +
        '<span class="ad-tag">' + esc((lang === 'en' ? (a.tag_en || a.tag) : a.tag) || t('广告', 'AD')) + '</span>' +
        '<span class="ad-body">' +
          (a.logo ? '<img class="ad-logo" src="' + esc(a.logo) + '" alt="" loading="lazy" decoding="async">' : '') +
          '<span class="ad-text"><b>' + esc(a.name) + '</b><span>' + esc(txt) + '</span></span>' +
        '</span>' +
      '</a>';
    }).join('') +
      '<a class="ad ad-empty" href="https://github.com/AISec123/aisec123.github.io/issues/new">' +
        '<span class="ad-tag">' + esc(t('虚位', 'OPEN')) + '</span>' +
        '<span class="ad-body"><span class="ad-text"><b>' + esc(t('广告位招租', 'Advertise here')) + '</b>' +
        '<span>' + esc(t('合作请开 issue，展示位与收录互不影响。', 'Open an issue — placements never influence listings.')) + '</span></span></span>' +
      '</a>';
    el.querySelectorAll('.ad-logo').forEach(function (img) { img.onerror = function () { img.remove(); }; });
  }

  function renderFriends() {
    var el = $('#friends');
    if (!el) return;
    var list = D.friends || [];
    el.innerHTML = list.map(function (f) {
      return '<a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.name) + '</a>';
    }).join('<span class="crumb-sep" aria-hidden="true">·</span>');
  }

  function renderAll() {
    renderCats();
    renderHeroTabs();
    renderList();
    renderAds();
    writeUrl();
  }

  /* ── AI 搜索 ──────────────────────────────────────────────
     回车 / 点「AI 搜索」/ 点热词触发。Worker 没配或调用失败时降级到本地关键词过滤。
     模型只回条目名 + 理由，完整字段由 Worker 从本地数据回填，前端再渲染成卡片。 */
  var aiPanel = $('#ai-panel');
  var aiBody = $('#ai-body');
  var aiMeta = $('#ai-meta');
  var aiBtn = $('#ai-search-btn');
  var aiReqId = 0;

  function setAiLoading(on) {
    if (!aiBtn) return;
    aiBtn.disabled = on;
    aiBtn.classList.toggle('is-loading', on);
  }

  function closeAiPanel() {
    state.aiMatches = null;
    state.aiQuery = '';
    if (aiPanel) aiPanel.hidden = true;
    renderList();
    writeUrl();
  }

  function aiLoadingHtml() {
    return '<div class="ai-loading"><span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
      '<span>' + esc(t('AI 正在检索知识库…', 'AI is searching the knowledge base…')) + '</span></div>';
  }

  function renderAiResult(data, q) {
    var matches = Array.isArray(data.matches) ? data.matches : [];
    state.aiMatches = matches.map(function (m) { return m.name; });
    state.aiQuery = q;

    var summary = data.summary
      ? '<p class="ai-summary">' + esc(data.summary) + '</p>'
      : '';
    var cards = matches.map(function (m) {
      var sec = byKey[m.section] || {};
      var color = sec.color || 'var(--accent)';
      var secLabel = lang === 'en' ? (sec.en || sec.key) : (sec.zh || sec.key);
      return '<a class="ai-match" style="--cat:' + esc(color) + '" href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="ai-match-sec">' + esc(secLabel || '') + '</span>' +
        '<span class="ai-match-name">' + esc(m.name) +
          '<svg class="card-ext" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
        '</span>' +
        (m.reason ? '<p class="ai-match-reason">' + esc(m.reason) + '</p>' : '') +
      '</a>';
    }).join('');

    aiBody.innerHTML = summary +
      (cards ? '<div class="ai-matches">' + cards + '</div>'
             : '<p class="ai-error">' + esc(t('没有找到相关条目，换个说法试试。', 'No relevant entries — try rephrasing.')) + '</p>');
    if (aiMeta) {
      aiMeta.textContent = (data.model ? data.model.replace('@cf/', '') : '') +
        (data.ms ? ' · ' + (data.ms / 1000).toFixed(1) + 's' : '') +
        ' · ' + matches.length + ' ' + esc(t('个结果', 'results'));
    }
    aiPanel.hidden = false;
    renderList();
    writeUrl();
  }

  function runAiSearch(q) {
    q = String(q || '').trim();
    if (!q) return;
    /* 没配 Worker：直接本地过滤，不弹面板 */
    if (!WORKER_BASE) {
      state.q = q; qEl.value = q;
      state.aiMatches = null;
      if (aiPanel) aiPanel.hidden = true;
      renderList(); writeUrl();
      return;
    }
    var reqId = ++aiReqId;
    setAiLoading(true);
    aiPanel.hidden = false;
    aiBody.innerHTML = aiLoadingHtml();
    if (aiMeta) aiMeta.textContent = '';

    fetch(WORKER_BASE + '/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: q, lang: lang })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      if (reqId !== aiReqId) return;   // 已有更新的请求，丢弃旧结果
      if (data.error) throw new Error(data.error);
      renderAiResult(data, q);
    }).catch(function () {
      if (reqId !== aiReqId) return;
      /* 降级：本地关键词过滤 + 面板里提示 */
      state.q = q; qEl.value = q;
      state.aiMatches = null;
      aiBody.innerHTML = '<p class="ai-error">' +
        esc(t('AI 搜索暂不可用，已切换为本地关键词匹配。', 'AI search unavailable — fell back to local keyword matching.')) + '</p>';
      if (aiMeta) aiMeta.textContent = t('本地模式', 'local mode');
      renderList(); writeUrl();
    }).finally(function () {
      if (reqId === aiReqId) setAiLoading(false);
    });
  }

  /* ── 事件 ─────────────────────────────────────────────── */
  $('#cats').addEventListener('click', function (ev) {
    var b = ev.target.closest('.side-item');
    if (!b) return;
    if (state.sec === b.dataset.sec) return;
    state.sec = b.dataset.sec;
    state.tag = '';           // 标签池随板块变，旧标签可能不在新板块里
    renderAll();
  });

  document.addEventListener('click', function (ev) {
    if (ev.target.closest('[data-clear]')) {
      state.tag = '';
      renderAll();
      return;
    }
    var c = ev.target.closest('[data-tag]');
    if (!c) return;
    state.tag = state.tag === c.dataset.tag ? '' : c.dataset.tag;
    renderAll();
  });

  var qEl = $('#q');
  qEl.value = state.q;
  qEl.addEventListener('input', function () {
    state.q = qEl.value;
    /* 一开始打字就退出 AI 结果模式，回到实时本地过滤 */
    if (state.aiMatches) { state.aiMatches = null; state.aiQuery = ''; if (aiPanel) aiPanel.hidden = true; }
    renderList();
    writeUrl();
  });

  /* 回车 / 点「AI 搜索」→ 语义搜索 */
  $('#search-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    runAiSearch(qEl.value);
  });

  /* 热词：填进搜索框并立即 AI 搜索。
     没配 Worker 时退化为标签筛选（data-local-tag），不做自然语言关键词匹配。 */
  document.querySelectorAll('.hot-tag').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = lang === 'en' ? (b.getAttribute('data-hot-en') || b.dataset.hot) : b.dataset.hot;
      if (!WORKER_BASE) {
        state.q = ''; qEl.value = '';
        state.aiMatches = null; state.aiQuery = '';
        if (aiPanel) aiPanel.hidden = true;
        state.tag = b.getAttribute('data-local-tag') || '';
        renderAll();
        return;
      }
      qEl.value = q;
      runAiSearch(q);
    });
  });

  /* hero 分类 tab：和侧栏一样切板块 */
  $('#hero-tabs').addEventListener('click', function (ev) {
    var b = ev.target.closest('.hero-tab');
    if (!b || state.sec === b.dataset.sec) return;
    state.sec = b.dataset.sec;
    state.tag = '';
    renderAll();
  });

  if ($('#ai-close')) $('#ai-close').addEventListener('click', closeAiPanel);

  $('#sort').addEventListener('change', function (ev) {
    state.sort = ev.target.value;
    renderList();
    writeUrl();
  });

  $('#view').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-view]');
    if (!b) return;
    state.view = b.dataset.view;
    LS.set('view', state.view);
    renderList();
    syncView();
    writeUrl();
  });

  function syncView() {
    document.querySelectorAll('#view button[data-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
    });
  }

  $('#lang-toggle').addEventListener('click', function () {
    lang = lang === 'en' ? 'zh' : 'en';
    LS.set('lang', lang);
    applyLang();
    renderTimes();
    renderAll();
  });

  $('#theme-toggle').addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    LS.set('theme', theme);
    applyTheme();
  });

  $('#reset').addEventListener('click', function () {
    state.q = ''; state.tag = ''; state.sec = 'all';
    state.aiMatches = null; state.aiQuery = '';
    if (aiPanel) aiPanel.hidden = true;
    qEl.value = '';
    renderAll();
    qEl.focus();
  });

  $('#to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('keydown', function (ev) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault(); qEl.focus(); qEl.select(); return;
    }
    if (ev.key === '/' && !typing) { ev.preventDefault(); qEl.focus(); return; }
    if (ev.key === 'Escape' && document.activeElement === qEl) {
      if (qEl.value || state.aiMatches) {
        qEl.value = ''; state.q = '';
        state.aiMatches = null; state.aiQuery = '';
        if (aiPanel) aiPanel.hidden = true;
        renderList(); writeUrl();
      }
      qEl.blur();
    }
  });

  /* ── 启动 ─────────────────────────────────────────────── */
  readUrl();
  if (LS.get('view', '')) state.view = LS.get('view', state.view);
  $('#sort').value = state.sort;
  qEl.value = state.q;
  applyLang();
  applyTheme();
  renderTimes();
  renderFriends();
  renderAll();
  syncView();
})();

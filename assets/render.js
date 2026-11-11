/* AISecpedia 渲染层：数据 → HTML 字符串，全程不碰 DOM。
 *
 * 浏览器里的 app.js 和 node 里的 scripts/gen-static.js 共用这一份，而且是必须共用：
 * 预渲染进 index.html 的静态卡片是给不执行 JS 的爬虫（百度、GPTBot、ClaudeBot）看的，
 * 用户打开页面后 app.js 会立刻用同一批函数重画 #list。两边 markup 差一个字符，
 * 加载时就闪一下，而且爬虫索引到的和用户看到的不是同一版内容。
 *
 * 状态通过 getState() 惰性读取，所以同一个 renderer 实例能跟着语言切换、搜索、
 * 排序变化，不用重建；预渲染脚本传一个固定状态就行。
 *
 * 双环境导出：浏览器挂 window.AISECPEDIARender，node 走 module.exports。
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AISECPEDIARender = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ICON = {
    star: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.3l-3.8 2.1.7-4.3-3.1-3 4.3-.6z" fill="currentColor"></path></svg>',
    doc: '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M9 1.5V5h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>'
  };

  /* 标签的英文显示名。标签本身（tags 字段）是数据里的唯一标识，
     这里只做展示层翻译，没收录的标签原样显示。 */
  var TAG_EN = {
    '模型安全': 'Model security', 'LLM 防护': 'LLM protection', 'Agent 管控': 'Agent governance',
    'Copilot': 'Copilot', '对抗攻防': 'Adversarial', '提示注入': 'Prompt injection', 'MLDR': 'MLDR',
    'AI 防火墙': 'AI firewall', '红队': 'Red team', '推理安全': 'Inference security',
    '网关': 'Gateway', '影子 AI': 'Shadow AI', '全生命周期': 'Full lifecycle', 'MCP': 'MCP',
    '运行时管控': 'Runtime controls', '可观测': 'Observability', '护栏': 'Guardrails',
    '评估': 'Evaluation', 'RAG': 'RAG', '访问控制': 'Access control',
    '自主渗透智能体': 'Autonomous pentest agents', 'LLM 漏扫': 'LLM-powered scanners',
    '智能体审计': 'Agent & app auditing', 'Skills 审计': 'Agent Skills auditing',
    '自主漏洞发现': 'Autonomous vuln discovery', 'Agent 工具箱': 'Agentic security toolkits',
    '专栏': 'Column', '工具拆解': 'Tool teardowns', '标准': 'Standards', '清单': 'Checklist',
    '威胁矩阵': 'Threat matrix', '知识库': 'Knowledge base', '博客': 'Blog', '框架': 'Framework',
    '大厂': 'Big tech', '合规': 'Compliance', '评测集': 'Eval set', '鲁棒性': 'Robustness',
    '对抗攻击': 'Adversarial attacks', '数据集': 'Dataset', '工具集': 'Tool collection',
    '索引': 'Index', '漏洞': 'Vulnerabilities', '档案': 'Case files'
  };

  function create(D, getState) {
    var SECS = (D && D.sections) || [];
    var byKey = {};
    SECS.forEach(function (s) { byKey[s.key] = s; });

    var ALL = ((D && D.entries) || []).filter(function (e) {
      if (!e || !e.name || !e.url) return false;
      if (!byKey[e.section]) console.warn('[aisecpedia] 未知 section，条目已跳过:', e.name, e.section);
      return !!byKey[e.section];
    });

    function st() { return (getState && getState()) || {}; }
    function isEn() { return st().lang === 'en'; }

    /* ── 工具函数 ─────────────────────────────────────────── */
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function tokens() {
      return String(st().q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    }

    /* 先按关键词切开再逐段转义，避免在已转义的文本上做替换把 &amp; 拆坏 */
    function hl(text) {
      var s = String(text == null ? '' : text);
      var tk = tokens();
      if (!tk.length) return esc(s);
      return s.split(new RegExp('(' + tk.map(reEsc).join('|') + ')', 'ig')).map(function (p, i) {
        return i % 2 ? '<mark>' + esc(p) + '</mark>' : esc(p);
      }).join('');
    }

    function fmtStar(n) {
      if (n >= 10000) return Math.round(n / 1000) + 'k';
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      return String(n);
    }

    function desc(e) { return isEn() ? (e.desc_en || e.desc || '') : (e.desc || e.desc_en || ''); }

    function t(zh, en) { return isEn() ? en : zh; }

    function tagLabel(g) { return isEn() ? (TAG_EN[g] || g) : g; }

    /* 品牌图标只认本地文件（scripts/fetch-logos.sh 抓的）。
       试过运行时现取 favicon.im：抓不到时它会回一张通用的 "f" 占位图，
       于是三家不同公司顶上出现同一个假 logo——比首字母更糟，所以宁可退回 monogram。 */
    function logoList(e) { return e.logo ? [e.logo] : []; }

    function markHtml(e, cls) {
      var list = logoList(e);
      var fb = esc(String(e.name).trim().charAt(0).toUpperCase());
      return '<span class="logo-mount ' + cls + (list.length ? '' : ' no-logo') + '" data-try="' +
        esc(JSON.stringify(list)) + '"><img alt="" loading="lazy" decoding="async"><i class="mark-fb">' + fb + '</i></span>';
    }

    /* ── 筛选与排序 ───────────────────────────────────────── */
    function matches(e) {
      var s = st();
      var sec = s.sec || 'all';
      if (sec !== 'all' && e.section !== sec) return false;
      if (s.tag && (e.tags || []).indexOf(s.tag) < 0) return false;
      var tk = tokens();
      if (tk.length) {
        var sec2 = byKey[e.section];
        var hay = [e.name, e.desc, e.desc_en, (e.tags || []).join(' '), e.region, e.github,
                   sec2 ? sec2.zh + ' ' + sec2.en : ''].join(' ').toLowerCase();
        for (var i = 0; i < tk.length; i++) if (hay.indexOf(tk[i]) < 0) return false;
      }
      return true;
    }

    function sortList(list) {
      var out = list.slice();
      var mode = st().sort || 'default';
      var feat = function (e) { return e.status === 'featured' ? 0 : 1; };
      if (mode === 'star') {
        out.sort(function (a, b) { return (b.star || 0) - (a.star || 0) || feat(a) - feat(b); });
      } else if (mode === 'new') {
        out.sort(function (a, b) { return String(b.added || '').localeCompare(String(a.added || '')) || (b.star || 0) - (a.star || 0); });
      } else if (mode === 'az') {
        out.sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
      } else {
        out.sort(function (a, b) {
          return feat(a) - feat(b) || (b.star || 0) - (a.star || 0) ||
                 String(b.added || '').localeCompare(String(a.added || ''));
        });
      }
      return out;
    }

    /* ── 渲染 ─────────────────────────────────────────────── */
    function card(e) {
      var s = byKey[e.section] || {};
      var meta = [];
      if (e.star) meta.push('<span class="card-star" title="GitHub stars">' + ICON.star + ' ' + esc(fmtStar(e.star)) + '</span>');
      if (e.post) meta.push('<a class="card-post" href="' + esc(e.post) + '" target="_blank" rel="noopener noreferrer">' + ICON.doc + ' ' + esc(t('深度长文', 'Deep dive')) + '</a>');
      var tags = (e.tags || []).map(function (g) {
        return '<button type="button" class="tag" data-tag="' + esc(g) + '">' + esc(tagLabel(g)) + '</button>';
      }).join('');

      return '<article class="card" style="--cat:' + esc(s.color || 'var(--accent)') + '">' +
        '<div class="card-top">' +
          markHtml(e, 'card-mark') +
          '<span class="card-id">' +
            '<span class="card-name">' +
              '<a href="' + esc(e.url) + '" target="_blank" rel="noopener noreferrer">' + hl(e.name) +
                '<svg class="card-ext" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">' +
                '<path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
              '</a>' +
              (e.status === 'featured' ? '<span class="badge-featured">' + esc(t('推荐', 'PICK')) + '</span>' : '') +
              (e.region ? '<span class="card-region">' + esc(e.region) + '</span>' : '') +
            '</span>' +
            '<p class="card-desc">' + hl(desc(e)) + '</p>' +
          '</span>' +
        '</div>' +
        ((tags || meta.length) ? '<div class="card-foot">' + tags + (meta.length ? '<span class="card-meta">' + meta.join('') + '</span>' : '') + '</div>' : '') +
      '</article>';
    }

    /* #list 的内容：按板块分组、组内排序。抽出来是为了让预渲染脚本能生成
       和浏览器逐字节一致的那一版（默认状态：中文 / 全部板块 / 推荐排序 / 无搜索词）。
       返回 shown 是给 #empty 的显隐用的。 */
    function blocksHtml(hit) {
      var html = '';
      var shown = 0;
      var sec = st().sec || 'all';
      SECS.forEach(function (s) {
        var list = sortList(hit.filter(function (e) { return e.section === s.key; }));
        if (!list.length) return;
        shown += list.length;
        var blurb = isEn() ? (s.desc_en || s.desc) : (s.desc || s.desc_en);
        /* 单板块视图不重复渲染板块标题：侧栏和面包屑已经说过同一个词了 */
        var head = sec === 'all'
          ? '<h2 class="block-head"><span>' + esc(isEn() ? s.en : s.zh) + '</span>' +
            '<span class="block-n">' + list.length + '</span></h2>'
          : '';
        html += '<section class="block" id="sec-' + esc(s.key) + '" style="--cat:' + esc(s.color || '') + '">' +
          head +
          (blurb ? '<p class="block-desc">' + esc(blurb) + '</p>' : '') +
          '<div class="grid">' + list.map(card).join('') + '</div>' +
        '</section>';
      });
      return { html: html, shown: shown };
    }

    return {
      SECS: SECS, byKey: byKey, ALL: ALL,
      esc: esc, hl: hl, t: t, desc: desc, fmtStar: fmtStar, tagLabel: tagLabel,
      markHtml: markHtml, matches: matches, sortList: sortList,
      card: card, blocksHtml: blocksHtml
    };
  }

  return { create: create, ICON: ICON, TAG_EN: TAG_EN };
});

#!/usr/bin/env node
/* 把 data/entries.js 预渲染进 index.html —— 给不执行 JS 的爬虫看的。
 *
 * 为什么需要：站点是单页应用，60 条内容全靠 app.js 画。Googlebot / Bingbot 会
 * 执行 JS 所以看得见，但百度和绝大多数 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot）
 * 不执行，它们只拿到 <head> 和 hero 那几行字。对一个内容即产品的百科站，
 * 等于主要内容全部不可索引，AI 答案引擎也引用不到具体条目。
 *
 * 做三件事，都写在 index.html / sitemap.xml 里，重跑整块覆盖：
 *   1. #list 的静态卡片 —— 复用 assets/render.js，和浏览器画出来的逐字节一致，
 *      所以 app.js 加载后重画不会闪。
 *   2. 条目级 JSON-LD —— ItemList + 每条实体。tags 声明成 knowsAbout，
 *      post 声明成 subjectOf，github 声明成 sameAs / codeRepository：
 *      这是把实体之间的关系讲给搜索引擎和 AI 答案引擎听的正规位置，
 *      也是「百科」这个定位在数据层面唯一能被机器验证的地方。
 *   3. sitemap.xml 的 <lastmod> 同步成 entries.js 的 updated（原来是手工活，容易忘）。
 *
 * 用法：改完 data/entries.js 后跑一次
 *   node scripts/gen-static.js
 * 零依赖、不进构建流程，和 scripts/fetch-logos.sh 一个性质。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const SITE = 'https://aisecpedia.github.io/';

/* entries.js 是 <script> 而不是 JSON（为了让 file:// 双击也能跑，见该文件头注释），
   所以这里 shim 一个 window 再执行，而不是自己写一套 JS 字面量解析器。 */
function loadData() {
  const src = fs.readFileSync(path.join(ROOT, 'data', 'entries.js'), 'utf8');
  const win = {};
  new Function('window', src)(win);
  if (!win.AISECPEDIA) throw new Error('data/entries.js 没有设置 window.AISECPEDIA');
  return win.AISECPEDIA;
}

/* 板块 → schema.org 类型 */
const SCHEMA_TYPE = {
  companies: 'Organization',
  opensource: 'SoftwareSourceCode',
  articles: 'Article',
  resources: 'CreativeWork'
};

/* 「标准与数据集」板块是混装的，带这两个标签的按 Dataset 声明更准确 */
const DATASET_TAGS = ['数据集', '评测集'];

function slug(name, used) {
  const base = String(name).toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'entry';
  let id = base;
  for (let n = 2; used.has(id); n++) id = base + '-' + n;
  used.add(id);
  return id;
}

function buildLd(ALL) {
  const used = new Set();
  const items = [];
  const entities = ALL.map(function (e, i) {
    const id = '#' + slug(e.name, used);
    items.push({ '@type': 'ListItem', position: i + 1, item: { '@id': id } });

    let type = SCHEMA_TYPE[e.section] || 'CreativeWork';
    if (e.section === 'resources' && (e.tags || []).some(function (t) { return DATASET_TAGS.indexOf(t) >= 0; })) {
      type = 'Dataset';
    }

    const node = { '@type': type, '@id': id, name: e.name, url: e.url };
    const d = e.desc || e.desc_en;
    if (d) node.description = d;
    /* tags 是图谱里的边：同一标签下的公司、工具、文章因此互相关联 */
    if (e.tags && e.tags.length) node.knowsAbout = e.tags.slice();
    if (e.github) {
      if (type === 'SoftwareSourceCode') node.codeRepository = e.github;
      else node.sameAs = [e.github];
    }
    /* post 是「关于这个条目的深度长文」，不是条目本身，所以是 subjectOf 而不是 url */
    if (e.post) node.subjectOf = { '@type': 'Article', url: e.post };
    return node;
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'ItemList',
      name: 'AISecpedia · AI 安全百科',
      description: '收录的 AI 安全实体：企业、开源项目、深度文章、标准与数据集。',
      url: SITE,
      numberOfItems: items.length,
      itemListElement: items
    }].concat(entities)
  };
}

/* 卡片之间插换行纯粹为了 diff 可读：#list 和 .grid 的子元素都是块级 / flex item，
   中间只含空白的文本节点不参与布局，所以断行不会让静态版和 app.js 版看起来不一样。 */
function readable(html) {
  return html
    .replace(/<section class="block"/g, '\n        <section class="block"')
    .replace(/<article class="card"/g, '\n          <article class="card"');
}

function inject(file, name, content) {
  const re = new RegExp(
    '(<!-- PRERENDER:' + name + ':START[\\s\\S]*?-->)([\\s\\S]*?)(<!-- PRERENDER:' + name + ':END -->)'
  );
  if (!re.test(file)) throw new Error('index.html 里找不到 PRERENDER:' + name + ' 标记');
  return file.replace(re, function (_, start, _old, end) {
    return start + '\n' + content + '\n      ' + end;
  });
}

function main() {
  const D = loadData();
  const render = require(path.join(ROOT, 'assets', 'render.js'));

  /* 预渲染用默认状态：中文 / 全部板块 / 推荐排序 / 无搜索词 —— 和用户首屏看到的一致 */
  const R = render.create(D, function () {
    return { lang: 'zh', q: '', sec: 'all', tag: '', sort: 'default' };
  });

  const out = R.blocksHtml(R.ALL);
  if (!out.shown) throw new Error('渲染出 0 个条目，检查 data/entries.js');

  let html = fs.readFileSync(INDEX, 'utf8');
  html = inject(html, 'LIST', '      <div id="list">' + readable(out.html) + '</div>');
  html = inject(html, 'LD',
    '<script type="application/ld+json">\n' +
    JSON.stringify(buildLd(R.ALL), null, 2) +
    '\n</script>');
  fs.writeFileSync(INDEX, html);

  /* lastmod 跟着 entries.js 的 updated 走，省掉一次手工同步。
     取较大值而不是直接覆盖：文件里的 lastmod 可能因为非数据改动而更新，
     日期往回走会让搜索引擎以为页面变旧了。 */
  let lastmod = '(未设置)';
  if (fs.existsSync(SITEMAP)) {
    const sm = fs.readFileSync(SITEMAP, 'utf8');
    const cur = (sm.match(/<lastmod>([\d-]+)<\/lastmod>/) || [])[1] || '';
    lastmod = D.updated && D.updated > cur ? D.updated : cur;
    if (lastmod) {
      const next = sm.replace(/<lastmod>[\d-]+<\/lastmod>/, '<lastmod>' + lastmod + '</lastmod>');
      if (next !== sm) fs.writeFileSync(SITEMAP, next);
    }
  }

  console.log('预渲染完成：%d 个条目 / %d 个板块，sitemap lastmod=%s',
    out.shown, R.SECS.length, lastmod);
  console.log('记得 git diff 看一眼再提交。');
}

main();

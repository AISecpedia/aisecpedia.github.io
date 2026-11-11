#!/usr/bin/env node
/* 从 AISecDB 拉数据集，生成 data/entries.js。
 *
 * 数据真源是 github.com/AISecpedia/AISecDB 的 entries.json；这个仓库里那份是
 * 构建产物（GitHub Pages 直接发静态文件，所以必须提交）。
 *
 * 为什么不在运行时跨域去 raw 取：raw.githubusercontent.com 在国内经常被阻断，
 * 而站点受众就在国内。运行时取等于多挂一个比 github.io 更容易挂的依赖，
 * 拿不到数据就是白屏；而且预渲染用的静态快照会和实际渲染内容分叉。
 * 改成发布前同步，站点仍是同源加载，预渲染照常。
 *
 * 用法：
 *   node scripts/pull-data.js                              从 AISecDB 线上拉
 *   node scripts/pull-data.js --local ../AISecDB/entries.json   从本地副本拉
 *   node scripts/pull-data.js --from <url|path>
 *
 * 拉完记得接着跑 node scripts/gen-static.js。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'entries.js');
const EXTRA = path.join(ROOT, 'data', 'site-extra.json');
const SOURCE = 'https://raw.githubusercontent.com/AISecpedia/AISecDB/main/entries.json';

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

async function loadSource() {
  const local = arg('--local') || (arg('--from') && !/^https?:/.test(arg('--from')) ? arg('--from') : null);
  const url = arg('--from') && /^https?:/.test(arg('--from')) ? arg('--from') : SOURCE;

  if (local) {
    const p = path.resolve(ROOT, local);
    const rel = path.relative(ROOT, p);
    console.log('读取本地数据集：%s', rel.startsWith('..') ? p : rel);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  console.log('拉取 %s', url);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('拉取失败：HTTP ' + res.status);
  return res.json();
}

/* 最小校验。不引 JSON Schema 库（零依赖），但把会让站点出问题的几类错误挡住：
   丢条目、空卡片、跨域图片、标签类型错。schema.json 管文档，这里管构建。 */
function validate(D) {
  const errs = [];
  const warns = [];
  if (!D || typeof D !== 'object') throw new Error('数据集不是对象');

  const sections = Array.isArray(D.sections) ? D.sections : [];
  const entries = Array.isArray(D.entries) ? D.entries : [];
  if (!sections.length) errs.push('sections 为空');
  if (!entries.length) errs.push('entries 为空');

  const keys = new Set();
  sections.forEach(function (s) {
    if (!s.key) errs.push('板块缺 key: ' + JSON.stringify(s));
    else if (keys.has(s.key)) errs.push('板块 key 重复: ' + s.key);
    else keys.add(s.key);
    if (s.key && !/^[a-z][a-z0-9-]*$/.test(s.key)) warns.push('板块 key 不符合 ^[a-z][a-z0-9-]*$: ' + s.key);
  });

  const names = new Map();
  const skipped = [];
  entries.forEach(function (e, i) {
    const at = 'entries[' + i + ']';
    if (!e || !e.name || !e.url) { errs.push(at + ' 缺 name 或 url'); return; }
    if (keys.has(e.section) === false) { skipped.push(e.name + ' → ' + e.section); return; }
    if (!/^https?:\/\//.test(e.url)) errs.push(e.name + ': url 不是 http(s) 绝对地址');
    if (names.has(e.name)) errs.push('名称重复: ' + e.name + '（' + names.get(e.name) + ' 与 ' + at + '）');
    else names.set(e.name, at);
    if (e.tags != null && (!Array.isArray(e.tags) || e.tags.some(function (t) { return typeof t !== 'string' || !t; }))) {
      errs.push(e.name + ': tags 必须是非空字符串数组');
    }
    if (e.logo && !/^assets\/logos\//.test(e.logo)) {
      errs.push(e.name + ': logo 必须是本地路径（assets/logos/…），不能引用外部图片');
    }
    if (e.added && !/^\d{4}-\d{2}-\d{2}$/.test(e.added)) errs.push(e.name + ': added 必须是 YYYY-MM-DD');
    if (e.status && ['featured', 'active', 'archived'].indexOf(e.status) < 0) {
      errs.push(e.name + ': status 只能是 featured / active / archived');
    }
  });

  if (skipped.length) errs.push('以下条目的 section 不存在，会被站点丢弃：' + skipped.join(', '));
  return { errs: errs, warns: warns, keys: keys };
}

/* AISecDB 是纯数据集，不含任何商业内容。展示位和友链留在站点自己的
   site-extra.json 里，拼进产物时补回去 —— 买不到列表位置这件事得由结构保证。 */
function loadExtra() {
  if (!fs.existsSync(EXTRA)) return { sponsors: [], friends: [] };
  const x = JSON.parse(fs.readFileSync(EXTRA, 'utf8'));
  return { sponsors: x.sponsors || [], friends: x.friends || [] };
}

function main() {
  return loadSource().then(function (D) {
    const v = validate(D);
    v.warns.forEach(function (w) { console.warn('  warn: ' + w); });
    if (v.errs.length) {
      v.errs.forEach(function (e) { console.error('  error: ' + e); });
      throw new Error('数据集校验未通过，共 ' + v.errs.length + ' 处错误。没有写入 data/entries.js。');
    }

    const extra = loadExtra();
    const merged = {
      updated: D.updated || '',
      sections: D.sections,
      entries: D.entries,
      sponsors: extra.sponsors,
      friends: extra.friends
    };

    const header = [
      '/* 生成文件，别手改 —— 真源是 github.com/AISecpedia/AISecDB 的 entries.json。',
      ' *',
      ' * 重新生成：',
      ' *   node scripts/pull-data.js                             从 AISecDB 线上拉',
      ' *   node scripts/pull-data.js --local ../AISecDB/entries.json   从本地副本拉',
      ' *',
      ' * sponsors / friends 是站点自有的展示位和友链，不属于数据集，',
      ' * 存在 data/site-extra.json，由脚本合并进来。',
      ' */',
      'window.AISECPEDIA = ' + JSON.stringify(merged, null, 2) + ';',
      ''
    ].join('\n');

    fs.writeFileSync(OUT, header);

    const bySec = {};
    D.entries.forEach(function (e) { bySec[e.section] = (bySec[e.section] || 0) + 1; });
    const tagSet = new Set();
    D.entries.forEach(function (e) { (e.tags || []).forEach(function (t) { tagSet.add(t); }); });

    console.log('已写入 %s', path.relative(ROOT, OUT));
    console.log('  %d 个条目 / %d 个板块 / %d 个标签，updated=%s',
      D.entries.length, D.sections.length, tagSet.size, D.updated || '(未设置)');
    console.log('  ' + D.sections.map(function (s) { return (s.zh || s.key) + ' ' + (bySec[s.key] || 0); }).join(' · '));
    console.log('下一步：node scripts/gen-static.js');
  });
}

main().catch(function (e) {
  console.error('\n' + e.message);
  process.exit(1);
});

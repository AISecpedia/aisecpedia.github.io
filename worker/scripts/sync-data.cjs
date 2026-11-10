#!/usr/bin/env node
/* 把 AISecDB 的 entries.json 同步成 Worker 用的 src/data.js（ESM 导出）。
 *
 * 与站点 scripts/pull-data.js 同源，但产物格式不同：站点要 window.AISEC123（浏览器），
 * Worker 要 export const DATA（ESM）。这里只取 sections + entries + updated，
 * 不带 sponsors / friends（那些是站点展示位，搜索用不到）。
 *
 * 用法：
 *   node scripts/sync-data.js                          从 AISecDB 线上拉
 *   node scripts/sync-data.js --local ../../AISecDB/entries.json
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'data.js');
const SOURCE = 'https://raw.githubusercontent.com/AISec123/AISecDB/main/entries.json';

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

async function loadSource() {
  const local = arg('--local');
  if (local) {
    const p = path.resolve(ROOT, local);
    console.log('读取本地数据集：%s', p);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  console.log('拉取 %s', SOURCE);
  const res = await fetch(SOURCE, { cache: 'no-store' });
  if (!res.ok) throw new Error('拉取失败：HTTP ' + res.status);
  return res.json();
}

async function main() {
  const D = await loadSource();
  if (!Array.isArray(D.entries) || !D.entries.length) throw new Error('entries 为空');

  const slim = {
    updated: D.updated || '',
    sections: D.sections || [],
    entries: D.entries,
  };

  const header = [
    '/* 生成文件，别手改 —— 真源是 github.com/AISec123/AISecDB 的 entries.json。',
    ' * 重新生成：node scripts/sync-data.js [--local <path>]',
    ' */',
    'export const DATA = ' + JSON.stringify(slim, null, 2) + ';',
    '',
  ].join('\n');

  fs.writeFileSync(OUT, header);
  console.log('已写入 %s（%d 条目）', path.relative(ROOT, OUT), D.entries.length);
}

main().catch((e) => {
  console.error('\n' + e.message);
  process.exit(1);
});
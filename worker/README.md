# AISecpedia 搜索 Worker

Cloudflare Workers AI 代理，给 [aisecpedia.github.io](https://aisecpedia.github.io) 的搜索框提供 LLM 语义搜索。
数据来自 [AISecDB](https://github.com/AISecpedia/AISecDB)，模型用 Workers AI 免费额度内的 `@cf/meta/llama-3.1-8b-instruct-fp8`。

## 架构

```
浏览器搜索框 ──POST /search {q,lang}──> Worker ──> Workers AI (Llama 3.1 8B)
                                          │
                                          └─ 本地 data.js（50 条目，发布前同步）
浏览器 <──{summary, matches[]}────────────┘
```

- 模型只返回「条目名 + 理由」，URL / 描述由 Worker 从本地数据回填，**杜绝幻觉链接**。
- 数据发布前同步进 `src/data.js`，运行时不跨域取数据（raw.githubusercontent.com 国内常被阻断）。
- CORS 只放行 `ALLOWED_ORIGIN`（默认 `https://aisecpedia.github.io`）+ localhost 调试。

## 端点

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/search` | `{q, lang}` → `{summary, matches:[完整条目+reason], model, ms}` |
| GET | `/health` | `{ok, entries, model, updated}` |

## 部署（一次性）

前置：一个 Cloudflare 账号（免费），Node.js 18+。

```bash
cd worker
npm install                 # 装 wrangler
npx wrangler login          # 浏览器授权登录 Cloudflare

# 1. 同步数据（从 AISecDB 线上拉；本地有副本可加 --local ../../AISecDB/entries.json）
npm run sync

# 2. 本地调试（--remote 才能用 Workers AI 绑定）
npm run dev                 # 默认 http://localhost:8787

# 3. 部署到 Cloudflare
npm run deploy              # 输出 https://aisecpedia-search.<你的子域>.workers.dev
```

部署成功后记下 Worker 域名，填进前端 `assets/app.js` 顶部的 `WORKER_BASE`
（或 `index.html` 里的 `window.AISECPEDIA_WORKER`）。

## 免费额度

Workers AI 免费档每天 10,000 neurons。Llama 3.1 8B 单次搜索约几十 neurons，
够每天几百次查询。超额会返回错误，前端自动降级到本地关键词搜索。

## 更新数据

AISecDB 加新条目后：

```bash
npm run sync && npm run deploy
```

站点侧也要同步：`cd .. && node scripts/pull-data.js && node scripts/gen-static.js`。

## 配置

`wrangler.toml`：
- `ALLOWED_ORIGIN`：改成你的站点域名（带 `https://`，无尾斜杠）。
- 换模型：改 `src/index.js` 的 `MODEL`，可选 Workers AI 目录里任意文本模型。
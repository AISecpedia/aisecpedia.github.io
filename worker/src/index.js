/* AISec123 搜索 Worker —— Cloudflare Workers AI 代理。
 *
 * 数据真源是 github.com/AISec123/AISecDB 的 entries.json，发布前用
 * scripts/sync-data.js 同步成 src/data.js（ESM 导出），Worker 启动即加载，
 * 不在运行时跨域取数据（raw.githubusercontent.com 在国内常被阻断）。
 *
 * 端点：
 *   POST /search   { q, lang }  →  { summary, matches:[{name,reason}], model, ms }
 *   GET  /health                 →  { ok, entries, model }
 *
 * 模型只返回「条目名 + 推荐理由」，URL / 描述等字段一律由 Worker 从本地数据
 * 回填 —— 模型不碰链接，杜绝幻觉 URL。
 */
import { DATA } from './data.js';

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
const MAX_MATCHES = 8;
const MAX_QUERY_LEN = 200;

const ENTRIES = DATA.entries || [];
const SECTIONS = DATA.sections || [];
const SEC_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

/* 给模型看的精简目录：只留 name / section / tags / desc，去掉 logo / star / post
 * 这些对语义匹配没帮助的字段，省 token。50 条约 6k token，8B 模型完全 hold 住。 */
const CATALOG = ENTRIES.map((e) => ({
  name: e.name,
  section: e.section,
  tags: e.tags || [],
  desc: e.desc || '',
  desc_en: e.desc_en || '',
}));

const SYSTEM_ZH = `你是 AISec123 的 AI 安全搜索助手。下面是收录的全部条目（JSON 数组）：
${JSON.stringify(CATALOG)}

用户会用自然语言描述需求。你的任务：
1. 从上面条目里挑出最相关的，最多 ${MAX_MATCHES} 个，按相关度排序。
2. 每个条目给一句简短理由（不超过 30 字），说明为什么匹配。
3. 写一段不超过 80 字的总结，直接回答用户问题，可以引用条目名。

严格只输出 JSON，格式：
{"summary":"...","matches":[{"name":"条目名","reason":"..."}]}

规则：
- name 必须和上面条目完全一致，不许编造不存在的条目。
- 没有匹配时 matches 为空数组，summary 说明没找到并建议换关键词。
- 不要输出 JSON 以外的任何文字、markdown 或代码围栏。`;

const SYSTEM_EN = `You are the AISec123 AI security search assistant. Here is the full catalog (JSON array):
${JSON.stringify(CATALOG)}

The user describes a need in natural language. Your job:
1. Pick the most relevant entries, up to ${MAX_MATCHES}, ranked by relevance.
2. Give each a short reason (under 20 words) for why it matches.
3. Write a summary under 50 words answering the user directly; you may cite entry names.

Output ONLY JSON in this exact shape:
{"summary":"...","matches":[{"name":"entry name","reason":"..."}]}

Rules:
- name must exactly match an entry above; never invent entries.
- If nothing matches, return an empty matches array and explain in summary.
- No text, markdown, or code fences outside the JSON.`;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

/* 从模型输出里抠出 JSON。8B 模型偶尔会包代码围栏或前后带话，这里做容错。 */
function parseModelJson(text) {
  if (!text) return null;
  let s = String(text).trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start >= 0 && end > start) s = s.slice(start, end + 1);
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/* 模型给的 name 回填成完整条目。找不到就丢弃，绝不透传模型编造的字段。 */
function hydrate(matches) {
  const byName = new Map(ENTRIES.map((e) => [e.name, e]));
  const out = [];
  const seen = new Set();
  for (const m of matches || []) {
    const name = m && typeof m.name === 'string' ? m.name.trim() : '';
    const e = byName.get(name);
    if (!e || seen.has(name)) continue;
    seen.add(name);
    out.push({ ...e, reason: typeof m.reason === 'string' ? m.reason : '' });
    if (out.length >= MAX_MATCHES) break;
  }
  return out;
}

async function handleSearch(request, env, origin) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: '请求体必须是 JSON' }, 400, origin);
  }

  const q = typeof payload.q === 'string' ? payload.q.trim() : '';
  if (!q) return json({ error: 'q 不能为空' }, 400, origin);
  if (q.length > MAX_QUERY_LEN) return json({ error: `查询过长（上限 ${MAX_QUERY_LEN} 字）` }, 400, origin);
  const lang = payload.lang === 'en' ? 'en' : 'zh';

  const t0 = Date.now();
  let aiRes;
  try {
    aiRes = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: lang === 'en' ? SYSTEM_EN : SYSTEM_ZH },
        { role: 'user', content: q },
      ],
      max_tokens: 700,
      temperature: 0.2,
    });
  } catch (err) {
    return json({ error: '模型调用失败', detail: String(err && err.message || err) }, 502, origin);
  }

  const parsed = parseModelJson(aiRes && aiRes.response);
  if (!parsed) {
    return json({ error: '模型返回无法解析', raw: String(aiRes && aiRes.response || '').slice(0, 500) }, 502, origin);
  }

  return json({
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    matches: hydrate(parsed.matches),
    model: MODEL,
    ms: Date.now() - t0,
  }, 200, origin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const reqOrigin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '*';
    /* 允许配置域名 + localhost 调试；* 时全放行 */
    const originOk = allowed === '*' || reqOrigin === allowed ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(reqOrigin);
    const origin = originOk ? reqOrigin : allowed;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === '/health' && request.method === 'GET') {
      return json({ ok: true, entries: ENTRIES.length, model: MODEL, updated: DATA.updated || '' }, 200, origin);
    }

    if (url.pathname === '/search' && request.method === 'POST') {
      if (!originOk) return json({ error: 'Origin 不被允许' }, 403, origin);
      return handleSearch(request, env, origin);
    }

    return json({ error: 'Not found', endpoints: ['POST /search', 'GET /health'] }, 404, origin);
  },
};
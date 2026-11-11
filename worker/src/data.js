/* 生成文件，别手改 —— 真源是 github.com/AISecpedia/AISecDB 的 entries.json。
 * 重新生成：node scripts/sync-data.js [--local <path>]
 */
export const DATA = {
  "updated": "2026-10-21",
  "sections": [
    {
      "key": "companies",
      "zh": "AI 安全公司",
      "en": "Companies",
      "color": "#F72585",
      "desc": "做 AI 安全产品的商业公司。按防护面看：模型层、推理层、Agent 层，三层各有玩家。",
      "desc_en": "Commercial vendors, grouped by where they sit: the model layer, the inference layer, or the agent layer."
    },
    {
      "key": "opensource",
      "zh": "开源项目",
      "en": "Open Source",
      "color": "#8338EC",
      "desc": "能自己跑起来的工具。数据与 Scanners-Box 每日推荐同源，star 数取自 GitHub。",
      "desc_en": "Tools you can run yourself. Same source as the Scanners-Box daily column; star counts come from GitHub."
    },
    {
      "key": "articles",
      "zh": "文章与专栏",
      "en": "Articles",
      "color": "#06D6A0",
      "desc": "值得读的深度内容：技术拆解、威胁分析、行业报告。不收新闻稿。",
      "desc_en": "Long-form worth reading: technical teardowns, threat analysis, industry reports. No press releases."
    },
    {
      "key": "resources",
      "zh": "标准与数据集",
      "en": "Standards & Datasets",
      "color": "#FB5607",
      "desc": "框架、威胁矩阵、评测集 —— 写方案和做检测时绕不开的那几份。",
      "desc_en": "Frameworks, threat matrices and eval sets — the handful you cannot avoid when writing a plan or building detections."
    }
  ],
  "entries": [
    {
      "name": "Protect AI",
      "url": "https://protectai.com",
      "section": "companies",
      "logo": "assets/logos/org-protectai.png",
      "region": "US",
      "status": "featured",
      "tags": [
        "模型安全",
        "LLM 防护"
      ],
      "desc": "模型扫描 + LLM 运行时防护的 AI/ML 安全平台。少数自己写开源工具的厂商：llm-guard、rebuff 都出自这里。",
      "desc_en": "Model scanning plus LLM runtime protection. One of the few vendors that ships its own open source: llm-guard and rebuff both came out of here.",
      "added": "2026-10-21"
    },
    {
      "name": "Zenity",
      "url": "https://zenity.io",
      "section": "companies",
      "logo": "assets/logos/zenity-io.ico",
      "region": "IL",
      "status": "featured",
      "tags": [
        "Agent 管控",
        "Copilot"
      ],
      "desc": "从 Copilot / Power Platform 起家的 Agent 安全，把企业里成百上千个 agent 当成一个新攻击面来管。",
      "desc_en": "Agent security that started with Copilot and the Power Platform, treating the hundreds of agents inside an enterprise as one new attack surface.",
      "added": "2026-10-21"
    },
    {
      "name": "瑞莱智慧 RealAI",
      "url": "https://www.realai.ai",
      "section": "companies",
      "logo": "assets/logos/realai-ai.ico",
      "region": "CN",
      "status": "featured",
      "tags": [
        "对抗攻防",
        "模型安全"
      ],
      "desc": "清华背景，做对抗攻防与 AI 基础设施安全，国内少数把对抗样本研究真正做成产品的团队。",
      "desc_en": "Out of Tsinghua; adversarial attack and defense plus AI infrastructure security. One of the few Chinese teams that turned adversarial-example research into a product.",
      "added": "2026-10-21"
    },
    {
      "name": "Lakera",
      "url": "https://www.lakera.ai",
      "section": "companies",
      "logo": "assets/logos/lakera-ai.png",
      "region": "CH",
      "tags": [
        "提示注入",
        "LLM 防护"
      ],
      "desc": "从提示注入检测起家（Lakera Guard）。Gandalf 那个让上百万人试着越狱的小游戏就是他们做的。",
      "desc_en": "Started with prompt-injection detection (Lakera Guard). They also made Gandalf, the game that got a million people attempting jailbreaks.",
      "added": "2026-10-21"
    },
    {
      "name": "HiddenLayer",
      "url": "https://hiddenlayer.com",
      "section": "companies",
      "logo": "assets/logos/hiddenlayer-com.png",
      "region": "US",
      "tags": [
        "模型安全",
        "MLDR"
      ],
      "desc": "MLDR（机器学习检测与响应）的提出者，主打模型扫描：把恶意模型文件当样本查。",
      "desc_en": "Coined MLDR (machine learning detection and response). Their focus is model scanning — treating a malicious model file as the sample.",
      "added": "2026-10-21"
    },
    {
      "name": "Robust Intelligence",
      "url": "https://www.robustintelligence.com",
      "section": "companies",
      "region": "US",
      "tags": [
        "AI 防火墙",
        "红队"
      ],
      "desc": "AI Firewall + 算法红队，偏合规与大模型上线前的系统性验证。",
      "desc_en": "AI Firewall plus algorithmic red teaming, leaning toward compliance and systematic pre-deployment validation.",
      "added": "2026-10-21"
    },
    {
      "name": "CalypsoAI",
      "url": "https://calypsoai.com",
      "section": "companies",
      "region": "US",
      "tags": [
        "推理安全",
        "Agent 管控"
      ],
      "desc": "推理安全平台，把扫描器、护栏、Agent 管控编排成一整套推理层。",
      "desc_en": "An inference-security platform that orchestrates scanners, guardrails and agent controls into one inference layer.",
      "added": "2026-10-21"
    },
    {
      "name": "Prompt Security",
      "url": "https://www.prompt.security",
      "section": "companies",
      "logo": "assets/logos/prompt-security.png",
      "region": "IL",
      "tags": [
        "网关",
        "影子 AI"
      ],
      "desc": "GenAI 安全网关，覆盖面从员工偷偷用 ChatGPT 到企业自研应用，影子 AI 是它的切入点。",
      "desc_en": "A GenAI security gateway spanning employees using ChatGPT on the side all the way to in-house apps; shadow AI is the wedge.",
      "added": "2026-10-21"
    },
    {
      "name": "Noma Security",
      "url": "https://www.nomasecurity.com",
      "section": "companies",
      "logo": "assets/logos/nomasecurity-com.png",
      "region": "IL",
      "tags": [
        "Agent 管控",
        "全生命周期"
      ],
      "desc": "AI 与 Agent 的全生命周期安全：数据、模型、应用、agent，SDLC 两端都管。",
      "desc_en": "Full-lifecycle AI and agent security — data, models, applications and agents, covering both ends of the SDLC.",
      "added": "2026-10-21"
    },
    {
      "name": "Lasso Security",
      "url": "https://www.lasso.security",
      "section": "companies",
      "logo": "assets/logos/lasso-security.png",
      "region": "IL",
      "tags": [
        "网关",
        "MCP"
      ],
      "desc": "GenAI 与 MCP 网关，思路是给 agent 的工具调用装一层代理。",
      "desc_en": "GenAI and MCP gateway; the idea is to put a proxy in front of an agent's tool calls.",
      "added": "2026-10-21"
    },
    {
      "name": "Operant AI",
      "url": "https://operant.ai",
      "section": "companies",
      "logo": "assets/logos/operant-ai.png",
      "region": "US",
      "tags": [
        "运行时管控",
        "MCP"
      ],
      "desc": "Kubernetes 运行时出身，现在做 Agentic AI 与 MCP 流量的在环防护。",
      "desc_en": "Came out of Kubernetes runtime protection; now does inline defense for agentic AI and MCP traffic.",
      "added": "2026-10-21"
    },
    {
      "name": "Aporia",
      "url": "https://www.aporia.com",
      "section": "companies",
      "region": "IL",
      "tags": [
        "可观测",
        "护栏"
      ],
      "desc": "ML 可观测与护栏，偏生产环境的模型监控加 LLM 输出拦截。",
      "desc_en": "ML observability and guardrails, focused on production model monitoring plus LLM output blocking.",
      "added": "2026-10-21"
    },
    {
      "name": "Fiddler AI",
      "url": "https://www.fiddler.ai",
      "section": "companies",
      "logo": "assets/logos/fiddler-ai.png",
      "region": "US",
      "tags": [
        "可观测",
        "评估"
      ],
      "desc": "LLM/ML 可观测与评估平台，强项是把模型表现和安全事件放进同一个看板。",
      "desc_en": "An LLM/ML observability and evaluation platform; its strength is putting model behaviour and security events on one dashboard.",
      "added": "2026-10-21"
    },
    {
      "name": "Arthur AI",
      "url": "https://www.arthur.ai",
      "section": "companies",
      "region": "US",
      "tags": [
        "护栏",
        "评估"
      ],
      "desc": "Arthur Shield 做运行时防护，Arthur Bench 做模型对比评估。",
      "desc_en": "Arthur Shield for runtime protection, Arthur Bench for model comparison and evaluation.",
      "added": "2026-10-21"
    },
    {
      "name": "Knostic",
      "url": "https://www.knostic.ai",
      "section": "companies",
      "logo": "assets/logos/knostic-ai.svg",
      "region": "US",
      "tags": [
        "RAG",
        "访问控制"
      ],
      "desc": "RAG 与知识库的最小权限访问控制，解决「检索把不该看的文档喂给了模型」。",
      "desc_en": "Least-privilege access control for RAG and knowledge bases — fixing the case where retrieval hands the model a document it should never see.",
      "added": "2026-10-21"
    },
    {
      "name": "Straiker",
      "url": "https://straiker.ai",
      "section": "companies",
      "logo": "assets/logos/straiker-ai.jpg",
      "region": "US",
      "tags": [
        "红队",
        "运行时管控"
      ],
      "desc": "GenAI 红队 + 运行时防护一体，从上线前评测到上线后拦截。",
      "desc_en": "GenAI red teaming and runtime protection in one, from pre-deployment evaluation to post-deployment blocking.",
      "added": "2026-10-21"
    },
    {
      "name": "mcp-scanner",
      "url": "https://github.com/cisco-ai-defense/mcp-scanner",
      "section": "opensource",
      "logo": "assets/logos/org-cisco-ai-defense.png",
      "star": 1094,
      "github": "cisco-ai-defense/mcp-scanner",
      "tags": [
        "智能体审计"
      ],
      "desc": "Cisco 开源的 MCP 服务器安检：YARA + LLM + AI Defense 三引擎并联，共 9 个分析器；最值钱的是报告纪律——扫描没跑完 is_safe 返回 None，不许说安全",
      "desc_en": "Cisco's open-source security screening for MCP servers — YARA + LLM + AI Defense in parallel, nine analyzers; the real prize is the reporting discipline: an unfinished scan returns is_safe=None, never \"safe\"",
      "post": "https://we5ter.github.io/ai-tools/mcp-scanner/",
      "added": "2026-10-19"
    },
    {
      "name": "agent-sandbox",
      "url": "https://github.com/kubernetes-sigs/agent-sandbox",
      "section": "opensource",
      "logo": "assets/logos/org-kubernetes-sigs.png",
      "star": 4270,
      "github": "kubernetes-sigs/agent-sandbox",
      "tags": [
        "运行时管控"
      ],
      "desc": "Kubernetes SIG Apps 官方出品：把「一个长期活着、有稳定名字、带自己磁盘的单容器」补成 Sandbox 这层 API，隔离一行代码都不自己写，全交给 gVisor / Kata",
      "desc_en": "Official Kubernetes SIG Apps project: turns \"one long-lived container with a stable name and its own disk\" into a first-class API — and writes zero isolation code itself, delegating it all to gVisor / Kata",
      "post": "https://we5ter.github.io/ai-tools/agent-sandbox/",
      "added": "2026-10-16"
    },
    {
      "name": "h5i",
      "url": "https://github.com/h5i-dev/h5i",
      "section": "opensource",
      "logo": "assets/logos/org-h5i-dev.png",
      "star": 775,
      "github": "h5i-dev/h5i",
      "tags": [
        "Agent 工具箱"
      ],
      "desc": "把 Burp 那一层重做成 Agent 原生工作台：浏览器驱动 + 抓包改包重放 + 沙箱 box + Lean 4 形式化验证，纪律条款编译进二进制",
      "desc_en": "The Burp layer rebuilt as an agent-native workbench — browser driving, HTTP capture/tamper/replay, sandbox boxes and Lean 4 proofs, with the discipline compiled into the binary",
      "post": "https://we5ter.github.io/ai-tools/h5i/",
      "added": "2026-10-14"
    },
    {
      "name": "LLMFuzzer",
      "url": "https://github.com/mnns/LLMFuzzer",
      "section": "opensource",
      "logo": "assets/logos/org-mnns.jpg",
      "star": 383,
      "github": "mnns/LLMFuzzer",
      "tags": [
        "智能体审计"
      ],
      "desc": "自称「首个 LLM 模糊测试框架」的 100 行 PoC：其实不 fuzz、无模型在环，判定靠子串匹配——但那个确定性 oracle 是整类注入检测的地基",
      "desc_en": "A 100-line PoC self-billed as \"the first LLM fuzzing framework\" — it doesn't fuzz, no model in the loop, verdict is a substring match; but that deterministic oracle is the foundation of the whole injection-detection class",
      "post": "https://we5ter.github.io/ai-tools/llmfuzzer/",
      "added": "2026-10-13"
    },
    {
      "name": "Cloudflare security-audit-skill",
      "url": "https://github.com/cloudflare/security-audit-skill",
      "section": "opensource",
      "logo": "assets/logos/org-cloudflare.jpg",
      "star": 22616,
      "github": "cloudflare/security-audit-skill",
      "tags": [
        "自主漏洞发现"
      ],
      "desc": "Cloudflare 官方的 coding-agent skill：6 阶段编排，查 findings 的 agent 永远不是发现它的那个 agent",
      "desc_en": "Cloudflare's official coding-agent skill: a six-phase orchestration where the agent verifying a finding is never the agent that found it",
      "post": "https://we5ter.github.io/ai-tools/cloudflare-security-audit-skill/",
      "added": "2026-10-07"
    },
    {
      "name": "Cisco Skill Scanner",
      "url": "https://github.com/cisco-ai-defense/skill-scanner",
      "section": "opensource",
      "logo": "assets/logos/org-cisco-ai-defense.png",
      "star": 2561,
      "github": "cisco-ai-defense/skill-scanner",
      "tags": [
        "Skills 审计"
      ],
      "desc": "Cisco AI Defense 的 skill 扫描器：9 个分析引擎 + cel-go 类型化决策层，敢把 7.75% 召回率原样写进 README",
      "desc_en": "Cisco AI Defense's skill scanner: nine analysis engines over a typed cel-go decision layer, brave enough to publish a 7.75% recall in its README",
      "post": "https://we5ter.github.io/ai-tools/cisco-skill-scanner/",
      "added": "2026-10-06"
    },
    {
      "name": "NVIDIA SkillSpector",
      "url": "https://github.com/NVIDIA/SkillSpector",
      "section": "opensource",
      "logo": "assets/logos/org-nvidia.png",
      "star": 18488,
      "github": "NVIDIA/SkillSpector",
      "tags": [
        "Skills 审计"
      ],
      "desc": "回答「这个 skill 装了安全吗」：71 个漏洞模式 × 17 类别，静态 + 可选 LLM 语义两阶段，SARIF 直接进 CI",
      "desc_en": "Answers \"is this skill safe to install?\": 71 vulnerability patterns across 17 categories, static plus optional LLM semantic analysis, SARIF straight into CI",
      "post": "https://we5ter.github.io/ai-tools/skillspector/",
      "added": "2026-10-05"
    },
    {
      "name": "Rebuff",
      "url": "https://github.com/protectai/rebuff",
      "section": "opensource",
      "logo": "assets/logos/org-protectai.png",
      "star": 1522,
      "github": "protectai/rebuff",
      "tags": [
        "智能体审计"
      ],
      "desc": "prompt injection 防御史上的绕不开的一章：canary token 检测 + 向量库自我加固的四层防线（仓库已归档，按史料读）",
      "desc_en": "An unavoidable chapter in prompt-injection defense history: canary-token detection plus vector-store self-hardening across four layers (archived — read it as history)",
      "post": "https://we5ter.github.io/ai-tools/rebuff/",
      "added": "2026-10-04"
    },
    {
      "name": "garak",
      "url": "https://github.com/NVIDIA/garak",
      "section": "opensource",
      "logo": "assets/logos/org-nvidia.png",
      "star": 9373,
      "github": "NVIDIA/garak",
      "tags": [
        "LLM 漏扫"
      ],
      "desc": "NVIDIA 的 LLM 漏洞扫描器：懂 nmap / Metasploit 的话，garak 对 LLM 干的是差不多的事",
      "desc_en": "NVIDIA's LLM vulnerability scanner: if you know nmap / Metasploit, garak does roughly the same thing to LLMs",
      "post": "https://we5ter.github.io/ai-tools/garak/",
      "added": "2026-10-03"
    },
    {
      "name": "Vigolium",
      "url": "https://github.com/vigolium/vigolium",
      "section": "opensource",
      "logo": "assets/logos/org-vigolium.jpg",
      "star": 1085,
      "github": "vigolium/vigolium",
      "tags": [
        "LLM 漏扫"
      ],
      "desc": "双引擎漏洞扫描器：208 主动 + 117 被动 Native 模块打底，Go 版 agentic 运行时（Autopilot / Swarm）在上",
      "desc_en": "A dual-engine vulnerability scanner: 208 active + 117 passive native modules underneath, a Go agentic runtime (Autopilot / Swarm) on top",
      "post": "https://we5ter.github.io/ai-tools/vigolium/",
      "added": "2026-10-02"
    },
    {
      "name": "deepsec",
      "url": "https://github.com/vercel-labs/deepsec",
      "section": "opensource",
      "logo": "assets/logos/org-vercel-labs.png",
      "star": 8044,
      "github": "vercel-labs/deepsec",
      "tags": [
        "LLM 漏扫"
      ],
      "desc": "Vercel Labs 的 agent 驱动漏洞扫描器：不扫 diff、不扫增量，对存量大型仓库做一次全量深挖",
      "desc_en": "Vercel Labs' agent-driven vulnerability scanner: no diffs, no increments — one full-depth audit of an existing large codebase",
      "post": "https://we5ter.github.io/ai-tools/deepsec/",
      "added": "2026-10-01"
    },
    {
      "name": "Dark-Moon",
      "url": "https://github.com/ASCIT31/Dark-Moon",
      "section": "opensource",
      "logo": "assets/logos/org-ascit31.jpg",
      "star": 975,
      "github": "ASCIT31/Dark-Moon",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "把真实 IP / 主机 / URL / 凭证在本地换成确定性占位符、只在工具执行那一刻还原：50 个专家 agent + 140+ 真实工具的自主渗透平台",
      "desc_en": "Real IPs, hosts, URLs and credentials become deterministic local placeholders, restored only at tool-execution time: an autonomous pentest platform with 50 specialist agents and 140+ real tools",
      "post": "https://we5ter.github.io/ai-tools/dark-moon/",
      "added": "2026-09-30"
    },
    {
      "name": "LuaN1ao",
      "url": "https://github.com/SanMuzZzZz/LuaN1aoAgent",
      "section": "opensource",
      "logo": "assets/logos/org-sanmuzzzzz.jpg",
      "star": 1316,
      "github": "SanMuzZzZz/LuaN1aoAgent",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "把每条渗透结论钉回证据链：P-E-O 三角色 + 三图分离 + Evidence→Hypothesis→Vulnerability→Exploit 因果链",
      "desc_en": "Pinning every pentest finding to evidence: Planner-Executor-Observer roles + three graph separations + an enforced Evidence → Hypothesis → Vulnerability → Exploit chain",
      "post": "https://we5ter.github.io/ai-tools/luan1ao-agent/",
      "added": "2026-09-29"
    },
    {
      "name": "Agent Governance Toolkit",
      "url": "https://github.com/microsoft/agent-governance-toolkit",
      "section": "opensource",
      "logo": "assets/logos/org-microsoft.png",
      "star": 6352,
      "github": "microsoft/agent-governance-toolkit",
      "tags": [
        "运行时管控"
      ],
      "desc": "微软开源的 AI Agent 运行时管控套件：把「请 AI 守规矩」换成「让 AI 没法不守规矩」",
      "desc_en": "Microsoft's runtime governance suite for AI agents: from \"asking AI to behave\" to \"making it structurally incapable of misbehaving\"",
      "post": "https://we5ter.github.io/ai-tools/agent-governance-toolkit/",
      "added": "2026-09-28"
    },
    {
      "name": "AgentShield",
      "url": "https://github.com/affaan-m/agentshield",
      "section": "opensource",
      "logo": "assets/logos/org-affaan-m.jpg",
      "star": 1232,
      "github": "affaan-m/agentshield",
      "tags": [
        "智能体审计"
      ],
      "desc": "Claude Code 黑客松作品 / Everything Claude Code 生态：把 AI Agent 配置审计做成 0–100 分、可上 CI 的合规工具",
      "desc_en": "A Claude Code Hackathon project from the Everything Claude Code ecosystem: a 0–100 graded audit of AI agent configurations that drops into CI as a compliance gate",
      "post": "https://we5ter.github.io/ai-tools/agentshield/",
      "added": "2026-09-27"
    },
    {
      "name": "AI-Infra-Guard",
      "url": "https://github.com/Tencent/AI-Infra-Guard",
      "section": "opensource",
      "logo": "assets/logos/org-tencent.png",
      "star": 6623,
      "github": "Tencent/AI-Infra-Guard",
      "tags": [
        "智能体审计"
      ],
      "desc": "腾讯朱雀实验室的全栈 AI 红队平台：五层能力覆盖 AI 基础设施 CVE、Agent 失控、MCP 供应链、Skill 后门与越狱评测",
      "desc_en": "A full-stack AI red teaming platform from Tencent Zhuque Lab: five capabilities spanning AI infrastructure CVEs, agent loss of control, the MCP supply chain, skill backdoors and jailbreak evaluation",
      "post": "https://we5ter.github.io/ai-tools/ai-infra-guard/",
      "added": "2026-09-24"
    },
    {
      "name": "NVIDIA OpenShell",
      "url": "https://github.com/NVIDIA/OpenShell",
      "section": "opensource",
      "logo": "assets/logos/org-nvidia.png",
      "star": 9087,
      "github": "NVIDIA/OpenShell",
      "tags": [
        "运行时管控"
      ],
      "desc": "面向自主 AI Agent 的安全私有运行时：用声明式 YAML 策略在文件系统、网络、进程、凭证四个维度设界，凭证只在策略放行后注入授权端点",
      "desc_en": "A safe, private runtime for autonomous AI agents: declarative YAML policies enforce boundaries across filesystem, network, process and provider access, and credentials only flow into policy-admitted endpoints",
      "post": "https://we5ter.github.io/ai-tools/openshell-nvidia-agent-runtime/",
      "added": "2026-09-22"
    },
    {
      "name": "PentAGI",
      "url": "https://github.com/vxcontrol/pentagi",
      "section": "opensource",
      "logo": "assets/logos/org-vxcontrol.png",
      "star": 25071,
      "github": "vxcontrol/pentagi",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "全自主渗透平台：Docker 沙箱里跑 20+ 工具，13 个 agent 角色分工，四道闸门防止跑飞",
      "desc_en": "A fully autonomous pentesting platform: 20+ tools in a Docker sandbox, 13 specialized agent roles, and four supervision gates to stop runaway runs",
      "post": "https://we5ter.github.io/ai-tools/pentagi-autonomous-pentest-platform/",
      "added": "2026-09-21"
    },
    {
      "name": "Cairn",
      "url": "https://github.com/oritera/Cairn",
      "section": "opensource",
      "logo": "assets/logos/org-oritera.png",
      "star": 3124,
      "github": "oritera/Cairn",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "通用状态空间搜索引擎：不定义角色与工作流，给起点和终点，让 Agent 在黑板上自己搜路",
      "desc_en": "A general state-space search engine: no roles, no workflows — hand it an origin and a goal and let agents find the path on a shared blackboard",
      "post": "https://we5ter.github.io/ai-tools/cairn-state-space-search/",
      "added": "2026-09-20"
    },
    {
      "name": "Shannon",
      "url": "https://github.com/KeygraphHQ/shannon",
      "section": "opensource",
      "logo": "assets/logos/org-keygraphhq.png",
      "star": 48455,
      "github": "KeygraphHQ/shannon",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "AI 渗透测试 Agent：读源码找攻击面，再真打一遍验证，只有跑通 PoC 的漏洞才进报告",
      "desc_en": "An AI pentesting agent: read the source, map attack paths, then prove every finding with a real exploit — no PoC, no report.",
      "post": "https://we5ter.github.io/ai-tools/shannon-ai-pentester/",
      "added": "2026-09-19"
    },
    {
      "name": "CyberStrikeAI",
      "url": "https://github.com/AIPentest/CyberStrikeAI",
      "section": "opensource",
      "logo": "assets/logos/org-aipentest.png",
      "star": 7074,
      "github": "AIPentest/CyberStrikeAI",
      "tags": [
        "自主渗透智能体"
      ],
      "desc": "AI 原生的安全执行中枢：把自然语言意图转成受治理的行动，并把证据沉淀成可复用的运营记忆",
      "desc_en": "An AI-native security execution hub: turns natural-language intent into governed action and bakes evidence into reusable operational memory.",
      "post": "https://we5ter.github.io/ai-tools/cyberstrikeai-ai-native-security-hub/",
      "added": "2026-09-18"
    },
    {
      "name": "Scanners-Box 每日 AI 工具推荐",
      "url": "https://we5ter.github.io/ai-tools/",
      "section": "articles",
      "logo": "assets/logos/we5ter-github-io.png",
      "status": "featured",
      "tags": [
        "专栏",
        "工具拆解"
      ],
      "desc": "本站的姊妹专栏：每天一个 AI 安全工具，读完源码再写的技术拆解，不是新闻搬运。",
      "desc_en": "The sister column of this site: one AI security tool a day, written after reading the source, not a news digest.",
      "added": "2026-10-21"
    },
    {
      "name": "OWASP Top 10 for LLM Applications",
      "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
      "section": "articles",
      "logo": "assets/logos/owasp-org.svg",
      "tags": [
        "标准",
        "清单"
      ],
      "desc": "LLM 应用十大风险的官方清单，写方案和做检测时的通用词汇表。",
      "desc_en": "The official top-ten risk list for LLM applications — the shared vocabulary for writing plans and building detections.",
      "added": "2026-10-21"
    },
    {
      "name": "MITRE ATLAS",
      "url": "https://atlas.mitre.org/",
      "section": "articles",
      "logo": "assets/logos/atlas-mitre-org.png",
      "tags": [
        "威胁矩阵",
        "知识库"
      ],
      "desc": "把 ATT&CK 的方法论搬到 AI 系统上的攻击知识库，附真实案例。",
      "desc_en": "An adversarial threat knowledge base that moves the ATT&CK methodology onto AI systems, with real case studies.",
      "added": "2026-10-21"
    },
    {
      "name": "Simon Willison · Prompt Injection",
      "url": "https://simonwillison.net/tags/prompt-injection/",
      "section": "articles",
      "logo": "assets/logos/simonwillison-net.ico",
      "tags": [
        "博客",
        "提示注入"
      ],
      "desc": "提示注入领域最持续的独立记录，几乎每个新绕过手法都有他的分析。",
      "desc_en": "The most sustained independent record of prompt injection; nearly every new bypass gets an analysis here.",
      "added": "2026-10-21"
    },
    {
      "name": "Google SAIF",
      "url": "https://saif.google/",
      "section": "articles",
      "logo": "assets/logos/saif-google.ico",
      "tags": [
        "框架",
        "大厂"
      ],
      "desc": "Google 的 Securing AI Framework：风险清单加成熟度自评。",
      "desc_en": "Google's Securing AI Framework — a risk inventory plus a maturity self-assessment.",
      "added": "2026-10-21"
    },
    {
      "name": "NIST AI RMF",
      "url": "https://www.nist.gov/itl/ai-risk-management-framework",
      "section": "articles",
      "logo": "assets/logos/nist-gov.ico",
      "tags": [
        "框架",
        "合规"
      ],
      "desc": "美国官方的 AI 风险管理框架，合规语境下绕不开。",
      "desc_en": "The official US AI risk management framework; unavoidable in any compliance conversation.",
      "added": "2026-10-21"
    },
    {
      "name": "人工智能安全治理框架 3.0",
      "url": "https://www.tc260.org.cn/",
      "section": "articles",
      "logo": "assets/logos/tc260-org-cn.ico",
      "region": "CN",
      "tags": [
        "框架",
        "合规"
      ],
      "desc": "全国网安标委发布的国内 AI 安全治理框架，中文合规的基准文本。",
      "desc_en": "China's AI security governance framework from TC260 — the baseline document for Chinese compliance work.",
      "added": "2026-10-21"
    },
    {
      "name": "AI 安全威胁矩阵",
      "url": "https://aisecmatrix.org/",
      "section": "articles",
      "region": "CN",
      "tags": [
        "威胁矩阵"
      ],
      "desc": "按威胁类型组织的 AI 安全威胁矩阵站点。",
      "desc_en": "An AI security threat matrix site organised by threat type.",
      "added": "2026-10-21"
    },
    {
      "name": "HarmBench",
      "url": "https://www.harmbench.org/",
      "section": "resources",
      "logo": "assets/logos/harmbench-org.png",
      "status": "featured",
      "tags": [
        "评测集",
        "红队"
      ],
      "desc": "自动化红队的标准评测框架，做越狱与攻防对比时的事实基准。",
      "desc_en": "The standard evaluation framework for automated red teaming, and the de facto baseline for jailbreak and attack comparisons.",
      "added": "2026-10-21"
    },
    {
      "name": "PromptBench",
      "url": "https://github.com/microsoft/promptbench",
      "section": "resources",
      "logo": "assets/logos/github-com.svg",
      "tags": [
        "评测集",
        "鲁棒性"
      ],
      "desc": "微软的大模型鲁棒性评测集，覆盖对抗提示与字符级 / 词级 / 句级攻击。",
      "desc_en": "Microsoft's LLM robustness evaluation suite, covering adversarial prompts and character-, word- and sentence-level attacks.",
      "added": "2026-10-21"
    },
    {
      "name": "llm-attacks (GCG)",
      "url": "https://github.com/llm-attacks/llm-attacks",
      "section": "resources",
      "logo": "assets/logos/github-com.svg",
      "tags": [
        "对抗攻击",
        "数据集"
      ],
      "desc": "GCG 对抗后缀攻击的原始实现，也是 AdvBench 数据集的出处。",
      "desc_en": "The original implementation of the GCG adversarial-suffix attack, and where the AdvBench dataset comes from.",
      "added": "2026-10-21"
    },
    {
      "name": "Scanners-Box",
      "url": "https://github.com/We5ter/Scanners-Box",
      "section": "resources",
      "logo": "assets/logos/github-com.svg",
      "tags": [
        "工具集",
        "索引"
      ],
      "desc": "本站作者维护的安全工具集合仓，很多 AI 安全工具的上游索引。",
      "desc_en": "A security tool collection maintained by the author of this site, and the upstream index for many AI security tools.",
      "added": "2026-10-21"
    },
    {
      "name": "CVE 档案",
      "url": "https://we5ter.github.io/cve/",
      "section": "resources",
      "logo": "assets/logos/we5ter-github-io.png",
      "tags": [
        "漏洞",
        "档案"
      ],
      "desc": "本站的 CVE 案例库，含 AI 相关漏洞的复盘。",
      "desc_en": "This site's CVE case files, including write-ups of AI-related vulnerabilities.",
      "added": "2026-10-21"
    }
  ]
};

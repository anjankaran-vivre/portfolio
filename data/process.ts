export interface ProcessStep {
  n: string;
  t: string;
  d: string;
}

export const PROCESS: ProcessStep[] = [
  { n: "01", t: "DISCOVER", d: "We start with the actual problem, not a technology choice." },
  { n: "02", t: "ARCHITECT", d: "System boundaries, data model and integration points get designed before code." },
  { n: "03", t: "DESIGN", d: "Interfaces are shaped around how people will really use the system." },
  { n: "04", t: "BUILD", d: "Frontend, backend and data layer are built as one coherent product." },
  { n: "05", t: "INTEGRATE", d: "APIs, services, CRMs and tools are wired into a single flow." },
  { n: "06", t: "AUTOMATE", d: "Manual steps become triggers, workflows and scheduled actions." },
  { n: "07", t: "INTELLIGENT", d: "Where reasoning adds real value, an agent or model is layered in." },
  { n: "08", t: "DEPLOY", d: "Shipped to production, monitored, and handed over ready to use." },
];

export const ASSISTANT_KB = [
  {
    k: ["build", "what do you", "capabilities", "do you do"],
    a: "PRAXEN builds complete digital systems: full-stack products, AI/ML systems, AI agents, agentic workflows, business automation, WhatsApp automation and API integrations — end to end, from interface to deployment.",
  },
  {
    k: ["pritam", "pritam routh"],
    a: "Pritam Routh is the AI / ML Engineer — agents, LLM applications, RAG, tool calling and agentic systems, with backend and API work as part of the same build. His map: DATA → MODEL → LLM → AGENT → TOOLS → API → WORKFLOW → ACTION.",
  },
  {
    k: ["anjan", "anjan karan"],
    a: "Anjan Karan is the Full-Stack Engineer — frontend, backend, databases, APIs, integrations and product automation. His map: INTERFACE → FRONTEND → API → BACKEND → DATABASE → INTEGRATION → AUTOMATION → PRODUCT.",
  },
  {
    k: ["ai agent", "ai agents", "what ai", "agents"],
    a: "We build agents that reason, access knowledge, use tools and execute actions — plus multi-step agentic workflows. The Agent Lab section shows one live: click a tool and watch the agent call it.",
  },
  {
    k: ["whatsapp", "automate whatsapp"],
    a: "WhatsApp automation end to end: CUSTOMER → WHATSAPP → AI → BUSINESS LOGIC → CRM → DATABASE → HUMAN HANDOFF when needed. Try the WhatsApp demo in Systems In Motion.",
  },
  {
    k: ["automation", "automate", "workflow"],
    a: "We turn manual business processes into automated workflows — CRM updates, lead scoring, notifications, follow-ups and orchestration across APIs. Run the Lead Automation demo to watch one execute.",
  },
  {
    k: ["full-stack", "fullstack", "frontend", "backend"],
    a: "Full-stack: React, Next.js, TypeScript on the front; Node.js, Python, APIs, SQL/NoSQL and vector databases behind — built as one product, not disconnected layers.",
  },
  {
    k: ["tech", "stack", "technolog", "use"],
    a: "Frontend: React, Next.js, TypeScript. Backend: Node.js, Python, APIs. Database: SQL, NoSQL, vector databases. AI/ML: LLMs, RAG, ML, embeddings. Agents: tool calling, agentic workflows. Automation: webhooks, WhatsApp, CRM, workflow engines. Infra: cloud, Docker, CI/CD.",
  },
  {
    k: ["system", "architecture", "explain"],
    a: "Every system we build follows one pattern: request enters through any channel → interface → application → API → backend → database → AI/agent → automation → action. The Systems section maps the full capabilities visually.",
  },
  {
    k: ["project", "case", "work"],
    a: "See the Work and Systems sections for our approach, and the case studies under Projects — each one walks Problem → Architecture → Build → AI → Automation → Integration → Result.",
  },
  {
    k: ["contact", "hire", "start", "reach", "project"],
    a: "Head to the contact section at the bottom of the page, or hit BUILD WITH US in the navigation to start a conversation.",
  },
  {
    k: ["team", "who", "two", "studio"],
    a: "PRAXEN is a two-person technology studio — Pritam Routh (AI / ML Engineer) × Anjan Karan (Full-Stack Engineer). Shared capabilities: backend, APIs, full-stack, architecture and automation.",
  },
  {
    k: ["hello", "hi", "hey", "what"],
    a: "Hey — I'm a small agent demonstration built from this portfolio's own data. Ask about what PRAXEN builds, Pritam, Anjan, AI agents, WhatsApp automation or the stack.",
  },
];

export const ASSISTANT_SUGGESTIONS = [
  "What does PRAXEN build?",
  "Tell me about Pritam.",
  "Tell me about Anjan.",
  "What AI agents can you build?",
  "How can you automate WhatsApp?",
  "Show me your full-stack capabilities.",
  "Explain one of your systems.",
];

export function answerAssistant(q: string): string {
  const lower = q.toLowerCase();
  const hit = ASSISTANT_KB.find((row) => row.k.some((kw) => lower.includes(kw)));
  return hit
    ? hit.a
    : "I only answer from this portfolio's own content — try asking about what PRAXEN builds, Pritam, Anjan, AI agents, WhatsApp automation, or the stack.";
}
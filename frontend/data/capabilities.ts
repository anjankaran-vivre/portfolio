export interface Capability {
  id: string;
  title: string;
  color: string;
  icon: string;
  desc: string;
  flow: string[];
  detail: string;
  tags: string[];
}

export const CAPABILITIES: Capability[] = [
  {
    id: "fullstack",
    title: "Full-Stack Development",
    color: "#4fa98c",
    icon: "layers",
    desc: "Complete digital products from interface to infrastructure.",
    flow: ["UI", "APPLICATION", "API", "BACKEND", "DATABASE", "DEPLOY"],
    detail: "One coherent product — frontend to database, shipped end to end.",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "APIs", "Databases", "Auth", "Deployment"],
  },
  {
    id: "aiml",
    title: "AI / ML",
    color: "#74bb7e",
    icon: "cpu",
    desc: "Machine learning, generative AI and LLM applications.",
    flow: ["DATA", "FEATURES", "MODEL", "LLM", "INFERENCE", "PRODUCT"],
    detail: "Generative AI and LLM applications, wired into real products.",
    tags: ["LLMs", "RAG", "ML", "Embeddings", "AI Pipelines", "Inference"],
  },
  {
    id: "agents",
    title: "AI Agents",
    color: "#74bb7e",
    icon: "bot",
    desc: "Agents that reason, access knowledge, use tools and act.",
    flow: ["USER", "AGENT", "KNOWLEDGE", "TOOLS", "APIS", "ACTION"],
    detail: "Agents that reason, pick the right tool, and act — not scripted replies.",
    tags: ["Reasoning", "Knowledge Access", "Tool Calling", "Action"],
  },
  {
    id: "agentic",
    title: "Agentic Workflows",
    color: "#74bb7e",
    icon: "workflow",
    desc: "Multi-step intelligent workflows combining AI, APIs and logic.",
    flow: ["TRIGGER", "AGENT", "DECISION", "TOOL", "ACTION", "COMPLETE"],
    detail: "AI-orchestrated workflows across APIs, tools and business logic.",
    tags: ["Orchestration", "Decision Logic", "APIs", "Multi-Agent"],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Automation",
    color: "#e3b462",
    icon: "message",
    desc: "WhatsApp + AI + CRM + APIs + database + human handoff.",
    flow: ["CUSTOMER", "WHATSAPP", "AI", "BUSINESS LOGIC", "CRM", "HUMAN HANDOFF"],
    detail: "Customer messages resolved automatically — AI, CRM and human handoff.",
    tags: ["WhatsApp API", "AI", "CRM", "Database", "Human Handoff"],
  },
  {
    id: "integration",
    title: "API & System Integration",
    color: "#4fa98c",
    icon: "server",
    desc: "Connect apps, services, databases, CRMs and platforms.",
    flow: ["SOURCE", "ADAPTER", "API", "MAP", "TARGET", "SYNC"],
    detail: "Every system connected — APIs, CRMs and platforms in one workflow.",
    tags: ["REST", "Webhooks", "CRM", "Third-Party APIs", "Data Sync"],
  },
];
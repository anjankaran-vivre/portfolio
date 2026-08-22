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
    color: "#6c9bff",
    icon: "layers",
    desc: "Complete digital products from interface to infrastructure.",
    flow: ["UI", "APPLICATION", "API", "BACKEND", "DATABASE", "DEPLOY"],
    detail:
      "Frontend + backend + databases + APIs + authentication + deployment — built as one coherent, deployable product, not disconnected layers.",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "APIs", "Databases", "Auth", "Deployment"],
  },
  {
    id: "aiml",
    title: "AI / ML",
    color: "#b98bfa",
    icon: "cpu",
    desc: "Machine learning, generative AI and LLM applications.",
    flow: ["DATA", "FEATURES", "MODEL", "LLM", "INFERENCE", "PRODUCT"],
    detail:
      "Intelligent systems built on modern AI/ML foundations — generative AI, LLM applications and inference wired into real products.",
    tags: ["LLMs", "RAG", "ML", "Embeddings", "AI Pipelines", "Inference"],
  },
  {
    id: "agents",
    title: "AI Agents",
    color: "#b98bfa",
    icon: "bot",
    desc: "Agents that reason, access knowledge, use tools and act.",
    flow: ["USER", "AGENT", "KNOWLEDGE", "TOOLS", "APIS", "ACTION"],
    detail:
      "Reasoning systems that decide what to do, call the right tool, pull the right data and execute — not scripted chat replies.",
    tags: ["Reasoning", "Knowledge Access", "Tool Calling", "Action"],
  },
  {
    id: "agentic",
    title: "Agentic Workflows",
    color: "#b98bfa",
    icon: "workflow",
    desc: "Multi-step intelligent workflows combining AI, APIs and logic.",
    flow: ["TRIGGER", "AGENT", "DECISION", "TOOL", "ACTION", "COMPLETE"],
    detail:
      "Multi-step workflows where AI makes decisions and orchestrates APIs, tools and business logic toward a completed outcome.",
    tags: ["Orchestration", "Decision Logic", "APIs", "Multi-Agent"],
  },
  {
    id: "automation",
    title: "Automation",
    color: "#f2b860",
    icon: "zap",
    desc: "Business process automation and workflow orchestration.",
    flow: ["EVENT", "RULE", "WORKFLOW", "INTEGRATION", "ACTION", "RESULT"],
    detail:
      "Manual processes turned into automated digital workflows — triggers, orchestration and integrations doing the work.",
    tags: ["Workflow Engines", "Webhooks", "Scheduling", "Orchestration"],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Automation",
    color: "#f2b860",
    icon: "message",
    desc: "WhatsApp + AI + CRM + APIs + database + human handoff.",
    flow: ["CUSTOMER", "WHATSAPP", "AI", "BUSINESS LOGIC", "CRM", "HUMAN HANDOFF"],
    detail:
      "Conversational automation from customer message to resolved action — AI, business logic, CRM and human handoff where it matters.",
    tags: ["WhatsApp API", "AI", "CRM", "Database", "Human Handoff"],
  },
  {
    id: "integration",
    title: "API & System Integration",
    color: "#6c9bff",
    icon: "server",
    desc: "Connect apps, services, databases, CRMs and platforms.",
    flow: ["SOURCE", "ADAPTER", "API", "MAP", "TARGET", "SYNC"],
    detail:
      "Applications, services, databases, CRMs, automation platforms and external APIs connected into a single operating workflow.",
    tags: ["REST", "Webhooks", "CRM", "Third-Party APIs", "Data Sync"],
  },
];
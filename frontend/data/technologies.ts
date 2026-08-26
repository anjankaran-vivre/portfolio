export interface TechCategory {
  id: string;
  label: string;
  color: string;
  items: string[];
  description: string;
}

export const STACK: TechCategory[] = [
  {
    id: "frontend",
    label: "FRONTEND",
    color: "#6c9bff",
    description: "Interfaces engineered with modern component systems.",
    items: ["React", "Next.js", "TypeScript"],
  },
  {
    id: "backend",
    label: "BACKEND",
    color: "#6c9bff",
    description: "Services, APIs and application logic.",
    items: ["Node.js", "Python", "APIs"],
  },
  {
    id: "database",
    label: "DATABASE",
    color: "#6c9bff",
    description: "Structured, flexible and semantic storage.",
    items: ["SQL", "NoSQL", "Vector Databases"],
  },
  {
    id: "aiml",
    label: "AI / ML",
    color: "#b98bfa",
    description: "Intelligence layered into real products.",
    items: ["LLMs", "RAG", "ML", "Embeddings"],
  },
  {
    id: "agents",
    label: "AGENTS",
    color: "#b98bfa",
    description: "Reasoning systems that call tools and act.",
    items: ["Tool Calling", "Agentic Workflows", "Multi-Agent Systems"],
  },
  {
    id: "automation",
    label: "AUTOMATION",
    color: "#f2b860",
    description: "Connecting systems so work happens without handoff.",
    items: ["Webhooks", "WhatsApp", "CRM", "Workflow Engines"],
  },
  {
    id: "infrastructure",
    label: "INFRASTRUCTURE",
    color: "#9aa3af",
    description: "Deployment and operations that keep systems live.",
    items: ["Cloud", "Docker", "CI/CD", "Deployment"],
  },
];
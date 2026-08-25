export interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
  initials: string;
  bio: string;
  strengths: string[];
  map: string[];
  overlap: string[];
}

export const TEAM: TeamMember[] = [
  {
    id: "pritam",
    name: "Pritam Routh",
    role: "AI / ML ENGINEER · FULL-STACK & AGENTIC SYSTEMS",
    color: "#b98bfa",
    initials: "PR",
    bio: "Builds intelligent systems that combine AI/ML, generative AI and agentic architecture — models that reason, agents that call tools, workflows that act. Backend, APIs and system architecture are part of the same build.",
    strengths: [
      "AI / ML",
      "Generative AI",
      "LLM Applications",
      "AI Agents",
      "Agentic Workflows",
      "RAG",
      "Tool Calling",
      "Intelligent Automation",
      "AI Integrations",
      "Backend & API Development",
      "Full-Stack Development",
      "System Architecture",
    ],
    map: ["DATA", "MODEL", "LLM", "AGENT", "TOOLS", "API", "WORKFLOW", "BACKEND"],
    overlap: ["Backend", "APIs", "Full-stack", "Architecture", "Automation"],
  },
  {
    id: "anjan",
    name: "Anjan Karan",
    role: "FULL-STACK ENGINEER · PRODUCT & AUTOMATION SYSTEMS",
    color: "#6c9bff",
    initials: "AK",
    bio: "Engineers complete digital products from interface to infrastructure — frontend experiences, backend architecture, databases, APIs, integrations and automation. Turns business needs into production systems.",
    strengths: [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Applications",
      "React / Modern Web",
      "API Development",
      "Database Architecture",
      "System Architecture",
      "Business Applications",
      "Workflow Automation",
      "Integrations",
      "Dashboards",
      "Production Systems",
    ],
    map: ["INTERFACE", "FRONTEND", "API", "BACKEND", "DATABASE", "INTEGRATION", "AUTOMATION", "PRODUCT"],
    overlap: ["Backend", "APIs", "Full-stack", "Architecture", "Automation"],
  },
  {
    id: "manish",
    name: "Manish Das",
    role: "INFRASTRUCTURE & PLATFORM",
    color: "#38bdf8",
    initials: "MD",
    bio: "Focusing on distributed systems, reliability engineering, and core infrastructure scaling.",
    strengths: [
      "Cloud Architecture",
      "Kubernetes",
      "CI/CD",
      "Distributed Systems",
      "Observability",
      "Security / IAM",
      "Database Optimization",
      "Networking",
      "Platform Engineering",
      "Reliability Engineering",
      "Infrastructure as Code",
      "Edge Computing",
    ],
    map: [
      "CLOUD ARCH",
      "K8S",
      "CI/CD",
      "NETWORK",
      "OBSERVABILITY",
      "SECURITY",
      "DB OPTIM",
      "EDGE",
    ],
    overlap: ["Backend", "APIs", "Architecture", "Automation"],
  },
];

export const SHARED_OVERLAP = ["BACKEND", "APIs", "FULL-STACK", "ARCHITECTURE", "AUTOMATION"];
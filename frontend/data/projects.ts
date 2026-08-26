export interface ProjectCase {
  id: string;
  name: string;
  tag: string;
  color: string;
  headline: string;
  problem: string;
  architecture: string[];
  build: string[];
  ai: string;
  automation: string;
  integration: string[];
  result: string;
  stack: string[];
  status: string;
}

export const PROJECTS: ProjectCase[] = [
  {
    id: "ops",
    name: "Intelligent Operations Platform",
    tag: "CONCEPT SYSTEM · PLACEHOLDER CASE",
    color: "#6c9bff",
    headline: "One system where every inbound request reaches resolution.",
    problem:
      "Order status, customer replies and follow-ups were handled manually across spreadsheets and chat threads — no single source of truth, slow responses, and work that disappeared when people were away.",
    architecture: [
      "Next.js dashboard as the operating surface.",
      "TypeScript API layer with typed routes and auth.",
      "Relational database as the system of record.",
      "Workflow engine between the app and third-party services.",
    ],
    build: [
      "Authenticated dashboard with order and customer data models.",
      "Internal API layer that exposes the full product surface.",
      "Sync service that keeps state consistent across tools in real time.",
    ],
    ai: "An agent reads incoming customer messages, classifies intent, and decides whether to answer directly, escalate to a human, or trigger a workflow.",
    automation: "Order updates, follow-up reminders and lead notifications run on triggers instead of manual checks.",
    integration: ["CRM", "Order service", "Notification channels", "Email"],
    result:
      "A request enters through any channel and reaches resolution without a person routing it by hand — the same system serves customers, operators and the business.",
    stack: ["Next.js", "TypeScript", "Postgres", "REST API", "AI Agent", "Workflow Engine"],
    status: "REPRESENTATIVE",
  },
  {
    id: "concierge",
    name: "WhatsApp Sales Concierge",
    tag: "CONCEPT SYSTEM · PLACEHOLDER CASE",
    color: "#b98bfa",
    headline: "Every conversation handled, at every hour, in every channel.",
    problem:
      "Inbound WhatsApp inquiries about products and orders competed with the sales team's actual work, and responses were slow outside business hours.",
    architecture: [
      "WhatsApp Business API in front of an AI agent.",
      "Customer database and order service as truth sources.",
      "CRM as the system of record for every conversation.",
      "Webhook receiver as the single message entry point.",
    ],
    build: [
      "Webhook receiver and message router.",
      "Agent service with tools for orders, knowledge and CRM.",
      "Lightweight review console for the sales team to override agent replies.",
    ],
    ai: "An LLM-based agent handles product questions and order lookups directly, and hands off to a human for anything outside its tools.",
    automation: "Every conversation is logged to the CRM automatically and scored for follow-up priority.",
    integration: ["WhatsApp API", "CRM", "Order service", "Knowledge base"],
    result:
      "Routine questions are answered immediately at any hour, while the sales team only sees the conversations that actually need them.",
    stack: ["WhatsApp API", "AI Agent", "CRM", "Node.js", "Webhooks"],
    status: "REPRESENTATIVE",
  },
];
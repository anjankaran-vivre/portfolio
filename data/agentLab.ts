export interface AgentTool {
  id: string;
  label: string;
  icon: string;
  angle: number;
  call: string;
  result: string;
}

export const AGENT_TOOLS: AgentTool[] = [
  {
    id: "knowledge",
    label: "KNOWLEDGE",
    icon: "book",
    angle: -150,
    call: "retrieve_context(query)",
    result: "3 relevant documents retrieved from the vector store.",
  },
  {
    id: "database",
    label: "DATABASE",
    icon: "database",
    angle: -90,
    call: "query('orders', filter)",
    result: "Row returned: order #4821, status: shipped.",
  },
  {
    id: "crm",
    label: "CRM",
    icon: "server",
    angle: -30,
    call: "crm.update(contact_id, fields)",
    result: "Contact record updated, lead score recalculated.",
  },
  {
    id: "whatsapp",
    label: "WHATSAPP",
    icon: "message",
    angle: 30,
    call: "whatsapp.send(to, message)",
    result: "Message delivered. Read receipt pending.",
  },
  {
    id: "api",
    label: "API",
    icon: "network",
    angle: 90,
    call: "api.get('/orders/4821')",
    result: "200 OK · order payload returned in 142ms.",
  },
  {
    id: "workflow",
    label: "WORKFLOW",
    icon: "workflow",
    angle: 150,
    call: "workflow.trigger('follow_up')",
    result: "Follow-up sequence scheduled for +24h.",
  },
];

export const RUN_AGENT_SEQUENCE = [
  { label: "INPUT RECEIVED", desc: "The agent receives an inbound request." },
  { label: "UNDERSTANDING", desc: "The model parses intent and context." },
  { label: "REASONING", desc: "The agent decides what needs to happen." },
  { label: "TOOL SELECTION", desc: "The right tool is chosen for the task." },
  { label: "API CALL", desc: "The tool executes against a service." },
  { label: "DATABASE QUERY", desc: "State is read or written to storage." },
  { label: "RESULT", desc: "The action resolves with a result." },
  { label: "ACTION", desc: "The result triggers downstream action." },
  { label: "RESPONSE", desc: "A final response is returned." },
] as const;

export const KNOWLEDGE =
  "PRAXEN is a two-person technology studio. We design, build, automate and deploy complete digital systems: full-stack products, AI/ML systems, AI agents, agentic workflows, business automation, WhatsApp automation and API integrations. Pritam Routh leads AI/ML, agents and agentic systems. Anjan Karan leads full-stack product engineering and automation systems. Capabilities overlap in backend, APIs, full-stack, architecture and automation.";
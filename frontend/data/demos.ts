export interface DemoStep {
  label: string;
  desc: string;
}

export interface Demo {
  id: string;
  name: string;
  prompt: string;
  color: string;
  steps: DemoStep[];
}

export const DEMOS: Demo[] = [
  {
    id: "agent",
    name: "AI Agent Demo",
    prompt: "> “What's the status of my order #4821?”",
    color: "#74bb7e",
    steps: [
      { label: "USER", desc: "Customer asks a question in plain language." },
      { label: "AI AGENT", desc: "Agent receives the message and begins reasoning." },
      { label: "UNDERSTAND INTENT", desc: "Model classifies this as an order-status request." },
      { label: "TOOL SELECTION", desc: "Agent selects the order-lookup tool." },
      { label: "API CALL", desc: "Tool calls the order service." },
      { label: "DATABASE QUERY", desc: "Service queries the orders table." },
      { label: "RESULT", desc: "Database returns current order state." },
      { label: "RESPONSE", desc: "Agent turns the result into a natural reply." },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Automation Demo",
    prompt: "> Customer messages: “I want to know about my order.”",
    color: "#e3b462",
    steps: [
      { label: "CUSTOMER", desc: "Message arrives through the WhatsApp Business API." },
      { label: "WHATSAPP", desc: "Webhook receiver authenticates and parses the message." },
      { label: "AI", desc: "Agent identifies the customer and the intent." },
      { label: "CRM", desc: "Customer record is pulled and conversation logged." },
      { label: "BUSINESS LOGIC", desc: "Order state is resolved from the backend." },
      { label: "RESPONSE", desc: "A clear reply is composed and sent back on WhatsApp." },
    ],
  },
  {
    id: "lead",
    name: "Lead Automation Demo",
    prompt: "> New inbound lead from a contact form.",
    color: "#4fa98c",
    steps: [
      { label: "LEAD", desc: "A lead is captured from a form or channel." },
      { label: "AI QUALIFICATION", desc: "Agent scores intent and fit from the lead's details." },
      { label: "SCORE", desc: "A qualification score is computed and attached." },
      { label: "CRM", desc: "Lead record is created or updated automatically." },
      { label: "NOTIFICATION", desc: "The right teammate is notified in real time." },
      { label: "FOLLOW-UP", desc: "A follow-up sequence is scheduled automatically." },
    ],
  },
  {
    id: "api",
    name: "API Demo",
    prompt: "> Frontend requests /orders/4821",
    color: "#4fa98c",
    steps: [
      { label: "FRONTEND", desc: "UI issues an authenticated request." },
      { label: "API", desc: "Route handler validates and authorizes." },
      { label: "BACKEND", desc: "Service layer applies business logic." },
      { label: "DATABASE", desc: "Data is read from the store." },
      { label: "RESPONSE", desc: "Structured JSON returns to the UI." },
    ],
  },
  {
    id: "workflow",
    name: "AI Workflow Demo",
    prompt: "> Trigger: invoice_paid event",
    color: "#74bb7e",
    steps: [
      { label: "TRIGGER", desc: "A webhook event fires the workflow." },
      { label: "AGENT", desc: "Agent decides the next step from the event." },
      { label: "DECISION", desc: "Intent and priority are resolved." },
      { label: "TOOL", desc: "Agent calls the fulfillment service." },
      { label: "ACTION", desc: "The action executes across systems." },
      { label: "COMPLETION", desc: "The workflow closes with a clean state." },
    ],
  },
];
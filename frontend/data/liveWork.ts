export interface LiveSite {
  id: string;
  name: string;
  kind: string;
  url: string;
  domain: string;
  description: string;
  color: string;
}

export const LIVE_SITES: LiveSite[] = [
  {
    id: "vivre-panels",
    name: "Vivre Panels",
    kind: "MARKETING SITE",
    url: "https://vivrepanels.com/",
    domain: "vivrepanels.com",
    description: "Public-facing marketing site, live in production.",
    color: "#6c9bff",
  },
  {
    id: "vivre-erp",
    name: "Vivre Panels ERP",
    kind: "OPERATIONS DASHBOARD",
    url: "https://server2.vivrepanelserp.xyz/",
    domain: "server2.vivrepanelserp.xyz",
    description: "Internal operations dashboard running the same business day to day.",
    color: "#b98bfa",
  },
  {
    id: "vivre-transcription",
    name: "Vivre Transcription",
    kind: "TRANSCRIPTION DASHBOARD",
    url: "https://server3.vivrepanelserp.xyz/",
    domain: "server3.vivrepanelserp.xyz",
    description: "Live transcription dashboard, part of the same operations stack.",
    color: "#f2b860",
  },
];

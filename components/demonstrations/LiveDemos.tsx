"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, RotateCcw, Radio, Bot } from "lucide-react";
import { T } from "@/lib/theme";
import { DEMOS, type Demo } from "@/data/demos";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { FlowReveal } from "@/components/shared/FlowReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

// Clean a demo prompt into a plain chat-bubble sentence
const bubbleText = (p: string) =>
  p
    .replace(/^>\s*/, "") // leading shell marker
    .replace(/^customer messages?\s*:\s*/i, "") // "Customer messages:" tag
    .replace(/^[“"]+/, "") // opening quote
    .replace(/[”".]+$/, "") // closing quote / trailing dots
    .trim();

// Dummy agent replies per demo (a real backend comes later)
const AGENT_REPLIES: Record<string, string> = {
  agent:
    "Hi! Your order #4821 was dispatched today via BlueDart and is expected by Thursday, 6 PM 📦 The tracking link has been sent to your WhatsApp ✅",
  whatsapp:
    "Hello 👋 Your order is out for delivery tomorrow between 10 AM – 1 PM. Reply here anytime if you'd like to reschedule.",
  lead:
    "Lead qualified — score 87/100 🔥 Owner notified in real time and a follow-up is scheduled for tomorrow at 11 AM.",
  api:
    '{ "order": "#4821", "status": "shipped", "carrier": "BlueDart", "eta": "Thu 6 PM" } · 200 OK · 42 ms',
  workflow:
    "invoice_paid processed → fulfillment triggered → receipt e-mailed. Workflow closed with a clean state ✔",
};

// Per-demo chat skins so every tab feels like its own product surface
type ChatTheme = {
  title: string;
  sub: string;
  headerBg: string;
  bodyBg: string;
  userBg: string;
  userBorder: string;
  agentBg: string;
  agentBorder: string;
  accent: string;
  wa?: boolean; // WhatsApp flavor: timestamps + double ticks
  terminal?: boolean; // terminal-style streaming log
};

const CHAT_THEMES: Record<string, ChatTheme> = {
  agent: {
    title: "LIVE AGENT",
    sub: "ONLINE · AVG REPLY ~2S",
    headerBg: T.bg2,
    bodyBg: T.bg2,
    userBg: `${T.violet}16`,
    userBorder: `${T.violet}40`,
    agentBg: T.surface2,
    agentBorder: T.border,
    accent: "#b98bfa",
  },
  whatsapp: {
    title: "VORGEN BUSINESS",
    sub: "online",
    headerBg: "#202c33",
    bodyBg: "#0b141a",
    userBg: "#005c4b",
    userBorder: "transparent",
    agentBg: "#202c33",
    agentBorder: "transparent",
    accent: "#25d366",
    wa: true,
  },
  lead: {
    title: "CRM ASSISTANT",
    sub: "ONLINE · SYNCING CRM",
    headerBg: "#10141c",
    bodyBg: "#10141c",
    userBg: `${T.blue}14`,
    userBorder: `${T.blue}38`,
    agentBg: "#151a23",
    agentBorder: `${T.blue}26`,
    accent: "#6c9bff",
  },
  api: {
    title: "~/api-console",
    sub: "HTTP · JSON · LIVE",
    headerBg: "#0a0e14",
    bodyBg: "#0a0e14",
    userBg: `${T.blue}10`,
    userBorder: `${T.blue}30`,
    agentBg: "#0f1520",
    agentBorder: `${T.blue}22`,
    accent: "#6c9bff",
    terminal: true,
  },
  workflow: {
    title: "~/workflow-runner",
    sub: "TRIGGERS · RUNNING",
    headerBg: "#14120d",
    bodyBg: "#14120d",
    userBg: `${T.amber}12`,
    userBorder: `${T.amber}36`,
    agentBg: "#191713",
    agentBorder: `${T.amber}28`,
    accent: "#f2b860",
    terminal: true,
  },
};

// Streaming log lines for terminal-style demos (revealed in sync with the left flow)
const TERMINAL_LOGS: Record<string, string[]> = {
  api: [
    "$ GET /orders/4821",
    "→ route matched · api/orders/[id]",
    "→ auth verified · scope orders:read",
    "→ db query · SELECT * FROM orders WHERE id = 4821",
    "→ row found · order #4821 (shipped)",
    "← 200 OK · 42 ms",
    '{ "order": "#4821", "status": "shipped", "carrier": "BlueDart", "tracking": "BD7742913", "eta": "Thu 6 PM" }',
  ],
  workflow: [
    "⚡ trigger received · invoice_paid",
    "→ workflow wf_8821 spawned",
    "→ agent · resolving next step…",
    "→ tool call · fulfillment.execute(#4821)",
    "→ action committed across systems",
    "✔ closed clean · receipt e-mailed · 118 ms",
  ],
};

// Right-side live AI agent chat
function AgentChat({
  demo,
  phase,
  step,
}: {
  demo: Demo;
  phase: "idle" | "running" | "done";
  step: number;
}) {
  const th = CHAT_THEMES[demo.id] ?? CHAT_THEMES.agent;
  const monoText = demo.id === "api";

  // Terminal demos: reveal log lines in sync with the left flow
  const logs = TERMINAL_LOGS[demo.id];
  const visibleCount =
    th.terminal && logs
      ? phase === "idle"
        ? 0
        : phase === "done"
          ? logs.length
          : Math.max(
              1,
              Math.min(
                Math.round(((step + 1) / demo.steps.length) * logs.length),
                logs.length - 1
              )
            )
      : 0;

  const lineColor = (l: string) =>
    l.startsWith("$") || l.startsWith("⚡")
      ? th.accent
      : l.startsWith("✔") || l.startsWith("←")
        ? "#3fb950"
        : l === "{" || l === "}" || l.trimStart().startsWith('"')
          ? "#79c0ff"
          : "#9aa3af";

  return (
    <div
      style={{
        border: `1px solid ${th.wa ? "#111b21" : T.border}`,
        borderRadius: 8,
        background: th.headerBg,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 380,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 16px",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        {th.terminal ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `${demo.color}14`,
              border: `1px solid ${demo.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Bot size={15} color={demo.color} />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span className="pf-mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: T.text }}>
            {th.title}
          </span>
          <span
            className="pf-mono"
            style={{ fontSize: 8.5, letterSpacing: "0.08em", color: th.accent, display: "flex", alignItems: "center", gap: 5 }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: th.accent, animation: "pf-pulse 1.6s infinite" }} />
            {th.sub}
          </span>
        </div>
        <span className="pf-mono" style={{ marginLeft: "auto", fontSize: 8.5, color: T.faint, letterSpacing: "0.12em" }}>
          DEMO
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 18,
          background: th.bodyBg,
          fontFamily: th.terminal ? "var(--font-mono, monospace)" : undefined,
        }}
      >
        {th.terminal && logs ? (
          <>
            {visibleCount === 0 && (
              <div className="pf-mono" style={{ fontSize: 11.5, color: "#8b949e", lineHeight: 2 }}>
                {demo.id === "api" ? "$ awaiting request…" : "// listening for events…"}
              </div>
            )}
            {logs.slice(0, visibleCount).map((l, i) => (
              <motion.div
                key={`${demo.id}-log-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="pf-mono"
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.9,
                  color: lineColor(l),
                  fontWeight: l.startsWith("✔") ? 700 : 400,
                  whiteSpace: "pre-wrap",
                }}
              >
                {l}
                {phase === "running" && i === visibleCount - 1 && (
                  <span style={{ animation: "pf-blink 1s infinite", marginLeft: 4 }}>▋</span>
                )}
              </motion.div>
            ))}
          </>
        ) : (
        <>
        {phase === "idle" && (
          <div
            className="pf-mono"
            style={{ margin: "auto", textAlign: "center", fontSize: 10.5, color: T.faint, lineHeight: 1.8 }}
          >
            {"// waiting for customer message…"}
            <br />
            press RUN on the flow to start the exchange
          </div>
        )}

        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
              alignSelf: "flex-end",
              maxWidth: "88%",
              background: th.userBg,
              border: `1px solid ${th.userBorder}`,
              borderRadius: th.wa ? "10px 10px 3px 10px" : "10px 10px 3px 10px",
              padding: "9px 12px",
            }}
          >
            <div className="pf-mono" style={{ fontSize: 8, letterSpacing: "0.14em", color: th.accent, marginBottom: 4 }}>
              {th.wa ? "YOU · NOW" : "CUSTOMER · NOW"}
            </div>
            <div style={{ fontSize: monoText ? 12 : 13, color: th.wa ? "#e9edef" : T.text, lineHeight: 1.5 }}>
              {bubbleText(demo.prompt)}
            </div>
            {th.wa && (
              <div
                className="pf-mono"
                style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 4, letterSpacing: "0.05em" }}
              >
                11:02 AM <span style={{ color: "#53bdeb" }}>✓✓</span>
              </div>
            )}
          </motion.div>
        )}

        {phase === "running" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: 5,
              alignItems: "center",
              background: th.agentBg,
              border: `1px solid ${th.agentBorder}`,
              borderRadius: "10px 10px 10px 3px",
              padding: "11px 13px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: demo.color }}
              />
            ))}
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              alignSelf: "flex-start",
              maxWidth: "94%",
              background: th.agentBg,
              border: `1px solid ${th.agentBorder}`,
              borderRadius: "10px 10px 10px 3px",
              padding: "10px 12px",
            }}
          >
            <div className="pf-mono" style={{ fontSize: 8, letterSpacing: "0.14em", color: th.accent, marginBottom: 4 }}>
              {th.wa ? "VORGEN AGENT · 11:02 AM" : "AGENT · JUST NOW"}
            </div>
            <div
              className={monoText ? "pf-mono" : undefined}
              style={{
                fontSize: monoText ? 11.5 : 13,
                color: th.wa ? "#d1d7db" : T.text,
                lineHeight: 1.55,
                whiteSpace: monoText ? "pre-wrap" : undefined,
              }}
            >
              {AGENT_REPLIES[demo.id] ?? "Done ✅ Request processed successfully."}
            </div>
          </motion.div>
        )}
        </>
        )}
      </div>

      {/* Input placeholder — real typing comes later */}
      {!th.terminal && (
      <div style={{ padding: "0 18px 16px" }}>
        <div
          className="pf-mono"
          style={{
            border: `1px dashed ${T.border}`,
            borderRadius: 6,
            padding: "11px 14px",
            fontSize: 11,
            color: T.faint,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Type a message…
          <span style={{ marginLeft: "auto", fontSize: 9, letterSpacing: "0.08em" }}>SOON</span>
        </div>
      </div>
      )}
    </div>
  );
}

// Coordinates the left flow + the right live agent chat
function DemoPanel({ demo }: { demo: Demo }) {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoRan = useRef(false);
  const inView = useInView(rootRef, { once: true, amount: 0.3 });

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const run = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(0);
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      if (i >= demo.steps.length) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        setStep(demo.steps.length - 1);
        return;
      }
      setStep(i);
    }, 700);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(-1);
    setRunning(false);
  };

  // Auto-run once when the panel scrolls into view
  useEffect(() => {
    if (!inView || autoRan.current) return;
    autoRan.current = true;
    const t = setTimeout(run, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const phase = step < 0 ? "idle" : running ? "running" : "done";

  return (
    <div
      ref={rootRef}
      style={{
        marginTop: 32,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: 28,
        background: T.surface,
      }}
    >
      <div className="pf-demo-grid">
        {/* Left: request flow */}
        <div style={{ minWidth: 0 }}>
          <FlowReveal>
            <div
              className="pf-mono"
              style={{
                fontSize: 12,
                color: T.dim,
                marginBottom: 20,
                padding: "12px 16px",
                border: `1px solid ${T.border}`,
                borderRadius: 4,
                background: T.bg2,
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 44,
              }}
            >
              <span style={{ color: demo.color, flexShrink: 0 }}>{running ? "●" : ">"}</span>
              <span>{demo.prompt}</span>
            </div>
          </FlowReveal>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {demo.steps.map((s, i) => {
              const activeNow = i === step;
              const past = i < step;
              const done = i <= step;
              return (
                <FlowReveal key={`${demo.id}-${i}`} delay={i * 110} from="top">
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          border: `2px solid ${done ? demo.color : T.border}`,
                          background: activeNow ? demo.color : "transparent",
                          transition: "all .3s",
                          animation: activeNow ? "pf-pulse-scale 1s ease-out infinite" : "none",
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                      {i < demo.steps.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            minHeight: 24,
                            background: past ? demo.color : T.border,
                            transition: "background .3s",
                          }}
                        />
                      )}
                    </div>
                    <div style={{ paddingBottom: 18, opacity: done ? 1 : 0.4, transition: "opacity .3s" }}>
                      <div
                        className="pf-mono"
                        style={{
                          fontSize: 12.5,
                          color: activeNow ? demo.color : T.text,
                          letterSpacing: "0.06em",
                          transition: "color .3s",
                        }}
                      >
                        {s.label}
                      </div>
                      {/* Always rendered so the layout never grows mid-run */}
                      <div
                        style={{
                          fontSize: 13,
                          color: T.dim,
                          marginTop: 3,
                          maxWidth: 420,
                          lineHeight: 1.5,
                          visibility: done ? "visible" : "hidden",
                          opacity: done ? 1 : 0,
                          transition: "opacity .35s ease",
                        }}
                      >
                        {s.desc}
                      </div>
                    </div>
                  </div>
                </FlowReveal>
              );
            })}
          </div>

          <FlowReveal delay={demo.steps.length * 110}>
            <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
              <button
                className="pf-btn pf-btn-solid"
                onClick={run}
                disabled={running}
                style={{ opacity: running ? 0.6 : 1, cursor: running ? "default" : "pointer" }}
              >
                {running ? <Radio size={13} /> : <Play size={13} />} {running ? "Running…" : "Run"}
              </button>
              <button className="pf-btn" onClick={reset}>
                <RotateCcw size={13} /> Reset
              </button>
              <span className="pf-mono" style={{ marginLeft: "auto", fontSize: 10, color: T.faint }}>
                {step < 0 ? "READY" : running ? `STEP ${step + 1}/${demo.steps.length}` : "COMPLETE"}
              </span>
            </div>
          </FlowReveal>
        </div>

        {/* Right: live agent */}
        <AgentChat demo={demo} phase={phase} step={step} />
      </div>

      <style>{`
        .pf-demo-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:26px;align-items:stretch;}
        @media(max-width:900px){.pf-demo-grid{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  );
}

export function LiveDemos() {
  const [active, setActive] = useState<string>(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === active)!;

  return (
    <section id="demos" style={{ background: T.bg2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 24px" }}>
        <Reveal>
          <Eyebrow color={T.amber}>Live Demonstrations</Eyebrow>
          <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
            Systems in motion
          </h2>
          <p style={{ color: T.dim, marginTop: 16, maxWidth: 600, fontSize: 15, lineHeight: 1.6 }}>
            Press run and watch the actual sequence a request travels through — every step is a real path we build.
          </p>
        </Reveal>

        <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
          {DEMOS.map((d, i) => (
            <Reveal key={d.id} delay={i * 90}>
              <button
                onClick={() => setActive(d.id)}
                className="pf-mono"
                style={{
                  display: "inline-flex",
                  padding: "10px 16px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11.5,
                  letterSpacing: "0.05em",
                  border: `1px solid ${active === d.id ? d.color : T.border}`,
                  background: active === d.id ? `${d.color}14` : "transparent",
                  color: active === d.id ? d.color : T.dim,
                  transition: "all .25s",
                }}
              >
                {d.name}
              </button>
            </Reveal>
          ))}
        </div>

        <DemoPanel key={demo.id} demo={demo} />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Radio } from "lucide-react";
import { T } from "@/lib/theme";
import { AGENT_TOOLS, RUN_AGENT_SEQUENCE } from "@/data/agentLab";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { Icon } from "@/components/shared/Icon";

const CX = 300;
const CY = 230;
const R = 165;

function pt(angle: number, r = R) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function AgentLab() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runStep, setRunStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tool = AGENT_TOOLS.find((t) => t.id === activeTool);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const runAgent = () => {
    if (timer.current) clearInterval(timer.current);
    setRunStep(0);
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      if (i >= RUN_AGENT_SEQUENCE.length) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        setRunStep(RUN_AGENT_SEQUENCE.length - 1);
        return;
      }
      setRunStep(i);
    }, 620);
  };

  const resetRun = () => {
    if (timer.current) clearInterval(timer.current);
    setRunStep(-1);
    setRunning(false);
  };

  return (
    <SectionWrap id="agent-lab">
      <Reveal>
        <Eyebrow color={T.violet}>Signature Feature</Eyebrow>
        <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
          Agent Lab
        </h2>
        <p style={{ color: T.dim, marginTop: 16, maxWidth: 600, fontSize: 15, lineHeight: 1.6 }}>
          A live model of how our agents actually work. Hover the tools to inspect calls, then press{" "}
          <span className="pf-mono" style={{ color: T.violet }}>RUN AGENT</span> to watch a full execution.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="pf-agent-grid" style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 24 }}>
          {/* Graph */}
          <div
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              background: `radial-gradient(circle at 50% 45%, ${T.violet}10, ${T.surface} 72%)`,
              padding: "10px 0",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <svg viewBox="0 0 600 460" style={{ width: "100%", maxWidth: 600, height: "auto" }}>
              {AGENT_TOOLS.map((t) => {
                const p = pt(t.angle);
                const isActive = activeTool === t.id || (running && Math.abs(t.angle) < 40);
                return (
                  <line
                    key={t.id}
                    x1={CX}
                    y1={CY}
                    x2={p.x}
                    y2={p.y}
                    stroke={isActive ? T.violet : T.border}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray="6 4"
                    style={{
                      transition: "stroke .3s",
                      animation: isActive ? "pf-flow 1.1s linear infinite" : "none",
                    }}
                  />
                );
              })}

              <circle cx={CX} cy={CY} r={46} fill={T.bg2} stroke={T.violet} strokeWidth={2} />
              <circle cx={CX} cy={CY} r={46} fill="none" stroke={T.violet} strokeWidth={1.5} style={{ animation: running ? "pf-ring-pulse 1s ease-in-out infinite" : "pf-ring-pulse 2.4s ease-in-out infinite" }} />
              <text x={CX} y={CY - 4} textAnchor="middle" className="pf-mono" fontSize="12" fill={T.text} fontWeight="600">
                AI AGENT
              </text>
              <text x={CX} y={CY + 16} textAnchor="middle" className="pf-mono" fontSize="9" fill={T.faint}>
                {running ? "EXECUTING…" : activeTool ? "CALLING…" : "IDLE"}
              </text>

              {AGENT_TOOLS.map((t) => {
                const p = pt(t.angle);
                const isActive = activeTool === t.id || (running && Math.abs(t.angle) < 40);
                return (
                  <g
                    key={t.id}
                    className="pf-node"
                    data-cursor
                    onClick={() => {
                      setActiveTool(isActive ? null : t.id);
                      resetRun();
                    }}
                    style={{ cursor: "pointer", filter: isActive ? `drop-shadow(0 0 10px ${T.violet})` : "none", transition: "filter .3s" }}
                  >
                    <circle cx={p.x} cy={p.y} r={33} fill={isActive ? `${T.violet}22` : T.bg2} stroke={isActive ? T.violet : T.borderLit} strokeWidth={1.5} />
                    <foreignObject x={p.x - 9} y={p.y - 20} width={18} height={18}>
                      <Icon name={t.icon} size={16} color={isActive ? T.violet : T.dim} strokeWidth={1.6} />
                    </foreignObject>
                    <text x={p.x} y={p.y + 22} textAnchor="middle" className="pf-mono" fontSize="8.5" fill={isActive ? T.violet : T.faint} letterSpacing="0.05em">
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div
              className="pf-mono"
              style={{
                position: "absolute",
                top: 10,
                left: 12,
                fontSize: 9,
                letterSpacing: "0.1em",
                color: T.faint,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: running ? T.amber : T.violet, animation: "pf-pulse 1.4s infinite", display: "inline-block" }} />
              {running ? "EXECUTION RUNNING" : "STANDBY"}
            </div>
          </div>

          {/* Console */}
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface, padding: 24, display: "flex", flexDirection: "column", minHeight: 460 }}>
            {runStep >= 0 || running ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="pf-mono" style={{ fontSize: 11, color: T.faint, letterSpacing: "0.08em", marginBottom: 12 }}>
                  AGENT EXECUTION TRACE
                </div>
                <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
                  {RUN_AGENT_SEQUENCE.map((s, i) => {
                    const done = i <= runStep;
                    const activeNow = i === runStep;
                    return (
                      <div key={s.label} style={{ display: "flex", gap: 12, minHeight: 34 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              border: `2px solid ${done ? T.violet : T.border}`,
                              background: activeNow ? T.violet : "transparent",
                              marginTop: 3,
                              transition: "all .3s",
                              animation: activeNow ? "pf-pulse-scale 1s ease-out infinite" : "none",
                            }}
                          />
                          {i < RUN_AGENT_SEQUENCE.length - 1 && (
                            <div style={{ width: 1, flex: 1, minHeight: 22, background: done && !activeNow ? T.violet : T.border, transition: "background .3s" }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: 14, opacity: done ? 1 : 0.35, transition: "opacity .3s" }}>
                          <div className="pf-mono" style={{ fontSize: 12, color: activeNow ? T.violet : T.text, letterSpacing: "0.06em" }}>
                            {s.label}
                          </div>
                          {done && <div style={{ fontSize: 12.5, color: T.dim, marginTop: 3 }}>{s.desc}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : tool ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="pf-fade-in">
                <div className="pf-mono" style={{ fontSize: 11, color: T.faint, letterSpacing: "0.08em", marginBottom: 12 }}>TOOL CALL INSPECTOR</div>
                <div className="pf-disp" style={{ fontSize: 16, fontWeight: 600, color: T.violet, marginBottom: 14 }}>{tool.label}</div>
                <div className="pf-mono" style={{ fontSize: 12, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 4, padding: "10px 12px", color: T.blue, marginBottom: 10 }}>
                  {tool.call}
                </div>
                <div className="pf-mono" style={{ fontSize: 10, color: T.faint, marginBottom: 6 }}>RESULT</div>
                <div className="pf-mono" style={{ fontSize: 12, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 4, padding: "10px 12px", color: T.dim }}>
                  {tool.result}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 20, fontSize: 12, color: T.faint }}>
                  Every agent we ship is built from real tool calls like this — not scripted chat replies.
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="pf-mono" style={{ fontSize: 11, color: T.faint, letterSpacing: "0.08em", marginBottom: 12 }}>TOOL CALL INSPECTOR</div>
                <div style={{ color: T.faint, fontSize: 13, lineHeight: 1.7, flex: 1 }}>
                  Select a tool node to inspect a live call — or press{" "}
                  <span className="pf-mono" style={{ color: T.violet }}>RUN AGENT</span> to trace a full
                  execution from input to response.
                </div>
                <div className="pf-mono" style={{ fontSize: 10, color: T.faint }}>
                  IDLE — AWAITING INSTRUCTION
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
              <button className="pf-btn pf-btn-solid" onClick={runAgent} disabled={running} style={{ opacity: running ? 0.6 : 1, cursor: running ? "default" : "pointer" }}>
                {running ? <Radio size={13} /> : <Play size={13} />} {running ? "Running…" : "Run Agent"}
              </button>
              <button className="pf-btn" onClick={resetRun}>
                <RotateCcw size={13} /> Reset
              </button>
              <span className="pf-mono" style={{ marginLeft: "auto", fontSize: 10, color: T.faint, alignSelf: "center" }}>
                {runStep >= 0 ? `STEP ${runStep + 1}/${RUN_AGENT_SEQUENCE.length}` : "AGENT IDLE"}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      <style>{`
        @media (max-width: 900px) {
          .pf-agent-grid { grid-template-columns: 1fr !important; }
        }
        .pf-fade-in { animation: pf-fade-up .4s ease both; }
      `}</style>
    </SectionWrap>
  );
}
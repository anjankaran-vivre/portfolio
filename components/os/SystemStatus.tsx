"use client";

import { T } from "@/lib/theme";
import { OS_STATUS } from "@/data/site";
import { useScrollY } from "@/lib/animations";

export function SystemStatus() {
  const y = useScrollY();
  const out = y > 900;

  return (
    <div
      className="pf-mono"
      style={{
        position: "fixed",
        left: 22,
        bottom: 22,
        zIndex: 45,
        border: `1px solid ${T.border}`,
        borderRadius: 6,
        background: `${T.bg}cc`,
        backdropFilter: "blur(8px)",
        padding: "14px 16px",
        minWidth: 172,
        opacity: out ? 0 : 1,
        transform: out ? "translateY(14px)" : "none",
        transition: "opacity .4s ease, transform .4s ease",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 10, color: T.text, letterSpacing: "0.12em", marginBottom: 10 }}>
        PRAXEN<span style={{ color: T.amber }}>.</span>OS
      </div>
      <div style={{ fontSize: 9, color: T.faint, letterSpacing: "0.08em", marginBottom: 6 }}>SYSTEM</div>
      <div style={{ fontSize: 11, color: T.amber, marginBottom: 10 }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: T.amber, marginRight: 6, animation: "pf-pulse 2s infinite" }} />
        {OS_STATUS.system}
      </div>
      {(
        [
          ["AGENTS", OS_STATUS.agents],
          ["AUTOMATIONS", OS_STATUS.automations],
          ["SYSTEMS", OS_STATUS.systems],
        ] as const
      ).map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 18, marginBottom: 6, fontSize: 10, color: T.dim }}>
          <span>{label}</span>
          <span style={{ color: T.text }}>{value}</span>
        </div>
      ))}
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${T.border}`,
          fontSize: 9,
          letterSpacing: "0.1em",
          color: T.faint,
        }}
      >
        {OS_STATUS.mode}
      </div>
    </div>
  );
}
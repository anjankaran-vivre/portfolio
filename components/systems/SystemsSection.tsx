"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/lib/theme";
import { CAPABILITIES } from "@/data/capabilities";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Reveal } from "@/components/shared/Reveal";
import { Tag } from "@/components/shared/Tag";
import { Icon } from "@/components/shared/Icon";

function CapabilityMap() {
  const [active, setActive] = useState<string>(CAPABILITIES[0].id);
  const cap = CAPABILITIES.find((c) => c.id === active)!;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }} className="pf-sys-grid">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CAPABILITIES.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="pf-mono"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                padding: "13px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.06em",
                border: `1px solid ${isActive ? c.color : T.border}`,
                background: isActive ? `${c.color}14` : T.surface,
                color: isActive ? c.color : T.dim,
                transition: "all .25s",
              }}
            >
              <Icon name={c.icon} size={15} color={isActive ? c.color : T.faint} />
              <span>{c.title}</span>
              <span style={{ marginLeft: "auto", fontSize: 9, opacity: isActive ? 1 : 0.4 }}>
                {String(CAPABILITIES.indexOf(c) + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface, padding: 28, display: "flex", flexDirection: "column", minHeight: 420 }}>
        <div className="pf-mono" style={{ fontSize: 11, color: T.faint, letterSpacing: "0.1em", marginBottom: 8 }}>
          SYSTEM MAP · {cap.id.toUpperCase()}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={cap.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontSize: 15, color: T.dim, lineHeight: 1.6, maxWidth: 620, minHeight: 60 }}>{cap.detail}</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "28px 0" }}>
              {cap.flow.map((f, i) => (
                <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    className="pf-mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      padding: "9px 16px",
                      borderRadius: 4,
                      border: `1px solid ${cap.color}55`,
                      background: `${cap.color}0c`,
                      color: T.text,
                    }}
                  >
                    {f}
                  </div>
                  {i < cap.flow.length - 1 && (
                    <div style={{ width: 1, height: 22, background: cap.color, opacity: 0.5 }}>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: cap.color, margin: "0 auto", animation: "pf-pulse 1.4s infinite" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cap.tags.map((t) => <Tag key={t} color={cap.color}>{t}</Tag>)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .pf-sys-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export function SystemsSection() {
  return (
    <SectionWrap id="systems" style={{ paddingTop: 44 }}>
      <Reveal delay={120}>
        <CapabilityMap />
      </Reveal>
    </SectionWrap>
  );
}
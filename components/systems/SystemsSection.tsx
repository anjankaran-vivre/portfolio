"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/lib/theme";
import { CAPABILITIES } from "@/data/capabilities";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Reveal } from "@/components/shared/Reveal";
import { FlowReveal } from "@/components/shared/FlowReveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Tag } from "@/components/shared/Tag";
import { Icon } from "@/components/shared/Icon";

function CapabilityMap() {
  const [active, setActive] = useState<string>(CAPABILITIES[0].id);
  const cap = CAPABILITIES.find((c) => c.id === active)!;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }} className="pf-sys-grid">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CAPABILITIES.map((c, idx) => {
          const isActive = c.id === active;
          return (
            <Reveal key={c.id} delay={idx * 90}>
              <button
                onClick={() => setActive(c.id)}
                className="pf-mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  width: "100%",
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
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </button>
            </Reveal>
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
            {/* Scroll-linked reveals + staggered replay on capability switch */}
            <FlowReveal>
              <div style={{ fontSize: 15, color: T.dim, lineHeight: 1.6, maxWidth: 620, minHeight: 60 }}>
                {cap.detail}
              </div>
            </FlowReveal>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "28px 0" }}>
              {cap.flow.map((f, i) => (
                <FlowReveal key={`${cap.id}-${f}`} delay={i * 110} from="top">
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                      <div style={{ position: "relative", width: 2, height: 26 }}>
                        {/* Faint base line */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(180deg, ${cap.color}00, ${cap.color}59 25%, ${cap.color}59 75%, ${cap.color}00)`,
                          }}
                        />
                        {/* Clip region: exact line bounds vertically, extra room horizontally for glow */}
                        <div style={{ position: "absolute", top: 0, bottom: 0, left: -9, right: -9, overflow: "hidden" }}>
                          <motion.span
                            animate={{ y: [-14, 40], opacity: [0, 1, 1, 0] }}
                            transition={{
                              duration: 1.5,
                              times: [0, 0.12, 0.88, 1],
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.25,
                            }}
                            style={{
                              position: "absolute",
                              left: "50%",
                              marginLeft: -1.5,
                              top: 0,
                              width: 3,
                              height: 10,
                              borderRadius: 2,
                              background: cap.color,
                              boxShadow: `0 0 8px ${cap.color}`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </FlowReveal>
              ))}
            </div>

            <FlowReveal delay={cap.flow.length * 110}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cap.tags.map((t) => <Tag key={t} color={cap.color}>{t}</Tag>)}
              </div>
            </FlowReveal>
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
      <Reveal>
        <Eyebrow color={T.amber}>What We Build</Eyebrow>
        <h2
          className="pf-disp"
          style={{
            fontSize: "clamp(28px,4.5vw,46px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
          }}
        >
          Full-stack delivery.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${T.violet}, ${T.blue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Intelligent automation.
          </span>
        </h2>
        <p style={{ color: T.dim, margin: "14px 0 36px", maxWidth: 600, fontSize: 15, lineHeight: 1.6 }}>
          Pick a layer — every capability below is something we design, ship and run in production.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <CapabilityMap />
      </Reveal>
    </SectionWrap>
  );
}
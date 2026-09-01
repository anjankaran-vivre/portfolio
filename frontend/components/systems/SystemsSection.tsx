"use client";

import { motion } from "framer-motion";
import { T } from "@/lib/theme";
import { CAPABILITIES, type Capability } from "@/data/capabilities";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Reveal } from "@/components/shared/Reveal";
import { FlowReveal } from "@/components/shared/FlowReveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Tag } from "@/components/shared/Tag";
import { Icon } from "@/components/shared/Icon";
import { ResilienceDemo } from "@/components/systems/ResilienceDemo";
import { RateLimitDemo } from "@/components/systems/RateLimitDemo";

// Capabilities whose cards are swapped out for their own "problem"
// animation instead of the standard flow-chain card. Each capability gets
// one of these over time.
const PROBLEM_DEMOS: Record<string, React.ComponentType> = {
  agents: ResilienceDemo,
  aiml: RateLimitDemo,
};

// One capability card — always fully open: icon, title, detail, the
// original vertical flow chain (connecting line + traveling pulse) and
// tags. No click-to-expand — this is the same content that used to live
// in the single selected-capability panel, just repeated per card.
function CapabilityCard({ cap }: { cap: Capability }) {
  return (
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        background: T.surface,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: `${cap.color}18`,
            border: `1px solid ${cap.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={cap.icon} size={16} color={cap.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pf-disp" style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{cap.title}</div>
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, marginTop: 4 }}>{cap.desc}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
        {cap.flow.map((f, i) => (
          <FlowReveal key={`${cap.id}-${f}`} delay={i * 110} from="top">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                className="pf-mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.06em",
                  padding: "8px 14px",
                  borderRadius: 4,
                  border: `1px solid ${cap.color}55`,
                  background: `${cap.color}0c`,
                  color: T.text,
                }}
              >
                {f}
              </div>
              {i < cap.flow.length - 1 && (
                <div style={{ position: "relative", width: 2, height: 24 }}>
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
                      animate={{ y: [-14, 38], opacity: [0, 1, 1, 0] }}
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
    </div>
  );
}

function CapabilityMap() {
  return (
    <>
      <div className="pf-cap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {CAPABILITIES.map((c) => {
          const Demo = PROBLEM_DEMOS[c.id];
          return Demo ? <Demo key={c.id} /> : <CapabilityCard key={c.id} cap={c} />;
        })}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .pf-cap-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .pf-cap-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
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

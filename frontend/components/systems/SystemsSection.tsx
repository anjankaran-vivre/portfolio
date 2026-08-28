"use client";

import { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, useInView } from "framer-motion";
import { T } from "@/lib/theme";
import { CAPABILITIES, type Capability } from "@/data/capabilities";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Reveal } from "@/components/shared/Reveal";
import { FlowReveal } from "@/components/shared/FlowReveal";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Tag } from "@/components/shared/Tag";
import { Icon } from "@/components/shared/Icon";

const EASE = [0.16, 1, 0.3, 1] as const;

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

// Small fixed-offset peek stack — identical language to the Live Work
// window stack: front card full size, up to two more peeking behind it.
const STACK_OFFSETS = [
  { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 },
  { x: -16, y: 16, scale: 0.96, opacity: 0.7, rotate: -2.5 },
  { x: -28, y: 28, scale: 0.93, opacity: 0.42, rotate: 2.5 },
];
const MAX_VISIBLE_DEPTH = STACK_OFFSETS.length - 1;
const GRID_COLS = 4;

function CapabilityMap() {
  // The container's own height swings from ~600px (stacked) to 1200px+
  // (grid). A *percentage* threshold (amount: 0.35) against that resizing
  // box caused a feedback loop: unstack → taller → the visible fraction
  // drops back under 35% → re-stacks → shorter → triggers again — the
  // flicker. Using "any overlap at all" (no amount/margin) instead means
  // it only flips once the whole section is genuinely off-screen in either
  // direction, so it stays unstacked the entire time you're scrolling
  // through reading the grid.
  const sectionRef = useRef<HTMLDivElement>(null);
  // No `once` — leaving the section (either direction) collapses it back
  // into a stack, so scrolling back in replays the reveal.
  const inView = useInView(sectionRef);
  const [unstacked, setUnstacked] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setUnstacked(true), 650);
      return () => clearTimeout(t);
    }
    setUnstacked(false);
  }, [inView]);

  return (
    <div ref={sectionRef} style={{ position: "relative" }}>
      <LayoutGroup>
        <div
          className={unstacked ? "pf-cap-grid" : undefined}
          style={
            unstacked
              ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }
              : { position: "relative", height: 600, maxWidth: 300, margin: "0 auto" }
          }
        >
          {CAPABILITIES.map((c, idx) => {
            const col = idx % GRID_COLS;
            const row = Math.floor(idx / GRID_COLS);
            const depth = Math.min(idx, MAX_VISIBLE_DEPTH);
            const hiddenInStack = idx > MAX_VISIBLE_DEPTH;
            const o = STACK_OFFSETS[depth];

            const delay = unstacked ? row * 0.15 + col * 0.06 : 0;

            return (
              // Outer element owns the actual DOM position (absolute peek
              // stack vs. grid cell) and only `layout` — Framer's FLIP
              // system — animates that move. The inner element separately
              // animates the small peek offset (its own x/y/scale/rotate).
              // Driving both on the SAME element caused the transform to
              // fight itself and flicker/jitter mid-transition.
              <motion.div
                key={c.id}
                layout
                transition={{ layout: { duration: 0.9, delay, ease: EASE } }}
                style={
                  unstacked
                    ? { height: "100%" }
                    : { position: "absolute", top: 0, left: 0, width: "100%", zIndex: CAPABILITIES.length - idx }
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    unstacked
                      ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
                      : { opacity: hiddenInStack ? 0 : o.opacity, x: o.x, y: o.y, scale: o.scale, rotate: o.rotate }
                  }
                  transition={{ duration: 0.6, delay, ease: EASE }}
                  style={{ height: "100%" }}
                >
                  <CapabilityCard cap={c} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
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

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { T } from "@/lib/theme";
import { PROCESS } from "@/data/process";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 70%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(lineScale, (v) => `${v * 100}%`);

  return (
    <section id="about" ref={ref} style={{ background: T.bg2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 24px" }}>
        <Reveal>
          <Eyebrow color={T.amber}>How We Build</Eyebrow>
          <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
            From idea to intelligent system.
          </h2>
        </Reveal>

        <div style={{ marginTop: 48, position: "relative" }}>
          <motion.div
            style={{
              position: "absolute",
              left: 26,
              top: 0,
              bottom: 0,
              width: 1,
              background: `linear-gradient(180deg, ${T.blue}, ${T.violet} 50%, ${T.amber})`,
              transformOrigin: "top",
              scaleY: lineScale,
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              left: 26,
              top: dotTop,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: T.amber,
              boxShadow: `0 0 16px ${T.amber}`,
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          />
          {PROCESS.map((s, i) => (
            <Reveal delay={i * 50} key={s.n}>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-start",
                  padding: "18px 0 18px 56px",
                  borderTop: i === 0 ? `1px solid ${T.border}` : "none",
                  borderBottom: `1px solid ${T.border}`,
                  position: "relative",
                }}
              >
                <div
                  className="pf-disp"
                  style={{
                    fontSize: 30,
                    color: i % 3 === 0 ? T.blue : i % 3 === 1 ? T.violet : T.amber,
                    width: 56,
                    flexShrink: 0,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.n}
                </div>
                <div style={{ width: 190, flexShrink: 0 }} className="pf-mono">
                  <div style={{ fontSize: 14, letterSpacing: "0.08em", color: T.text }}>{s.t}</div>
                </div>
                <div style={{ fontSize: 14.5, color: T.dim, lineHeight: 1.65, maxWidth: 560 }}>{s.d}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
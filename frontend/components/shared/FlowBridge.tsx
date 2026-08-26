"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { T } from "@/lib/theme";

export function FlowBridge({ label, height = 96 }: { label?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useSpring(useTransform(scrollYProgress, [0.1, 0.9], [0, 1]), { stiffness: 70, damping: 20 });
  const fade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="pf-bridge"
      style={{
        position: "relative",
        zIndex: 1,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 1240,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <motion.div style={{ opacity: fade, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", width: 2, height: 46, background: T.border }}>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${T.blue}, ${T.violet} 50%, ${T.amber})`,
              transformOrigin: "top",
              scaleY: draw,
              boxShadow: `0 0 10px ${T.violet}55`,
            }}
          />
          <div
            className="pf-bridge-dot"
            style={{
              position: "absolute",
              left: -4,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: T.amber,
              boxShadow: `0 0 14px ${T.amber}`,
            }}
          />
        </div>
        {label && (
          <span className="pf-mono" style={{ fontSize: 8.5, letterSpacing: "0.18em", color: T.faint, whiteSpace: "nowrap" }}>
            {label}
          </span>
        )}
      </motion.div>
      <style>{`
        .pf-bridge { justify-content: center; }
        .pf-bridge-dot { animation: pf-bridge-drop 1.8s ease-in-out infinite; }
        @keyframes pf-bridge-drop {
          0% { top: -5px; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @media (min-width: 1000px) {
          .pf-bridge { justify-content: flex-end; padding-right: 22%; }
        }
      `}</style>
    </div>
  );
}
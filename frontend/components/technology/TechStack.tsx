"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/lib/theme";
import { STACK } from "@/data/technologies";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { SectionPhoto } from "@/components/shared/SectionPhoto";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";

export function TechStack() {
  const [filter, setFilter] = useState<string>("ALL");
  const cats = ["ALL", ...STACK.map((c) => c.id)];
  const labelOf = (id: string) => (id === "ALL" ? "ALL" : STACK.find((c) => c.id === id)?.label ?? id);
  const visible = STACK.filter((c) => filter === "ALL" || c.id === filter);

  return (
    <SectionWrap id="stack">
      <SectionPhoto src="/assets/chips.jpg" opacity={0.1} />
      <Reveal>
        <Eyebrow color={T.violet}>Technology</Eyebrow>
        <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
          The stack, in use
        </h2>
        <p style={{ color: T.dim, marginTop: 16, maxWidth: 600, fontSize: 15, lineHeight: 1.6 }}>
          Only what we actually ship with — selected by the team, not by a logo budget.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div style={{ display: "flex", gap: 8, marginTop: 36, flexWrap: "wrap" }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="pf-mono"
              suppressHydrationWarning
              style={{
                padding: "9px 15px",
                borderRadius: 4,
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                border: `1px solid ${filter === c ? T.text : T.border}`,
                background: filter === c ? T.text : "transparent",
                color: filter === c ? T.bg : T.dim,
                transition: "all .25s",
              }}
            >
              {labelOf(c)}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <AnimatePresence>
            {visible.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: 24,
                  background: T.surface,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cat.color}, transparent 70%)`, opacity: 0.8 }} />
                <div className="pf-mono" style={{ fontSize: 11, color: cat.color, letterSpacing: "0.1em", marginBottom: 6 }}>{cat.label}</div>
                <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.6, marginBottom: 14 }}>{cat.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cat.items.map((it) => (
                    <span key={it} className="pf-mono" style={{ fontSize: 11, padding: "6px 11px", borderRadius: 3, border: `1px solid ${cat.color}44`, background: `${cat.color}0c`, color: T.text }}>
                      {it}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Reveal>
    </SectionWrap>
  );
}
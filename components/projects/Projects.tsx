"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, ArrowLeft } from "lucide-react";
import { T } from "@/lib/theme";
import { PROJECTS, type ProjectCase } from "@/data/projects";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { Tag } from "@/components/shared/Tag";

function FlowRow({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div>
      <div className="pf-mono" style={{ fontSize: 10, color, letterSpacing: "0.12em", marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <span className="pf-mono" style={{ fontSize: 10, color: T.faint, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: T.text }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseStudy({ p, onClose }: { p: ProjectCase; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onScroll = () => setScrolled((el?.scrollTop ?? 0) > 20);
    window.addEventListener("keydown", onKey);
    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("scroll", onScroll);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bg2} 100%)`,
        overflowY: "auto",
      }}
    >
      {/* Sticky header bar — always visible while reading */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: scrolled ? `${T.bg}f5` : `${T.bg}88`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
          transition: "all .25s",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            onClick={onClose}
            className="pf-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.surface2,
              border: `1px solid ${T.borderLit}`,
              color: T.text,
              padding: "9px 14px",
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.amber;
              e.currentTarget.style.color = T.amber;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.borderLit;
              e.currentTarget.style.color = T.text;
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="pf-mono" style={{ fontSize: 11, color: T.faint, letterSpacing: "0.08em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.name.toUpperCase()}
          </div>
          <button
            onClick={onClose}
            className="pf-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: T.dim,
              padding: "9px 10px",
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
          >
            <X size={14} /> Esc
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 120px" }}>
        <div className="pf-mono" style={{ fontSize: 11, color: p.color, letterSpacing: "0.1em", marginBottom: 12 }}>{p.tag}</div>
        <h2 className="pf-disp" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 600, letterSpacing: "-0.02em", margin: 0, maxWidth: 700 }}>
          {p.name}
        </h2>
        <p style={{ color: T.dim, fontSize: 16, lineHeight: 1.6, marginTop: 14, maxWidth: 620 }}>{p.headline}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
          {p.stack.map((s) => <Tag key={s} color={p.color}>{s}</Tag>)}
        </div>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 26 }}>
          <FlowRow label="01 · PROBLEM" items={[p.problem]} color={p.color} />
          <FlowRow label="02 · ARCHITECTURE" items={p.architecture} color={p.color} />
          <FlowRow label="03 · BUILD" items={p.build} color={p.color} />
          <div>
            <div className="pf-mono" style={{ fontSize: 10, color: p.color, letterSpacing: "0.12em", marginBottom: 12 }}>04 · AI</div>
            <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7, padding: "12px 16px 12px 20px", borderLeft: `2px solid ${p.color}`, background: `${p.color}0a`, borderRadius: 4 }}>
              {p.ai}
            </div>
          </div>
          <div>
            <div className="pf-mono" style={{ fontSize: 10, color: p.color, letterSpacing: "0.12em", marginBottom: 12 }}>05 · AUTOMATION</div>
            <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7, padding: "12px 16px 12px 20px", borderLeft: `2px solid ${T.amber}`, background: `${T.amber}0a`, borderRadius: 4 }}>
              {p.automation}
            </div>
          </div>
          <FlowRow label="06 · INTEGRATION" items={p.integration} color={p.color} />
          <div>
            <div className="pf-mono" style={{ fontSize: 10, color: T.amber, letterSpacing: "0.12em", marginBottom: 12 }}>07 · RESULT</div>
            <div style={{ fontSize: 15, color: T.text, lineHeight: 1.7, padding: "16px 20px", border: `1px solid ${T.amber}44`, background: `${T.amber}0a`, borderRadius: 6 }}>
              {p.result}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={`mailto:hello@praxen.studio?subject=${encodeURIComponent(`Project inquiry: ${p.name}`)}`}
            className="pf-btn pf-btn-solid"
            style={{ textDecoration: "none", display: "inline-flex" }}
          >
            Build Something Like This <ArrowUpRight size={14} />
          </a>
          <button className="pf-btn" onClick={onClose}>
            <ArrowLeft size={13} /> Back To Case Studies
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = PROJECTS.find((p) => p.id === openId) ?? null;

  return (
    <SectionWrap id="work">
      <Reveal>
        <Eyebrow color={T.blue}>Case Studies</Eyebrow>
        <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
          Systems, not screenshots
        </h2>
        <p style={{ color: T.dim, marginTop: 16, maxWidth: 620, fontSize: 15, lineHeight: 1.6 }}>
          Representative system designs illustrating how we approach a build end to end. Outcomes are
          described qualitatively — no invented numbers.
        </p>
      </Reveal>

      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 16 }}>
        {PROJECTS.map((p, i) => (
          <Reveal delay={i * 80} key={p.id}>
            <button
              className="pf-card"
              onClick={() => setOpenId(p.id)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: 30,
                cursor: "pointer",
                transition: "all .3s",
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = p.color;
                (e.currentTarget as HTMLElement).style.background = `${p.color}08`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = T.border;
                (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              <div className="pf-mono" style={{ fontSize: 11, color: p.color, letterSpacing: "0.1em", minWidth: 190 }}>
                {String(i + 1).padStart(2, "0")} / {p.tag}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="pf-disp" style={{ fontSize: 22, fontWeight: 600, color: T.text }}>{p.name}</div>
                <div className="pf-mono" style={{ fontSize: 11, color: T.faint, marginTop: 6 }}>{p.status} CASE</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 420 }}>
                {p.stack.slice(0, 5).map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
              <div className="pf-mono" style={{ fontSize: 11, color: T.dim, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                OPEN CASE <ArrowRight size={13} />
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open && <CaseStudy p={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </SectionWrap>
  );
}
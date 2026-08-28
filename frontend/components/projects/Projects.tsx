"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, ArrowLeft, ChevronRight, Book, Search, Lock } from "lucide-react";
import { T } from "@/lib/theme";
import { PROJECTS, type ProjectCase } from "@/data/projects";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { Tag } from "@/components/shared/Tag";
import { useCaseStudy } from "@/lib/case-study-context";

const CASE_SECTIONS = [
  { id: "problem", num: "01", label: "PROBLEM" },
  { id: "architecture", num: "02", label: "ARCHITECTURE" },
  { id: "build", num: "03", label: "BUILD" },
  { id: "ai", num: "04", label: "AI" },
  { id: "automation", num: "05", label: "AUTOMATION" },
  { id: "integration", num: "06", label: "INTEGRATION" },
  { id: "result", num: "07", label: "RESULT" },
] as const;

function FlowRow({ label, items, color, id }: { label: string; items: string[]; color: string; id?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 100 }}>
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

export function CaseStudy({ p }: { p: ProjectCase }) {
  const { setOpenId } = useCaseStudy();
  const onClose = () => setOpenId(null);
  const [activeSection, setActiveSection] = useState<string>("problem");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // The content area isn't a bounded scroll pane (it grows to fit its content),
  // so the page itself scrolls — the section spy has to track window scroll,
  // not a scroll event on the content div (which never fires).
  // Mount-only: `setOpenId` is a stable setState reference, so this never
  // needs to re-run — re-running on every scroll-driven render would call
  // window.scrollTo(0) on every tick and fight the user's own scrolling.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    const onScroll = () => {
      let current = CASE_SECTIONS[0].id as string;
      for (const s of CASE_SECTIONS) {
        const sec = document.getElementById(`cs-${s.id}`);
        if (sec && sec.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActiveSection(current);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(`cs-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        zIndex: 10,
        background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bg2} 100%)`,
        minHeight: "100vh",
      }}
    >
      {/* Layout: Sidebar + Content */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Left Sidebar - Section Navigation */}
        <motion.aside
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: sidebarOpen ? 280 : 72 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: sidebarOpen ? 280 : 72,
            minWidth: sidebarOpen ? 280 : 72,
            background: `${T.bg}f0`,
            borderRight: `1px solid ${T.border}`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "sticky",
            top: 72,
            height: "calc(100vh - 72px)",
            zIndex: 20,
          }}
        >
          {/* Sidebar Header */}
          <div style={{ padding: "20px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="pf-mono" style={{ fontSize: 10, color: p.color, letterSpacing: "0.1em" }}>{p.tag}</div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", padding: 4, display: "flex" }}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <ChevronRight size={16} style={{ transform: sidebarOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }} />
              </button>
            </div>
            {sidebarOpen && (
              <>
                <h3 className="pf-disp" style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0, lineHeight: 1.3 }}>
                  {p.name}
                </h3>
                <p style={{ color: T.dim, fontSize: 12.5, lineHeight: 1.5, marginTop: 8 }}>{p.headline}</p>
              </>
            )}
          </div>

          {/* Section Navigation */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
            <div className="pf-mono" style={{ fontSize: 9, color: T.faint, letterSpacing: "0.15em", marginBottom: 16, padding: "0 8px" }}>SECTIONS</div>
            {CASE_SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.id)}
                  style={{
                    width: "100%",
                    background: isActive ? `${p.color}15` : "transparent",
                    border: "none",
                    borderLeft: isActive ? `3px solid ${p.color}` : "3px solid transparent",
                    borderRadius: "0 6px 6px 0",
                    padding: "10px 12px",
                    marginBottom: 6,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all .2s",
                    color: isActive ? p.color : T.dim,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${p.color}08`;
                    e.currentTarget.style.color = p.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive ? `${p.color}15` : "transparent";
                    e.currentTarget.style.color = isActive ? p.color : T.dim;
                  }}
                >
                  <span className="pf-mono" style={{ fontSize: 10, opacity: 0.7, minWidth: sidebarOpen ? "auto" : 24, textAlign: "center" }}>{s.num}</span>
                  {sidebarOpen && <span style={{ fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Back Button at bottom of sidebar */}
          <div style={{ padding: "16px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
            <button
              onClick={onClose}
              className="pf-mono"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: 8,
                background: T.surface2,
                border: `1px solid ${T.borderLit}`,
                color: T.text,
                padding: "11px 14px",
                borderRadius: 6,
                fontSize: 11.5,
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all .2s",
                whiteSpace: "nowrap",
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
              <ArrowLeft size={14} />
              {sidebarOpen && <span>Back To Case Studies</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Content — scrolls with the page, alongside the sticky sidebar */}
          <div style={{ flex: 1, maxWidth: 900, margin: "0 auto", padding: "100px 24px 120px", width: "100%" }}>
            <h2 className="pf-disp" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 600, letterSpacing: "-0.02em", margin: 0, maxWidth: 700 }}>
              {p.name}
            </h2>
            <p style={{ color: T.dim, fontSize: 16, lineHeight: 1.6, marginTop: 14, maxWidth: 620 }}>{p.headline}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {p.stack.map((s) => <Tag key={s} color={p.color}>{s}</Tag>)}
            </div>

            <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 26 }}>
              <FlowRow id="cs-problem" label="01 · PROBLEM" items={[p.problem]} color={p.color} />
              <FlowRow id="cs-architecture" label="02 · ARCHITECTURE" items={p.architecture} color={p.color} />
              <FlowRow id="cs-build" label="03 · BUILD" items={p.build} color={p.color} />
              <div id="cs-ai" style={{ scrollMarginTop: 100 }}>
                <div className="pf-mono" style={{ fontSize: 10, color: p.color, letterSpacing: "0.12em", marginBottom: 12 }}>04 · AI</div>
                <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7, padding: "12px 16px 12px 20px", borderLeft: `2px solid ${p.color}`, background: `${p.color}0a`, borderRadius: 4 }}>
                  {p.ai}
                </div>
              </div>
              <div id="cs-automation" style={{ scrollMarginTop: 100 }}>
                <div className="pf-mono" style={{ fontSize: 10, color: p.color, letterSpacing: "0.12em", marginBottom: 12 }}>05 · AUTOMATION</div>
                <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7, padding: "12px 16px 12px 20px", borderLeft: `2px solid ${T.amber}`, background: `${T.amber}0a`, borderRadius: 4 }}>
                  {p.automation}
                </div>
              </div>
              <FlowRow id="cs-integration" label="06 · INTEGRATION" items={p.integration} color={p.color} />
              <div id="cs-result" style={{ scrollMarginTop: 100 }}>
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
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          aside { width: 72px !important; min-width: 72px !important; }
          aside > div:first-child > div:last-child { display: none; }
          aside nav button span:last-child { display: none; }
          aside button:last-child span { display: none; }
        }
        @media (max-width: 768px) {
          aside { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}

// One repo-list row — GitHub's repository-list styling: icon + name +
// visibility-style badge, description, then a language dot and topic chips.
function ProjectRow({ p, index, onOpen }: { p: ProjectCase; index: number; onOpen: () => void }) {
  const [primaryLang, ...restStack] = p.stack;
  return (
    <button
      onClick={onOpen}
      suppressHydrationWarning
      style={{
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        borderTop: index === 0 ? "none" : `1px solid ${T.border}`,
        padding: "20px 22px",
        cursor: "pointer",
        display: "block",
        transition: "background .2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = `${p.color}08`)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Book size={15} color={T.faint} style={{ flexShrink: 0 }} />
        <span className="pf-disp" style={{ fontSize: 17, fontWeight: 600, color: p.color }}>{p.name}</span>
        <span
          className="pf-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.06em",
            color: T.faint,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "2px 9px",
          }}
        >
          {p.status}
        </span>
      </div>

      <p style={{ color: T.dim, fontSize: 13.5, lineHeight: 1.55, margin: "8px 0 0", maxWidth: 640 }}>
        {p.headline}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 14 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: T.dim, flexShrink: 0 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
          {primaryLang}
        </span>
        {restStack.slice(0, 4).map((s) => (
          <span key={s} className="pf-mono" style={{ fontSize: 10, color: T.faint }}>{s}</span>
        ))}
        <span className="pf-mono" style={{ marginLeft: "auto", fontSize: 10, color: T.faint, display: "flex", alignItems: "center", gap: 5 }}>
          OPEN CASE <ArrowRight size={11} />
        </span>
      </div>
    </button>
  );
}

export function Projects() {
  const { setOpenId } = useCaseStudy();
  const [query, setQuery] = useState("");

  const filtered = PROJECTS.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q));
  });

  return (
    <SectionWrap id="work" style={{ paddingTop: 56 }}>
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

      <Reveal delay={100}>
        <div style={{ marginTop: 40, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", background: T.bg2 }}>
          {/* Window chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderBottom: `1px solid ${T.border}`,
              background: T.surface2,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div
              className="pf-mono"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 5,
                padding: "6px 12px",
                fontSize: 11,
                color: T.dim,
              }}
            >
              <Lock size={9} color={T.faint} style={{ flexShrink: 0 }} />
              stackloop.dev/case-studies
            </div>
          </div>

          {/* Repo-list header: search + count, like a GitHub repositories tab */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              padding: "14px 22px",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              className="pf-mono"
              style={{
                flex: "1 1 220px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                padding: "8px 12px",
                fontSize: 12,
                color: T.dim,
              }}
            >
              <Search size={13} color={T.faint} style={{ flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a case study..."
                suppressHydrationWarning
                style={{
                  border: "none",
                  outline: "none",
                  background: "none",
                  color: T.text,
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  width: "100%",
                }}
              />
            </div>
            <span className="pf-mono" style={{ fontSize: 11, color: T.faint, whiteSpace: "nowrap" }}>
              {filtered.length} case {filtered.length === 1 ? "study" : "studies"}
            </span>
          </div>

          {/* Repo rows */}
          {filtered.length > 0 ? (
            filtered.map((p, i) => (
              <ProjectRow key={p.id} p={p} index={i} onOpen={() => setOpenId(p.id)} />
            ))
          ) : (
            <div className="pf-mono" style={{ padding: "40px 22px", textAlign: "center", fontSize: 12.5, color: T.faint }}>
              No case studies match &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </Reveal>
    </SectionWrap>
  );
}
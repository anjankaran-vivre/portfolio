"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Cpu } from "lucide-react";
import { T } from "@/lib/theme";
import { site } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Magnetic } from "@/components/shared/Magnetic";

const VBW = 420;
const VBH = 440;

const NODES = [
  { id: "user", label: "USER", x: 350, y: 90, fn: "The request enters the system." },
  { id: "interface", label: "INTERFACE", x: 210, y: 90, fn: "The surface the user interacts with." },
  { id: "application", label: "APPLICATION", x: 70, y: 90, fn: "Business logic and application state." },
  { id: "api", label: "API", x: 70, y: 230, fn: "The typed contract between layers." },
  { id: "backend", label: "BACKEND", x: 210, y: 230, fn: "Services, rules and orchestration." },
  { id: "database", label: "DATABASE", x: 350, y: 230, fn: "The persistent source of truth." },
  { id: "ai", label: "AI / AGENT", x: 350, y: 370, fn: "Reasoning, tools and decisions." },
  { id: "automation", label: "AUTOMATION", x: 210, y: 370, fn: "Actions that run without a human." },
  { id: "action", label: "ACTION", x: 70, y: 370, fn: "The work gets done in the world." },
];

const COLORS = ["#6c9bff", "#6c9bff", "#6c9bff", "#9aa3af", "#6c9bff", "#6c9bff", "#b98bfa", "#f2b860", "#f2b860"];

const SNAKE_PATH = `M ${NODES[0].x} ${NODES[0].y}` + NODES.slice(1).map((n) => ` L ${n.x} ${n.y}`).join("");

const SEGMENTS = NODES.slice(1).map((n, i) => ({
  from: NODES[i].id,
  to: n.id,
  d: `M ${NODES[i].x} ${NODES[i].y} L ${n.x} ${n.y}`,
}));

function wrapLines(text: string): string[] {
  const words = text.split(" ");
  if (words.length <= 1) return [text];
  const target = text.length / 2;
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function NodeShape({
  node,
  color,
  index,
  mx,
  my,
  onHover,
  hovered,
  progress,
  total,
}: {
  node: (typeof NODES)[number];
  color: string;
  index: number;
  mx: number;
  my: number;
  onHover: (id: string | null) => void;
  hovered: string | null;
  progress: MotionValue<number>;
  total: number;
}) {
  const dx = mx - node.x;
  const dy = my - node.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const pull = Math.max(0, 1 - dist / 150) * 12;
  const x = node.x + (dx / (dist || 1)) * pull;
  const y = node.y + (dy / (dist || 1)) * pull;
  const isActive = hovered === node.id;
  const opacity = useTransform(progress, [(index + 1) / (total + 2), (index + 2) / (total + 2)], [0.12, 1]);

  return (
    <motion.g
      style={{ opacity, transformBox: "fill-box", transformOrigin: "center", cursor: "pointer", transition: "filter .3s" }}
      className="pf-hero-node"
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      filter={isActive ? `drop-shadow(0 0 10px ${color})` : "none"}
    >
      <circle cx={x} cy={y} r={6} fill="#08090c" stroke={color} strokeWidth={1.5} />
      {isActive && (
        <circle cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth={1} opacity={0.55} />
      )}
      <text x={x} y={y - 18} textAnchor="middle" className="pf-mono" fontSize="10" fill={isActive ? color : "#9aa3af"} letterSpacing="0.08em">
        {node.label}
      </text>
      {isActive && (
        <g className="pf-fade-in">
          {(() => {
            const lines = wrapLines(node.fn);
            const BW = 174;
            const BH = 42;
            const bx = x > VBW - 150 ? x - 14 - BW : x < 150 ? x + 14 : x - BW / 2;
            const by = y + 16;
            const tx = bx + BW / 2;
            return (
              <>
                <rect x={bx} y={by} width={BW} height={BH} rx={4} fill="#171a20" stroke={color} strokeOpacity={0.5} />
                {lines.map((ln, i) => (
                  <text key={i} x={tx} y={by + (i === 0 ? 18 : 31)} textAnchor="middle" className="pf-mono" fontSize="9.5" fill="#eef0f3">
                    {ln}
                  </text>
                ))}
              </>
            );
          })()}
        </g>
      )}
    </motion.g>
  );
}

function SystemGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mpos, setMpos] = useState({ x: -500, y: -500 });

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 85%", "end 35%"] });
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svgRef.current?.getBoundingClientRect();
        if (!r || r.width === 0) return;
        setMpos({
          x: (e.clientX - r.left) * (VBW / r.width),
          y: (e.clientY - r.top) * (VBH / r.height),
        });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hoverIdx = NODES.findIndex((n) => n.id === hovered);

  return (
    <div
      ref={wrapRef}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
        <span className="pf-mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: T.faint }}>REQUEST FLOW</span>
        <span className="pf-mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: T.amber, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amber, animation: "pf-pulse 1.6s infinite", display: "inline-block" }} />
          LIVE
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VBW} ${VBH}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHovered(null)}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id="hflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c9bff" stopOpacity="0.8" />
              <stop offset="55%" stopColor="#b98bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f2b860" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* ghost track — full path faint */}
          <path
            d={SNAKE_PATH}
            fill="none"
            stroke="#22262e"
            strokeWidth={1.5}
            strokeDasharray="4 6"
            opacity={0.6}
          />
          {/* scroll-drawn flow line */}
          <motion.path
            d={SNAKE_PATH}
            fill="none"
            stroke="url(#hflow)"
            strokeWidth={2}
            strokeDasharray="4 6"
            style={{ pathLength: pathProgress, opacity: pathOpacity }}
          />
          {/* highlighted segments near hovered node */}
          {hoverIdx >= 0 && (
            <>
              {hoverIdx > 0 && (
                <line
                  x1={NODES[hoverIdx - 1].x}
                  y1={NODES[hoverIdx - 1].y}
                  x2={NODES[hoverIdx].x}
                  y2={NODES[hoverIdx].y}
                  stroke={COLORS[hoverIdx]}
                  strokeWidth={2}
                  strokeDasharray="4 6"
                  style={{ animation: "pf-flow 1.1s linear infinite" }}
                />
              )}
              {hoverIdx < NODES.length - 1 && (
                <line
                  x1={NODES[hoverIdx].x}
                  y1={NODES[hoverIdx].y}
                  x2={NODES[hoverIdx + 1].x}
                  y2={NODES[hoverIdx + 1].y}
                  stroke={COLORS[hoverIdx]}
                  strokeWidth={2}
                  strokeDasharray="4 6"
                  style={{ animation: "pf-flow 1.1s linear infinite" }}
                />
              )}
            </>
          )}

          {/* flowing data particles along the whole path */}
          {[5, 6.4, 8].map((dur, i) => (
            <circle key={i} r={2} fill="url(#hflow)" opacity={0.9}>
              <animateMotion dur={`${dur}s`} begin={`${-i * 1.7}s`} repeatCount="indefinite" path={SNAKE_PATH} />
            </circle>
          ))}

          {NODES.map((n, i) => (
            <NodeShape
              key={n.id}
              node={n}
              color={COLORS[i]}
              index={i}
              mx={mpos.x}
              my={mpos.y}
              onHover={setHovered}
              hovered={hovered}
              progress={scrollYProgress}
              total={NODES.length}
            />
          ))}
        </svg>
      </div>

      <div className="pf-mono" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: T.faint, textAlign: "center" }}>
        SCROLL TO DRAW THE FLOW — HOVER A NODE TO INSPECT
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  return (
    <section
      id="hero"
      ref={ref}
      style={{ position: "relative", minHeight: "100vh", padding: "150px 24px 0", overflow: "hidden", zIndex: 1 }}
    >
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1240,
          margin: "0 auto",
          y: yText,
          opacity,
        }}
      >
        <div className="pf-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: 56, alignItems: "center" }}>
          {/* Text column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Eyebrow color={T.amber}>{site.founderLine} — ENGINEERING STUDIO</Eyebrow>
            </motion.div>

            <h1
              className="pf-disp"
              style={{
                fontSize: "clamp(34px, 5.4vw, 66px)",
                fontWeight: 600,
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                maxWidth: 760,
                margin: 0,
              }}
            >
              {site.headline.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="pf-inline-block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.05 }}
                  style={{
                    display: "inline-block",
                    marginRight: "0.24em",
                    color: word === "SYSTEMS." ? T.amber : undefined,
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <span className="pf-blink-cursor" style={{ fontSize: "0.5em" }} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              style={{ marginTop: 26, maxWidth: 540, fontSize: 17, lineHeight: 1.6, color: T.dim }}
            >
              {site.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
              style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}
            >
              <Magnetic>
                <button className="pf-btn pf-btn-solid" onClick={() => scrollToSection("work")}>
                  See The Work <ArrowUpRight size={14} />
                </button>
              </Magnetic>
              <Magnetic>
                <button className="pf-btn" onClick={() => scrollToSection("agent-lab")}>
                  Enter Agent Lab <Cpu size={14} />
                </button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ marginTop: 52, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}
              className="pf-mono"
            >
              <div style={{ fontSize: 12, color: T.text, letterSpacing: "0.12em", fontWeight: 500 }}>{site.name}</div>
              <div style={{ color: T.border }}>/</div>
              {site.positioning.split(" · ").map((p, i) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 11, color: T.faint, letterSpacing: "0.1em" }}>{p}</div>
                  {i < site.positioning.split(" · ").length - 1 && <div style={{ color: T.border }}>/</div>}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Graph column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <SystemGraph />
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        .pf-inline-block { display: inline-block; }
        .pf-fade-in { animation: pf-fade-up .3s ease both; }
        @media (max-width: 1000px) {
          .pf-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
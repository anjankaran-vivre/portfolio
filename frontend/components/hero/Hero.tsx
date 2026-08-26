"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Monitor,
  Code,
  Server,
  Database,
  Bot,
  Zap,
  Rocket,
  Box,
  ArrowUpRight,
} from "lucide-react";
import { T } from "@/lib/theme";
import { site } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";
import { STACKLOOPLogo } from "@/components/navigation/Nav";

// Hub-and-spoke system flow (reference layout: test.html hero visual)
// Left column feeds data INTO the core, right column receives actions OUT of it.
const FLOW_NODES_LEFT = [
  { id: "frontend", num: "01", label: "FRONTEND", desc: "React / Next.js", icon: Monitor },
  { id: "api", num: "02", label: "API LAYER", desc: "GraphQL / REST", icon: Code },
  { id: "backend", num: "03", label: "BACKEND", desc: "Node.js / Python", icon: Server },
  { id: "database", num: "04", label: "DATABASE", desc: "SQL / NoSQL", icon: Database },
];

const FLOW_NODES_RIGHT = [
  { id: "ai", num: "05", label: "AI AGENT", desc: "Reasoning / Tools", icon: Bot },
  { id: "automation", num: "06", label: "AUTOMATION", desc: "Workflows / Triggers", icon: Zap },
  { id: "integrations", num: "07", label: "INTEGRATIONS", desc: "APIs / Webhooks", icon: Box },
  { id: "action", num: "08", label: "ACTION", desc: "Real World Impact", icon: Rocket },
];

// Bezier connectors in a 400x520 space; the core sits at (200,260).
const LEFT_PATHS = [
  "M90,45 Q200,45 200,260",
  "M90,180 Q170,190 200,260",
  "M90,335 Q170,330 200,260",
  "M90,470 Q200,470 200,260",
];
// Right-side paths written from the core OUTWARD so packets stream out to nodes.
const RIGHT_PATHS_OUT = [
  "M200,260 Q200,45 310,45",
  "M200,260 Q230,190 310,180",
  "M200,260 Q230,330 310,335",
  "M200,260 Q200,470 310,470",
];

// Partner list with custom inline SVG icons
const PARTNERS = [
  {
    name: "Startify",
    icon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: "Nexora",
    icon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: "StackOne",
    icon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
      </svg>
    ),
  },
  {
    name: "CloudBase",
    icon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    name: "Droip",
    icon: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

// Single node card in the flow columns
function FlowNodeCard({
  node,
  side,
  idx,
  mounted,
  hoveredNode,
  setHoveredNode,
}: {
  node: (typeof FLOW_NODES_LEFT)[number];
  side: "left" | "right";
  idx: number;
  mounted: boolean;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}) {
  const IconComponent = node.icon;
  const active = hoveredNode === node.id;
  const anyHovered = hoveredNode !== null;

  return (
    <motion.div
      className="sf-node"
      onMouseEnter={() => setHoveredNode(node.id)}
      onMouseLeave={() => setHoveredNode(null)}
      initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
      animate={
        mounted
          ? { opacity: anyHovered && !active ? 0.35 : 1, x: 0 }
          : { opacity: 0, x: side === "left" ? -24 : 24 }
      }
      whileHover={{ y: -2 }}
      transition={{
        opacity: { duration: 0.3 },
        x: mounted
          ? { duration: 0.55 }
          : { duration: 0.6, delay: 0.25 + idx * 0.09, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 0.25 },
      }}
      style={{
        borderColor: active ? "rgba(185,139,250,0.5)" : T.border,
        boxShadow: active
          ? "0 8px 22px rgba(185,139,250,0.16)"
          : "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <div className="sf-chip">
        <IconComponent
          size={15}
          color={active ? T.violet : "#9aa3af"}
          strokeWidth={1.9}
          style={{ transition: "color 0.2s" }}
        />
      </div>
      <div className="pf-mono sf-tt">
        <b>
          <span style={{ color: T.violet, marginRight: "4px" }}>{node.num}</span>
          {node.label}
        </b>
        <span>{node.desc}</span>
      </div>
    </motion.div>
  );
}

// Right-side hub-and-spoke system flow visual:
// glowing core with spinning rings, curved connectors carrying light packets,
// and two columns of capability nodes feeding in / acting out.
function SystemFlow({
  hoveredNode,
  setHoveredNode,
}: {
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [coreHovered, setCoreHovered] = useState(false);
  const [pulses, setPulses] = useState<number[]>([]);
  const pulseId = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Emit expanding wave rings from the core on click
  const triggerPulse = () => {
    const id = ++pulseId.current;
    setPulses((prev) => [...prev, id]);
    window.setTimeout(() => {
      setPulses((prev) => prev.filter((p) => p !== id));
    }, 1900);
  };

  return (
    <div className="sf-stage">
      {/* Curved connectors + travelling data packets */}
      <svg className="sf-lines" viewBox="0 0 400 520" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sf-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b98bfa" />
            <stop offset="1" stopColor="#6c9bff" />
          </linearGradient>
        </defs>

        {FLOW_NODES_LEFT.map((node, i) => {
          const active = hoveredNode === node.id;
          const anyHovered = hoveredNode !== null;
          return (
            <g key={node.id}>
              <path
                d={LEFT_PATHS[i]}
                className="sf-line"
                style={{ opacity: anyHovered && !active ? 0.12 : 0.55 }}
              />
              <circle r="2.4" fill="#b98bfa" className="sf-packet">
                <animateMotion
                  dur={`${3 + i * 0.45}s`}
                  begin={`${i * 0.55}s`}
                  repeatCount="indefinite"
                  path={LEFT_PATHS[i]}
                />
              </circle>
            </g>
          );
        })}

        {FLOW_NODES_RIGHT.map((node, i) => {
          const active = hoveredNode === node.id;
          const anyHovered = hoveredNode !== null;
          return (
            <g key={node.id}>
              <path
                d={RIGHT_PATHS_OUT[i]}
                className="sf-line"
                style={{ opacity: anyHovered && !active ? 0.12 : 0.55 }}
              />
              <circle r="2.4" fill="#6c9bff" className="sf-packet">
                <animateMotion
                  dur={`${3 + ((i + 2) % 4) * 0.45}s`}
                  begin={`${i * 0.55 + 0.9}s`}
                  repeatCount="indefinite"
                  path={RIGHT_PATHS_OUT[i]}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Spinning rings - stay on top, visible over everything */}
      <div className="sf-rings-wrap">
        <div className="sf-ring sf-r3" />
        <div className="sf-ring sf-r2" />
        <div className="sf-ring sf-r1">
          <span className="sf-orbit-dot" />
        </div>
      </div>

      {/* Core circle with v logo - tucked behind the branch cards */}
      <div className="sf-core-wrap">
        <motion.div
          className="sf-core-circle"
          onMouseEnter={() => setCoreHovered(true)}
          onMouseLeave={() => setCoreHovered(false)}
          onClick={triggerPulse}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          style={{
            borderColor: coreHovered ? "rgba(185,139,250,0.9)" : "rgba(185,139,250,0.4)",
            boxShadow: coreHovered
              ? "0 0 80px rgba(185,139,250,0.45), inset 0 0 40px rgba(185,139,250,0.25)"
              : "0 0 60px rgba(185,139,250,0.22), inset 0 0 30px rgba(185,139,250,0.12)",
            cursor: "pointer",
          }}
        >
          <span className="sf-core-aura" />
          {pulses.map((id) => (
            <span key={`${id}a`} className="sf-pulse" />
          ))}
          {pulses.map((id) => (
            <span key={`${id}b`} className="sf-pulse" style={{ animationDelay: "0.22s" }} />
          ))}
          <STACKLOOPLogo size={38} />
        </motion.div>
      </div>

      {/* Node columns */}
      <div className="sf-cols">
        <div className="sf-col">
          {FLOW_NODES_LEFT.map((node, idx) => (
            <FlowNodeCard
              key={node.id}
              node={node}
              side="left"
              idx={idx}
              mounted={mounted}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          ))}
        </div>
        <div className="sf-col sf-col-right">
          {FLOW_NODES_RIGHT.map((node, idx) => (
            <FlowNodeCard
              key={node.id}
              node={node}
              side="right"
              idx={idx}
              mounted={mounted}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          ))}
        </div>
      </div>

      <style>{`
        .sf-stage{position:relative;height:520px;width:100%;max-width:480px;margin:0 auto;}
        .sf-lines{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;}
        .sf-line{fill:none;stroke:url(#sf-line-grad);stroke-width:1;transition:opacity .35s ease;}
        .sf-packet{filter:drop-shadow(0 0 4px rgba(185,139,250,0.85));}
        .sf-cols{position:absolute;inset:0;display:flex;justify-content:space-between;pointer-events:none;z-index:3;}
        .sf-col{display:flex;flex-direction:column;justify-content:space-between;height:100%;width:min(210px,34vw);pointer-events:auto;}
        .sf-node{background:#111318;border:1px solid #22262e;border-radius:10px;padding:11px 13px;display:flex;align-items:center;gap:10px;width:100%;cursor:pointer;will-change:transform;transition:border-color .25s ease, box-shadow .25s ease;}
        .sf-chip{width:32px;height:32px;flex:none;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(185,139,250,0.12);}
        .sf-tt b{display:block;font-size:11px;font-weight:600;letter-spacing:.5px;color:#eef0f3;line-height:1.3;margin-bottom:1px;}
        .sf-tt span{display:block;font-size:10.5px;color:#9aa3af;line-height:1.3;}
        .sf-core-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:190px;height:190px;z-index:1;pointer-events:none;}
        .sf-rings-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:190px;height:190px;z-index:4;pointer-events:none;}
        .sf-ring{position:absolute;border-radius:50%;}
        .sf-r1{inset:0;border:1px solid rgba(185,139,250,.35);animation:pf-spin 14s linear infinite;}
        .sf-r2{inset:-28px;border:1px solid rgba(108,155,255,.18);animation:pf-spin 26s linear infinite reverse;}
        .sf-r3{inset:-56px;border:1px dashed rgba(185,139,250,.12);animation:pf-spin 44s linear infinite;}
        .sf-orbit-dot{position:absolute;top:-3px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#b98bfa;box-shadow:0 0 8px #b98bfa;display:block;}
        .sf-core-circle{position:absolute;inset:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%, rgba(185,139,250,.25), rgba(8,9,12,.95));border:1px solid rgba(185,139,250,.4);box-shadow:0 0 60px rgba(185,139,250,.22), inset 0 0 30px rgba(185,139,250,.12);pointer-events:auto;transition:border-color .25s ease, box-shadow .25s ease;}
        @keyframes sf-wave{
          0%{transform:scale(.55);opacity:.8;}
          100%{transform:scale(3.4);opacity:0;}
        }
        .sf-pulse{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(185,139,250,.6);box-shadow:0 0 18px rgba(185,139,250,.35), inset 0 0 10px rgba(185,139,250,.2);animation:sf-wave 1.5s cubic-bezier(.16,1,.3,1) forwards;display:block;pointer-events:none;}
        .sf-core-aura{position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(185,139,250,.35);animation:pf-ping 2.4s cubic-bezier(.16,1,.3,1) infinite;display:block;}
        @media(max-width:1000px){.sf-stage{height:500px;max-width:460px;}}
        @media(max-width:600px){
          .sf-stage{height:420px;}
          .sf-col{width:min(150px,33vw);}
          .sf-node{padding:9px 10px;gap:8px;border-radius:8px;}
          .sf-chip{width:26px;height:26px;border-radius:6px;}
          .sf-tt b{font-size:9.5px;}
          .sf-tt span{font-size:8.5px;}
          .sf-core-wrap{transform:translate(-50%,-50%) scale(.72);}
          .sf-rings-wrap{transform:translate(-50%,-50%) scale(.72);}
        }
      `}</style>
    </div>
  );
}


export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Scroll bindings for drawing paths and fades
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      id="hero"
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "88px 24px 64px",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Main Columns Grid */}
        <div
          className="pf-hero-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Text & Partner Logos */}
          <motion.div style={{ y: textY, opacity: textOpacity, display: "flex", flexDirection: "column" }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Restored and fused brand labels */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  border: `1.5px solid ${T.violet}33`,
                  background: `${T.violet}08`,
                  color: T.violet,
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: T.violet,
                    animation: "pf-pulse 1.8s infinite",
                  }}
                />
                DIGITAL SYSTEMS. INTELLIGENT FUTURE.
                <span style={{ color: T.borderLit, margin: "0 6px" }}>|</span>
                <span style={{ color: T.amber }}>PRITAM x ANJAN</span>
              </div>
            </motion.div>

            {/* Redesigned Headline */}
            <h1
              className="pf-disp"
              style={{
                fontSize: "clamp(30px, 4.1vw, 47px)",
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                margin: "0 0 18px",
                color: T.text,
              }}
            >
              We design, build,
              <br />
              automate & deploy
              <br />
              digital systems that
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${T.violet} 0%, ${T.blue} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                think, work & scale.
              </span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "15px",
                lineHeight: "1.55",
                color: T.dim,
                maxWidth: "520px",
                margin: "0 0 26px",
              }}
            >
              {site.subhead}
            </motion.p>

            {/* Redesigned Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}
            >
              <button
                className="pf-mono"
                onClick={() => scrollToSection("systems")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  border: "none",
                  background: `linear-gradient(135deg, ${T.violet} 0%, ${T.violet}ee 100%)`,
                  color: T.bg,
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: `0 4px 20px ${T.violet}33`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 6px 24px ${T.violet}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 4px 20px ${T.violet}33`;
                }}
              >
                EXPLORE SYSTEMS <ArrowUpRight size={13} strokeWidth={2.2} />
              </button>

              <button
                className="pf-mono"
                onClick={() => scrollToSection("work")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  border: `1.5px solid ${T.borderLit}`,
                  background: "transparent",
                  color: T.text,
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.text;
                  e.currentTarget.style.background = `${T.text}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.borderLit;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                VIEW WORK{" "}
                <span style={{ fontSize: "9px", display: "inline-flex", transform: "translateY(0.5px)" }}>AK x PR</span>
              </button>
            </motion.div>

            {/* Trusted By Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div
                className="pf-mono"
                style={{ fontSize: "10px", letterSpacing: "0.12em", color: T.dim, marginBottom: "10px" }}
              >
                TRUSTED BY INNOVATORS
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                {PARTNERS.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: 0.85,
                      transition: "opacity 0.25s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                  >
                    {p.icon(T.dim)}
                    <span
                      className="pf-disp"
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: T.text,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {p.name.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Compact stats row - same width as the trusted-by block, not full page */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                gap: "28px",
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: `1px solid ${T.border}`,
                maxWidth: "520px",
              }}
            >
              {[
                { val: "20+", label: "Projects Delivered", icon: Box, color: T.blue },
                { val: "50+", label: "AI Agents Built", icon: Bot, color: T.violet },
                { val: "100+", label: "Automations Deployed", icon: Zap, color: T.amber },
              ].map((stat) => {
                const IconComp = stat.icon;
                return (
                  <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: `${stat.color}10`,
                        border: `1px solid ${stat.color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                        boxShadow: `0 0 10px ${stat.color}0d`,
                      }}
                    >
                      <IconComp size={14} color={stat.color} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        className="pf-disp"
                        style={{ fontSize: "18px", fontWeight: 700, color: T.text, lineHeight: 1.15 }}
                      >
                        {stat.val}
                      </span>
                      <span
                        className="pf-mono"
                        style={{ fontSize: "8.5px", color: T.dim, letterSpacing: "0.06em" }}
                      >
                        {stat.label.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column: system flow graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              alignSelf: "start",
              paddingTop: "26px",
              marginTop: "-24px",
            }}
          >
            {/* Hub-and-spoke system flow graphic - expanded size */}
            <SystemFlow
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          </motion.div>
        </div>

        {/* Centered scroll cue at the bottom of the hero */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            zIndex: 5,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pf-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: T.dim,
              fontSize: "9px",
              letterSpacing: "0.12em",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "22px",
                borderRadius: "10px",
                border: `1px solid ${T.borderLit}`,
                display: "flex",
                justifyContent: "center",
                padding: "3px 0",
              }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ width: "3px", height: "3px", borderRadius: "50%", background: T.violet }}
              />
            </div>
            <span>SCROLL TO EXPLORE</span>
          </motion.div>
        </div>
      </div>

      {/* Global CSS adjustments */}
      <style>{`
        .pf-hero-main-grid {
          align-items: center;
        }
        @media (max-width: 1000px) {
          .pf-hero-main-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}

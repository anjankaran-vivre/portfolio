"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock, MousePointerClick, RefreshCw } from "lucide-react";
import { T } from "@/lib/theme";
import { LIVE_SITES, type LiveSite } from "@/data/liveWork";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

// Depth offsets for windows peeking out behind the front one.
const STACK_OFFSETS = [
  { x: 0, y: 0, scale: 1, opacity: 1 },
  { x: -26, y: 22, scale: 0.965, opacity: 0.55 },
  { x: -42, y: 38, scale: 0.94, opacity: 0.3 },
];
const MAX_VISIBLE_DEPTH = STACK_OFFSETS.length - 1;

// One real browser window — chrome + an iframe of the actual live site.
// Not a screenshot: this is the product, running.
function BrowserWindow({ site, front }: { site: LiveSite; front: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(0);
  // A live iframe otherwise swallows the mouse wheel the moment the cursor
  // passes over it (its own page scrolls instead of the site), which freezes
  // scroll and strands the nav's active tab. Require a click to "unlock"
  // scroll/interaction on it, and re-lock whenever it leaves the front.
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    if (!front) setInteractive(false);
  }, [front]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        background: T.bg2,
        boxShadow: front ? "0 26px 60px rgba(0,0,0,0.45)" : "0 10px 26px rgba(0,0,0,0.35)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderBottom: `1px solid ${T.border}`,
          background: T.surface2,
          flexShrink: 0,
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
            padding: "6px 10px",
            minWidth: 0,
          }}
        >
          <Lock size={10} color={T.faint} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: T.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {site.domain}
          </span>
        </div>
        <button
          onClick={() => {
            setLoaded(false);
            setKey((k) => k + 1);
          }}
          title="Reload"
          style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", display: "flex", flexShrink: 0, padding: 2 }}
        >
          <RefreshCw size={13} />
        </button>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open live site"
          style={{ display: "flex", flexShrink: 0, color: T.faint }}
          onMouseEnter={(e) => (e.currentTarget.style.color = site.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.faint)}
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      {/* Live page */}
      <div style={{ position: "relative", flex: 1, background: "#fff" }}>
        {!loaded && (
          <div
            className="pf-mono"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: T.bg2,
              fontSize: 10.5,
              color: T.faint,
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ width: 22, height: 22, border: `2px solid ${T.border}`, borderTopColor: site.color, borderRadius: "50%", animation: "pf-spin 0.8s linear infinite" }} />
            LOADING LIVE PAGE…
          </div>
        )}
        <iframe
          key={key}
          src={site.url}
          title={site.name}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", border: "none", display: "block", pointerEvents: interactive ? "auto" : "none" }}
        />
        {loaded && !interactive && (
          <button
            onClick={() => setInteractive(true)}
            className="pf-mono"
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10.5,
                letterSpacing: "0.05em",
                color: T.dim,
                background: `${T.bg}dd`,
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: "7px 14px",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <MousePointerClick size={12} color={site.color} />
              Click to interact — scroll stays on the page until then
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function LiveWork() {
  const [active, setActive] = useState<string>(LIVE_SITES[0].id);
  const activeSite = LIVE_SITES.find((s) => s.id === active) ?? LIVE_SITES[0];

  // Non-active sites keep their catalog order behind the active one.
  const order = [...LIVE_SITES.map((s) => s.id).filter((id) => id !== active), active];

  return (
    <SectionWrap id="live-work" style={{ paddingTop: 56 }}>
      <Reveal>
        <Eyebrow color={T.blue}>Live In Production</Eyebrow>
        <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
          See it running
        </h2>
        <p style={{ color: T.dim, marginTop: 16, maxWidth: 620, fontSize: 15, lineHeight: 1.6 }}>
          These aren&apos;t screenshots or mockups — the windows below load the actual live product,
          right now, in an iframe.
        </p>
      </Reveal>

      <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
        {LIVE_SITES.map((s, i) => (
          <Reveal key={s.id} delay={i * 90}>
            <button
              onClick={() => setActive(s.id)}
              className="pf-mono"
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 3,
                padding: "9px 16px",
                borderRadius: 4,
                cursor: "pointer",
                border: `1px solid ${active === s.id ? s.color : T.border}`,
                background: active === s.id ? `${s.color}14` : "transparent",
                transition: "all .25s",
              }}
            >
              <span style={{ fontSize: 11.5, letterSpacing: "0.05em", color: active === s.id ? s.color : T.dim }}>{s.name}</span>
              <span style={{ fontSize: 8.5, letterSpacing: "0.1em", color: T.faint }}>{s.kind}</span>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <div
          className="pf-live-stack"
          style={{ position: "relative", marginTop: 32, height: 640 }}
        >
          {order.map((id, i) => {
            const site = LIVE_SITES.find((s) => s.id === id);
            if (!site) return null;
            const depthRaw = order.length - 1 - i;
            const depth = Math.min(depthRaw, MAX_VISIBLE_DEPTH);
            const front = depthRaw === 0;
            const hidden = depthRaw > MAX_VISIBLE_DEPTH;
            const { x, y, scale, opacity } = STACK_OFFSETS[depth];

            return (
              <motion.div
                key={id}
                animate={{ opacity: hidden ? 0 : opacity, x, y, scale }}
                transition={{ duration: 0.55, ease: EASE }}
                onClick={front ? undefined : () => setActive(id)}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: i,
                  pointerEvents: hidden ? "none" : "auto",
                  cursor: front ? "default" : "pointer",
                  transformOrigin: "bottom left",
                }}
              >
                <BrowserWindow site={site} front={front} />
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p style={{ color: T.dim, marginTop: 24, fontSize: 13, lineHeight: 1.6, maxWidth: 620 }}>
          {activeSite.description}
        </p>
      </Reveal>

      <style>{`
        @keyframes pf-spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          .pf-live-stack { height: 460px !important; }
        }
      `}</style>
    </SectionWrap>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { T } from "@/lib/theme";
import { Icon } from "@/components/shared/Icon";

// Down/failed state has no equivalent in the shared palette (every other
// token is a "good news" color) — defined locally, kept close in warmth to
// T.amber so it still reads as part of the same family under stress.
const BAD = "#c9584f";

type ServerState = "ok" | "warn" | "bad" | "off";

interface Stage {
  name: string;
  duration: number;
  caption: string;
  servers: [ServerState, ServerState, ServerState];
  active: [boolean, boolean, boolean];
  lb: boolean;
  spawnMs: number;
  showQueue?: boolean;
  packetTargets: (healthy: boolean[]) => number | null; // server index, or null for direct-to-1
}

const STATE_COLOR: Record<ServerState, string> = { ok: T.violet, warn: T.amber, bad: BAD, off: T.border };
const STATE_LOAD: Record<ServerState, string> = {
  ok: "load: nominal",
  warn: "load: high — queueing",
  bad: "load: unreachable",
  off: "not provisioned",
};

let rrIndex = 0;
function nextHealthy(healthy: boolean[]): number {
  for (let i = 0; i < healthy.length; i++) {
    rrIndex = (rrIndex + 1) % healthy.length;
    if (healthy[rrIndex]) return rrIndex;
  }
  return 0;
}

const STAGES: Stage[] = [
  {
    name: "Stage 1 · One server",
    duration: 3400,
    caption: "A single server handles every request directly.",
    servers: ["ok", "off", "off"],
    active: [true, false, false],
    lb: false,
    spawnMs: 900,
    packetTargets: () => 0,
  },
  {
    name: "Stage 2 · Overloaded",
    duration: 2600,
    caption: "Traffic grows — requests start queueing up behind it.",
    servers: ["warn", "off", "off"],
    active: [true, false, false],
    lb: false,
    spawnMs: 320,
    showQueue: true,
    packetTargets: () => 0,
  },
  {
    name: "Stage 3 · Scaling out",
    duration: 2400,
    caption: "A load balancer joins, and two more servers come online.",
    servers: ["ok", "ok", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 500,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 4 · Spreading the load",
    duration: 3600,
    caption: "Requests spread across whichever server is healthy.",
    servers: ["ok", "ok", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 5 · A server dies",
    duration: 2600,
    caption: "Server 2 crashes — the health check pulls it out instantly.",
    servers: ["ok", "bad", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 6 · Traffic keeps flowing",
    duration: 3800,
    caption: "Traffic reroutes to the survivors. The client notices nothing.",
    servers: ["ok", "bad", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
];

// Bigger, more legible server boxes than the first pass — width/height and
// vertical rhythm recomputed together so the three boxes still clear each
// other with a comfortable gap.
const BOX_W = 200;
const BOX_H = 92;
const BOX_X = 640;
const BOX_TOP = [66, 184, 302]; // n=0,1,2
const BOX_CENTER_Y = BOX_TOP.map((t) => t + BOX_H / 2); // [112, 230, 348]
const DOT_CX = BOX_X + BOX_W - 18;

const SERVER_ENTRY = BOX_CENTER_Y.map((y) => ({ x: BOX_X, y }));
const CLIENT = { x: 150, y: 230 };
const LB = { x: 385, y: 230 };

// Before the load balancer exists, there's exactly one server — it sits at
// the client's own height so the connector is a single straight line, not
// an angled stub pointing at where server 1 will eventually stack. The
// vertical offset below slides the actual server box down to meet it.
const SOLO_Y = CLIENT.y;
const SOLO_ENTRY = { x: BOX_X, y: SOLO_Y };
const SOLO_OFFSET = SOLO_Y - BOX_CENTER_Y[0];

export function ResilienceDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const packetsLayerRef = useRef<SVGGElement>(null);
  const directPathRef = useRef<SVGGElement>(null);
  const lbGroupRef = useRef<SVGGElement>(null);
  const serverRefs = useRef<(SVGGElement | null)[]>([]);
  const queueGroupRef = useRef<SVGGElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const jumpRef = useRef<(idx: number) => void>(() => {});

  const [playing, setPlaying] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);

  const playingRef = useRef(playing);
  playingRef.current = playing;
  const stageIndexRef = useRef(stageIndex);
  stageIndexRef.current = stageIndex;

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let spawnTimer: ReturnType<typeof setInterval> | null = null;
    let rafId: number | null = null;
    let stageStart = performance.now();

    function setServerState(n: number, state: ServerState, active: boolean, lbActive: boolean) {
      const g = serverRefs.current[n];
      if (!g) return;
      const solo = n === 0 && !lbActive ? SOLO_OFFSET : 0;
      g.style.opacity = active ? "1" : "0";
      g.style.transform = `translate(0px, ${solo}px) scale(${active ? 1 : 0.94})`;
      g.style.transformOrigin = `${BOX_X}px ${BOX_CENTER_Y[n]}px`;
      const box = g.querySelector<SVGRectElement>(".server-box");
      if (box) {
        box.style.stroke = STATE_COLOR[state];
        box.style.fill = `${STATE_COLOR[state]}1c`;
      }
      const dot = g.querySelector<SVGCircleElement>(".status-dot");
      if (dot) dot.style.fill = STATE_COLOR[state];
      const label = g.querySelector<SVGTextElement>(".load-label");
      if (label) label.textContent = active ? STATE_LOAD[state] : "not provisioned";
      const x = g.querySelector<SVGPathElement>(".down-x");
      if (x) x.style.opacity = state === "bad" ? "1" : "0";
      // The LB→server connector only makes sense once the load balancer
      // itself exists — before that, the straight client→server line (below)
      // is the only connector shown, so this stays hidden even though the
      // server itself is active.
      const line = g.querySelector<SVGLineElement>(".lb-line");
      if (line) line.style.opacity = active && lbActive ? "1" : "0";
    }

    function setLbActive(active: boolean) {
      if (lbGroupRef.current) lbGroupRef.current.style.opacity = active ? "1" : "0";
      if (directPathRef.current) directPathRef.current.style.opacity = active ? "0" : "1";
    }

    function shootPacket(waypoints: { x: number; y: number }[], color: string, duration: number) {
      const layer = packetsLayerRef.current;
      if (!layer) return;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", "5.5");
      c.setAttribute("fill", color);
      layer.appendChild(c);
      const start = performance.now();
      function seg(t: number) {
        const total = waypoints.length - 1;
        const pos = t * total;
        const i = Math.min(Math.floor(pos), total - 1);
        const localT = pos - i;
        const a = waypoints[i];
        const b = waypoints[i + 1];
        return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
      }
      function frame(now: number) {
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        const p = seg(t);
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.setAttribute("opacity", t > 0.85 ? String(1 - (t - 0.85) / 0.15) : "1");
        if (t < 1) requestAnimationFrame(frame);
        else c.remove();
      }
      requestAnimationFrame(frame);
    }

    function fireStagePacket(stage: Stage) {
      const healthy = stage.servers.map((s) => s !== "off" && s !== "bad");
      const i = stage.packetTargets(healthy);
      if (i === null) return;
      const waypoints = stage.lb ? [CLIENT, LB, SERVER_ENTRY[i]] : [CLIENT, SOLO_ENTRY];
      shootPacket(waypoints, T.blue, stage.lb ? 700 : 650);
    }

    function applyStage(idx: number) {
      const stage = STAGES[idx];
      setLbActive(stage.lb);
      stage.servers.forEach((s, n) => setServerState(n, s, stage.active[n], stage.lb));
      if (queueGroupRef.current) queueGroupRef.current.style.opacity = stage.showQueue ? "1" : "0";
      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        d.classList.toggle("done", i < idx);
        d.classList.toggle("active", i === idx);
        d.style.removeProperty("--p");
      });
      if (spawnTimer) clearInterval(spawnTimer);
      if (playingRef.current && !reduceMotion) {
        spawnTimer = setInterval(() => fireStagePacket(stage), stage.spawnMs);
        fireStagePacket(stage);
      }
    }

    function tick(now: number) {
      const idx = stageIndexRef.current;
      const stage = STAGES[idx];
      const elapsed = now - stageStart;
      const p = Math.min(1, elapsed / stage.duration);
      const dot = dotRefs.current[idx];
      if (dot) dot.style.setProperty("--p", String(p));
      if (playingRef.current) {
        if (elapsed >= stage.duration) {
          const nextIdx = (idx + 1) % STAGES.length;
          stageStart = now;
          setStageIndex(nextIdx);
          applyStage(nextIdx);
        }
        rafId = requestAnimationFrame(tick);
      }
    }

    // Lets the clickable stage dots (rendered outside this effect) jump the
    // animation straight to a chosen stage instead of only watching it play.
    jumpRef.current = (idx: number) => {
      stageStart = performance.now();
      setStageIndex(idx);
      applyStage(idx);
    };

    applyStage(stageIndexRef.current);
    if (!reduceMotion) rafId = requestAnimationFrame(tick);

    return () => {
      if (spawnTimer) clearInterval(spawnTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const stage = STAGES[stageIndex];

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: `${T.blue}18`,
            border: `1px solid ${T.blue}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="shield" size={16} color={T.blue} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pf-disp" style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Load Balancing &amp; Failover</div>
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, marginTop: 4 }}>How we keep traffic flowing when a server goes down.</div>
        </div>
        <button
          type="button"
          className="pf-btn"
          onClick={() => setPlaying((p) => !p)}
          style={{ padding: "8px 14px", fontSize: 10.5, flexShrink: 0 }}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "Pause" : "Play"}
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 900 460"
        role="img"
        aria-label="Diagram of a client sending requests through a load balancer to three servers, one of which fails while traffic keeps flowing to the other two."
        style={{ display: "block", width: "100%", height: "auto", color: T.dim, marginTop: 18 }}
      >
        <defs>
          <marker id="rd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fontFamily="var(--font-mono), IBM Plex Mono, monospace" fontSize="12" fontWeight={600}>
          <rect x={40} y={200} width={110} height={60} rx={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
          <text x={95} y={235} textAnchor="middle" fill={T.text}>CLIENT</text>

          {/* Before there's a load balancer, one straight line — client
              straight to the single server, no angled stub. */}
          <g id="directPath" ref={directPathRef}>
            <line x1={CLIENT.x} y1={CLIENT.y} x2={SOLO_ENTRY.x} y2={SOLO_ENTRY.y} stroke="currentColor" strokeWidth={1.6} markerEnd="url(#rd-arrow)" />
            <text x={(CLIENT.x + SOLO_ENTRY.x) / 2} y={CLIENT.y - 14} textAnchor="middle" fontWeight={500} fill="currentColor" opacity={0.75}>request</text>
          </g>

          <g id="lb-group" ref={lbGroupRef}>
            <polygon points="330,190 385,230 330,270 275,230" fill="none" stroke={T.blue} strokeWidth={1.6} />
            <text x={330} y={234} textAnchor="middle" fill={T.blue}>LB</text>
            <line x1={150} y1={230} x2={278} y2={230} stroke="currentColor" strokeWidth={1.6} markerEnd="url(#rd-arrow)" />
          </g>

          {[0, 1, 2].map((n) => (
            <g key={n} className="server-group" ref={(el) => { serverRefs.current[n] = el; }}>
              <line
                className="lb-line"
                x1={388}
                y1={222 + n * 8}
                x2={BOX_X}
                y2={BOX_CENTER_Y[n]}
                stroke="currentColor"
                strokeWidth={1.6}
                markerEnd="url(#rd-arrow)"
              />
              <rect className="server-box" x={BOX_X} y={BOX_TOP[n]} width={BOX_W} height={BOX_H} rx={12} fill="none" stroke="currentColor" strokeWidth={2} />
              <text x={BOX_X + 20} y={BOX_TOP[n] + 34} fill={T.text}>SERVER {n + 1}</text>
              <text className="load-label" x={BOX_X + 20} y={BOX_TOP[n] + 60} fontWeight={500} fill="currentColor" opacity={0.7}>
                load: nominal
              </text>
              <circle className="status-dot" cx={DOT_CX} cy={BOX_TOP[n] + 20} r={8} />
              <path
                className="down-x"
                d={`M${DOT_CX - 5},${BOX_TOP[n] + 15} L${DOT_CX + 5},${BOX_TOP[n] + 25} M${DOT_CX + 5},${BOX_TOP[n] + 15} L${DOT_CX - 5},${BOX_TOP[n] + 25}`}
                stroke={T.text}
                strokeWidth={2}
                opacity={0}
              />
            </g>
          ))}

          <g id="queueGroup" ref={queueGroupRef} opacity={0}>
            <circle className="q-dot" cx={618} cy={118} r={4} fill={T.amber} />
            <circle className="q-dot" cx={606} cy={118} r={4} fill={T.amber} />
            <circle className="q-dot" cx={594} cy={118} r={4} fill={T.amber} />
          </g>
        </g>

        <g ref={packetsLayerRef} />
      </svg>

      {/* Stage indicator + clickable timeline — moved below the diagram so
          the animation is the first thing read, the controls come after. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18 }}>
        <span className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: T.blue }}>
          {stage.name}
        </span>
        <span className="pf-mono" style={{ fontSize: 10, color: T.faint }}>
          STEP {stageIndex + 1}/{STAGES.length}
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {STAGES.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to ${s.name}`}
            title={s.name}
            onClick={() => jumpRef.current(i)}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="pf-resilience-dot"
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: T.surface2,
              overflow: "hidden",
              position: "relative",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <p style={{ minHeight: 40, fontSize: 14, lineHeight: 1.5, color: T.dim, margin: "12px 2px 0" }}>
        {stage.caption}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", margin: "18px 2px 0", fontSize: 12, color: T.dim }}>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.violet, display: "inline-block" }} /> Healthy
        </span>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber, display: "inline-block" }} /> Overloaded
        </span>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: BAD, display: "inline-block" }} /> Down
        </span>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.blue, display: "inline-block" }} /> Request in flight
        </span>
      </div>

      <style>{`
        .server-group, #lb-group, #directPath, #queueGroup { transition: opacity 450ms ease; }
        .server-box { transition: stroke 350ms ease, fill 350ms ease; }
        .pf-resilience-dot::after {
          content: "";
          position: absolute;
          inset: 0;
          background: ${T.blue};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 120ms linear;
        }
        .pf-resilience-dot:hover { background: ${T.border}; }
        .pf-resilience-dot.done::after { transform: scaleX(1); }
        .pf-resilience-dot.active::after { transform: scaleX(var(--p, 0)); }
      `}</style>
    </div>
  );
}

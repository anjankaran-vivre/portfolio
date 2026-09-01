"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { T } from "@/lib/theme";

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
    caption: "A single server handles every request directly. Traffic is light, so it keeps up fine.",
    servers: ["ok", "off", "off"],
    active: [true, false, false],
    lb: false,
    spawnMs: 900,
    packetTargets: () => 0,
  },
  {
    name: "Stage 2 · Overloaded",
    duration: 2600,
    caption: "Traffic grows. The same server now takes every request, and requests start queueing up behind it.",
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
    caption: "A load balancer is added in front, and two more servers join the pool.",
    servers: ["ok", "ok", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 500,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 4 · Spreading the load",
    duration: 3600,
    caption: "Each new request is handed to whichever server is healthy — no single machine carries all the traffic.",
    servers: ["ok", "ok", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 5 · A server dies",
    duration: 2600,
    caption: "Server 2 crashes. The load balancer's health check notices within seconds and stops routing to it.",
    servers: ["ok", "bad", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
  {
    name: "Stage 6 · Traffic keeps flowing",
    duration: 3800,
    caption: "Requests now split only between Server 1 and Server 3. The client never sees the failure at all.",
    servers: ["ok", "bad", "ok"],
    active: [true, true, true],
    lb: true,
    spawnMs: 420,
    packetTargets: (h) => nextHealthy(h),
  },
];

const SERVER_ENTRY = [
  { x: 640, y: 128 },
  { x: 640, y: 230 },
  { x: 640, y: 332 },
];
const CLIENT = { x: 150, y: 230 };
const LB = { x: 385, y: 230 };

export function ResilienceDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const packetsLayerRef = useRef<SVGGElement>(null);
  const directPathRef = useRef<SVGGElement>(null);
  const lbGroupRef = useRef<SVGGElement>(null);
  const serverRefs = useRef<(SVGGElement | null)[]>([]);
  const queueGroupRef = useRef<SVGGElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    function setServerState(n: number, state: ServerState, active: boolean) {
      const g = serverRefs.current[n];
      if (!g) return;
      g.style.opacity = active ? "1" : "0.32";
      g.style.transform = active ? "scale(1)" : "scale(0.94)";
      g.style.transformOrigin = `640px ${128 + n * 102}px`;
      const dot = g.querySelector<SVGCircleElement>(".status-dot");
      if (dot) dot.style.fill = STATE_COLOR[state];
      const label = g.querySelector<SVGTextElement>(".load-label");
      if (label) label.textContent = active ? STATE_LOAD[state] : "not provisioned";
      const x = g.querySelector<SVGPathElement>(".down-x");
      if (x) x.style.opacity = state === "bad" ? "1" : "0";
      const line = g.querySelector<SVGLineElement>(".lb-line");
      if (line) line.style.opacity = active ? "1" : "0";
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
      const waypoints = stage.lb ? [CLIENT, LB, SERVER_ENTRY[i]] : [CLIENT, SERVER_ENTRY[i]];
      shootPacket(waypoints, T.blue, stage.lb ? 700 : 650);
    }

    function applyStage(idx: number) {
      const stage = STAGES[idx];
      setLbActive(stage.lb);
      stage.servers.forEach((s, n) => setServerState(n, s, stage.active[n]));
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <span className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: T.blue }}>
          {stage.name}
        </span>
        <button
          type="button"
          className="pf-btn"
          onClick={() => setPlaying((p) => !p)}
          style={{ padding: "8px 14px", fontSize: 10.5 }}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "Pause" : "Play"}
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 900 460"
        role="img"
        aria-label="Diagram of a client sending requests through a load balancer to three servers, one of which fails while traffic keeps flowing to the other two."
        style={{ display: "block", width: "100%", height: "auto", color: T.dim }}
      >
        <defs>
          <marker id="rd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fontFamily="var(--font-mono), IBM Plex Mono, monospace" fontSize="12" fontWeight={600}>
          <rect x={40} y={200} width={110} height={60} rx={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
          <text x={95} y={235} textAnchor="middle" fill={T.text}>CLIENT</text>

          <g id="directPath" ref={directPathRef}>
            <line x1={150} y1={230} x2={300} y2={150} stroke="currentColor" strokeWidth={1.6} markerEnd="url(#rd-arrow)" />
            <text x={205} y={180} textAnchor="middle" fontWeight={500} fill="currentColor" opacity={0.75}>request</text>
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
                x2={640}
                y2={[130, 230, 330][n]}
                stroke="currentColor"
                strokeWidth={1.6}
                markerEnd="url(#rd-arrow)"
              />
              <rect x={640} y={90 + n * 102} width={170} height={76} rx={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
              <text x={660} y={122 + n * 102} fill={T.text}>SERVER {n + 1}</text>
              <text className="load-label" x={660} y={146 + n * 102} fontWeight={500} fill="currentColor" opacity={0.7}>
                load: nominal
              </text>
              <circle className="status-dot" cx={792} cy={106 + n * 102} r={7} />
              <path
                className="down-x"
                d={`M787,${101 + n * 102} L797,${111 + n * 102} M797,${101 + n * 102} L787,${111 + n * 102}`}
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

      <p style={{ minHeight: 44, fontSize: 14, lineHeight: 1.55, color: T.dim, margin: "16px 2px 4px" }}>
        {stage.caption}
      </p>

      <div style={{ display: "flex", gap: 6, margin: "14px 2px 0" }}>
        {STAGES.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="pf-resilience-dot"
            style={{ flex: 1, height: 4, borderRadius: 2, background: T.surface2, overflow: "hidden", position: "relative" }}
          />
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", margin: "20px 2px 0", fontSize: 12, color: T.dim }}>
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

      <p style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${T.border}`, fontSize: 13.5, lineHeight: 1.6, color: T.dim, maxWidth: "68ch" }}>
        <strong style={{ color: T.text }}>The takeaway:</strong> a load balancer doesn&apos;t remove failure, it just makes failure someone else&apos;s problem for a moment. Health checks pull a dead server out of rotation automatically, so the client never has to know Server 2 was the one that took the hit.
      </p>

      <style>{`
        .server-group, #lb-group, #directPath, #queueGroup { transition: opacity 450ms ease; }
        .pf-resilience-dot::after {
          content: "";
          position: absolute;
          inset: 0;
          background: ${T.blue};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 120ms linear;
        }
        .pf-resilience-dot.done::after { transform: scaleX(1); }
        .pf-resilience-dot.active::after { transform: scaleX(var(--p, 0)); }
      `}</style>
    </div>
  );
}

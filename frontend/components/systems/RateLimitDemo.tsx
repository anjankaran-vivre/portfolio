"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { T } from "@/lib/theme";
import { Icon } from "@/components/shared/Icon";
import { setWrappedSvgText } from "@/lib/wrapSvgText";

const BAD = "#c9584f";

type ServerState = "ok" | "warn" | "bad";
const STATE_COLOR: Record<ServerState, string> = { ok: T.violet, warn: T.amber, bad: BAD };
const STATE_LOAD: Record<ServerState, string> = {
  ok: "load: nominal",
  warn: "load: climbing",
  bad: "load: overwhelmed",
};

type Limiter = "none" | "flood" | "basic" | "window" | "bucket";

interface Stage {
  name: string;
  duration: number;
  caption: string;
  limiter: Limiter;
  gate: boolean;
  gateLabel: string;
  spawnMs: number;
  escalateAt?: number; // ms into the stage when the server flips to "bad"
}

const STAGES: Stage[] = [
  {
    name: "Stage 1 · Normal traffic",
    duration: 3000,
    caption: "Every login attempt reaches the server directly.",
    limiter: "none",
    gate: false,
    gateLabel: "",
    spawnMs: 850,
  },
  {
    name: "Stage 2 · No rate limit",
    duration: 3200,
    caption: "A script floods the endpoint — nothing holds it back.",
    limiter: "flood",
    gate: false,
    gateLabel: "",
    spawnMs: 180,
    escalateAt: 1400,
  },
  {
    name: "Stage 3 · Limiter added",
    duration: 2800,
    caption: "A rate limiter steps in — excess requests get a 429, not a crash.",
    limiter: "basic",
    gate: true,
    gateLabel: "LIMITER · max 6 req/s",
    spawnMs: 260,
  },
  {
    name: "Stage 4 · Fixed window",
    duration: 3600,
    caption: "A hard cap per interval, then a clean reset.",
    limiter: "window",
    gate: true,
    gateLabel: "FIXED WINDOW · 5 req / 1.8s",
    spawnMs: 320,
  },
  {
    name: "Stage 5 · Token bucket",
    duration: 3600,
    caption: "A small burst is allowed, then it has to refill.",
    limiter: "bucket",
    gate: true,
    gateLabel: "TOKEN BUCKET · burst 5, +1 / 0.7s",
    spawnMs: 300,
  },
];

// Vertical flow — client on top, the limiter gate beneath it, the server
// at the bottom, with the same viewBox and stop positions as the Load
// Balancing card's diagram (620×580, server row at y=440) so the two sit
// at matching scale and the server boxes land in the same row of the page
// when the cards are side by side in the grid.
const CLIENT_EXIT = { x: 310, y: 86 };
const GATE = { x: 310, y: 220 };
const SERVER_ENTRY = { x: 310, y: 440 };
// A horizontal row of slots — offset to the right of the vertical flow
// line so the gauge doesn't sit on top of it.
const METER_SLOTS = 5;
const METER_SLOT_W = 22;
const METER_GAP = 5;
const METER_X = GATE.x + 60;
const METER_Y = 352;

export function RateLimitDemo() {
  const packetsLayerRef = useRef<SVGGElement>(null);
  const gateGroupRef = useRef<SVGGElement>(null);
  const gateLabelRef = useRef<SVGTextElement>(null);
  const serverBoxRef = useRef<SVGRectElement>(null);
  const serverLabelRef = useRef<SVGTextElement>(null);
  const meterRefs = useRef<(SVGRectElement | null)[]>([]);
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
    let meterTimer: ReturnType<typeof setInterval> | null = null;
    let escalateTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let stageStart = performance.now();

    // Fixed-window / token-bucket state, reset whenever that stage starts.
    let windowCount = 0;
    let tokens = METER_SLOTS;

    function setServerState(state: ServerState) {
      if (serverBoxRef.current) {
        serverBoxRef.current.style.stroke = STATE_COLOR[state];
        serverBoxRef.current.style.fill = `${STATE_COLOR[state]}1c`;
      }
      setWrappedSvgText(serverLabelRef.current, STATE_LOAD[state], SERVER_ENTRY.x, 20, 14);
    }

    function setMeter(filled: number) {
      meterRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.fill = i < filled ? T.amber : T.surface2;
        el.style.opacity = i < filled ? "1" : "0.6";
      });
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
        c.setAttribute("opacity", t > 0.8 ? String(1 - (t - 0.8) / 0.2) : "1");
        if (t < 1) requestAnimationFrame(frame);
        else c.remove();
      }
      requestAnimationFrame(frame);
    }

    function fireStagePacket(stage: Stage) {
      if (stage.limiter === "none") {
        shootPacket([CLIENT_EXIT, SERVER_ENTRY], T.blue, 650);
        return;
      }
      if (stage.limiter === "flood") {
        shootPacket([CLIENT_EXIT, SERVER_ENTRY], BAD, 380);
        return;
      }
      // Every gated stage decides allow/block, then routes the packet
      // accordingly — allowed continues past the gate, blocked stops there.
      let allowed: boolean;
      if (stage.limiter === "basic") {
        allowed = Math.random() > 0.35;
      } else if (stage.limiter === "window") {
        allowed = windowCount < METER_SLOTS;
        if (allowed) windowCount++;
        setMeter(windowCount);
      } else {
        allowed = tokens > 0;
        if (allowed) tokens--;
        setMeter(tokens);
      }
      if (allowed) {
        shootPacket([CLIENT_EXIT, GATE, SERVER_ENTRY], T.blue, 700);
      } else {
        shootPacket([CLIENT_EXIT, GATE], BAD, 420);
      }
    }

    function applyStage(idx: number) {
      const stage = STAGES[idx];
      if (spawnTimer) clearInterval(spawnTimer);
      if (meterTimer) clearInterval(meterTimer);
      if (escalateTimer) clearTimeout(escalateTimer);

      if (gateGroupRef.current) gateGroupRef.current.style.opacity = stage.gate ? "1" : "0";
      if (gateLabelRef.current) gateLabelRef.current.textContent = stage.gateLabel;
      setServerState(stage.limiter === "flood" ? "warn" : "ok");

      if (stage.limiter === "window") {
        windowCount = 0;
        setMeter(0);
        meterTimer = setInterval(() => {
          windowCount = 0;
          setMeter(0);
        }, 1800);
      } else if (stage.limiter === "bucket") {
        tokens = METER_SLOTS;
        setMeter(tokens);
        meterTimer = setInterval(() => {
          tokens = Math.min(METER_SLOTS, tokens + 1);
          setMeter(tokens);
        }, 700);
      } else {
        setMeter(0);
      }

      if (stage.escalateAt) {
        escalateTimer = setTimeout(() => setServerState("bad"), stage.escalateAt);
      }

      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        d.classList.toggle("done", i < idx);
        d.classList.toggle("active", i === idx);
        d.style.removeProperty("--p");
      });

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

    jumpRef.current = (idx: number) => {
      stageStart = performance.now();
      setStageIndex(idx);
      applyStage(idx);
    };

    applyStage(stageIndexRef.current);
    if (!reduceMotion) rafId = requestAnimationFrame(tick);

    return () => {
      if (spawnTimer) clearInterval(spawnTimer);
      if (meterTimer) clearInterval(meterTimer);
      if (escalateTimer) clearTimeout(escalateTimer);
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
            background: `${T.amber}18`,
            border: `1px solid ${T.amber}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="lock" size={16} color={T.amber} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pf-disp" style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Rate Limiting</div>
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, marginTop: 4 }}>How we protect login from abuse without blocking real users.</div>
        </div>
        <button
          type="button"
          className="pf-btn"
          onClick={() => setPlaying((p) => !p)}
          style={{ padding: "8px 14px", fontSize: 10.5, flexShrink: 0, width: 88, justifyContent: "center" }}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "Pause" : "Play"}
        </button>
      </div>

      <svg
        viewBox="0 0 620 580"
        role="img"
        aria-label="Diagram of login requests passing from a client through an optional rate limiter to a server, showing what happens with and without limiting."
        style={{ display: "block", width: "100%", height: "auto", color: T.dim, marginTop: 18, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}
      >
        <defs>
          <marker id="rl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fontFamily="var(--font-mono), IBM Plex Mono, monospace" fontSize="12" fontWeight={600}>
          <rect x={CLIENT_EXIT.x - 65} y={20} width={130} height={66} rx={10} fill="none" stroke="currentColor" strokeWidth={1.6} />
          <text x={CLIENT_EXIT.x} y={58} textAnchor="middle" fontSize={13} fill={T.text}>CLIENT</text>

          <line x1={CLIENT_EXIT.x} y1={CLIENT_EXIT.y} x2={SERVER_ENTRY.x} y2={SERVER_ENTRY.y} stroke="currentColor" strokeWidth={1.6} opacity={0.5} markerEnd="url(#rl-arrow)" />

          <g ref={gateGroupRef} style={{ transition: "opacity 400ms ease" }}>
            <polygon points={`${GATE.x - 70},${GATE.y} ${GATE.x},${GATE.y - 45} ${GATE.x + 70},${GATE.y} ${GATE.x},${GATE.y + 45}`} fill={T.bg2} stroke={T.amber} strokeWidth={1.6} />
            <text x={GATE.x} y={GATE.y + 5} textAnchor="middle" fontSize={14} fill={T.amber}>RL</text>
            <text ref={gateLabelRef} x={GATE.x} y={GATE.y - 58} textAnchor="middle" fontSize="10" fontWeight={500} fill={T.amber} letterSpacing="0.04em" />
            <g>
              {Array.from({ length: METER_SLOTS }).map((_, i) => (
                <rect
                  key={i}
                  ref={(el) => { meterRefs.current[i] = el; }}
                  x={METER_X + i * (METER_SLOT_W + METER_GAP)}
                  y={METER_Y}
                  width={METER_SLOT_W}
                  height={16}
                  rx={2}
                  fill={T.surface2}
                />
              ))}
            </g>
          </g>

          <rect ref={serverBoxRef} x={SERVER_ENTRY.x - 130} y={SERVER_ENTRY.y} width={260} height={110} rx={12} fill="none" stroke="currentColor" strokeWidth={2} />
          <text x={SERVER_ENTRY.x} y={SERVER_ENTRY.y + 38} textAnchor="middle" fontSize={13.5} fill={T.text}>SERVER</text>
          <text ref={serverLabelRef} x={SERVER_ENTRY.x} y={SERVER_ENTRY.y + 62} textAnchor="middle" fontSize={11} fontWeight={500} fill="currentColor" opacity={0.7}>load: nominal</text>
        </g>

        <g ref={packetsLayerRef} />
      </svg>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18 }}>
        <span className="pf-mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: T.amber }}>
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
            className="pf-ratelimit-dot"
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

      <div style={{ display: "flex", gap: 10, margin: "18px 2px 0", fontSize: 10, color: T.dim, overflowX: "auto", whiteSpace: "nowrap" }}>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, display: "inline-block", flexShrink: 0 }} /> Allowed
        </span>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: BAD, display: "inline-block", flexShrink: 0 }} /> Blocked / 429
        </span>
        <span className="pf-mono" style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amber, display: "inline-block", flexShrink: 0 }} /> Overwhelmed
        </span>
      </div>

      <style>{`
        .pf-ratelimit-dot::after {
          content: "";
          position: absolute;
          inset: 0;
          background: ${T.amber};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 120ms linear;
        }
        .pf-ratelimit-dot:hover { background: ${T.border}; }
        .pf-ratelimit-dot.done::after { transform: scaleX(1); }
        .pf-ratelimit-dot.active::after { transform: scaleX(var(--p, 0)); }
      `}</style>
    </div>
  );
}

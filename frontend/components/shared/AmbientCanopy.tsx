"use client";

import { T } from "@/lib/theme";

// Fixed, pre-computed positions/timings (not Math.random() at render time —
// that would produce a server/client hydration mismatch). Two motifs mixed
// on purpose: soft round glows read as fireflies/spores (the "greenery"
// half of the brand), small square motes read as data packets (the
// "digital" half) — the same pairing the rest of the site already uses
// (moss/teal/gold dots drifting along circuit-style connector lines).
const MOTES: { x: number; delay: number; dur: number; size: number; color: string; shape: "round" | "square" }[] = [
  { x: 4, delay: 0, dur: 22, size: 3, color: T.violet, shape: "round" },
  { x: 11, delay: 5, dur: 26, size: 2, color: T.amber, shape: "square" },
  { x: 18, delay: 11, dur: 20, size: 3, color: T.blue, shape: "round" },
  { x: 26, delay: 2, dur: 28, size: 2, color: T.violet, shape: "square" },
  { x: 34, delay: 8, dur: 24, size: 4, color: T.violet, shape: "round" },
  { x: 43, delay: 14, dur: 21, size: 2, color: T.blue, shape: "square" },
  { x: 52, delay: 4, dur: 27, size: 3, color: T.amber, shape: "round" },
  { x: 61, delay: 9, dur: 23, size: 2, color: T.violet, shape: "square" },
  { x: 69, delay: 16, dur: 25, size: 3, color: T.blue, shape: "round" },
  { x: 77, delay: 1, dur: 29, size: 2, color: T.amber, shape: "square" },
  { x: 84, delay: 12, dur: 22, size: 4, color: T.violet, shape: "round" },
  { x: 91, delay: 6, dur: 26, size: 2, color: T.blue, shape: "square" },
  { x: 97, delay: 18, dur: 24, size: 3, color: T.violet, shape: "round" },
];

// A slow, low-opacity ambient layer — spore-like glows and data-mote
// squares drifting upward from the bottom of the viewport, forever. Reads
// as "digital forest canopy" texture, not decoration you consciously
// notice. Fixed positioning + pointer-events:none keeps it inert; the
// global prefers-reduced-motion rule in globals.css (animation-duration
// forced to ~0) freezes every mote in place for users who ask for it.
export function AmbientCanopy() {
  return (
    <div className="pf-canopy" aria-hidden>
      {MOTES.map((m, i) => (
        <span
          key={i}
          className={`pf-mote pf-mote-${m.shape}`}
          style={{
            left: `${m.x}%`,
            width: m.size,
            height: m.size,
            background: m.color,
            boxShadow: `0 0 ${m.size * 3}px ${m.color}`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
          }}
        />
      ))}
      <style>{`
        .pf-canopy {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .pf-mote {
          position: absolute;
          bottom: -6%;
          border-radius: 50%;
          opacity: 0;
          animation-name: pf-mote-rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .pf-mote-square {
          border-radius: 2px;
          transform: rotate(45deg);
        }
        @keyframes pf-mote-rise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          8% { opacity: 0.55; }
          50% { transform: translateY(-52vh) translateX(14px); opacity: 0.35; }
          92% { opacity: 0.1; }
          100% { transform: translateY(-104vh) translateX(-10px); opacity: 0; }
        }
        .pf-mote-square {
          animation-name: pf-mote-rise-square;
        }
        @keyframes pf-mote-rise-square {
          0% { transform: translateY(0) translateX(0) rotate(45deg); opacity: 0; }
          8% { opacity: 0.45; }
          50% { transform: translateY(-52vh) translateX(-14px) rotate(45deg); opacity: 0.28; }
          92% { opacity: 0.08; }
          100% { transform: translateY(-104vh) translateX(10px) rotate(45deg); opacity: 0; }
        }
        @media (max-width: 700px) {
          .pf-canopy { display: none; }
        }
      `}</style>
    </div>
  );
}

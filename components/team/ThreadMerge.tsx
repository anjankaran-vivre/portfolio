"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { T } from "@/lib/theme";
import { TEAM, SHARED_OVERLAP } from "@/data/team";

const ANJAN_MAP = TEAM.find((t) => t.id === "anjan")!.map;
const PRITAM_MAP = TEAM.find((t) => t.id === "pritam")!.map;

const LEFT_X = 170;
const RIGHT_X = 630;
const TOP = 24;
const SPACING = 54;
const MERGE_Y = 426;
const CENTER_X = 400;

const ANJAN_COLOR = "#6c9bff";
const PRITAM_COLOR = "#b98bfa";

function ThreadNode({
  progress,
  index,
  total,
  x,
  y,
  label,
  color,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  x: number;
  y: number;
  label: string;
  color: string;
}) {
  const opacity = useTransform(progress, [(index + 1) / (total + 2), (index + 2) / (total + 2)], [0.12, 1]);
  return (
    <motion.g style={{ opacity }}>
      <circle cx={x} cy={y} r={4} fill={T.bg} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y - 11} textAnchor="middle" className="pf-mono" fontSize="9.5" fill={T.dim} letterSpacing="0.06em">
        {label}
      </text>
    </motion.g>
  );
}

export function ThreadMerge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });

  const colProgress = useTransform(scrollYProgress, [0, 0.72], [0, 1]);
  const mergeProgress = useTransform(scrollYProgress, [0.55, 0.95], [0, 1]);

  const total = ANJAN_MAP.length;

  return (
    <div
      ref={ref}
      style={{
        margin: "56px 0 0",
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        background: `radial-gradient(ellipse at 50% 88%, ${T.amber}0d, transparent 60%), ${T.surface}`,
        padding: "12px 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="pf-mono" style={{ position: "absolute", top: 12, left: 16, fontSize: 9, letterSpacing: "0.12em", color: T.faint }}>
        SYSTEM TOPOLOGY · PRITAM {TEAM.find((t) => t.id === "pritam")!.initials} × ANJAN {TEAM.find((t) => t.id === "anjan")!.initials}
      </div>
      <div className="pf-mono" style={{ position: "absolute", top: 12, right: 16, fontSize: 9, letterSpacing: "0.12em", color: T.faint }}>
        MERGING THREADS
      </div>

      <svg viewBox="0 0 800 500" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id="tm-anjan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANJAN_COLOR} stopOpacity="0.9" />
            <stop offset="100%" stopColor={ANJAN_COLOR} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="tm-pritam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRITAM_COLOR} stopOpacity="0.9" />
            <stop offset="100%" stopColor={PRITAM_COLOR} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="tm-merge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ANJAN_COLOR} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f2b860" stopOpacity="0.9" />
            <stop offset="100%" stopColor={PRITAM_COLOR} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <motion.line
          x1={LEFT_X}
          y1={TOP + SPACING}
          x2={LEFT_X}
          y2={MERGE_Y}
          stroke="url(#tm-anjan)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          style={{ scaleY: colProgress, transformOrigin: `${LEFT_X}px ${TOP + SPACING}px` }}
        />
        <motion.line
          x1={RIGHT_X}
          y1={TOP + SPACING}
          x2={RIGHT_X}
          y2={MERGE_Y}
          stroke="url(#tm-pritam)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          style={{ scaleY: colProgress, transformOrigin: `${RIGHT_X}px ${TOP + SPACING}px` }}
        />

        <motion.path
          d={`M ${LEFT_X} ${MERGE_Y} C ${LEFT_X} ${MERGE_Y + 34} ${CENTER_X - 90} ${MERGE_Y + 26} ${CENTER_X} ${MERGE_Y + 10}`}
          fill="none"
          stroke={ANJAN_COLOR}
          strokeWidth={1.5}
          strokeDasharray="4 6"
          style={{ pathLength: mergeProgress, opacity: 0.85 }}
        />
        <motion.path
          d={`M ${RIGHT_X} ${MERGE_Y} C ${RIGHT_X} ${MERGE_Y + 34} ${CENTER_X + 90} ${MERGE_Y + 26} ${CENTER_X} ${MERGE_Y + 10}`}
          fill="none"
          stroke={PRITAM_COLOR}
          strokeWidth={1.5}
          strokeDasharray="4 6"
          style={{ pathLength: mergeProgress, opacity: 0.85 }}
        />
        <motion.line
          x1={CENTER_X}
          y1={MERGE_Y + 10}
          x2={CENTER_X}
          y2={MERGE_Y + 44}
          stroke="url(#tm-merge)"
          strokeWidth={2}
          style={{ scaleY: mergeProgress, transformOrigin: `${CENTER_X}px ${MERGE_Y + 10}px` }}
        />

        <motion.g style={{ opacity: mergeProgress }}>
          <circle cx={CENTER_X} cy={MERGE_Y + 44} r={10} fill={T.bg2} stroke={T.amber} strokeWidth={2} />
          <circle
            cx={CENTER_X}
            cy={MERGE_Y + 44}
            r={10}
            fill="none"
            stroke={T.amber}
            strokeOpacity={0.5}
            style={{
              animation: "pf-pulse-scale 2s ease-out infinite",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
          <text x={CENTER_X} y={MERGE_Y + 44 + 26} textAnchor="middle" className="pf-mono" fontSize="12" fill={T.amber} fontWeight="600" letterSpacing="0.14em">
            VORGEN
          </text>
          <text x={CENTER_X} y={MERGE_Y + 44 + 42} textAnchor="middle" className="pf-mono" fontSize="8.5" fill={T.faint} letterSpacing="0.1em">
            ONE SHARED SYSTEM
          </text>
        </motion.g>

        {ANJAN_MAP.map((_, i) => (
          <circle key={`a${i}`} r={2} fill={ANJAN_COLOR}>
            <animateMotion
              dur={`${3.2 + i * 0.18}s`}
              repeatCount="indefinite"
              path={`M ${LEFT_X} ${TOP + i * 8} L ${LEFT_X} ${MERGE_Y - 6}`}
            />
          </circle>
        ))}
        {PRITAM_MAP.map((_, i) => (
          <circle key={`p${i}`} r={2} fill={PRITAM_COLOR}>
            <animateMotion
              dur={`${3.2 + i * 0.18}s`}
              repeatCount="indefinite"
              path={`M ${RIGHT_X} ${TOP + i * 8} L ${RIGHT_X} ${MERGE_Y - 6}`}
            />
          </circle>
        ))}

        {ANJAN_MAP.map((n, i) => {
          const y = TOP + SPACING + i * SPACING;
          return (
            <ThreadNode
              key={`a-${n}`}
              progress={scrollYProgress}
              index={i}
              total={total}
              x={LEFT_X}
              y={y}
              label={n}
              color={ANJAN_COLOR}
            />
          );
        })}

        {PRITAM_MAP.map((n, i) => {
          const y = TOP + SPACING + i * SPACING;
          return (
            <ThreadNode
              key={`p-${n}`}
              progress={scrollYProgress}
              index={i}
              total={total}
              x={RIGHT_X}
              y={y}
              label={n}
              color={PRITAM_COLOR}
            />
          );
        })}
      </svg>

      <div
        style={{
          padding: "16px 24px 20px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div className="pf-mono" style={{ fontSize: 10, color: T.faint, letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
          SHARED OVERLAP
        </div>
        {SHARED_OVERLAP.map((o) => (
          <span
            key={o}
            className="pf-mono"
            style={{
              fontSize: 11,
              padding: "6px 13px",
              borderRadius: 20,
              background: `${T.amber}14`,
              border: `1px solid ${T.amber}55`,
              color: T.amber,
            }}
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}
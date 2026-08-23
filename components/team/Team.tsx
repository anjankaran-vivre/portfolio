"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { T } from "@/lib/theme";
import { TEAM, type TeamMember } from "@/data/team";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { ThreadMerge } from "@/components/team/ThreadMerge";
import {
  Database, Cpu, Brain, Bot, Wrench, Code2, GitBranch, Zap,
  Monitor, Layout, CodeXml, Server, HardDrive, Link, Settings, Package
} from "lucide-react";

/* Icon mappings for each member's skill map labels */
const PRITAM_ICONS = [Database, Cpu, Brain, Bot, Wrench, Code2, GitBranch, Zap];
const ANJAN_ICONS = [Monitor, Layout, CodeXml, Server, HardDrive, Link, Settings, Package];

/* Use useLayoutEffect on the client, fall back to useEffect during SSR */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ElbowPos = { x1: number; y1: number; xMid: number; x2: number; y2: number };

/**
 * Full portrait with skill labels on both sides.
 *
 * ONE chip per skill. Each connector is an ELBOW:
 *   1) a horizontal stub leaving the label at the label's own height
 *   2) a bend at a FIXED x-column (same for every line on that side)
 *   3) a short diagonal into a point near the portrait, away from the face
 *
 * Non-crossing guarantee: every line bends at the same x on its side, and
 * the end-Y values are kept in the exact same top-to-bottom order as the
 * label rows. Two "chords" between two shared vertical lines never cross
 * as long as both endpoints stay in matching sorted order — so as long as
 * endYs stays monotonic (increasing, matching labelYs), nothing overlaps.
 */
function AnnotatedPhoto({ member, icons }: { member: TeamMember; icons: typeof PRITAM_ICONS }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [elbows, setElbows] = useState<ElbowPos[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skills = member.map;

  /* SVG viewBox dimensions */
  const W = 480;
  const H = 440;
  const CX = W / 2;

  /* Label row Y positions — wide spread, pinned to the outer edges */
  const labelYs = [78, 172, 266, 360];

  /* End-point Y positions — MUST stay in the same increasing order as
     labelYs (non-crossing guarantee) and pushed well down onto the
     chest/collar area with extra padding below the face line. */
  const endYs = [228, 266, 304, 342];
  const END_X_OFFSET = 46; /* how far the diagonal reaches into the photo, from center */

  /* Fixed bend column per side — just outside the photo edge so the elbow
     clears the head, but close enough that diagonals stay short. */
  const MID_OFFSET = 146;
  const leftMidX = CX - MID_OFFSET;
  const rightMidX = CX + MID_OFFSET;
  const MIN_STUB = 18; /* fallback minimum stub length if a label is unusually wide */

  const getRow = (i: number) => {
    const isLeft = i % 2 === 0;
    const sideIdx = Math.floor(i / 2);
    return {
      isLeft,
      labelY: labelYs[sideIdx],
      endX: isLeft ? CX - END_X_OFFSET : CX + END_X_OFFSET,
      endY: endYs[sideIdx],
    };
  };

  /* Measure each label's real edge so the stub always starts touching the
     chip exactly, regardless of how long its text is. */
  useIsoLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      if (!cRect.width || !cRect.height) return;

      const sx = W / cRect.width;
      const sy = H / cRect.height;

      const next: ElbowPos[] = skills.map((_, i) => {
        const { isLeft, labelY, endX, endY } = getRow(i);
        const labelEl = labelRefs.current[i];

        let x1 = isLeft ? 0 : W;
        let y1 = labelY;
        if (labelEl) {
          const r = labelEl.getBoundingClientRect();
          const edgePxX = isLeft ? r.right : r.left;
          const edgePxY = r.top + r.height / 2;
          x1 = (edgePxX - cRect.left) * sx;
          y1 = (edgePxY - cRect.top) * sy;
        }

        /* Bend at the shared column for this side; if a label is unusually
           wide, fall back to a minimum stub rather than bending backwards. */
        const xMid = isLeft
          ? Math.max(leftMidX, x1 + MIN_STUB)
          : Math.min(rightMidX, x1 - MIN_STUB);

        return { x1, y1, xMid, x2: endX, y2: endY };
      });

      setElbows(next);
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills.length, member.id]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", margin: "0 auto" }}>
      {/* Ambient glow behind the portrait */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%,-50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${member.color}26 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Full rectangular photo with bottom fade */}
      <div style={{ position: "relative", width: "min(280px, 58%)", margin: "0 auto" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/${member.id}.jpeg`}
          alt={member.name}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            filter: "brightness(0.9) contrast(1.06)",
            maskImage: `linear-gradient(to bottom, black 55%, transparent 98%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 55%, transparent 98%)`,
          }}
        />
      </div>

      {/* SVG overlay: elbow connectors — horizontal stub, then diagonal, then a dot */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {elbows.map((e, i) => {
          const active = hoverIdx === i;
          const color = active ? member.color : "#5a6270";
          return (
            <g key={i} opacity={hoverIdx === null ? 0.75 : active ? 1 : 0.2} style={{ transition: "opacity .25s ease" }}>
              <polyline
                points={`${e.x1},${e.y1} ${e.xMid},${e.y1} ${e.x2},${e.y2}`}
                fill="none"
                stroke={color}
                strokeWidth={active ? 1.75 : 1}
                strokeLinejoin="round"
                style={{ transition: "stroke .25s ease, stroke-width .25s ease" }}
              />
              <circle cx={e.x2} cy={e.y2} r={active ? 3.4 : 2.6} fill={color} style={{ transition: "all .25s ease" }} />
            </g>
          );
        })}
      </svg>

      {/* Label chips: the ONLY chip per skill — icon → number → text */}
      {skills.map((label, i) => {
        const { isLeft, labelY } = getRow(i);
        const active = hoverIdx === i;
        const IconCmp = icons[i];
        return (
          <div
            key={`lbl-${label}`}
            ref={(el) => { labelRefs.current[i] = el; }}
            className="pf-mono pf-team-label"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{
              position: "absolute",
              top: `${(labelY / H) * 100}%`,
              transform: "translateY(-50%)",
              ...(isLeft ? { left: 0 } : { right: 0 }),
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 11px",
              borderRadius: 8,
              background: active ? `${member.color}14` : "#101218",
              border: `1px solid ${active ? member.color + "55" : T.border}`,
              cursor: "default",
              zIndex: 3,
              transition: "border-color .25s ease, background .25s ease",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: `${member.color}18`,
                border: `1px solid ${member.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconCmp size={12} color={active ? member.color : T.faint} strokeWidth={1.6} />
            </span>
            <span style={{ fontSize: 10, color: T.faint, letterSpacing: "0.05em" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: 12.5,
                lineHeight: 1.5,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                color: active ? T.text : T.dim,
                transition: "color .25s ease",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const icons = member.id === "pritam" ? PRITAM_ICONS : ANJAN_ICONS;

  return (
    <Reveal delay={index * 100}>
      <div
        className="pf-card pf-team-card"
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          background: "#000",
          padding: "30px 32px 28px",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${member.color}, transparent 60%)`, opacity: 0.7 }} />

        {/* Header: Name + Role | Status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
          <div>
            <div className="pf-disp" style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600, color: T.text, lineHeight: 1.2 }}>
              {member.name}
            </div>
            <div className="pf-mono" style={{ fontSize: 10, color: member.color, marginTop: 6, letterSpacing: "0.06em", lineHeight: 1.5 }}>
              {member.role}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 20,
              background: `${T.bg}cc`,
              border: `1px solid ${T.border}`,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: member.color, boxShadow: `0 0 8px ${member.color}66` }} />
            <div className="pf-mono" style={{ fontSize: 9, letterSpacing: "0.1em", lineHeight: 1 }}>
              <span style={{ color: T.faint }}>STATUS</span>
              <br />
              <span style={{ color: T.text, fontWeight: 600 }}>BUILDING</span>
            </div>
          </div>
        </div>

        {/* Skill map label */}
        <div className="pf-mono" style={{ fontSize: 10, color: T.faint, letterSpacing: "0.1em", marginTop: 18, marginBottom: 2 }}>
          SKILL MAP · {member.initials} · HOVER TO TRACE
        </div>

        {/* Annotated Photo */}
        <AnnotatedPhoto member={member} icons={icons} />

        {/* Bio section */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            marginTop: 8,
            padding: "16px 0 0",
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `${member.color}18`,
              border: `1px solid ${member.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={member.color} stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.65, margin: 0 }}>
            {member.bio}
          </p>
        </div>
      </div>

      <style>{`
        .pf-team-card {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .pf-team-card:hover {
          border-color: #323844 !important;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 60px ${member.color}08;
        }
        @media (max-width: 520px) {
          .pf-team-card { padding: 22px 16px 20px !important; }
          .pf-team-label { gap: 6px !important; padding: 7px 8px !important; }
          .pf-team-label span:last-child { font-size: 10.5px !important; }
        }
      `}</style>
    </Reveal>
  );
}

export function Team() {
  return (
    <SectionWrap id="team">
      <Reveal>
        <Eyebrow color={T.amber}>The Team</Eyebrow>
        <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
          Two disciplines, one system
        </h2>
        <p style={{ color: T.dim, marginTop: 16, maxWidth: 620, fontSize: 15, lineHeight: 1.6 }}>
          Pritam's thread is intelligence. Anjan's thread is the product. The system runs on both.
        </p>
      </Reveal>

      <Reveal>
        <ThreadMerge />
      </Reveal>

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {TEAM.map((m, i) => <MemberCard member={m} index={i} key={m.id} />)}
      </div>
    </SectionWrap>
  );
}
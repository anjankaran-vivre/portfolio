"use client";

import { useState } from "react";
import { T } from "@/lib/theme";
import { TEAM, type TeamMember } from "@/data/team";
import { SectionWrap } from "@/components/shared/SectionWrap";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";
import { ThreadMerge } from "@/components/team/ThreadMerge";

function MemberMap({ member }: { member: TeamMember }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {member.map.map((m, i) => (
        <div
          key={m}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <div className="pf-mono" style={{ width: 22, fontSize: 10, color: T.faint }}>{String(i + 1).padStart(2, "0")}</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < member.map.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: hoverIdx === i ? member.color : T.border, transition: "background .2s" }} />
            <div style={{ fontSize: 13.5, color: hoverIdx === i ? T.text : T.dim, transition: "color .2s", letterSpacing: "0.03em" }} className="pf-mono">{m}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal delay={index * 100}>
      <div
        className="pf-card"
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          background: T.surface,
          padding: 34,
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${member.color}, transparent 60%)`, opacity: 0.7 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div
              className="pf-disp"
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: member.color,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {member.initials}
            </div>
            <div className="pf-disp" style={{ fontSize: 20, fontWeight: 600, marginTop: 14, color: T.text }}>{member.name}</div>
            <div className="pf-mono" style={{ fontSize: 10.5, color: member.color, marginTop: 6, letterSpacing: "0.06em", lineHeight: 1.5 }}>{member.role}</div>
          </div>
          <div className="pf-mono" style={{ fontSize: 9, color: T.faint, textAlign: "right", whiteSpace: "nowrap" }}>
            STATUS<br /><span style={{ color: T.amber }}>● BUILDING</span>
          </div>
        </div>

        <p style={{ fontSize: 14, color: T.dim, lineHeight: 1.7, marginTop: 22 }}>{member.bio}</p>

        <div className="pf-mono" style={{ fontSize: 10, color: T.faint, letterSpacing: "0.1em", marginTop: 30, marginBottom: 14 }}>
          TECHNICAL MAP · {member.initials}
        </div>
        <MemberMap member={member} />

        <div className="pf-mono" style={{ fontSize: 10, color: T.faint, letterSpacing: "0.1em", marginTop: 28, marginBottom: 10 }}>
          FOCUS AREAS
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {member.strengths.slice(0, 8).map((s) => (
            <span
              key={s}
              className="pf-mono"
              style={{ fontSize: 10.5, padding: "5px 9px", border: `1px solid ${T.border}`, borderRadius: 3, color: T.dim }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
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
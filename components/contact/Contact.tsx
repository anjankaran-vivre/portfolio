"use client";

import { ArrowUpRight } from "lucide-react";
import { T } from "@/lib/theme";
import { site } from "@/data/site";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Magnetic } from "@/components/shared/Magnetic";
import { Reveal } from "@/components/shared/Reveal";

export function Contact() {
  return (
    <section id="contact" style={{ padding: "150px 24px 100px", textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow color={T.amber}>{`>`} Start Here</Eyebrow>
          </div>
          <h2 className="pf-disp" style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 600, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.05 }}>
            Have a problem
            <br />
            worth building?
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p style={{ color: T.dim, marginTop: 20, fontSize: 17 }}>
            Let's build the system behind it.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 44, flexWrap: "wrap" }}>
            <Magnetic>
              <a href={`mailto:${site.email}`} className="pf-btn pf-btn-solid" style={{ textDecoration: "none", fontSize: 14, padding: "16px 30px" }}>
                Start A Project <ArrowUpRight size={15} />
              </a>
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="pf-mono" style={{ marginTop: 56, fontSize: 12, color: T.faint, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: T.text, letterSpacing: "0.14em" }}>{site.name}</span>
            <span style={{ color: T.border }}>/</span>
            <span>{site.founderLine}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: "28px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }} className="pf-mono">
        <span style={{ fontSize: 11, color: T.faint }}>© {new Date().getFullYear()} {site.founderLine}</span>
        <span style={{ fontSize: 11, color: T.faint }}>PRAXEN — BUILT AS ONE SYSTEM</span>
        <span style={{ fontSize: 11, color: T.faint }}>
          <span style={{ color: T.amber }}>●</span> DEMO MODE
        </span>
      </div>
    </footer>
  );
}
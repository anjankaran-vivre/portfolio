"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { T } from "@/lib/theme";
import { site } from "@/data/site";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Magnetic } from "@/components/shared/Magnetic";
import { Reveal } from "@/components/shared/Reveal";
import { SectionPhoto } from "@/components/shared/SectionPhoto";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: T.bg2,
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  padding: "13px 14px",
  color: T.text,
  fontSize: 14,
  outline: "none",
  transition: "border-color .25s ease, box-shadow .25s ease",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span className="pf-mono" style={{ display: "block", fontSize: 9, letterSpacing: "0.14em", color: T.faint, marginBottom: 8 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function ContactCard() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        background: T.surface,
        padding: "30px 30px 26px",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.violet}, ${T.blue} 55%, transparent)` }} />

      <div className="pf-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: T.faint, marginBottom: 22 }}>
        CONTACT FORM · REPLIES WITHIN ONE BUSINESS DAY
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <Field label="NAME">
          <input
            required
            type="text"
            placeholder="Your full name"
            style={inputStyle}
            suppressHydrationWarning
            onFocus={(e) => (e.currentTarget.style.borderColor = `${T.violet}88`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </Field>
        <Field label="EMAIL">
          <input
            required
            type="email"
            placeholder="you@company.com"
            style={inputStyle}
            suppressHydrationWarning
            onFocus={(e) => (e.currentTarget.style.borderColor = `${T.violet}88`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
          />
        </Field>
      </div>

      <Field label="PROJECT TYPE">
        <select
          defaultValue="AI Agent / Assistant"
          style={{ ...inputStyle, cursor: "pointer" }}
          suppressHydrationWarning
          onFocus={(e) => (e.currentTarget.style.borderColor = `${T.violet}88`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
        >
          <option>AI Agent / Assistant</option>
          <option>Full-Stack Product</option>
          <option>Automation / Workflow</option>
          <option>WhatsApp Automation</option>
          <option>Others</option>
        </select>
      </Field>

      <Field label="MESSAGE">
        <textarea
          required
          rows={5}
          placeholder="What are you looking to build?"
          style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = `${T.violet}88`)}
          onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
        />
      </Field>

      <button
        type="submit"
        className="pf-btn pf-btn-solid"
        suppressHydrationWarning
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "15px",
          fontSize: 13,
          opacity: sent ? 0.85 : 1,
        }}
      >
        {sent ? "MESSAGE SENT ✓" : (
          <>
            SEND MESSAGE <ArrowUpRight size={14} />
          </>
        )}
      </button>

      <div className="pf-mono" style={{ marginTop: 14, fontSize: 9.5, color: T.faint, textAlign: "center", letterSpacing: "0.08em", minHeight: 14 }}>
        {sent ? "✓ RECEIVED — WE'LL REPLY TO YOUR INBOX SHORTLY" : "NO SPAM · NO NEWSLETTERS · JUST A REPLY"}
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section id="contact" style={{ padding: "150px 24px 100px", position: "relative", zIndex: 1 }}>
      <SectionPhoto src="/assets/tree-above.jpg" opacity={0.11} />
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="pf-contact-grid">
          {/* Left: pitch + direct CTA */}
          <Reveal>
            <Eyebrow color={T.amber}>{`>`} Start Here</Eyebrow>
            <h2
              className="pf-disp"
              style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 600, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.05, color: T.text }}
            >
              Have a problem
              <br />
              worth building?
            </h2>
            <p style={{ color: T.dim, marginTop: 20, fontSize: 17, lineHeight: 1.6, maxWidth: 420 }}>
              Let&apos;s build the system behind it. Tell us what you&apos;re trying to automate — we reply personally.
            </p>

            <div style={{ marginTop: 36 }}>
              <Magnetic>
                <a href={`mailto:${site.email}`} className="pf-btn pf-btn-solid" style={{ textDecoration: "none", fontSize: 14, padding: "16px 30px" }}>
                  Start A Project <ArrowUpRight size={15} />
                </a>
              </ Magnetic>
            </div>

            {/* Direct info rows */}
            <div style={{ marginTop: 44, borderTop: `1px solid ${T.border}` }}>
              <div className="pf-mono" style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "14px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
                <span style={{ color: T.faint, letterSpacing: "0.1em" }}>EMAIL</span>
                <a href={`mailto:${site.email}`} style={{ color: T.text, textDecoration: "none" }}>{site.email}</a>
              </div>
              <div className="pf-mono" style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "14px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
                <span style={{ color: T.faint, letterSpacing: "0.1em" }}>RESPONSE TIME</span>
                <span style={{ color: T.violet }}>&lt; 24 HOURS</span>
              </div>
              <div className="pf-mono" style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "14px 0", fontSize: 11 }}>
                <span style={{ color: T.faint, letterSpacing: "0.1em" }}>TEAM</span>
                <span style={{ color: T.text }}>{site.founderLine}</span>
              </div>
            </div>
          </Reveal>

          {/* Right: the form */}
          <Reveal delay={140}>
            <ContactCard />
          </Reveal>
        </div>

        <Reveal delay={280}>
          <div
            className="pf-mono"
            style={{
              marginTop: 72,
              paddingTop: 26,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "center",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <span style={{ color: T.text, letterSpacing: "0.14em" }}>{site.name}</span>
            <span style={{ color: T.border }}>/</span>
            <span>{site.founderLine}</span>
          </div>
        </Reveal>
      </div>

      <style>{`
        .pf-contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 940px) {
          .pf-contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        .pf-contact-grid select option { background: #141812; color: #f1eee3; }
      `}</style>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: "28px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }} className="pf-mono">
        <span style={{ fontSize: 11, color: T.faint }}>© {new Date().getFullYear()} {site.founderLine}</span>
        <span style={{ fontSize: 11, color: T.faint }}>STACKLOOP — BUILT AS ONE SYSTEM</span>
        <span style={{ fontSize: 11, color: T.faint }}>
          <span style={{ color: T.amber }}>●</span> DEMO MODE
        </span>
      </div>
    </footer>
  );
}

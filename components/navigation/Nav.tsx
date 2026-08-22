"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { T } from "@/lib/theme";
import { NAV_ITEMS, STATUS_LINES } from "@/data/site";
import { scrollToSection } from "@/lib/scroll";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_LINES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const go = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        background: scrolled ? `${T.bg}ee` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all .3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: scrolled ? "12px 24px" : "22px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding .3s ease",
          gap: 16,
        }}
      >
        <div
          className="pf-disp"
          style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", cursor: "pointer", whiteSpace: "nowrap" }}
          onClick={() => go("hero")}
        >
          PRAXEN <span style={{ color: T.amber, fontSize: 12 }}>×</span>{" "}
          <span className="pf-mono" style={{ fontSize: 10, color: T.faint, fontWeight: 400 }}>
            AK·PR
          </span>
        </div>

        <div className="pf-nav-desktop" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="pf-mono"
              style={{
                background: "none",
                border: "none",
                color: T.dim,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color .2s",
                padding: "4px 0",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.dim)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="pf-nav-desktop pf-mono" style={{ fontSize: 10, color: T.faint, minWidth: 178, textAlign: "right" }}>
          <span style={{ color: T.amber }}>●</span> {STATUS_LINES[statusIdx]}
        </div>

        <button className="pf-btn pf-nav-desktop" onClick={() => go("contact")}>
          Build With Us <ArrowRight size={13} />
        </button>

        <button
          className="pf-nav-mobile"
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            color: T.text,
            borderRadius: 3,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          <span className="pf-mono" style={{ fontSize: 11 }}>{open ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderTop: `1px solid ${T.border}`, background: T.bg, overflow: "hidden" }}
          >
            <div style={{ padding: "14px 24px 22px", display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className="pf-mono"
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    color: T.dim,
                    padding: "10px 0",
                    fontSize: 13,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => go("contact")}
                className="pf-btn pf-btn-solid"
                style={{ marginTop: 10, justifyContent: "center" }}
              >
                Build With Us <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .pf-nav-desktop { display: flex; }
        .pf-nav-mobile { display: none; }
        @media (max-width: 900px) {
          .pf-nav-desktop { display: none !important; }
          .pf-nav-mobile { display: inline-flex; }
        }
      `}</style>
    </div>
  );
}
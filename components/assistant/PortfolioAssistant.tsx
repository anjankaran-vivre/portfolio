"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import { T } from "@/lib/theme";
import { answerAssistant, ASSISTANT_SUGGESTIONS } from "@/data/process";

interface Msg {
  role: "user" | "bot";
  text: string;
}

export function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Ask me what this team builds — I'll answer from the portfolio itself." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: answerAssistant(q) }]);
    }, 500);
  };

  return (
    <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 60 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 340,
              maxWidth: "calc(100vw - 44px)",
              height: 460,
              background: T.surface,
              border: `1px solid ${T.borderLit}`,
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              marginBottom: 12,
              boxShadow: "0 24px 80px rgba(0,0,0,.55)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg2 }}>
              <div className="pf-mono" style={{ fontSize: 11, color: T.amber, letterSpacing: "0.06em" }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: T.amber, marginRight: 8, animation: "pf-pulse 1.6s infinite" }} />
                PRAXEN ASSISTANT
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: T.faint, cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>
            <div className="pf-assist-scroll" style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                    background: m.role === "user" ? `${T.amberDim}33` : T.surface2,
                    border: `1px solid ${m.role === "user" ? `${T.amber}44` : T.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: T.text,
                  }}
                >
                  {m.text}
                </div>
              ))}
              {typing && (
                <div style={{ alignSelf: "flex-start", fontSize: 12, color: T.faint, fontFamily: "IBM Plex Mono, monospace" }}>
                  <span style={{ animation: "pf-pulse 1s infinite" }}>●</span> reasoning…
                </div>
              )}
              <div ref={endRef} />
            </div>
            {msgs.length < 3 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 14px 10px" }}>
                {ASSISTANT_SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="pf-mono"
                    style={{ fontSize: 10.5, padding: "6px 10px", border: `1px solid ${T.border}`, borderRadius: 4, background: "none", color: T.dim, cursor: "pointer" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: "flex", borderTop: `1px solid ${T.border}`, padding: 10, gap: 8, background: T.bg2 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about the team…"
                style={{
                  flex: 1,
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  color: T.text,
                  padding: "10px 12px",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <button
                onClick={() => send()}
                style={{ background: T.amber, border: "none", borderRadius: 6, width: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Send size={14} color="#16110a" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: open ? T.surface2 : T.amber,
          border: `1px solid ${open ? T.borderLit : T.amber}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginLeft: "auto",
          boxShadow: "0 12px 40px rgba(0,0,0,.45)",
        }}
        aria-label="Open portfolio assistant"
      >
        {open ? <X size={20} color={T.text} /> : <MessageSquare size={20} color="#16110a" />}
      </button>
      <style>{`
        .pf-assist-scroll::-webkit-scrollbar { width: 5px; }
        .pf-assist-scroll::-webkit-scrollbar-thumb { background: ${T.borderLit}; border-radius: 4px; }
        .pf-assist-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}
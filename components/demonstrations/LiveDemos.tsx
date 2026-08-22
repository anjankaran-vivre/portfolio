"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Radio } from "lucide-react";
import { T } from "@/lib/theme";
import { DEMOS, type Demo } from "@/data/demos";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Reveal } from "@/components/shared/Reveal";

function DemoRunner({ demo }: { demo: Demo }) {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const run = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(0);
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      if (i >= demo.steps.length) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        setStep(demo.steps.length - 1);
        return;
      }
      setStep(i);
    }, 700);
  };

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(-1);
    setRunning(false);
  };

  return (
    <div>
      <div
        className="pf-mono"
        style={{
          fontSize: 12,
          color: T.dim,
          marginBottom: 20,
          padding: "12px 16px",
          border: `1px solid ${T.border}`,
          borderRadius: 4,
          background: T.bg2,
          display: "flex",
          alignItems: "center",
          gap: 10,
          minHeight: 44,
        }}
      >
        <span style={{ color: demo.color, flexShrink: 0 }}>{running ? "●" : ">"}</span>
        <span>{demo.prompt}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {demo.steps.map((s, i) => {
          const activeNow = i === step;
          const past = i < step;
          const done = i <= step;
          return (
            <div key={`${demo.id}-${i}`} style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: `2px solid ${done ? demo.color : T.border}`,
                    background: activeNow ? demo.color : "transparent",
                    transition: "all .3s",
                    animation: activeNow ? "pf-pulse-scale 1s ease-out infinite" : "none",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                {i < demo.steps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 24,
                      background: past ? demo.color : T.border,
                      transition: "background .3s",
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: 18, opacity: done ? 1 : 0.4, transition: "opacity .3s" }}>
                <div
                  className="pf-mono"
                  style={{
                    fontSize: 12.5,
                    color: activeNow ? demo.color : T.text,
                    letterSpacing: "0.06em",
                    transition: "color .3s",
                  }}
                >
                  {s.label}
                </div>
                {done && (
                  <div
                    style={{
                      fontSize: 13,
                      color: T.dim,
                      marginTop: 3,
                      maxWidth: 420,
                      animation: "pf-fade-up .4s ease both",
                    }}
                  >
                    {s.desc}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          className="pf-btn pf-btn-solid"
          onClick={run}
          disabled={running}
          style={{ opacity: running ? 0.6 : 1, cursor: running ? "default" : "pointer" }}
        >
          {running ? <Radio size={13} /> : <Play size={13} />} {running ? "Running…" : "Run"}
        </button>
        <button className="pf-btn" onClick={reset}>
          <RotateCcw size={13} /> Reset
        </button>
        <span className="pf-mono" style={{ marginLeft: "auto", fontSize: 10, color: T.faint, alignSelf: "center" }}>
          {step < 0 ? "READY" : running ? `STEP ${step + 1}/${demo.steps.length}` : "COMPLETE"}
        </span>
      </div>
    </div>
  );
}

export function LiveDemos() {
  const [active, setActive] = useState<string>(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === active)!;

  return (
    <section id="demos" style={{ background: T.bg2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 24px" }}>
        <Reveal>
          <Eyebrow color={T.amber}>Live Demonstrations</Eyebrow>
          <h2 className="pf-disp" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 600, maxWidth: 760, letterSpacing: "-0.02em", margin: 0 }}>
            Systems in motion
          </h2>
          <p style={{ color: T.dim, marginTop: 16, maxWidth: 600, fontSize: 15, lineHeight: 1.6 }}>
            Press run and watch the actual sequence a request travels through — every step is a real path we build.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            {DEMOS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className="pf-mono"
                style={{
                  padding: "10px 16px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11.5,
                  letterSpacing: "0.05em",
                  border: `1px solid ${active === d.id ? d.color : T.border}`,
                  background: active === d.id ? `${d.color}14` : "transparent",
                  color: active === d.id ? d.color : T.dim,
                  transition: "all .25s",
                }}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 32,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: 28,
              background: T.surface,
              maxWidth: 660,
            }}
          >
            <DemoRunner demo={demo} key={demo.id} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
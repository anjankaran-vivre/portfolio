"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal that can never permanently hide content.
 * - Primary: IntersectionObserver reveals on scroll (like whileInView).
 * - Fallback: if the observer never fires (or IO is unavailable), content
 *   is force-revealed after a short safety timer so it is never stuck at
 *   opacity 0.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setVisible(true);
      cleanup();
    };

    const nearViewport = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight + 250;
    };

    const cleanup = () => {
      obs.disconnect();
      clearInterval(fallback);
      clearTimeout(hardStop);
      window.removeEventListener("scroll", onScroll, { passive: true } as EventListenerOptions);
    };

    // Poll + scroll check: reveal as soon as the element scrolls near the
    // viewport, so the transition is visible on scroll.
    const fallback = setInterval(() => {
      if (nearViewport()) show();
    }, 400);
    const onScroll = () => {
      if (nearViewport()) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Absolute safety net — content can never stay hidden permanently.
    const hardStop = setTimeout(show, 12000);

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      clearInterval(fallback);
      clearTimeout(hardStop);
      window.removeEventListener("scroll", onScroll, { passive: true } as EventListenerOptions);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(26px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
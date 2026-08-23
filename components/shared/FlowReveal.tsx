"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, animate, useMotionValue, useScroll, useTransform } from "framer-motion";

/**
 * Hybrid reveal for switchable panels:
 * - Scroll-linked: hides as you scroll up, returns as you scroll down.
 * - Entrance: on mount / switch it cascades in with a stagger,
 *   so every switch replays the one-by-one appearance.
 */
export function FlowReveal({
  delay = 0,
  from = "bottom",
  children,
}: {
  delay?: number;
  from?: "top" | "bottom";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.72"],
  });

  // Entrance progress (0 -> 1) triggered on mount / switch
  const enter = useMotionValue(0);
  useEffect(() => {
    const controls = animate(enter, 1, {
      duration: 0.45,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useTransform([scrollYProgress, enter], (v: number[]) =>
    Math.min(v[0], v[1])
  );
  const distance = from === "top" ? -16 : 18;
  const y = useTransform(visible, (v: number) => (1 - v) * distance);

  return (
    <motion.div ref={ref} style={{ opacity: visible, y, willChange: "opacity, transform" }}>
      {children}
    </motion.div>
  );
}

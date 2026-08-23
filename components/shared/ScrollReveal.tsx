"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-linked reveal: the section's opacity and vertical position are
 * driven directly by scroll progress, so it smoothly rises into place
 * while you scroll — fully visible once its top passes ~78% of the viewport.
 */
export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // 0 when the section's top hits the bottom of the viewport,
  // 1 when the section's top reaches 72% of the viewport height.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.72"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.985, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale, willChange: "opacity, transform" }}>
      {children}
    </motion.div>
  );
}

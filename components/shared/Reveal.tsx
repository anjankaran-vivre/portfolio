"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-linked reveal for individual elements inside sections.
 * Opacity/position are driven directly by scroll progress (same feel as
 * ScrollReveal): the element rises into place as you scroll and settles
 * once its top passes ~88% of the viewport. `delay` (ms) staggers items
 * by shifting where in the scroll range their fade begins.
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.72"],
  });

  // Stagger: delayed items start fading later along the same scroll range.
  const d = Math.min(delay / 900, 0.55);
  const opacity = useTransform(scrollYProgress, [d, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [34, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y, willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

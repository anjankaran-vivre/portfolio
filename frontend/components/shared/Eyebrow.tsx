"use client";

import { T } from "@/lib/theme";

export function Eyebrow({ children, color = T.amber }: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="pf-mono"
      style={{
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          animation: "pf-pulse 2s infinite",
        }}
      />
      {children}
    </div>
  );
}
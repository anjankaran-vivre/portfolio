import { T } from "@/lib/theme";

export function Tag({ children, color = T.dim }: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="pf-mono"
      style={{
        fontSize: 11,
        padding: "5px 10px",
        border: `1px solid ${T.border}`,
        borderRadius: 3,
        color,
        background: T.surface,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
import { T } from "@/lib/theme";

export function SectionWrap({
  id,
  children,
  style,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        padding: "120px 24px",
        position: "relative",
        zIndex: 1,
        maxWidth: 1240,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
export const T = {
  bg: "#08090c",
  bg2: "#0c0e12",
  surface: "#111318",
  surface2: "#171a20",
  border: "#22262e",
  borderLit: "#323844",
  text: "#eef0f3",
  dim: "#9aa3af",
  faint: "#575f6c",
  blue: "#6c9bff",
  blueDim: "#3a4a7a",
  violet: "#b98bfa",
  violetDim: "#584a7a",
  amber: "#f2b860",
  amberDim: "#7a6438",
} as const;

export type Token = typeof T;

export const fonts = {
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

export const scrollOffsets = {
  start: "top 85%",
  end: "top 60%",
} as const;
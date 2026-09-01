// "Living Digital Systems" palette — deep charcoal with a forest/olive
// cast, warm off-white type, muted moss + emerald accents instead of the
// former violet/blue, warm gold kept for the third accent. Token *names*
// are unchanged on purpose (`violet`, `blue`, `amber`) — everything in the
// app addresses colors through these keys, so retinting here cascades
// site-wide without touching component logic.
export const T = {
  bg: "#0a0c09",
  bg2: "#0e110d",
  surface: "#141812",
  surface2: "#1b2018",
  border: "#262b22",
  borderLit: "#38402f",
  text: "#f1eee3",
  dim: "#a7ab98",
  faint: "#838a76",
  blue: "#4fa98c", // secondary accent — emerald/teal
  blueDim: "#2c4a3f",
  violet: "#74bb7e", // primary accent — forest/moss green
  violetDim: "#3a5540",
  amber: "#e3b462", // warm gold — dappled-light accent
  amberDim: "#6b5730",
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
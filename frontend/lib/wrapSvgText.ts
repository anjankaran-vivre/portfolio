// Native SVG <text> doesn't wrap on its own. This manually breaks a status
// label into up to two word-wrapped <tspan> lines so a longer status
// ("load: high — queueing") stays inside its box instead of overflowing it,
// while a short one ("load: nominal") still renders as a single line.
export function setWrappedSvgText(
  el: SVGTextElement | null,
  text: string,
  x: number,
  maxCharsPerLine: number,
  lineHeight: number
) {
  if (!el) return;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  const capped = lines.length > 2 ? [lines[0], lines.slice(1).join(" ")] : lines;

  while (el.firstChild) el.removeChild(el.firstChild);
  capped.forEach((line, i) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", String(x));
    tspan.setAttribute("dy", i === 0 ? "0" : String(lineHeight));
    tspan.textContent = line;
    el.appendChild(tspan);
  });
}

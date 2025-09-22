export type DotBgOptions = {
  dotColor?: string;
  bgColor?: string;
  dotSize?: number;
  gapX?: number;
  gapY?: number;
  opacity?: number;  radius?: number;
};

export function dotBgDataUrl({
  dotColor = "rgba(0,0,0,0.18)",
  bgColor = "transparent",
  dotSize = 3,
  gapX = 70,
  gapY = 70,
  opacity = 1,
  radius = 0,
}: DotBgOptions = {}): string {
  const w = Math.max(1, Math.round(gapX));
  const h = Math.max(1, Math.round(gapY));
  const s = Math.max(1, Math.round(dotSize));

  const x = Math.round(w / 2 - s / 2);
  const y = Math.round(h / 2 - s / 2);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ` +
    `opacity="${opacity}" shape-rendering="crispEdges">` +
    `<rect width="100%" height="100%" fill="${bgColor}"/>` +
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${radius}" ry="${radius}" fill="${dotColor}"/>` +
    `</svg>`;

  const encoded = encodeURIComponent(svg).replace(/%0A/g, "").replace(/%20/g, " ");
  return `data:image/svg+xml;utf8,${encoded}`;
}

export function dotBgStyle(opts?: DotBgOptions): React.CSSProperties {
  const url = dotBgDataUrl(opts);
  return {
    backgroundImage: `url("${url}")`,
    backgroundRepeat: "repeat",
  };
}

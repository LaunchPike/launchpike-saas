// src/utils/dotBg.ts
export type DotBgOptions = {
  /** Цвет квадратика */
  dotColor?: string;
  /** Цвет фона SVG (обычно transparent) */
  bgColor?: string;
  /** Сторона квадратика в px */
  dotSize?: number;
  /** Горизонтальный шаг (px) */
  gapX?: number;
  /** Вертикальный шаг (px) */
  gapY?: number;
  /** Общая непрозрачность SVG (0..1) */
  opacity?: number;
  /** Скругление углов квадратика (px), 0 = строго квадрат */
  radius?: number;
};

export function dotBgDataUrl({
  dotColor = "rgba(0,0,0,0.18)",
  bgColor = "transparent",
  dotSize = 3,          // размер квадратика
  gapX = 70,            // шаг по умолчанию 70×70
  gapY = 70,
  opacity = 1,
  radius = 0,
}: DotBgOptions = {}): string {
  const w = Math.max(1, Math.round(gapX));
  const h = Math.max(1, Math.round(gapY));
  const s = Math.max(1, Math.round(dotSize));

  // центрируем квадратик в тайле и привязываем к целым пикселям
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
    // при желании можно зафиксировать background-size:
    // backgroundSize: `${Math.round(opts?.gapX ?? 70)}px ${Math.round(opts?.gapY ?? 70)}px`,
  };
}

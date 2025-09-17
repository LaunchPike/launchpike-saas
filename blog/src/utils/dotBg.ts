import type { CSSProperties } from "react";

export type SquareBgOptions = {
  /** Цвет квадратика */
  squareColor?: string;
  /** Цвет фона SVG (обычно transparent) */
  bgColor?: string;
  /** Размер стороны квадрата (px) */
  squareSize?: number;
  /** Шаг по X (px) */
  gapX?: number;
  /** Шаг по Y (px) */
  gapY?: number;
  /** Общая прозрачность SVG (0..1) */
  opacity?: number;
};

export function squareBgDataUrl({
  squareColor = "rgba(0,0,0,0.18)",
  bgColor = "transparent",
  squareSize = 3,
  gapX = 70,
  gapY = 70,
  opacity = 1,
}: SquareBgOptions = {}): string {
  const w = Math.max(1, Math.round(gapX));
  const h = Math.max(1, Math.round(gapY));
  const s = Math.max(1, Math.round(squareSize));

  // Центрируем квадрат и прилипляем к целым пикселям для резкости
  const x = Math.round(w / 2 - s / 2);
  const y = Math.round(h / 2 - s / 2);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ` +
    `opacity="${opacity}" shape-rendering="crispEdges">` + // без сглаживания
    `<rect width="100%" height="100%" fill="${bgColor}"/>` +
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${squareColor}"/>` + // строго квадрат
    `</svg>`;

  const encoded = encodeURIComponent(svg).replace(/%0A/g, "").replace(/%20/g, " ");
  return `data:image/svg+xml;utf8,${encoded}`;
}

export function squareBgStyle(opts?: SquareBgOptions): CSSProperties {
  const url = squareBgDataUrl(opts);
  return {
    backgroundImage: `url("${url}")`,
    backgroundRepeat: "repeat",
    // backgroundSize можно не указывать — возьмётся из intrinsic size (gapX × gapY)
  };
}

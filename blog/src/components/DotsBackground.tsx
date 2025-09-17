// src/components/DotBackground.tsx
import React, { useMemo } from "react";
import { dotBgStyle, type DotBgOptions } from "../utils/dotBg.ts";

export type DotBackgroundProps = React.HTMLAttributes<HTMLDivElement> & DotBgOptions;

/**
 * Оборачивает детей и навешивает точечный фон.
 * Не требует гидрации, если пропсы статичны.
 */
export default function DotBackground({
  dotColor,
  bgColor,
  radius,
  gapX,
  gapY,
  opacity,
  style,
  className,
  children,
  ...rest
}: DotBackgroundProps) {
  const bg = useMemo(
    () => dotBgStyle({ dotColor, bgColor, radius, gapX, gapY, opacity }),
    [dotColor, bgColor, radius, gapX, gapY, opacity]
  );

  return (
    <div
      {...rest}
      className={className}
      style={{
        ...bg,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

export type TimelineAxisHandle = {
  minuteToX: (minute: number) => number;
  element: HTMLDivElement | null;
  contentWidth: number;
};

type Props = {
  totalMinutes: number;
  labelEvery?: number;
  paddingLeft?: number;
  paddingRight?: number;
  height?: number;
  tickSmall?: number;
  tickLarge?: number;
  className?: string;
  style?: React.CSSProperties;
  pxPerMinute: number;
  tickLargeWidth: number
  tickSmallWidth: number;
  fontSize: number
};

const TimelineAxis = forwardRef<TimelineAxisHandle, Props>(
  (
    {
      totalMinutes,
      labelEvery = 5,
      paddingLeft = 0,
      paddingRight = 0,
      height = 70,
      tickSmall = 8,
      tickLarge = 15,
      className,
      style,
      pxPerMinute,
      tickLargeWidth = 4,
      tickSmallWidth = 3,
      fontSize = 25
    },
    ref
  ) => {
    const wrapRef = useRef<HTMLDivElement>(null);

    const contentWidth = totalMinutes * pxPerMinute;
    const totalWidth = contentWidth + paddingLeft + paddingRight;

    const ticks = useMemo(() => {
      const arr: { minute: number; x: number; major: boolean }[] = [];
      for (let minute = 0; minute <= totalMinutes; minute++) {
        const x = paddingLeft + (minute * pxPerMinute);
        const major = labelEvery > 0 && (minute % labelEvery === 0);
        arr.push({ minute, x, major });
      }
      return arr;
    }, [totalMinutes, labelEvery, pxPerMinute, paddingLeft]);

    const minuteToX = (minute: number) => {
      const m = Math.max(0, Math.min(totalMinutes, minute));
      return paddingLeft + m * pxPerMinute;
    };

    useImperativeHandle(
      ref,
      () => ({
        minuteToX,
        element: wrapRef.current,
        contentWidth,
      }),
      [contentWidth, minuteToX]
    );

    const calcXAndX1ForFirstAndLastLine = (x: number, index: number) =>
      index === 0 ? x + tickLargeWidth : index === ticks.length - 1 ? x - tickLargeWidth : x

    return (
      <div
        ref={wrapRef}
        className={className}
        style={{
          width: totalWidth,
          ...style
        }}
      >
        <svg
          width={totalWidth}
          height={height}
          viewBox={`0 0 ${totalWidth} ${height}`}
        >
          {ticks.map(({ minute, x, major }, index) => (
            <g key={minute}>
              {/* Полоска вниз от линии */}
              <line
                x1={calcXAndX1ForFirstAndLastLine(x, index)}
                x2={calcXAndX1ForFirstAndLastLine(x, index)}
                y1={20}
                y2={20 + (major ? tickLarge : tickSmall)}
                stroke="#333"
                strokeWidth={major ? tickLargeWidth : tickSmallWidth}
              />

              {major && (
                <text
                  x={ticks.length - 1 === index ? x - 40 : x}
                  y={20 + tickLarge + 30}
                  fontSize={fontSize}
                  textAnchor="middle"
                  fontWeight="600"
                  fill="#333"
                >
                  {index === 0 ? "" : minute + " min"}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  }
);

export default TimelineAxis;
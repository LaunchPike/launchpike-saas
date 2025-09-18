import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const ROWS = 9;
const COLS = 8;
const TOTAL_DURATION = 4;
const DIAGONALS = ROWS + COLS - 1;
const STEP = TOTAL_DURATION / DIAGONALS;

const START_DELAY = 1.5;

const EASE_IN = [0.12, 0.0, 0.39, 0.0];
const EASE_OUT = [0.22, 1.0, 0.36, 1.0];

export default function HoverBoard() {
  const reduce = useReducedMotion();
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div
      className="relative lg:top-[-20px] lg:left-[23px] grid grid-cols-8 grid-rows-9 gap-1 w-[340px] h-[360px] lg:w-fit lg:h-fit"
      style={{
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      }}
    >
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const k = r + c;
          const perCellDelay = START_DELAY + k * STEP;
          const cellKey = `${r}-${c}`;
          const baseDuration = Math.max(STEP * 1.6, 0.65);

          return (
            <motion.div
              key={cellKey}
              initial={{
                color: "#0A0A0A",
                backgroundColor: "rgba(255,255,255,0)",
                boxShadow: "0 0 0px 0 rgba(240,229,254,0)",
                fontWeight: 300,
                textAlign: "center",
              }}
              animate={{
                color: "#000",
                boxShadow: [
                  "0 0 0px 0 rgba(240,229,254,0)",
                  "0 0 32px 0 rgba(240,229,254,0.85)",
                  "0 0 0px 0 rgba(240,229,254,0)",
                ],
                backgroundColor: [
                  "rgba(255,255,255,0)",
                  "#F6EEFF",
                  "#FFFFFF",
                ],
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      delay: perCellDelay,
                      duration: baseDuration,
                      times: [0, 0.65, 1],
                      ease: [EASE_IN, EASE_OUT],
                    }
              }
              style={{ willChange: "background-color, box-shadow" }}
              className="relative hour-card flex items-center justify-center text-sm lg:text-[22px] font-medium cursor-pointer rounded-sm min-w-[36px] min-h-[36px] lg:min-h-[60px] lg:w-[65px] lg:h-[65px]"
              onMouseEnter={() => setHoveredCell(cellKey)}
              onMouseDown={() => setHoveredCell(null)}
              onMouseOut={() => setHoveredCell(null)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {!reduce && (
                <motion.span
                  key={`${cellKey}-wave`}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: perCellDelay,
                    duration: baseDuration,
                    times: [0, 0.65, 1],
                    ease: [EASE_IN, EASE_OUT],
                  }}
                >
                  1 lost hour
                </motion.span>
              )}

              {(hoveredCell === cellKey || reduce) && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  1 lost hour
                </span>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
}

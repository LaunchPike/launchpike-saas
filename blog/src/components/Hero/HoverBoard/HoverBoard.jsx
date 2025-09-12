import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ROWS = 10;
const COLS = 8;
const TOTAL_DURATION = 30; // seconds
const DIAGONALS = ROWS + COLS - 1; // 17
const STEP = TOTAL_DURATION / DIAGONALS; // ~1.7647s per diagonal

export default function HoverBoard() {
  const reduce = useReducedMotion();
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div
      className="grid grid-cols-8 grid-rows-10 gap-0.5 p-4"
      style={{
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        width: '600px',
        height: '750px'
      }}
    >
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const k = r + c; // anti-diagonal index (TL -> BR)
          const delay = k * STEP; // start time for this diagonal
          const cellKey = `${r}-${c}`;

          return (
            <motion.div
              key={cellKey}
              initial={{ color: "0A0A0A", backgroundColor: "#FFF", fontSize: "24px", fontWeight: 300, textAlign: "center" }}
              animate={{
                color: "#000",
                boxShadow: "0 0 40px 0 #F0E5FE",
                backgroundColor: "#F6EEFF",
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                    delay,
                    duration: STEP, // each diagonal fades over its slot
                    ease: "linear",
                    repeat: 1, // play twice (forward + reverse)
                    repeatType: "reverse", // go back to initial
                    repeatDelay: 0,
                  }
              }
              className="hour-card flex items-center justify-center text-xs font-medium cursor-pointer rounded-sm min-h-[60px] border border-gray-100"
              onMouseEnter={() => setHoveredCell(cellKey)}
              onMouseDown={() => setHoveredCell(null)}
              onMouseOut={() => setHoveredCell(null)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {hoveredCell === cellKey ? "1 lost hour" : ""}
            </motion.div>
          );
        })
      )}
    </div>
  );
}
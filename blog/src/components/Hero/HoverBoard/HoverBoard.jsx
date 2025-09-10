import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./HoverBoard.css";

const ROWS = 10;
const COLS = 8;
const TOTAL_DURATION = 30; // seconds
const DIAGONALS = ROWS + COLS - 1; // 17
const STEP = TOTAL_DURATION / DIAGONALS; // ~1.7647s per diagonal

export default function HoverBoard() {
  const reduce = useReducedMotion();

  return (
    <div
      className="grid grid-cols-8 grid-rows-10 gap-0.5"
      style={{
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      }}
    >
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const k = r + c; // anti-diagonal index (TL -> BR)
          const delay = k * STEP; // start time for this diagonal

          return (
            <motion.div
              key={`${r}-${c}`}
              initial={{ color: "#FFF", backgroundColor: "#FFF" }}
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
              className="hour-card"
            >
              1 lost hour
            </motion.div>
          );
        })
      )}
    </div>
  );
}

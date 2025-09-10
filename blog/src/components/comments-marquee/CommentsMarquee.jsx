import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import Comment from "./Comment";
import "./CommentsMarquee.css";

function ColumnFM({ comments, speed = 40 }) {
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const [H, setH] = useState(0);
  const y = useMotionValue(0);
  const pausedRef = useRef(false);

  // measure height of one stack
  useEffect(() => {
    if (!groupRef.current) return;
    const measure = () => setH(groupRef.current.getBoundingClientRect().height || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, []);

  // desync start
  useEffect(() => {
    if (H > 0) y.set(-Math.random() * H);
  }, [H]); // eslint-disable-line react-hooks/exhaustive-deps

  // hover pause
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onEnter = () => (pausedRef.current = true);
    const onLeave = () => (pausedRef.current = false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // smooth, seamless scroll: rAF + modulo wrap
  useAnimationFrame((t, delta) => {
    if (pausedRef.current || H === 0) return;
    const dy = -(speed * (delta / 1000)); // px per frame
    let next = y.get() + dy;
    // wrap upward: when we've moved past one stack, jump by +H (identical copy)
    if (-next >= H) next += H;
    if (next > 0) next -= H; // stability for very small H / speed changes
    y.set(next);
  });

  return (
    <div className="marquee-vertical-container" style={{ height: 808, overflow: "hidden" }}>
      <motion.div
        ref={trackRef}
        style={{
          y,
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          gap: "2rem",
        }}
      >
        {/* first stack */}
        <div ref={groupRef} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {comments.map((c, i) => (
            <Comment key={`a-${i}`} name={c.name} title={c.title} comment={c.comment} />
          ))}
        </div>
        {/* duplicate stack */}
        <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {comments.map((c, i) => (
            <Comment key={`b-${i}`} name={c.name} title={c.title} comment={c.comment} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function CommentsMarqueeFM({ rows, speeds }) {
  return (
    <div className="relative w-full h-[808px] parent-fade-mask">
      <div className="child-fade-mask h-full flex items-center justify-center">
        <div className="flex flex-row gap-6">
          {rows.map((row, idx) => (
            <ColumnFM key={idx} comments={row} speed={speeds[idx] ?? 40} />
          ))}
        </div>
      </div>
    </div>
  );
}

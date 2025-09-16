import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import Comment from "./Comment";
import "./CommentsMarquee.css";

function ColumnFM({ comments, speed = 40 }) {
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const [H, setH] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const y = useMotionValue(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    const measure = () => setH(groupRef.current.getBoundingClientRect().height || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (H > 0 && !isMobile) y.set(-Math.random() * H);
  }, [H, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    
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
  }, [isMobile]);

  useAnimationFrame((t, delta) => {
    if (pausedRef.current || H === 0 || isMobile) return;
    
    const dy = -(speed * (delta / 1000));
    let next = y.get() + dy;
    if (-next >= H) next += H;
    if (next > 0) next -= H;
    y.set(next);
  });

  return (
    <div className="marquee-vertical-container" style={{ height: 808, overflow: "hidden" }}>
      <motion.div
        ref={trackRef}
        style={{
          y: isMobile ? 0 : y,
          display: "flex",
          flexDirection: "column",
          willChange: isMobile ? "auto" : "transform",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          gap: "2rem",
        }}
      >
        <div ref={groupRef} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {comments.map((c, i) => (
            <Comment key={`a-${i}`} name={c.name} title={c.title} comment={c.comment} />
          ))}
        </div>
        {!isMobile && (
          <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {comments.map((c, i) => (
              <Comment key={`b-${i}`} name={c.name} title={c.title} comment={c.comment} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function CommentsMarqueeFM({ rows, speeds }) {
  return (
    <div className="relative w-full lg:h-[808px] parent-fade-mask">
      <div className="child-fade-mask h-full flex items-center justify-center">
        <div className="flex flex-col lg:flex-row gap-6">
          {rows.map((row, idx) => (
            <ColumnFM key={idx} comments={row} speed={speeds[idx] ?? 40} />
          ))}
        </div>
      </div>
    </div>
  );
}
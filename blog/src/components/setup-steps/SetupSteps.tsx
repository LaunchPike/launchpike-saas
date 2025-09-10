import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  useScroll,
  useMotionTemplate
} from "framer-motion";
import SlideCard from "./SlideCard";
import "./SetupSteps.scss";


function useElementScrollPercentage(ref: any, threshold = 0.1, displayHeight = 0) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Calculate how much of the element is visible
      const elementVisible = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const elementPercentVisible = rect.height > 0 || displayHeight > 0 ? elementVisible / (displayHeight ?? rect.height) : 0;
      if (elementPercentVisible >= threshold) {
        const total = rect.height + windowHeight;
        const visible = Math.max(0, windowHeight - rect.top);
        setPercentage(Math.min(1, Math.max(0, visible / total)));
      } else {
        setPercentage(0);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, threshold]);

  return percentage;
}

const SmoothScroll = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);


  const scrollPerc = useMotionValue(0);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      setScrollRange(scrollRef.current.scrollWidth + window.innerWidth * .8);
    }
  }, [scrollRef, containerRef]);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      setViewportW(entry.contentRect.width);
    }
  }, []);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => onResize(entries));
    if (ghostRef.current) {
      resizeObserver.observe(ghostRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [onResize]);

  const { scrollYProgress } = useScroll();


  const percentage = useElementScrollPercentage(containerRef, 1, typeof window !== "undefined" ? window.innerHeight : undefined);

  useEffect(() => {
    scrollPerc.set(percentage);
  }, [percentage, scrollPerc]);

  const transform = useTransform(
    scrollPerc,
    [0, 1],
    [0, -scrollRange + viewportW]
  );
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);
  const bgSpring = useSpring(scrollPerc, {
    damping: 30,
    stiffness: 50,
    mass: 1,
  });

  const bgPercent = useTransform(bgSpring, [0, .8], [0, 100]);

  // build a reactive gradient string
  const bgGradient = useMotionTemplate`
    linear-gradient(to right, #3B82F6 ${bgPercent}%, gray ${bgPercent}%)
  `;


  return (
    <div ref={containerRef}>
      <div className="scroll-container">
        <motion.section
          ref={scrollRef}
          style={{ x: spring }}
          className="slides-container"
        >
          <div className="slides">
            <SlideCard slideNumber={1} isActive={false} />
            <SlideCard slideNumber={2} isActive={false} paddingFromLeft='450px' />
            <SlideCard slideNumber={4} isActive={false} paddingFromLeft='750px' />
            <SlideCard slideNumber={3} isActive={false} paddingFromLeft='450px' />
            <SlideCard slideNumber={5} isActive={false} paddingFromLeft='550px' />
            <SlideCard slideNumber={6} isActive={false} paddingFromLeft='650px' />
            <SlideCard slideNumber={7} isActive={false} paddingFromLeft='750px' />
            <SlideCard slideNumber={8} isActive={false} paddingFromLeft='300px' />
            <SlideCard slideNumber={9} isActive={false} paddingFromLeft='850px' />
            <SlideCard slideNumber={10} isActive={false} paddingFromLeft='1700px' />
          </div>
          <motion.div
            className="w-[12254px] h-[15px]"
            style={{ background: bgGradient }}
          ></motion.div>
          <img src="/Timer.svg" alt="" />
        </motion.section>
      </div>
      <div ref={ghostRef} style={{ height: scrollRange }} className="ghost" />
    </div>
  );
};

export default SmoothScroll;

import { useEffect, useRef, useState, useMemo } from "react";
import "./SetupSteps.scss";
import SlideCard from "./SlideCard";
import TimelineAxis, { type TimelineAxisHandle } from "./TimelineAxis";

export default function SmoothScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<TimelineAxisHandle>(null);

  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlides, setActiveSlides] = useState<Set<number>>(new Set());
  const [activeSlide, setActiveSlide] = useState<number>(1);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  const TOTAL_MINUTES = 90;
  const PX_PER_MINUTE = 120;
  const TIMELINE_WIDTH = TOTAL_MINUTES * PX_PER_MINUTE;

  const LABEL_EVERY = 5;
  const AXIS_PADDING_LEFT = 0;
  const AXIS_PADDING_RIGHT = 0;
  const ANCHOR_GAP = 18;

  const slideTimes: Record<number, string> = {
    1: "0:00",
    2: "8:31",
    3: "18:01",
    4: "23:21",
    5: "33:41",
    6: "42:31",
    7: "52:15",
    8: "58:41",
    9: "74:01",
    10: "90:00",
  };

  const parseTime = (timeStr: string): number => {
    const [mm = "0", ss = "0"] = timeStr.split(":");
    return Number(mm) + Number(ss) / 60;
  };

  const minuteToXLinear = (minute: number): number =>
    AXIS_PADDING_LEFT + minute * PX_PER_MINUTE;

  const slideLeftPosition = (slideNumber: number): number => {
    const minutes = parseTime(slideTimes[slideNumber] ?? "0:00");
    return minuteToXLinear(minutes) - ANCHOR_GAP;
  };

  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const anchors = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const n = i + 1;
      return slideLeftPosition(n) + ANCHOR_GAP;
    });
  }, [PX_PER_MINUTE]);

  function progressToXWithHolds(progress: number) {
    if (!anchors.length) return 0;
    const sections = anchors.length - 1;
    if (sections <= 0) return anchors[0];
    const START_HOLD = 0.08;
    const END_HOLD = 0.08;
    const MID_HOLDS = 0.16;
    const TOTAL_HOLDS = START_HOLD + END_HOLD + MID_HOLDS;
    const MOVE_FRACTION = Math.max(0, 1 - TOTAL_HOLDS);
    const movePerSection = MOVE_FRACTION / sections;
    const internalAnchors = Math.max(0, anchors.length - 2);
    const holdPerInternal = internalAnchors ? MID_HOLDS / internalAnchors : 0;
    let r = progress;
    if (r <= START_HOLD) return anchors[0];
    r -= START_HOLD;
    for (let i = 0; i < sections; i++) {
      if (r <= movePerSection) {
        const localP = r / movePerSection;
        const eased =
          localP < 0.5 ? 4 * localP * localP * localP : 1 - Math.pow(-2 * localP + 2, 3) / 2;
        return anchors[i] + eased * (anchors[i + 1] - anchors[i]);
      }
      r -= movePerSection;
      const isLastAnchor = i + 1 === sections;
      if (!isLastAnchor && holdPerInternal > 0) {
        if (r <= holdPerInternal) return anchors[i + 1];
        r -= holdPerInternal;
      }
    }
    if (r <= END_HOLD) return anchors[anchors.length - 1];
    return anchors[anchors.length - 1];
  }

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 480);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const virtualYRef = useRef(0);
  const virtualXRef = useRef(0);
  const scrollingRafRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const edgeLockRef = useRef<"top" | "bottom" | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (isMobile) return;
    const node = containerRef.current;
    if (!node) return;

    const EDGE_ENTER = 0.02;
    const EDGE_EXIT = 0.06;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const updateTargetsFromWindow = () => {
      virtualYRef.current = window.scrollY || window.pageYOffset;
      virtualXRef.current = window.scrollX || window.pageXOffset;
    };
    updateTargetsFromWindow();

    const animate = () => {
      const maxY = (document.scrollingElement?.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const maxX = (document.scrollingElement?.scrollWidth || document.body.scrollWidth) - window.innerWidth;
      const curY = window.scrollY || window.pageYOffset;
      const curX = window.scrollX || window.pageXOffset;
      const tgtY = clamp(virtualYRef.current, 0, Math.max(0, maxY));
      const tgtX = clamp(virtualXRef.current, 0, Math.max(0, maxX));
      const nextY = curY + (tgtY - curY) * 0.35;
      const nextX = curX + (tgtX - curX) * 0.35;
      window.scrollTo(nextX, nextY);
      const vy = Math.abs(tgtY - nextY);
      const vx = Math.abs(tgtX - nextX);
      if (vy < 0.5 && vx < 0.5) {
        animatingRef.current = false;
        scrollingRafRef.current = null;
        return;
      }
      scrollingRafRef.current = requestAnimationFrame(animate);
    };

    const getProgress = () => {
      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = node.offsetHeight;
      const startPoint = windowHeight;
      const endPoint = -containerHeight;
      const totalDistance = startPoint - endPoint;
      const currentPosition = rect.top;
      return Math.max(0, Math.min(1, (startPoint - currentPosition) / totalDistance));
    };

    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
      edgeLockRef.current = null;
      if (animatingRef.current && scrollingRafRef.current) {
        cancelAnimationFrame(scrollingRafRef.current);
        scrollingRafRef.current = null;
        animatingRef.current = false;
      }
      updateTargetsFromWindow();
    };

    const onWheel = (e: WheelEvent) => {
      if (!hoverRef.current) return;
      const rect = node.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const progress = getProgress();

      if (edgeLockRef.current === "top") {
        if (progress > EDGE_EXIT || e.deltaY > 0) edgeLockRef.current = null;
        else return;
      } else if (edgeLockRef.current === "bottom") {
        if (progress < 1 - EDGE_EXIT || e.deltaY < 0) edgeLockRef.current = null;
        else return;
      }

      if (progress < EDGE_ENTER && e.deltaY < 0) {
        edgeLockRef.current = "top";
        if (animatingRef.current && scrollingRafRef.current) {
          cancelAnimationFrame(scrollingRafRef.current);
          scrollingRafRef.current = null;
          animatingRef.current = false;
        }
        return;
      }
      if (progress > 1 - EDGE_ENTER && e.deltaY > 0) {
        edgeLockRef.current = "bottom";
        if (animatingRef.current && scrollingRafRef.current) {
          cancelAnimationFrame(scrollingRafRef.current);
          scrollingRafRef.current = null;
          animatingRef.current = false;
        }
        return;
      }

      e.preventDefault();
      const scale = 0.45;
      virtualYRef.current += e.deltaY * scale;
      virtualXRef.current += e.deltaX * scale;
      if (!animatingRef.current) {
        animatingRef.current = true;
        scrollingRafRef.current = requestAnimationFrame(animate);
      }
    };

    const onScrollSync = () => {
      if (!animatingRef.current) updateTargetsFromWindow();
    };

    node.addEventListener("mouseenter", onEnter);
    node.addEventListener("mouseleave", onLeave);
    node.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScrollSync, { passive: true });

    return () => {
      node.removeEventListener("mouseenter", onEnter);
      node.removeEventListener("mouseleave", onLeave);
      node.removeEventListener("wheel", onWheel as EventListener);
      window.removeEventListener("scroll", onScrollSync as EventListener);
      if (scrollingRafRef.current) cancelAnimationFrame(scrollingRafRef.current);
      scrollingRafRef.current = null;
      animatingRef.current = false;
      edgeLockRef.current = null;
      hoverRef.current = false;
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const handleMobileScroll = () => {
      const viewportHeight = window.innerHeight;
      const centerY = viewportHeight / 2;
      const next = new Set<number>();
      for (let i = 1; i <= 10; i++) {
        const el = document.querySelector(`[data-mobile-slide="${i}"]`) as HTMLElement | null;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const slideCenter = rect.top + rect.height / 2;
        const threshold = viewportHeight * 0.25;
        const isInCenter = slideCenter >= centerY - threshold && slideCenter <= centerY + threshold;
        const coversCenter = rect.top <= centerY && rect.bottom >= centerY;
        if (isInCenter || coversCenter) next.add(i);
      }
      setActiveSlides(next);
    };
    window.addEventListener("scroll", handleMobileScroll, { passive: true });
    window.addEventListener("resize", handleMobileScroll, { passive: true });
    const t = setTimeout(handleMobileScroll, 200);
    return () => {
      window.removeEventListener("scroll", handleMobileScroll);
      window.removeEventListener("resize", handleMobileScroll);
      clearTimeout(t);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const updateFromProgress = (p: number) => {
      const knobX = progressToXWithHolds(p);
      const viewportCenterOffset = window.innerWidth * 0.4;
      const startPosition = viewportCenterOffset;
      const endPosition = -(TIMELINE_WIDTH - window.innerWidth * 0.8) - viewportCenterOffset;
      const fullSpan = anchors[anchors.length - 1] - anchors[0] || 1;
      const t = (knobX - anchors[0]) / fullSpan;
      const currentTranslate = startPosition + t * (endPosition - startPosition);
      setTranslateX(currentTranslate);
      const last = anchors.length - 1;
      let activeIdx = 0;
      if (knobX >= anchors[last]) {
        activeIdx = last;
      } else {
        for (let i = 0; i < last; i++) {
          if (knobX >= anchors[i] && knobX < anchors[i + 1]) {
            activeIdx = i;
            break;
          }
        }
      }
      const newActive = activeIdx + 1;
      if (newActive !== activeSlide) setActiveSlide(newActive);
      const segIdx = Math.min(activeIdx, last - 1);
      const segStart = anchors[segIdx];
      const segEnd = anchors[segIdx + 1];
      if (progressFillRef.current) {
        progressFillRef.current.style.left = `${segStart}px`;
        progressFillRef.current.style.width = `${segEnd - segStart}px`;
      }
    };

    const startRAF = () => {
      if (rafRef.current != null) return;
      const SPEED = 6;
      const tick = (ts: number) => {
        if (!lastTsRef.current) lastTsRef.current = ts;
        const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
        lastTsRef.current = ts;
        const rate = 1 - Math.exp(-SPEED * dt);
        const cur = smoothProgressRef.current;
        const tgt = targetProgressRef.current;
        const next = cur + (tgt - cur) * rate;
        smoothProgressRef.current = next;
        updateFromProgress(next);
        if (Math.abs(tgt - next) > 0.0005) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = containerRef.current.offsetHeight;
      const startPoint = windowHeight;
      const endPoint = -containerHeight;
      const totalDistance = startPoint - endPoint;
      const currentPosition = rect.top;
      const rawProgress = Math.max(0, Math.min(1, (startPoint - currentPosition) / totalDistance));
      const globalPauseStart = 0.15;
      const globalMovePhase = 0.70;
      let movedProgress = 0;
      if (rawProgress <= globalPauseStart) movedProgress = 0;
      else if (rawProgress < globalPauseStart + globalMovePhase) {
        const p = (rawProgress - globalPauseStart) / globalMovePhase;
        movedProgress = Math.max(0, Math.min(1, p));
      } else movedProgress = 1;
      targetProgressRef.current = movedProgress;
      startRAF();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
  }, [isMobile, TIMELINE_WIDTH, anchors, activeSlide]);

  if (isMobile) {
    return (
      <div className="mobile-container">
        <div className="mobile-header">
          <h2 className="timeline-title">What if you could save these 3+ days of setup?</h2>
          <p className="mobile-subtitle">
            With LaunchPike, you're getting a plug-n-play MVP boilerplate + step-by-step guide so you can go live today. Here's what you can do in 90 mins or less:
          </p>
        </div>
        <div className="mobile-slides-list">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div key={n} className="mobile-slide-item" data-mobile-slide={n}>
              <SlideCard slideNumber={n} isActive={activeSlides.has(n)} isMobile />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const PIN_LEFT = 0;

  return (
    <div ref={containerRef} className="scroll-container" data-scroll-container>
      <div className="sticky-viewport">
        <h2 className="timeline-title lg:hidden px-6">Timer to start your business</h2>
        <h2 className="timeline-title lg:hidden px-6">What if you could save these 3+ days of setup?</h2>
        <article className="text-3xl lg:hidden px-6 py-6 text-justify">
          With LaunchPike, you're getting a plug-n-play MVP boilerplate + step-by-step guide so you can go live today. Here's what you can do in 90 mins or less:
        </article>
        <div
          ref={slidesContainerRef}
          className="slides-container"
          data-slides-container
          style={{
            transform: `translateX(${translateX}px)`,
            width: TIMELINE_WIDTH + AXIS_PADDING_LEFT + AXIS_PADDING_RIGHT,
          }}
        >
          <div
            className="slides"
            style={{ width: TIMELINE_WIDTH + AXIS_PADDING_LEFT + AXIS_PADDING_RIGHT }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
              const leftPx = n === 1 ? 0 : slideLeftPosition(n);
              const viewX = translateX + leftPx;
              const shouldStick = n <= activeSlide;
              const stickyOffset = shouldStick ? Math.max(0, PIN_LEFT - viewX) : 0;
              return (
                <div
                  key={n}
                  className="slide-wrapper"
                  style={{
                    left: leftPx,
                    transform: `translateX(${stickyOffset}px)`,
                    zIndex: n === activeSlide ? 3 : n < activeSlide ? 2 : 1,
                    pointerEvents: n === activeSlide ? "auto" : "none",
                  }}
                >
                  <SlideCard slideNumber={n} isActive={activeSlide === n} />
                </div>
              );
            })}
          </div>
          <div className="progress-bar" ref={progressTrackRef} data-progress-bar>
            <div className="progress-fill" ref={progressFillRef} />
          </div>
          <TimelineAxis
            ref={axisRef}
            className="hidden lg:flex timeline-axis"
            totalMinutes={TOTAL_MINUTES}
            labelEvery={LABEL_EVERY}
            paddingLeft={AXIS_PADDING_LEFT}
            paddingRight={AXIS_PADDING_RIGHT}
            tickLargeWidth={4}
            tickSmallWidth={3}
            height={200}
            tickSmall={50}
            tickLarge={80}
            pxPerMinute={PX_PER_MINUTE}
            fontSize={26}
          />
        </div>
      </div>
    </div>
  );
}

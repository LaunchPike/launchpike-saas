import { useEffect, useRef, useState } from "react";
import "./SetupSteps.scss";
import SlideCard from "./SlideCard";
import TimelineAxis, { TimelineAxisHandle } from "./TimelineAxis";
import { VerticalTimeline } from "./TimelineAxisVertical";

export default function SmoothScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<TimelineAxisHandle>(null);
  const [translateX, setTranslateX] = useState(0);
  const [progressBarProgress, setProgressBarProgress] = useState(0);

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
    const minutes = Number(mm);
    const seconds = Number(ss);
    return minutes + seconds / 60;
  };

  const minuteToXLinear = (minute: number): number => {
    return AXIS_PADDING_LEFT + minute * PX_PER_MINUTE;
  };

  const slideLeftPosition = (slideNumber: number): number => {
    const timeStr = slideTimes[slideNumber] ?? "0:00";
    const minutes = parseTime(timeStr);
    return minuteToXLinear(minutes) - ANCHOR_GAP;
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    // Установка начальных стилей
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'background 0.24s ease-out';
    }
    
    if (slidesContainerRef.current) {
      slidesContainerRef.current.style.transition = 'transform 0.18s ease-out';
    }

    const handleScroll = () => {
      if (!containerRef.current || !slidesContainerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = containerRef.current.offsetHeight;

      const startPoint = windowHeight;
      const endPoint = -containerHeight;
      const totalDistance = startPoint - endPoint;

      const currentPosition = rect.top;
      const rawProgress = Math.max(0, Math.min(1, (startPoint - currentPosition) / totalDistance));

      // Добавляем паузы как в оригинальном скрипте
      const pauseStart = 0.15;
      const animationPhase = 0.70;

      let translateX: number;
      let progressBarProgress: number;

      const centerOffset = window.innerWidth / 2 - 200;
      const maxTranslateX = -(TIMELINE_WIDTH - window.innerWidth * 0.8);
      const startPosition = centerOffset;
      const endPosition = maxTranslateX - centerOffset;

      if (rawProgress < pauseStart) {
        translateX = startPosition;
        progressBarProgress = 0;
      } else if (rawProgress < (pauseStart + animationPhase)) {
        const phaseProgress = (rawProgress - pauseStart) / animationPhase;
        const smoothProgress = easeInOutCubic(phaseProgress);
        translateX = startPosition + (smoothProgress * (endPosition - startPosition));
        progressBarProgress = smoothProgress;
      } else {
        translateX = endPosition;
        progressBarProgress = 1;
      }

      setTranslateX(translateX);
      setProgressBarProgress(progressBarProgress);

      // Обновляем progress bar
      if (progressBarRef.current) {
        const progressPercent = progressBarProgress * 100;
        progressBarRef.current.style.background = 
          `linear-gradient(to right, #3B82F6 ${progressPercent}%, #D1D5DB ${progressPercent}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [TIMELINE_WIDTH]);

  return (
    <div ref={containerRef} className="scroll-container" data-scroll-container>
      <div className="sticky-viewport">
        <h2 className="timeline-title lg:hidden">Timer to start your business</h2>
        <h2 className="timeline-title lg:hidden pl-6">What if you could save these 3+ days of setup?</h2>
        <article className="text-3xl lg:hidden pl-6 pt-6 text-justify">
          With LaunchPike, you're getting a plug-n-play MVP boilerplate + step-by-step guide so you can go live today. Here's what you can do in 90 mins or less:
        </article>
        <div
          ref={slidesContainerRef}
          className="slides-container"
          data-slides-container
          style={{
            transform: `translateX(${translateX}px)`,
            width: TIMELINE_WIDTH + AXIS_PADDING_LEFT + AXIS_PADDING_RIGHT
          }}
        >
          <div
            className="slides"
            style={{
              width: TIMELINE_WIDTH + AXIS_PADDING_LEFT + AXIS_PADDING_RIGHT,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slideNumber) => (
              <div
                key={slideNumber}
                className="slide-wrapper"
                style={{
                  left: slideNumber === 1 ? 0 : slideLeftPosition(slideNumber)
                }}
              >
                <SlideCard
                  slideNumber={slideNumber}
                  isActive={false}
                />
              </div>
            ))}
          </div>

          <div
            ref={progressBarRef}
            className="progress-bar"
            data-progress-bar
            style={{
              width: TIMELINE_WIDTH + AXIS_PADDING_LEFT + AXIS_PADDING_RIGHT
            }}
          />

          <VerticalTimeline
            totalMinutes={90}
            labelEvery={5}
            className="vertical-timeline absolute h-[100%] lg:hidden"
          />

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
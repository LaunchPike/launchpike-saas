import { useEffect, useRef, useState } from "react";
import "./SetupSteps.scss";
import SlideCard from "./SlideCard";
import TimelineAxis, { TimelineAxisHandle } from "./TimelineAxis";
import { VerticalTimeline } from "./TimelineAxisVertical";

export default function SmoothScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<TimelineAxisHandle>(null);
  const [translateX, setTranslateX] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = containerRef.current.offsetHeight;

      const startPoint = windowHeight;
      const endPoint = -containerHeight;
      const totalDistance = startPoint - endPoint;

      const currentPosition = rect.top;
      const progress = Math.max(0, Math.min(1, (startPoint - currentPosition) / totalDistance));

      const viewportWidth = window.innerWidth;
      const maxTranslateX = -(TIMELINE_WIDTH - viewportWidth + 100);
      const newTranslateX = progress * maxTranslateX;

      setTranslateX(newTranslateX);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [TIMELINE_WIDTH]);

  return (
    <div ref={containerRef} className="scroll-container" data-scroll-container>
      <div className="sticky-viewport">
        <h2 className="timeline-title  lg:hidden">Timer to start your business</h2>
        <h2 className="timeline-title lg:hidden pl-6">What if you could save these 3+ days of setup?</h2>
        <article className="text-3xl lg:hidden pl-6 pt-6 text-justify">With LaunchPike, you're getting a plug-n-play MVP boilerplate + step-by-step guide so you can go live today. Here's what you can do in 90 mins or less:</article>
        <div
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
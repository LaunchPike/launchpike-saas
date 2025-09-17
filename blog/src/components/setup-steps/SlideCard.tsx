import React from "react";

interface SlideCardProps {
  slideNumber: number;
  isActive: boolean;
  paddingFromLeft?: string;
  isMobile?: boolean;
}

export default function SlideCard({
  slideNumber,
  isActive,
  paddingFromLeft,
  isMobile = false,
}: SlideCardProps) {
  const inactiveFilter = "grayscale(100%) brightness(1.15) contrast(0.92)";

  return (
    <div className="slide flex items-end py-10" style={{ pointerEvents: "auto" }}>
      <div className="relative h-fit" style={{ paddingLeft: paddingFromLeft ?? 0 }}>
        <img
          src={`/setup/slide${slideNumber}.png`}
          alt={`Slide ${slideNumber}`}
          className={isActive && !isMobile ? "slide-active" : "slide-inactive"}
          style={{
            filter: isActive ? "none" : inactiveFilter,
            transition:
              "filter 240ms ease, opacity 240ms ease, transform 280ms ease, box-shadow 280ms ease",
          }}
        />

        <div
          className="slide-anchor absolute w-[18px] h-[20px] bg-[#3B82F6] z-50"
          style={{ left: 0 }}
        />
      </div>
    </div>
  );
}

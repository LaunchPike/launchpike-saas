import React from "react";

interface SlideCardProps {
  slideNumber: number;
  isActive: boolean;
  paddingFromLeft?: string;
}

export default function SlideCard({ slideNumber, paddingFromLeft }: SlideCardProps) {
  return (
    <div className="slide" style={{ pointerEvents: "auto" }}>
      <div className="relative" style={{ paddingLeft: paddingFromLeft ?? 0 }}>
        <img src={`/setup/slide${slideNumber}.png`} alt={`Slide ${slideNumber}`} />
        
        <div
          className="slide-anchor absolute w-[18px] h-[20px] bg-[#3B82F6] z-50"
          style={{ left: 0 }}
        />
      </div>
    </div>
  );
}
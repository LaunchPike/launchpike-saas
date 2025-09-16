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
  isMobile = false 
}: SlideCardProps) {
  console.log(`SlideCard ${slideNumber}: isActive=${isActive}, isMobile=${isMobile}`);
  
  return (
    <div className="slide" style={{ pointerEvents: "auto" }}>
      <div className="relative" style={{ paddingLeft: paddingFromLeft ?? 0 }}>
        <img 
          src={`/setup/slide${slideNumber}.png`} 
          alt={`Slide ${slideNumber}`}
          style={{
            filter: isMobile && !isActive ? 'grayscale(100%) brightness(1.3) contrast(0.95)' : 'none',
            transition: isMobile ? 'filter 0.4s ease-in-out' : 'none',
            opacity: isMobile && !isActive ? 0.9 : 1
          }}
        />
        
        <div
          className="slide-anchor absolute w-[18px] h-[20px] bg-[#3B82F6] z-50"
          style={{ 
            left: 0,
            opacity: isMobile && !isActive ? 0.7 : 1,
            transition: isMobile ? 'opacity 0.4s ease-in-out' : 'none'
          }}
        />
      </div>
    </div>
  );
}
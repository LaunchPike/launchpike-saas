import React from 'react';

const GridBackgroundCard = ({ 
  title = "Setting up payments",
  number = "1", 
  mainText = "5+ hours", 
  subtitle = "on webhooks", 
  description = "& integrations",
  linkText = "Learn more"
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title above card */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8 px-2">
        {title}
      </h2>
      
      {/* Card with grid background */}
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden w-[388px] h-[388px] flex">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 400 300" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern 
                id="grid" 
                width="20" 
                height="20" 
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d="M 20 0 L 0 0 0 20" 
                  fill="none" 
                  stroke="#d1d5db" 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Dots at intersections */}
            {Array.from({ length: 21 }, (_, i) => 
              Array.from({ length: 16 }, (_, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={i * 20}
                  cy={j * 20}
                  r="1.5"
                  fill="#6b7280"
                  opacity="0.5"
                />
              ))
            )}
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6 w-[100%] h-[100%]">
          {/* Number Badge */}
          <div className="inline-block mb-6">
            <div className="bg-gray-800 text-white text-2xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
              {number}
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-1 w-[100%] absolute bottom-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {mainText}
              <span className="text-gray-600"> {subtitle}</span>
            </h3>
            <p className="text-2xl font-bold text-gray-600">
              {description}
            </p>
            
            {/* Learn More Link */}
            {/* <div className="pt-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm"
              >
                {linkText}
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridBackgroundCard;
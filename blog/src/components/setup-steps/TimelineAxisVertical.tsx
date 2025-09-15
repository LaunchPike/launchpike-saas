import React, { useRef, useEffect, useState } from 'react';

interface VerticalTimelineProps {
  totalMinutes?: number;
  labelEvery?: number;
  tickLarge?: number;
  tickSmall?: number;
  tickLargeWidth?: number;
  tickSmallWidth?: number;
  fontSize?: number;
  tickColor?: string;
  textColor?: string;
  lineColor?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
}

const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  totalMinutes = 90,
  labelEvery = 5,
  tickLarge = 35, // Уменьшили
  tickSmall = 20, // Уменьшили
  tickLargeWidth = 2, // Уменьшили
  tickSmallWidth = 2, // Уменьшили
  fontSize = 14, // Уменьшили
  tickColor = '#9CA3AF', // Серый цвет
  textColor = '#9CA3AF', // Серый цвет
  className = 'vertical-timeline',
  style,
  width = 60 // Уменьшили до 1/8
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(4500);

  useEffect(() => {
    const updateHeight = () => {
      console.log('Updating height...');

      if (containerRef.current) {
        // Ищем контейнер .slides
        const slidesContainer = document.querySelector('.slides');
        if (slidesContainer) {
          const slidesHeight = slidesContainer.clientHeight;
          console.log('Slides container height:', slidesHeight);

          if (slidesHeight > 50) {
            setContainerHeight(slidesHeight);
            console.log('Set height to slides:', slidesHeight);
            return;
          }
        }

        // Затем родительский элемент
        if (containerRef.current.parentElement) {
          const parentHeight = containerRef.current.parentElement.clientHeight;
          console.log('Parent height:', parentHeight);

          if (parentHeight > 50) {
            setContainerHeight(parentHeight);
            console.log('Set height to parent:', parentHeight);
            return;
          }
        }

        // Fallback
        setContainerHeight(587);
      }
    };

    updateHeight();
    setTimeout(updateHeight, 100);
    setTimeout(updateHeight, 500);

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const generateVerticalSVG = (): string => {
    const pxPerMinute = containerHeight / totalMinutes;
    const paddingTop = 20;
    const paddingBottom = 20;

    const ticks = [];
    for (let minute = 0; minute <= totalMinutes; minute++) {
      const y = paddingTop + (minute * pxPerMinute);
      const major = labelEvery > 0 && (minute % labelEvery === 0);
      ticks.push({ minute, y, major });
    }

    let svgContent = `<svg width="${width}" height="${containerHeight}" viewBox="0 0 ${width} ${containerHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // Вертикальная главная линия - позиционируем справа
    const lineX = width - 5;

    ticks.forEach(({ minute, y, major }, index) => {
      const tickWidth = major ? tickLarge : tickSmall;
      const strokeWidth = major ? tickLargeWidth : tickSmallWidth;

      // Горизонтальная полоска от линии влево
      svgContent += `<line x1="${lineX}" x2="${lineX - tickWidth}" y1="${y}" y2="${y}" stroke="${tickColor}" stroke-width="${strokeWidth}"/>`;

      // Подписи слева от major полосок (только для каждого 5-й минуты)
      if (major && minute % 5 === 0) {
        const text = index === 0 ? "" : `${minute}`;

        if (text) {
          svgContent += `<g transform="translate(${lineX - 50}, ${y}) rotate(90)"><text x="0" y="0" font-size="${fontSize}" text-anchor="middle" font-weight="600" fill="${textColor}">${text}</text></g>`;
        }
      }
    });

    svgContent += '</svg>';
    return svgContent;
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width,
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0, // ИСПРАВЛЕНО: справа вместо слева
        left: 'auto',
        zIndex: 10,
        pointerEvents: 'none',
        ...style
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: generateVerticalSVG() }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export { VerticalTimeline };
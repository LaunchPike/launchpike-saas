import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GridBackgroundCard from './GridSlides';

type Slide = { title: string; image: string };

// ТОНКАЯ НАСТРОЙКА "шага" между слайдами:
const STEP_VH = 60;                            // было 90 — теперь 60vh ⬅
const ROOT_MARGIN = '-25% 0px -25% 0px';      // раньше -30%/-30%, чуть раньше переключаем ⬅

export default function Feature({ items = [] }: { items?: Array<Slide> }) {
  const sentinels = useMemo(
    () => items.map(() => React.createRef<HTMLDivElement>()),
    [items]
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sentinels.forEach((ref, i) => {
      const node = ref.current;
      if (!node) return;

      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(i);
          }
        },
        {
          root: null,
          rootMargin: ROOT_MARGIN,   // ⬅
          threshold: 0.01,
        }
      );

      obs.observe(node);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sentinels]);

  const scrollToSlide = useCallback(
    (i: number) => {
      const el = sentinels[i]?.current;
      if (!el || typeof window === 'undefined') return;
      const headerOffset = 6 * 16; // 96px
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [sentinels]
  );

  return (
    <section
      id="features"
      className="features py-12 px-6 lg:px-40 lg:pb-0 flex flex-row justify-between relative w-full"
    >
      <div className="flex flex-col lg:flex-row justify-center w-full">
        <div className="flex flex-1 flex-col justify-center lg:sticky top-7 self-start z-10 h-[100vh] md:h-auto lg:py-32 md:py-2 md:pb-32">
          <div className="flex flex-col gap-5">
            <span className="features-title font-extrabold text-5xl lg:text-6xl">
              We feel your pain
            </span>
            <span className="features-subtitle text-3xl lg:text-4xl font-normal">
              Launching an MVP comes with <br /> 3+ days of headaches:
            </span>
          </div>

          <aside className="md:h-[80vh] md:sticky md:top-20 self-start hidden lg:flex">
            <ul className="flex flex-col gap-10 md:gap-5 font-extrabold text-5xl mt-[10vh] md:mt-[3vh]">
              {items.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.title}>
                    <button
                      onClick={() => scrollToSlide(i)}
                      className={[
                        'w-full font-extrabold text-5xl md:text-4xl text-left transition-all duration-200 cursor-pointer',
                        isActive ? 'text-[#0A0A0A]' : 'text-gray-600',
                      ].join(' ')}
                      aria-current={isActive ? 'true' : 'false'}
                    >
                      <span>{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        {/* mobile stack */}
        <div className="flex flex-1 flex-col lg:hidden">
          {items.map((item) => (
            <GridBackgroundCard key={item.title} {...item} />
          ))}
        </div>

        {/* desktop viewport */}
        <div className="hidden lg:block lg:flex-1">
          <div className="sticky top-32 h-[60vh] relative"> {/* совпадает со STEP_VH для плотности ⬅ */}
            {items.map((s, i) => (
              <motion.div
                key={s.title}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                initial={false}
                animate={{
                  opacity: active === i ? 1 : 0,
                  y: active === i ? 0 : 20,
                  scale: active === i ? 1 : 0.98,
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                aria-hidden={active !== i}
                style={{ pointerEvents: active === i ? 'auto' : 'none', willChange: 'transform, opacity' }}
              >
                <GridBackgroundCard key={s.title} {...s} />
              </motion.div>
            ))}
          </div>

          {/* Сентинелы: уменьшили высоту шага с 90vh до 60vh ⬅ */}
          <div aria-hidden="true">
            {items.map((_, i) => (
              <div
                key={`sentinel-${i}`}
                ref={sentinels[i]}
                style={{ height: `${STEP_VH}vh` }} // ⬅ было className="h-[90vh]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

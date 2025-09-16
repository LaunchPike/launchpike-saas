import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import GridBackgroundCard from './GridSlides';

type Slide = { title: string; image: string; };

export default function Feature({ items = [] }: { items?: Array<Slide> }) {
  const slideRefs = useMemo(
    () => items.map(() => React.createRef<HTMLDivElement>()),
    [items]
  );

  // Track which slide is active using IntersectionObserver
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    slideRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(i);
          });
        },
        {
          // Trigger when ~45% of slide is visible
          root: null,
          rootMargin: '0px',
          threshold: 0.45,
        }
      );
      obs.observe(ref.current);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [slideRefs]);

  const scrollToSlide = useCallback(
    (i: number) => {
      const el = slideRefs[i]?.current;
      if (!el) return;
      // Adjust for any fixed header if needed (e.g., 80px)
      const headerOffset = 24 * 16; // 96px
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [slideRefs]
  );

  return (
    <section id="features" className="features py-12 px-6 lg:px-40 lg:pb-0 flex flex-row justify-between relative w-full">
      <div className="flex flex-col lg:flex-row justify-center">

        <div className="flex flex-col justify-center flex-1 lg:sticky top-7 self-start z-10 min-w-[24rem] h-[100vh] md:h-[auto] lg:py-32 md:py-2 md:pb-32">
          <div className="flex flex-col gap-5">
            <span className="features-title font-extrabold text-5xl lg:text-6xl"> We feel your pain </span>
            <span className="features-subtitle text-3xl lg:text-4xl font-normal">
              Launching an MVP comes with 3+ days of headaches:
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
                        isActive
                          ? 'text-[##0A0A0A]'
                          : 'text-gray-600',
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
        <div className="flex-col lg:hidden">
          {
            items.map(item => {
              return <GridBackgroundCard {...item}/>
            })
          }
        </div>
        <div className="hidden lg:flex lg:flex-col space-y-24 self-center lg:py-96">
          {items.map((s, i) => (
            <SlidePanel
              key={s.title}
              ref={slideRefs[i]}
              title={s.title}
              image={s.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Single slide panel: image enters from bottom + slight fade */
const SlidePanel = React.forwardRef<
  HTMLDivElement,
  { key: string, title: string; image: string }
>(function SlidePanel({ key, title, image }, ref) {
  // We'll use whileInView so it triggers on scroll into view
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { amount: 0.35, margin: '0px 0px -10% 0px' });

  return (
    <div key={key} ref={(node) => {
      // forward to outside + local ref for inView
      // @ts-ignore
      ref && (typeof ref === 'function' ? ref(node) : (ref.current = node));
      containerRef.current = node;
    }}>
      {/* Image animates from bottom */}
      <motion.div
        className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-gray-200 bg-white"
        initial={{ y: 50, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Use img or next/image */}
        <img
          src={image}
          alt={title}
          className="w-full h-[390px] lg:h-[435px] md:h-[420px] object-cover"
          loading="lazy"
        />
      </motion.div>

    </div>
  );
});

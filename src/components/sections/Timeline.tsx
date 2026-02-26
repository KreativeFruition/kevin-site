"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { timelineEntries } from "@/data/content";
import { cinematicEase } from "@/lib/motion";

export const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: rawTimelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"],
  });
  const timelineProgress = useSpring(rawTimelineProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.8,
  });
  const timelineFill = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  const scrollToIndex = (index: number) => {
    const target = blockRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="career" className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
        <div className="lg:w-1/3">
          <div className="sticky top-24 hidden space-y-6 lg:block">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
              Career Evolution
            </p>
            <div className="relative pl-6">
              <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block" />
              <motion.div
                className="pointer-events-none absolute left-[-1px] top-0 hidden w-[4px] rounded-full bg-white/25 blur-sm lg:block"
                style={{ height: timelineFill }}
              />
              <motion.div
                className="pointer-events-none absolute left-0 top-0 hidden w-px rounded-full bg-white lg:block"
                style={{ height: timelineFill }}
              />
              <ul className="space-y-5">
                {timelineEntries.map((entry, index) => (
                  <li
                    key={entry.title}
                    className={`flex items-center gap-4 font-display text-3xl transition ${
                      activeIndex === index ? "text-white" : "text-neutral-500"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border transition ${
                        activeIndex === index
                          ? "border-white bg-white"
                          : "border-neutral-600"
                      }`}
                    />
                    {entry.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          ref={timelineRef}
          className="relative lg:w-2/3 space-y-24 snap-y snap-mandatory lg:pl-0"
        >
          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block" />
          <div className="pointer-events-none sticky top-[72px] z-20 -mx-6 flex flex-col gap-3 bg-gradient-to-b from-black via-black/85 to-transparent px-6 pb-6 pt-6 before:pointer-events-none before:absolute before:inset-x-0 before:top-[-72px] before:block before:h-[72px] before:bg-gradient-to-b before:from-black before:via-black/90 before:to-transparent lg:hidden">
            <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.5em] text-neutral-500">
              <span>Career</span>
              <span>Evolution</span>
            </div>
            <div className="relative h-px w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-[-10px] left-0 h-[20px] rounded-full bg-white/40 blur-2xl"
                style={{ width: timelineFill }}
              />
              <motion.div
                className="absolute inset-y-[-4px] left-0 h-[8px] rounded-full bg-white shadow-[0_0_12px_0_rgba(255,255,255,0.6)]"
                style={{ width: timelineFill }}
              />
            </div>
          </div>
         {timelineEntries.map((entry, index) => (
           <TimelineBlock
             key={entry.title}
              entry={entry}
              index={index}
              setActiveIndex={setActiveIndex}
              registerRef={(el) => {
                blockRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

type TimelineBlockProps = {
  entry: (typeof timelineEntries)[number];
  index: number;
  setActiveIndex: (index: number) => void;
  registerRef?: (el: HTMLDivElement | null) => void;
};

const TimelineBlock = ({
  entry,
  index,
  setActiveIndex,
  registerRef,
}: TimelineBlockProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.85, once: false });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  useEffect(() => {
    if (inView) {
      setActiveIndex(index);
    }
  }, [inView, index, setActiveIndex]);

  useEffect(() => {
    if (registerRef) {
      registerRef(ref.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRef]);

  return (
    <motion.article
      ref={ref}
      className="relative min-h-[60vh] pt-10 snap-start overflow-visible lg:overflow-hidden"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.7, ease: cinematicEase }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-transparent via-black/60 to-black/90" />
      <motion.div
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-px rounded-full bg-gradient-to-b from-white/0 via-white/70 to-white/0 blur-[1px] lg:block"
        style={{ opacity: glowOpacity }}
      />
      <span className="pointer-events-none absolute left-0 top-16 hidden h-px w-10 bg-white/10 lg:block" />
      <motion.span
        className="pointer-events-none absolute left-0 top-16 hidden h-px w-10 origin-left rounded-full bg-white lg:block"
        animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0.2, opacity: 0 }}
        transition={{ duration: 0.45, ease: cinematicEase }}
      />
      <motion.div className="space-y-6 pl-10 lg:pl-16" style={{ y }}>
        <p
          className={`font-display ${
            entry.title === "Choreographer" ? "text-5xl" : "text-7xl"
          } text-white sm:text-8xl`}
        >
          {entry.title}
        </p>
        <p className="text-sm uppercase tracking-[0.6em] text-neutral-400">
          {entry.duration}
        </p>
        <p className="max-w-3xl text-lg text-neutral-200">{entry.details}</p>
      </motion.div>
    </motion.article>
  );
};

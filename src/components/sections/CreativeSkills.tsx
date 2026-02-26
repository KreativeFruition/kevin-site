"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { creativeSkills } from "@/data/content";
import { cinematicEase } from "@/lib/motion";

type SkillCardProps = {
  skill: (typeof creativeSkills)[number];
  index: number;
  isActive: boolean;
  setActive: (index: number | null) => void;
  onMobileFocus: (index: number) => void;
};

const noop = () => {};

export const CreativeSkills = () => {
  const [active, setActive] = useState<number | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  const progress =
    ((activeTrackIndex + 1) / creativeSkills.length) * 100 || 0;

  return (
    <section
      id="skills"
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-5xl text-white md:flex md:gap-12 md:items-start">
        <div className="sticky top-[120px] z-20 -mx-6 mb-10 flex flex-col gap-4 bg-gradient-to-b from-black via-black/85 to-transparent px-6 pb-6 pt-6 before:pointer-events-none before:absolute before:inset-x-0 before:top-[-140px] before:block before:h-[140px] before:bg-black md:top-[140px] md:mx-0 md:h-[calc(100vh-80px)] md:w-1/3 md:rounded-[2rem] md:bg-black/70 md:p-8 md:self-start">
            <div className="w-full">
              <p className="font-display text-4xl leading-[1] tracking-tight text-white md:text-[8rem]">
                Creative Skills
              </p>
            <ProgressLine progress={progress} align="left" />
            </div>
          </div>
        <div className="flex-1 flex flex-col gap-16 md:gap-24 md:pb-[80vh]">
          <div className="flex-1">
            {creativeSkills.map((skill, index) => (
              <div
                key={skill.title}
                className="min-h-[70vh] pb-10 md:min-h-[90vh] md:flex md:justify-end md:pt-24"
              >
                <SkillCard
                  skill={skill}
                  index={index}
                  isActive={active === index}
                  setActive={setActive}
                  onMobileFocus={(i) =>
                    setActiveTrackIndex((prev) => (prev === i ? prev : i))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgressLine = ({
  progress,
  align = "center",
}: {
  progress: number;
  align?: "center" | "left";
}) => (
  <div
    className={`relative h-px w-full overflow-hidden rounded-full bg-white/10 ${
      align === "left" ? "md:w-full" : ""
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
    <motion.div
      className="absolute inset-y-[-8px] left-0 h-[16px] rounded-full bg-white/25 blur-xl"
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
    <motion.div
      className="absolute inset-y-[-2px] left-0 h-[3px] rounded-full bg-white/90"
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  </div>
);

const SkillCard = ({
  skill,
  index,
  isActive,
  setActive,
  onMobileFocus,
}: SkillCardProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const controls = useAnimationControls();
  const inView = useInView(ref, {
    margin: "-30% 0px -55% 0px",
    once: false,
  });

  useEffect(() => {
    if (inView) {
      onMobileFocus(index);
    }
    controls.start(inView ? "active" : "rest");
  }, [controls, inView, index, onMobileFocus]);

  const variants = {
    rest: {
      borderColor: "rgba(70,70,70,0.7)",
      background:
        "linear-gradient(135deg, rgba(5,5,5,0.95), rgba(15,15,15,0.65))",
    },
    active: {
      borderColor: "rgba(255,255,255,0.4)",
      background:
        "linear-gradient(140deg, rgba(255,255,255,0.05), rgba(10,10,10,0.75))",
      translateY: -10,
    },
  };

  return (
    <motion.button
      ref={ref}
      className="group sticky top-[220px] flex h-full w-full flex-col justify-between border border-neutral-800 bg-neutral-950/40 px-6 py-10 text-left transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:top-[200px] md:max-w-[520px]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: cinematicEase,
      }}
      variants={variants}
      animate={controls}
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={() => setActive(null)}
    >
      <p className="font-display text-2xl tracking-tight text-white sm:text-3xl">
        {skill.title}
      </p>
      <motion.p
        className="mt-6 text-sm leading-relaxed text-neutral-300 sm:text-base"
        animate={{ opacity: isActive ? 1 : 0.7 }}
      >
        {skill.description}
      </motion.p>
    </motion.button>
  );
};

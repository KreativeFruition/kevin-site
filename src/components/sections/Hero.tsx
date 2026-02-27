"use client";

import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

const textMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: cinematicEase },
};

const HERO_VIDEO_WEBM =
  process.env.NEXT_PUBLIC_HERO_VIDEO_WEBM ??
  "https://kevin-branding-media.s3.us-east-2.amazonaws.com/branding/hero-reel.webm";
const HERO_VIDEO_MP4 =
  process.env.NEXT_PUBLIC_HERO_VIDEO_MP4 ??
  "https://kevin-branding-media.s3.us-east-2.amazonaws.com/branding/hero-reel.mp4";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col justify-end gap-10 overflow-hidden bg-black pb-16 pt-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          className="pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover md:scale-100 scale-[1.15]"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/branding/hero-reel-poster.jpg"
        >
          {HERO_VIDEO_WEBM && (
            <source
              src={HERO_VIDEO_WEBM}
              type="video/webm; codecs=vp9"
            />
          )}
          {HERO_VIDEO_MP4 && (
            <source
              src={HERO_VIDEO_MP4}
              type="video/mp4"
            />
          )}
        </video>
      </div>
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 pb-8">
        <motion.div
          className="space-y-6 text-white"
          initial={textMotion.initial}
          animate={textMotion.animate}
          transition={textMotion.transition}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Kevin Frey
          </p>
          <h1 className="font-display text-[21vw] leading-[0.9] tracking-tight text-white sm:text-[14vw] lg:text-[11vw]">
            KEVIN FREY
          </h1>
          <p className="font-display text-[2.2rem] leading-tight tracking-[0.15em] text-white sm:text-[3.2rem] uppercase">
            Director. Creative. Producer. Educator. Choreographer. Dancer.
          </p>
          <p className="text-sm uppercase tracking-[0.45em] text-neutral-400">
            Where vision meets creativity.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <span className="h-px w-20 bg-neutral-700" />
          Scroll
          <span className="relative flex h-7 w-4 items-center justify-center rounded-full border border-neutral-700">
            <span className="h-1.5 w-1 rounded-full bg-neutral-300 animate-bounce" />
          </span>
        </motion.div>
      </div>
    </section>
  );
};

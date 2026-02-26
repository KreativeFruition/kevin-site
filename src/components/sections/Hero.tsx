"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

const textMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: cinematicEase },
};

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const attemptPlay = () => {
        video.currentTime = 0;
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setNeedsManualPlay(true);
          });
        }
      };
      video.addEventListener("loadeddata", attemptPlay, { once: true });
      attemptPlay();
      return () => {
        video.removeEventListener("loadeddata", attemptPlay);
      };
    }
  }, []);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setNeedsManualPlay(false))
        .catch(() => setNeedsManualPlay(true));
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col justify-end gap-10 overflow-hidden bg-black px-6 pb-16 pt-32 sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <video
          ref={videoRef}
          className="pointer-events-none h-full w-full object-cover opacity-90 brightness-125"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/branding/hero-reel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/60 to-black/90" />
        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black via-black/70 to-transparent" />
        {needsManualPlay && (
          <button
            onClick={handleManualPlay}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-xs uppercase tracking-[0.5em] text-white"
          >
            <span className="rounded-full border border-white px-6 py-3">
              Play Reel
            </span>
          </button>
        )}
      </div>
      <motion.div
        className="relative z-10 space-y-6 text-white"
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
        className="relative z-10 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-neutral-500"
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
    </section>
  );
};

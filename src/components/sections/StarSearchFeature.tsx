"use client";

import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

export const StarSearchFeature = () => {
  return (
    <section
      id="star-search"
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <motion.div
        className="mx-auto max-w-5xl border border-neutral-800 bg-neutral-950/40 p-8 text-white sm:p-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: cinematicEase }}
      >
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
          Authority Moment
        </p>
        <h2 className="mt-6 font-display text-[10vw] leading-[0.9] tracking-tight text-white sm:text-[5vw]">
          STAR SEARCH
        </h2>
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-400">
          Netflix — Season 1 — Producer Coordinator
        </p>
        <p className="mt-8 text-lg leading-relaxed text-neutral-300">
          Built creative systems. Coordinated cross-department teams. Ensured
          seamless translation from concept to stage while supporting Fatima
          Robinson&apos;s creative leadership on a flagship Netflix debut.
        </p>
      </motion.div>
    </section>
  );
};

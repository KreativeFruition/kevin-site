"use client";

import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

export const ManifestoBlock = () => {
  return (
    <section
      id="manifesto"
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <h2 className="sr-only">Manifesto</h2>
      <motion.div
        className="mx-auto flex max-w-6xl flex-col gap-12 text-white lg:flex-row"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: cinematicEase }}
      >
        <div className="flex-1 space-y-6">
          <p className="font-display text-[14vw] uppercase leading-none tracking-tight sm:text-[10vw] lg:text-[8vw]">
            I BUILD WORLDS.
          </p>
          <div className="space-y-3 text-[4.5vw] font-display uppercase leading-tight tracking-tight sm:text-[3.2vw] lg:text-[2.4vw]">
            <p className="border-l-4 border-white/40 pl-4">Where vision meets creativity.</p>
            <p className="border-l-4 border-white/40 pl-4">Where creativity meets execution.</p>
            <p className="border-l-4 border-white/40 pl-4">Where execution holds at scale.</p>
          </div>
        </div>
        <div className="flex-1 space-y-6 border-l border-neutral-800 pl-8 text-lg leading-relaxed tracking-[0.05em] text-neutral-200 sm:text-xl uppercase">
          <p>
            My foundation was movement — on the world’s biggest stages, inside
            award shows, global tours, and landmark music videos alongside the
            most influential artists of our time.
          </p>
          <p>
            Choreography refined authorship. Direction became the lens. Today, I
            direct and produce at scale — leading large creative teams, aligning
            departments, and building the systems that allow ambitious ideas to
            hold.
          </p>
          <p>
            I understand how vision travels. From concept to camera. From
            rehearsal to broadcast. From idea to impact.
          </p>
          <p>
            Where vision meets creativity and execution meets structure.
            Because great direction is not just imagined...
            <span className="mt-4 block font-display text-[8vw] uppercase tracking-[0.25em] text-white sm:text-[5vw]">
              It is built.
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

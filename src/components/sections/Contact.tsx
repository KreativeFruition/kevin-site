"use client";

import { contactLinks } from "@/data/content";
import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <motion.div
        className="mx-auto max-w-4xl text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: cinematicEase }}
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/kf-logo.svg"
            alt="Kevin Frey monogram"
            className="h-12 w-12"
            loading="lazy"
          />
          <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
            Contact
          </p>
        </div>
        <h2 className="mt-6 font-display text-[10vw] leading-[0.9] tracking-tight text-white sm:text-[5vw]">
          Let&apos;s build the vision together.
        </h2>
        <p className="mt-4 text-sm uppercase tracking-[0.45em] text-neutral-400">
          Where vision meets creativity.
        </p>
        <div className="mt-10 space-y-4 text-sm uppercase tracking-[0.5em] text-neutral-300">
          <a
            href={`mailto:${contactLinks.email}`}
            className="block border border-neutral-800 px-6 py-4 transition hover:border-white"
          >
            Email
          </a>
          <a
            href={`mailto:${contactLinks.booking}`}
            className="block border border-neutral-800 px-6 py-4 transition hover:border-white"
          >
            Booking Agent
          </a>
          <a
            href={contactLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="block border border-neutral-800 px-6 py-4 transition hover:border-white"
          >
            Instagram
          </a>
          <a
            href={contactLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="block border border-neutral-800 px-6 py-4 transition hover:border-white"
          >
            Facebook
          </a>
          <a
            href={contactLinks.creativeCareer}
            target="_blank"
            rel="noreferrer"
            className="block border border-neutral-800 px-6 py-4 transition hover:border-white"
          >
            Interested in building a creative career?
          </a>
        </div>
      </motion.div>
    </section>
  );
};

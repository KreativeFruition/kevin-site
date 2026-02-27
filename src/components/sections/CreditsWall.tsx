"use client";

import { useEffect } from "react";
import credits from "@/data/credits.json";
import { motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion";
import { cdnUrl } from "@/lib/cdn";

type Credit = (typeof credits)[number];
const creditHighlightVideos: Record<string, string> = {
  "Super Bowl Halftime Show": cdnUrl("gaga-reel.mp4"),
  "Ariana Grande": cdnUrl("ariana-reel.mp4"),
  "Lady Gaga": cdnUrl("gaga-reel-2.mp4"),
  "Taylor Swift": cdnUrl("taylor-reel.mp4"),
  "J Balvin x Fortnite": cdnUrl("jbalvin-reel.mp4"),
  "Valley Girl": cdnUrl("valleygirl-reel.mp4"),
  "Artistic Dance Exchange": cdnUrl("ade-reel.mp4"),
  "The PULSE": cdnUrl("pulse-reel.mp4"),
  "Fama A Bailar": cdnUrl("fama-reel.mp4"),
  "\"Insipid\"": cdnUrl("insipid-reel.mp4"),
  "\"Almost Love\"": cdnUrl("almostlove.mp4"),
  "Dancing with the Stars China": cdnUrl("dwts-china.mp4"),
  "Heartbeats": cdnUrl("heartbeats.mp4"),
  "Gaga: Five Foot Two": cdnUrl("gaga-five.mp4"),
  "Star Search": cdnUrl("starsearch.mp4"),
  "Grace": cdnUrl("grace.mp4"),
  "LDMA": cdnUrl("ldma.mp4"),
  "So You Think You Can Dance": cdnUrl("sytycd.mp4"),
  "96th Academy Awards": cdnUrl("oscars.mp4"),
  "\"Hurricane Venus\"": cdnUrl("boa.mp4"),
  "Coachella": cdnUrl("coachella.mp4"),
};
const creditVideoSources = Array.from(new Set(Object.values(creditHighlightVideos)));

export const CreditsWall = () => {
  useEffect(() => {
    const links = creditVideoSources.map((src) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = src;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, []);

  return (
    <section
      id="work"
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 text-white">
          <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
            Work
          </p>
          <h2
            id="work-heading"
            className="font-display text-[13vw] leading-[0.9] tracking-tight text-white sm:text-[8vw]"
          >
            WORK
          </h2>
          <p className="max-w-2xl text-base text-neutral-300">
            Select collaborations across global artists, broadcast platforms, and large-scale live productions.
          </p>
          <div className="hidden items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-neutral-500 sm:flex">
            <span className="h-px w-16 bg-neutral-700" />
            Hover cards to reveal footage
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700">
              <span className="absolute inset-0 rounded-full border border-neutral-600/30" />
              <span className="h-1.5 w-1 rounded-full bg-neutral-300 animate-[hover-drift_1.6s_ease-in-out_infinite]" />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 text-white sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(0,1fr)]">
          {credits.map((credit: Credit, index) => (
            <motion.article
              key={`${credit.name}-${index}`}
              className="group relative flex h-full flex-col overflow-hidden border border-transparent bg-neutral-950/30 transition hover:border-neutral-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.03,
                ease: cinematicEase,
              }}
            >
              {creditHighlightVideos[credit.name] && (
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  >
                    <source src={creditHighlightVideos[credit.name]} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
                </div>
              )}
              <div className="relative z-10 flex h-full flex-col p-6 pb-16">
                <p className="text-xs uppercase tracking-[0.5em] text-white/90 transition-colors sm:text-neutral-500 sm:group-hover:text-white/70">
                  {credit.category}
                </p>
                <h3 className="font-display text-4xl leading-tight tracking-tight text-white transition-colors group-hover:text-white sm:text-6xl">
                  {credit.name}
                </h3>
                {credit.year && (
                  <p className="text-xs uppercase tracking-[0.5em] text-white/80 transition-colors sm:text-neutral-600 sm:group-hover:text-white/80">
                    {credit.year}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/80 transition-colors sm:text-neutral-400 sm:group-hover:text-white/80">
                  {credit.highlights?.map((highlight, idx) => (
                    <span key={highlight} className="flex items-center gap-2">
                      <span>{highlight}</span>
                      {idx < (credit.highlights?.length ?? 0) - 1 && (
                        <span className="inline-block h-1 w-1 rounded-full bg-white/70 transition-colors sm:bg-neutral-500 sm:group-hover:bg-white/70" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <div className="w-full border-t border-neutral-800 bg-black/80 px-6 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-neutral-100">
                    {credit.roles?.join(" / ")}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

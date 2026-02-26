"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cinematicEase } from "@/lib/motion";

type CreditItem = {
  show: string;
  platform: string;
  role: string;
  details: string;
};

type CreditsListProps = {
  title: string;
  items: CreditItem[];
  id?: string;
};

export const CreditsList = ({ title, items, id }: CreditsListProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <section
      id={id}
      className="bg-black px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      aria-labelledby={`${title}-heading`}
    >
      <div className="mx-auto max-w-5xl text-white">
        <div className="mb-12 flex justify-between text-xs uppercase tracking-[0.5em] text-neutral-500">
          <h2 id={`${title}-heading`} className="text-xs uppercase tracking-[0.5em] text-neutral-500">
            {title}
          </h2>
          <p>High Authority</p>
        </div>
        <ul className="space-y-6">
          {items.map((item, index) => {
            const currentIndex = hoverIndex ?? activeIndex;
            const isOpen = currentIndex === index;
            return (
              <li key={item.show} className="border-t border-neutral-800 pt-6">
                <button
                  className="flex w-full flex-col gap-2 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:flex-row lg:items-center lg:justify-between"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                >
                  <div>
                    <p className="font-display text-4xl tracking-tight sm:text-5xl">
                      {item.show}
                    </p>
                    <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
                      {item.platform}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.5em] text-neutral-300">
                    {item.role}
                  </p>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: cinematicEase }}
                      className="overflow-hidden pr-6 pt-4 text-sm text-neutral-300 sm:text-base lg:max-w-3xl"
                    >
                      {item.details}
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Evolution", href: "#career" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const SiteHeader = () => {
  const [isSolid, setIsSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSolid(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header className="sticky top-0 z-50 w-full px-4 py-4 sm:px-6">
      <div
        className={`flex items-center justify-between rounded-full border px-5 py-3 text-xs uppercase tracking-[0.4em] transition ${
          isSolid
            ? "border-neutral-800 bg-black/90 backdrop-blur-xl"
            : "border-neutral-900 bg-transparent"
        }`}
      >
        <button
          className="flex items-center gap-4 md:pointer-events-none"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {/* Decorative logo for identity */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/kf-logo.svg"
            alt="Kevin Frey monogram"
            className="h-10 w-10"
            loading="lazy"
          />
        </button>
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex gap-6 text-sm uppercase tracking-[0.4em] text-neutral-200">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-neutral-300 transition hover:text-white"
              >
                {link.label}
                <span className="pointer-events-none absolute inset-x-0 -bottom-1 block h-[2px] origin-left scale-x-0 bg-white/80 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-3 rounded-3xl border border-neutral-800 bg-black/95 px-5 py-6 text-sm">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-neutral-300 uppercase tracking-[0.4em]"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </motion.header>
  );
};

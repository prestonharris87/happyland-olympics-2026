"use client";

import Countdown from "@/components/ui/Countdown";
import { motion } from "framer-motion";
import {
  EVENT_NAME,
  EVENT_YEAR,
  EVENT_TAGLINE,
  EVENT_DATES,
  EVENT_LOCATION,
} from "@/lib/constants";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;

function stagger(delay: number) {
  return {
    initial: { opacity: 0, scale: 0.92, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: DURATION, ease: EASE, delay },
  };
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="text-center max-w-3xl mx-auto relative z-10">
        {/* Countdown */}
        <motion.div {...stagger(0)} className="mb-8 sm:mb-12">
          <Countdown />
        </motion.div>

        {/* Title */}
        <motion.h1
          {...stagger(0.3)}
          className="font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-gold drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
        >
          {EVENT_NAME}
        </motion.h1>

        {/* Year */}
        <motion.p
          {...stagger(0.45)}
          className="font-heading text-5xl sm:text-7xl md:text-8xl font-black text-gold-light mt-1 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          {EVENT_YEAR}
        </motion.p>

        {/* Tagline */}
        <motion.p
          {...stagger(0.6)}
          className="font-body text-lg sm:text-2xl font-semibold text-cream/80 mt-4 italic"
        >
          &ldquo;{EVENT_TAGLINE}&rdquo;
        </motion.p>

        {/* Date / Location */}
        <motion.p
          {...stagger(0.75)}
          className="font-body text-base sm:text-xl font-semibold text-cream mt-3 tracking-wide"
        >
          {EVENT_DATES} &bull; {EVENT_LOCATION}
        </motion.p>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 1.05, ease: "easeOut" },
          y: { duration: 2, repeat: Infinity, delay: 1.05 },
        }}
      >
        <motion.span
          className="font-body text-lg text-gold/50 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 5, delay: 1.05, times: [0, 0.1, 0.85, 1] }}
        >
          Scroll down
        </motion.span>
        <svg
          className="w-8 h-8 text-gold/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}

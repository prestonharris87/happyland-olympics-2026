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

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto relative z-10"
      >
        <div className="mb-8 sm:mb-12">
          <Countdown />
        </div>

        <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-gold drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
          {EVENT_NAME}
        </h1>

        <p className="font-heading text-5xl sm:text-7xl md:text-8xl font-black text-gold-light mt-1 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
          {EVENT_YEAR}
        </p>

        <p className="font-body text-lg sm:text-2xl font-semibold text-cream/80 mt-4 italic">
          &ldquo;{EVENT_TAGLINE}&rdquo;
        </p>

        <p className="font-body text-base sm:text-xl font-semibold text-cream mt-3 tracking-wide">
          {EVENT_DATES} &bull; {EVENT_LOCATION}
        </p>
      </motion.div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
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

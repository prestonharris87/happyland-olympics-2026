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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-sunny-light via-sunny-light/50 to-cream overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="mb-4">
          <span className="inline-block bg-coral text-white font-body text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Version 3
          </span>
        </div>

        <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-dark">
          {EVENT_NAME}
        </h1>

        <p className="font-heading text-5xl sm:text-7xl md:text-8xl font-black text-gold mt-1">
          {EVENT_YEAR}
        </p>

        <p className="font-body text-lg sm:text-2xl font-semibold text-dark/80 mt-4 italic">
          &ldquo;{EVENT_TAGLINE}&rdquo;
        </p>

        <p className="font-body text-sm sm:text-base text-dark/60 mt-3 tracking-wide">
          {EVENT_DATES} &bull; {EVENT_LOCATION}
        </p>

        <div className="mt-8 sm:mt-12">
          <Countdown />
        </div>
      </motion.div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-8 h-8 text-dark/40"
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

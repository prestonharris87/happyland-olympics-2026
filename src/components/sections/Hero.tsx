"use client";

import Countdown from "@/components/ui/Countdown";
import ConstellationSVG from "@/components/ui/ConstellationSVG";
import ElementalRing from "@/components/ui/ElementalRing";
import ParallaxLayer from "@/components/ui/ParallaxLayer";
import { motion } from "framer-motion";
import {
  EVENT_NAME,
  EVENT_YEAR,
  EVENT_TAGLINE,
  EVENT_DATES,
  EVENT_LOCATION,
} from "@/lib/constants";
import { PARALLAX_LAYERS } from "@/lib/parallax";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Constellation pattern behind everything */}
      <ParallaxLayer speed={PARALLAX_LAYERS.far}>
        <ConstellationSVG variant="hero" opacity={0.1} />
      </ParallaxLayer>

      {/* Mandala watermark */}
      <ParallaxLayer speed={PARALLAX_LAYERS.mid}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] opacity-[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/mandala-center.png"
              alt=""
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
        </div>
      </ParallaxLayer>

      {/* Symmetric elemental medallion ring */}
      <ElementalRing />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto relative z-10"
      >
        <div className="mb-4">
          <span className="inline-block bg-fire/80 text-cream font-body text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Version 3
          </span>
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

        <p className="font-body text-sm sm:text-base text-cream/50 mt-3 tracking-wide">
          {EVENT_DATES} &bull; {EVENT_LOCATION}
        </p>

        <div className="mt-8 sm:mt-12">
          <Countdown />
        </div>
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

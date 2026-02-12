"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";

export default function VideoRecap() {
  return (
    <section id="recap" className="relative py-28 sm:py-36 px-4">
      {/* Clip-path definition for wavy edges */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="recap-clip" clipPathUnits="objectBoundingBox">
            <path d="M0,0.06 C0.167,0 0.333,0.08 0.5,0.04 C0.667,0 0.833,0.08 1,0.04 L1,0.96 C0.833,1 0.667,0.92 0.5,0.96 C0.333,1 0.167,0.92 0,0.96 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Glassmorphic background — clip-path makes the blur follow the wave */}
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        style={{ clipPath: "url(#recap-clip)" }}
        aria-hidden="true"
      />

      {/* Gold accent strokes along the wavy edges */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 6 C16.7 0 33.3 8 50 4 C66.7 0 83.3 8 100 4"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 96 C16.7 92 33.3 100 50 96 C66.7 92 83.3 100 100 96"
          stroke="#FFD700"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-gold mb-10 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            The 2025 Recap
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 bg-navy-mid border border-gold/10">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/videos/recap-thumbnail.png"
              className="w-full aspect-video"
            >
              <source src="/videos/recap-2025.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";

export default function VideoRecap() {
  return (
    <section
      id="recap"
      className="relative py-20 sm:py-28 px-4 bg-navy/40 backdrop-blur-sm border-y border-gold/10"
    >
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

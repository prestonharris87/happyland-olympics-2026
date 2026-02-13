"use client";

import { motion } from "framer-motion";
import { useParallaxY, BG_PARALLAX } from "@/lib/parallax";

export default function BackgroundImage() {
  const starsRearY = useParallaxY(BG_PARALLAX.starsRear);
  const starsFrontY = useParallaxY(BG_PARALLAX.starsFront);
  const mandalaY = useParallaxY(BG_PARALLAX.mandala);

  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden" aria-hidden="true">
      {/* Layer 1: Base gradient — fixed, no parallax */}
      <picture>
        <source media="(orientation: portrait)" srcSet="/images/bg-gradient-portrait.webp" type="image/webp" />
        <source media="(orientation: portrait)" srcSet="/images/bg-gradient-portrait.jpg" type="image/jpeg" />
        <source media="(orientation: landscape)" srcSet="/images/bg-gradient-landscape.webp" type="image/webp" />
        <img
          src="/images/bg-gradient-landscape.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* Layer 2: Rear stars — slow parallax */}
      <motion.div style={{ y: starsRearY }} className="absolute inset-0">
        <picture>
          <source media="(orientation: portrait)" srcSet="/images/bg-stars-rear-portrait.webp" type="image/webp" />
          <source media="(orientation: portrait)" srcSet="/images/bg-stars-rear-portrait.png" type="image/png" />
          <source media="(orientation: landscape)" srcSet="/images/bg-stars-rear-landscape.webp" type="image/webp" />
          <img
            src="/images/bg-stars-rear-landscape.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div
          className="shimmer-overlay absolute pointer-events-none"
          style={{
            inset: "-20%",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
            animation: "shimmer-drift-rear 30s ease-in-out infinite",
            background: [
              "radial-gradient(ellipse 35% 35% at 25% 30%, rgba(255,253,230,0.12) 0%, transparent 70%)",
              "radial-gradient(ellipse 30% 40% at 70% 60%, rgba(255,255,255,0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 40% 30% at 50% 80%, rgba(255,215,0,0.08) 0%, transparent 70%)",
            ].join(", "),
          }}
        />
      </motion.div>

      {/* Layer 3: Front stars — medium parallax */}
      <motion.div style={{ y: starsFrontY }} className="absolute inset-0">
        <picture>
          <source media="(orientation: portrait)" srcSet="/images/bg-stars-front-portrait.webp" type="image/webp" />
          <source media="(orientation: portrait)" srcSet="/images/bg-stars-front-portrait.png" type="image/png" />
          <source media="(orientation: landscape)" srcSet="/images/bg-stars-front-landscape.webp" type="image/webp" />
          <img
            src="/images/bg-stars-front-landscape.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div
          className="shimmer-overlay absolute pointer-events-none"
          style={{
            inset: "-20%",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
            animation: "shimmer-drift-front 20s ease-in-out infinite",
            background: [
              "radial-gradient(ellipse 28% 32% at 30% 40%, rgba(255,255,255,0.14) 0%, transparent 70%)",
              "radial-gradient(ellipse 32% 28% at 65% 25%, rgba(255,253,230,0.12) 0%, transparent 70%)",
              "radial-gradient(ellipse 25% 35% at 50% 70%, rgba(255,223,100,0.10) 0%, transparent 70%)",
            ].join(", "),
          }}
        />
      </motion.div>

      {/* Layer 4: Mandala — parallax */}
      <motion.div style={{ y: mandalaY }} className="absolute inset-0">
        <picture>
          <source media="(orientation: portrait)" srcSet="/images/bg-mandala-portrait.webp" type="image/webp" />
          <source media="(orientation: portrait)" srcSet="/images/bg-mandala-portrait.png" type="image/png" />
          <source media="(orientation: landscape)" srcSet="/images/bg-mandala-landscape.webp" type="image/webp" />
          <img
            src="/images/bg-mandala-landscape.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div
          className="shimmer-overlay absolute pointer-events-none"
          style={{
            inset: "-20%",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
            animation: "shimmer-glow-mandala 25s ease-in-out infinite",
            background: [
              "radial-gradient(ellipse 40% 40% at 45% 45%, rgba(255,215,0,0.10) 0%, transparent 70%)",
              "radial-gradient(ellipse 35% 35% at 60% 55%, rgba(204,168,0,0.07) 0%, transparent 70%)",
            ].join(", "),
          }}
        />
      </motion.div>
    </div>
  );
}

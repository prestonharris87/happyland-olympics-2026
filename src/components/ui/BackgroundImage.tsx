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
            className="shimmer-layer absolute inset-0 w-full h-full object-cover"
            style={{ animation: "shimmer-stars-rear 30s ease-in-out infinite" }}
            loading="eager"
            decoding="async"
          />
        </picture>
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
            className="shimmer-layer absolute inset-0 w-full h-full object-cover"
            style={{ animation: "shimmer-stars-front 20s ease-in-out infinite" }}
            loading="eager"
            decoding="async"
          />
        </picture>
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
            className="shimmer-layer absolute inset-0 w-full h-full object-cover"
            style={{ animation: "shimmer-mandala 25s ease-in-out infinite" }}
            loading="eager"
            decoding="async"
          />
        </picture>
      </motion.div>
    </div>
  );
}

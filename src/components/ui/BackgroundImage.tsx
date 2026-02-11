"use client";

import { motion } from "framer-motion";
import { useParallaxY } from "@/lib/parallax";

export default function BackgroundImage() {
  const mandalaY = useParallaxY(0.03);

  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden" aria-hidden="true">
      {/* Layer 1: Gradient/Stars — fixed, no parallax */}
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

      {/* Layer 2: Mandala — parallax, shifts slowly on scroll */}
      <motion.div style={{ y: mandalaY }} className="absolute -inset-y-[10%] inset-x-0">
        <picture>
          <source media="(orientation: portrait)" srcSet="/images/bg-mandala-portrait.webp" type="image/webp" />
          <source media="(orientation: portrait)" srcSet="/images/bg-mandala-portrait.png" type="image/png" />
          <source media="(orientation: landscape)" srcSet="/images/bg-mandala-landscape.webp" type="image/webp" />
          <img
            src="/images/bg-mandala-landscape.png"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </picture>
      </motion.div>
    </div>
  );
}

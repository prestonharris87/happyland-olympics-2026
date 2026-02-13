"use client";

import { useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

export const PARALLAX_LAYERS = {
  far: 0.1,
  mid: 0.3,
  near: 0.6,
  foreground: 1.2,
} as const;

export const BG_PARALLAX = {
  starsRear: 0.02,
  mandala: 0.03,
  starsFront: 0.05,
} as const;

export type ParallaxSpeed = (typeof PARALLAX_LAYERS)[keyof typeof PARALLAX_LAYERS];

/**
 * Custom hook for parallax Y-axis movement based on scroll position.
 * Returns a MotionValue<number> for the Y transform.
 *
 * @param speed - Multiplier for parallax effect (lower = slower/further away)
 * @param ref - Optional ref to scope scrolling to a parent element
 */
export function useParallaxY(
  speed: number,
  ref?: RefObject<HTMLElement | null>
): MotionValue<number> {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const y = useTransform(scrollY, (value) => {
    if (shouldReduceMotion) return 0;
    return value * speed * -1;
  });

  return y;
}

/**
 * Hook for section-scoped parallax.
 * Returns ref + parallax Y value scoped to the section's visibility in viewport.
 */
export function useSectionParallax(speed: number) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : speed * -100]);

  return { ref, y };
}

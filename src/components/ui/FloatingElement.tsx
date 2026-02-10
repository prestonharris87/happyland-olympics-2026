"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useParallaxY } from "@/lib/parallax";
import Image from "next/image";

interface FloatingElementProps {
  /** Image source path (relative to public/) */
  src: string;
  /** CSS width/height value */
  size: number;
  /** Horizontal position (% from left) */
  x: number;
  /** Vertical position (% from top) */
  y: number;
  /** Initial rotation in degrees */
  rotation?: number;
  /** Parallax speed multiplier */
  speed?: number;
  /** Duration of floating animation in seconds */
  floatDuration?: number;
  /** Range of floating movement in pixels */
  floatRange?: number;
  /** Opacity */
  opacity?: number;
  /** Additional className */
  className?: string;
}

export default function FloatingElement({
  src,
  size,
  x,
  y,
  rotation = 0,
  speed = 0.1,
  floatDuration = 6,
  floatRange = 15,
  opacity = 0.7,
  className = "",
}: FloatingElementProps) {
  const parallaxY = useParallaxY(speed);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        rotate: rotation,
        opacity,
        y: parallaxY,
        willChange: "transform",
      }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -floatRange, 0],
              }
        }
        transition={{
          y: {
            duration: floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-contain"
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}

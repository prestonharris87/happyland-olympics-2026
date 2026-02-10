"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useParallaxY } from "@/lib/parallax";

interface ParallaxLayerProps {
  speed: number;
  className?: string;
  children: ReactNode;
}

export default function ParallaxLayer({
  speed,
  className = "",
  children,
}: ParallaxLayerProps) {
  const y = useParallaxY(speed);

  return (
    <motion.div
      style={{ y, willChange: "transform" }}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

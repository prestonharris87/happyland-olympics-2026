"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import ParallaxLayer from "./ParallaxLayer";

interface MedallionPosition {
  element: "earth" | "fire" | "water" | "air";
  x: number;
  y: number;
}

/**
 * 8 medallions in a symmetric mirrored ring around the hero content.
 * Each element gets 2 medallions placed diagonally opposite each other.
 *
 * Layout (compass-like):
 *         [Earth]          [Air]
 *    [Water]                    [Fire]
 *               CONTENT
 *    [Fire]                     [Water]
 *         [Air]            [Earth]
 */
const MEDALLION_POSITIONS: MedallionPosition[] = [
  // Top row (x: 24+76=100, y: 12+88=100 ✓)
  { element: "earth", x: 24, y: 12 },
  { element: "air", x: 76, y: 12 },
  // Mid sides (x: 22+78=100, y: 39+61=100 ✓)
  { element: "water", x: 22, y: 39 },
  { element: "fire", x: 78, y: 39 },
  // Lower sides
  { element: "fire", x: 22, y: 61 },
  { element: "water", x: 78, y: 61 },
  // Bottom row
  { element: "air", x: 24, y: 88 },
  { element: "earth", x: 76, y: 88 },
];

const MEDALLION_ASSETS: Record<string, string> = {
  earth: "/assets/medallion-earth.png",
  fire: "/assets/medallion-fire.png",
  water: "/assets/medallion-water.png",
  air: "/assets/medallion-air.png",
};

export default function ElementalRing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ParallaxLayer speed={shouldReduceMotion ? 0 : 0.2}>
      {MEDALLION_POSITIONS.map((pos, i) => (
        <div
          key={`${pos.element}-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: "translate(-50%, -50%)",
            width: "clamp(162px, 16vw, 180px)",
            height: "clamp(162px, 16vw, 180px)",
            opacity: 0.85,
            filter: "drop-shadow(0 0 12px rgba(197, 165, 90, 0.3))",
          }}
        >
          <Image
            src={MEDALLION_ASSETS[pos.element]}
            alt=""
            width={160}
            height={160}
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>
      ))}
    </ParallaxLayer>
  );
}

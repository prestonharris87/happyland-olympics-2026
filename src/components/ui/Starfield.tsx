"use client";

import { useMemo } from "react";

function generateStars(count: number, seed: number): string {
  const stars: string[] = [];
  // Simple seeded pseudo-random
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    const x = Math.round(rand() * 2560);
    const y = Math.round(rand() * 2560);
    stars.push(`${x}px ${y}px`);
  }
  return stars.join(", ");
}

export default function Starfield() {
  const layer1 = useMemo(() => generateStars(300, 42), []);
  const layer2 = useMemo(() => generateStars(150, 137), []);
  const layer3 = useMemo(() => generateStars(60, 271), []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Tiny stars - 1px, fast twinkle */}
      <div
        className="absolute inset-0"
        style={{
          width: 2560,
          height: 2560,
          boxShadow: layer1,
          background: "transparent",
          animation: "twinkle 4s ease-in-out infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 215, 0, 0.6)",
            boxShadow: layer1.split(", ").map(s => `${s} rgba(255, 215, 0, 0.6)`).join(", "),
          }}
        />
      </div>

      {/* Medium stars - 2px, medium twinkle */}
      <div
        className="absolute inset-0"
        style={{
          width: 2560,
          height: 2560,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 248, 220, 0.7)",
            boxShadow: layer2.split(", ").map(s => `${s} rgba(255, 248, 220, 0.7)`).join(", "),
            animation: "twinkle-slow 7s ease-in-out infinite",
          }}
        />
      </div>

      {/* Large stars - 3px, with glow, slow twinkle */}
      <div
        className="absolute inset-0"
        style={{
          width: 2560,
          height: 2560,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 215, 0, 0.9)",
            boxShadow: layer3
              .split(", ")
              .map(
                (s) =>
                  `${s} rgba(255, 215, 0, 0.9), ${s} 0 0 6px rgba(255, 215, 0, 0.4), ${s} 0 0 12px rgba(255, 215, 0, 0.2)`
              )
              .join(", "),
            animation: "twinkle 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Subtle cosmic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(91, 155, 213, 0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(212, 86, 43, 0.03) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(58, 125, 68, 0.03) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

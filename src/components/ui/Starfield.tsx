"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  color: string;
  phase: number;
  speed: number;
  minBrightness: number;
  maxBrightness: number;
  isBright: boolean;
}

// Spectral class colors weighted toward white/cream/gold
const SPECTRAL_COLORS = [
  { color: "#CAD8FF", weight: 0.08 }, // O/B blue-white
  { color: "#FFFFFF", weight: 0.22 }, // A white
  { color: "#FFF8DC", weight: 0.25 }, // F cream
  { color: "#FFD700", weight: 0.22 }, // G gold
  { color: "#FFCC6F", weight: 0.15 }, // K warm
  { color: "#FFBB88", weight: 0.08 }, // cooler K pale orange
];

function pickColor(rand: () => number): string {
  let r = rand();
  for (const sc of SPECTRAL_COLORS) {
    r -= sc.weight;
    if (r <= 0) return sc.color;
  }
  return SPECTRAL_COLORS[2].color;
}

function generateStars(width: number, height: number): Star[] {
  // Seeded LCG PRNG (same as old code, seed 42)
  let s = 42;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };

  // Density-scale to viewport, clamped 200–800
  const area = width * height;
  const count = Math.min(800, Math.max(200, Math.round(area / 3700)));

  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    // Inverse-power-law size: many tiny, fewer bright
    const sizeRoll = rand();
    const baseRadius = 0.3 + Math.pow(sizeRoll, 3) * 2.2;

    stars.push({
      x: rand(),
      y: rand(),
      baseRadius,
      color: pickColor(rand),
      phase: rand() * Math.PI * 2,
      speed: 0.3 + rand() * 0.9,
      minBrightness: 0.15 + rand() * 0.35,
      maxBrightness: 0.6 + rand() * 0.4,
      isBright: false,
    });
  }

  // Flag top ~25 by radius for sparkle spikes
  const sorted = [...stars].sort((a, b) => b.baseRadius - a.baseRadius);
  const brightCount = Math.min(25, Math.floor(stars.length * 0.05));
  const threshold = sorted[brightCount - 1]?.baseRadius ?? 2.5;
  for (const star of stars) {
    if (star.baseRadius >= threshold) star.isBright = true;
  }

  return stars;
}

function drawSpike(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  length: number,
  color: string,
  alpha: number,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const endX = cx + cos * length;
  const endY = cy + sin * length;

  const grad = ctx.createLinearGradient(cx, cy, endX, endY);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const dimsRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    function resize() {
      const container = containerRef.current;
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      dimsRef.current = { w, h };
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = generateStars(w, h);
    }

    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }
    window.addEventListener("resize", onResize);

    function render(time: number) {
      const { w, h } = dimsRef.current;
      const stars = starsRef.current;
      const t = time / 1000;

      ctx!.clearRect(0, 0, w, h);

      for (const star of stars) {
        const cx = star.x * w;
        const cy = star.y * h;

        // Compute current brightness via sine wave
        const isStatic = reducedMotion.matches;
        const brightness = isStatic
          ? (star.minBrightness + star.maxBrightness) / 2
          : star.minBrightness +
            (star.maxBrightness - star.minBrightness) *
              ((Math.sin(t * star.speed + star.phase) + 1) / 2);

        // Draw soft glow halo for medium+ stars
        if (star.baseRadius > 0.8) {
          const glowRadius = star.baseRadius * 3;
          const grad = ctx!.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            glowRadius,
          );
          grad.addColorStop(0, star.color);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.globalAlpha = brightness * 0.25;
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(cx, cy, glowRadius, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Draw star circle
        ctx!.globalAlpha = brightness;
        ctx!.fillStyle = star.color;
        ctx!.beginPath();
        ctx!.arc(cx, cy, star.baseRadius, 0, Math.PI * 2);
        ctx!.fill();

        // Sparkle spikes for bright stars
        if (star.isBright) {
          const spikeLen =
            star.baseRadius * (6 + 6 * brightness);
          const rotation = isStatic ? 0 : t * 0.1 + star.phase;
          const spikeAlpha = brightness * 0.6;

          ctx!.globalCompositeOperation = "lighter";

          // 4 primary cross spikes
          for (let i = 0; i < 4; i++) {
            const angle = rotation + (i * Math.PI) / 2;
            drawSpike(ctx!, cx, cy, angle, spikeLen, star.color, spikeAlpha);
          }

          // 4 diagonal secondary spikes (half length, half opacity)
          for (let i = 0; i < 4; i++) {
            const angle = rotation + Math.PI / 4 + (i * Math.PI) / 2;
            drawSpike(
              ctx!,
              cx,
              cy,
              angle,
              spikeLen * 0.5,
              star.color,
              spikeAlpha * 0.5,
            );
          }

          ctx!.globalCompositeOperation = "source-over";
        }
      }

      ctx!.globalAlpha = 1;

      if (!reducedMotion.matches) {
        rafRef.current = requestAnimationFrame(render);
      }
    }

    if (reducedMotion.matches) {
      // Single static frame
      render(0);
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    // Listen for reduced-motion changes
    function onMotionChange() {
      cancelAnimationFrame(rafRef.current);
      if (reducedMotion.matches) {
        render(0);
      } else {
        rafRef.current = requestAnimationFrame(render);
      }
    }
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 top-0 z-0 overflow-hidden pointer-events-none"
      style={{ height: "100lvh" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

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

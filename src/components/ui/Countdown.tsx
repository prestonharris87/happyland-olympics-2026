"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EVENT_TARGET = new Date("2026-06-12T19:00:00-05:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = EVENT_TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const BOX_CLASSES =
  "bg-white/15 backdrop-blur-lg border border-gold/30 ring-1 ring-white/5 text-gold font-heading text-3xl sm:text-5xl font-bold rounded-xl w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shadow-lg shadow-black/30";

function CountdownBox({
  value,
  label,
  index,
}: {
  value: number;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.7, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
    >
      <div className={BOX_CLASSES}>{String(value).padStart(2, "0")}</div>
      <span className="text-cream/50 text-xs sm:text-sm mt-2 font-body font-semibold uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-3 sm:gap-6 justify-center">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className={BOX_CLASSES}>00</div>
            <span className="text-cream/50 text-xs sm:text-sm mt-2 font-body font-semibold uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const boxes: { value: number; label: string }[] = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {boxes.map((box, i) => (
        <CountdownBox
          key={box.label}
          value={box.value}
          label={box.label}
          index={i}
        />
      ))}
    </div>
  );
}

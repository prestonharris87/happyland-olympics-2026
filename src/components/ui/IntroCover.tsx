"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "happyland-intro-seen";

export default function IntroCover() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Don't show on revisits
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }
    // Auto-fade after 1.5s
    const timer = setTimeout(() => setOpacity(0), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (opacity === 0) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [opacity]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[55] bg-navy"
      style={{
        opacity,
        transition: "opacity 0.6s ease-out",
        pointerEvents: "none",
      }}
    />
  );
}

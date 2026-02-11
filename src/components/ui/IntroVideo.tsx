"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SESSION_KEY = "happyland-intro-seen";
const FADE_DURATION = 0.8;
const SKIP_FADE_IN_DELAY = 1.5;
const MAX_TIMEOUT = 10_000;

type IntroState = "playing" | "fading" | "done";

export default function IntroVideo() {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<IntroState>(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(SESSION_KEY)) return "done";
      if (prefersReducedMotion) return "done";
    }
    return "playing";
  });
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isPortrait =
    typeof window !== "undefined" && window.innerHeight > window.innerWidth;

  const skip = useCallback(() => {
    if (state === "done") return;
    setState("fading");
  }, [state]);

  // Lock scroll while intro is active
  useEffect(() => {
    if (state === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  // Show skip button after delay
  useEffect(() => {
    if (state !== "playing") return;
    const timer = setTimeout(() => setShowSkip(true), SKIP_FADE_IN_DELAY * 1000);
    return () => clearTimeout(timer);
  }, [state]);

  // Max timeout fallback
  useEffect(() => {
    if (state !== "playing") return;
    timeoutRef.current = setTimeout(skip, MAX_TIMEOUT);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, skip]);

  // Escape key to skip
  useEffect(() => {
    if (state === "done") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state, skip]);

  // Mark as seen once we start fading
  useEffect(() => {
    if (state === "fading") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, [state]);

  // Autoplay the video
  useEffect(() => {
    if (state !== "playing" || !videoRef.current) return;
    videoRef.current.play().catch(() => {
      // Autoplay blocked — skip gracefully
      setState("done");
      sessionStorage.setItem(SESSION_KEY, "1");
    });
  }, [state]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || state !== "playing") return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FADE_DURATION) {
      setState("fading");
    }
  };

  const handleEnded = () => {
    if (state === "playing") {
      setState("fading");
    }
  };

  const handleFadeComplete = () => {
    setState("done");
  };

  // SSR safety + reduced motion + already seen
  if (state === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: state === "fading" ? 0 : 1 }}
        transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (state === "fading") handleFadeComplete();
        }}
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/videos/intro-poster.jpg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={skip}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src={
              isPortrait
                ? "/videos/intro-portrait.mp4"
                : "/videos/intro-landscape.mp4"
            }
            type="video/mp4"
          />
        </video>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showSkip ? 0.7 : 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={skip}
          className="absolute bottom-8 right-8 z-10 px-4 py-2 text-sm text-white/80
                     bg-white/10 backdrop-blur-sm rounded-full border border-white/20
                     cursor-pointer hover:bg-white/20 transition-colors"
        >
          Skip Intro
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

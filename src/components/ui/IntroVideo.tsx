"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  EVENT_NAME,
  EVENT_YEAR,
  EVENT_TAGLINE,
  EVENT_DATES,
  EVENT_LOCATION,
} from "@/lib/constants";
import Countdown from "@/components/ui/Countdown";

const SESSION_KEY = "happyland-intro-seen";
const SKIP_FADE_IN_DELAY = 1.5;
const MAX_TIMEOUT = 15_000;

// Choreography timing constants
const REVEAL_BEFORE_END = 1.0;
const TITLE_FADE_IN = 0.5;
const CASCADE_STAGGER = 0.15;
const CASCADE_ITEM_DURATION = 0.3;
const POST_CASCADE_HOLD = 0.5;
const OVERLAY_FADE = 0.8;

type IntroState = "playing" | "revealing" | "frozen" | "fading" | "done";

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
  const cascadeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [isPortrait] = useState(
    () => window.matchMedia("(orientation: portrait)").matches
  );

  // Track which cascade items are visible
  const [cascadeVisible, setCascadeVisible] = useState({
    countdown: false,
    tagline: false,
    dates: false,
  });

  const skip = useCallback(() => {
    if (state === "fading" || state === "done") return;
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
    const timer = setTimeout(
      () => setShowSkip(true),
      SKIP_FADE_IN_DELAY * 1000
    );
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
      setState("done");
      sessionStorage.setItem(SESSION_KEY, "1");
    });
  }, [state]);

  // Cascade animation when frozen
  useEffect(() => {
    if (state !== "frozen") return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Countdown fades in immediately
    timers.push(
      setTimeout(() => {
        setCascadeVisible((prev) => ({ ...prev, countdown: true }));
      }, 0)
    );

    // Tagline after stagger
    timers.push(
      setTimeout(() => {
        setCascadeVisible((prev) => ({ ...prev, tagline: true }));
      }, CASCADE_STAGGER * 1000)
    );

    // Dates after 2x stagger
    timers.push(
      setTimeout(() => {
        setCascadeVisible((prev) => ({ ...prev, dates: true }));
      }, CASCADE_STAGGER * 2 * 1000)
    );

    // After cascade completes + hold, start fading video
    const totalCascadeTime =
      CASCADE_STAGGER * 2 * 1000 +
      CASCADE_ITEM_DURATION * 1000 +
      POST_CASCADE_HOLD * 1000;

    cascadeTimerRef.current = setTimeout(() => {
      setState("fading");
    }, totalCascadeTime);

    return () => {
      timers.forEach(clearTimeout);
      if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current);
    };
  }, [state]);

  // timeupdate: trigger "revealing" ~1s before end
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || state !== "playing") return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= REVEAL_BEFORE_END && remaining > 0) {
      setState("revealing");
    }
  };

  // Video ended: freeze on last frame
  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = video.duration - 0.01;
      video.pause();
    }
    setState("frozen");
  };

  // When video overlay fade completes, unmount
  const handleOverlayFadeComplete = () => {
    if (state === "fading") {
      setState("done");
    }
  };

  // SSR safety + reduced motion + already seen
  if (state === "done") return null;

  const titleVisible = state === "revealing" || state === "frozen" || state === "fading";

  return (
    <AnimatePresence>
      {/* Video layer — z-[60], fades independently */}
      <motion.div
        key="intro-video-layer"
        initial={{ opacity: 1 }}
        animate={{ opacity: state === "fading" ? 0 : 1 }}
        transition={{ duration: OVERLAY_FADE, ease: "easeInOut" }}
        onAnimationComplete={handleOverlayFadeComplete}
        className="fixed inset-0 z-[60]"
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
      </motion.div>

      {/* Text overlay layer — z-[70], does NOT fade with video */}
      <div
        key="intro-text-layer"
        className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-4 pointer-events-none"
      >
        <div className="text-center max-w-3xl mx-auto">
          {/* Countdown — cascades in after freeze */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: cascadeVisible.countdown ? 1 : 0,
              y: cascadeVisible.countdown ? 0 : 10,
            }}
            transition={{ duration: CASCADE_ITEM_DURATION, ease: "easeOut" }}
            className="mb-8 sm:mb-12"
          >
            <Countdown />
          </motion.div>

          {/* Title — fades in during "revealing" */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: titleVisible ? 1 : 0,
              y: titleVisible ? 0 : 10,
            }}
            transition={{ duration: TITLE_FADE_IN, ease: "easeOut" }}
            className="font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-gold drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          >
            {EVENT_NAME}
          </motion.h1>

          {/* Year — fades in with title */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: titleVisible ? 1 : 0,
              y: titleVisible ? 0 : 10,
            }}
            transition={{
              duration: TITLE_FADE_IN,
              ease: "easeOut",
              delay: 0.1,
            }}
            className="font-heading text-5xl sm:text-7xl md:text-8xl font-black text-gold-light mt-1 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            {EVENT_YEAR}
          </motion.p>

          {/* Tagline — cascades in after freeze */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: cascadeVisible.tagline ? 1 : 0,
              y: cascadeVisible.tagline ? 0 : 10,
            }}
            transition={{ duration: CASCADE_ITEM_DURATION, ease: "easeOut" }}
            className="font-body text-lg sm:text-2xl font-semibold text-cream/80 mt-4 italic"
          >
            &ldquo;{EVENT_TAGLINE}&rdquo;
          </motion.p>

          {/* Dates — cascades in after freeze */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: cascadeVisible.dates ? 1 : 0,
              y: cascadeVisible.dates ? 0 : 10,
            }}
            transition={{ duration: CASCADE_ITEM_DURATION, ease: "easeOut" }}
            className="font-body text-sm sm:text-base text-cream/50 mt-3 tracking-wide"
          >
            {EVENT_DATES} &bull; {EVENT_LOCATION}
          </motion.p>
        </div>
      </div>

      {/* Skip button — z-[80], above everything */}
      <motion.button
        key="intro-skip-button"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSkip && state !== "fading" ? 0.7 : 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={skip}
        className="fixed bottom-8 right-8 z-[80] px-4 py-2 text-sm text-white/80
                   bg-white/10 backdrop-blur-sm rounded-full border border-white/20
                   cursor-pointer hover:bg-white/20 transition-colors"
      >
        Skip Intro
      </motion.button>
    </AnimatePresence>
  );
}

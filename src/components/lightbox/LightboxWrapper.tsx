"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { motion, AnimatePresence } from "framer-motion";
import HeartButton from "./HeartButton";
import CommentOverlay from "./CommentOverlay";

export type EngagedSlide = Slide & {
  publicId?: string;
  blurSrc?: string;
};

interface LightboxWrapperProps {
  open: boolean;
  slides: EngagedSlide[];
  index?: number;
  onClose: () => void;
}

function BlurSlide({
  slide,
  rect,
}: {
  slide: EngagedSlide;
  rect: { width: number; height: number };
}) {
  const [loaded, setLoaded] = useState(false);

  if (!("src" in slide) || !slide.src || !slide.blurSrc) return undefined;

  const slideWidth = slide.width ?? 1;
  const slideHeight = slide.height ?? 1;
  const aspectRatio = slideWidth / slideHeight;
  const containerAspect = rect.width / rect.height;

  let displayWidth: number;
  let displayHeight: number;
  if (aspectRatio > containerAspect) {
    displayWidth = rect.width;
    displayHeight = rect.width / aspectRatio;
  } else {
    displayHeight = rect.height;
    displayWidth = rect.height * aspectRatio;
  }

  return (
    <div
      style={{
        position: "relative",
        width: displayWidth,
        height: displayHeight,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.blurSrc}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.src}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 300ms ease-in",
        }}
      />
    </div>
  );
}

function PinchZoomSlide({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    scale: 1,
    x: 0,
    y: 0,
    pinching: false,
    panning: false,
    initDist: 0,
    initScale: 1,
    initCX: 0,
    initCY: 0,
    initX: 0,
    initY: 0,
    panSX: 0,
    panSY: 0,
    panOX: 0,
    panOY: 0,
    lastTap: 0,
  });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const st = s.current;

    const apply = () => {
      if (!contentRef.current) return;
      contentRef.current.style.transform =
        st.scale > 1
          ? `scale(${st.scale}) translate(${st.x}px, ${st.y}px)`
          : "";
    };

    const animateTo = () => {
      if (!contentRef.current) return;
      contentRef.current.style.transition = "transform 200ms ease-out";
      apply();
      const onEnd = () => {
        if (contentRef.current) contentRef.current.style.transition = "";
      };
      contentRef.current.addEventListener("transitionend", onEnd, {
        once: true,
      });
    };

    const dist = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const clamp = () => {
      const r = el.getBoundingClientRect();
      const mx = Math.max(0, (r.width * (st.scale - 1)) / (2 * st.scale));
      const my = Math.max(0, (r.height * (st.scale - 1)) / (2 * st.scale));
      st.x = Math.max(-mx, Math.min(mx, st.x));
      st.y = Math.max(-my, Math.min(my, st.y));
    };

    const onStart = (e: TouchEvent) => {
      // Two-finger pinch start
      if (e.touches.length >= 2) {
        e.preventDefault();
        st.pinching = true;
        st.panning = false;
        st.initDist = dist(e.touches[0], e.touches[1]);
        st.initScale = st.scale;
        st.initCX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        st.initCY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        st.initX = st.x;
        st.initY = st.y;
        return;
      }

      if (e.touches.length === 1) {
        // Double-tap detection
        const now = Date.now();
        if (now - st.lastTap < 300) {
          e.preventDefault();
          st.lastTap = 0;
          if (st.scale > 1) {
            st.scale = 1;
            st.x = 0;
            st.y = 0;
          } else {
            st.scale = 2.5;
            st.x = 0;
            st.y = 0;
          }
          animateTo();
          return;
        }
        st.lastTap = now;

        // Start pan if zoomed
        if (st.scale > 1) {
          e.preventDefault();
          st.panning = true;
          st.panSX = e.touches[0].clientX;
          st.panSY = e.touches[0].clientY;
          st.panOX = st.x;
          st.panOY = st.y;
        }
      }
    };

    const onMove = (e: TouchEvent) => {
      if (st.pinching && e.touches.length >= 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        st.scale = Math.max(1, Math.min(5, st.initScale * (d / st.initDist)));
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        st.x = st.initX + (cx - st.initCX) / st.scale;
        st.y = st.initY + (cy - st.initCY) / st.scale;
        clamp();
        apply();
        return;
      }
      if (st.panning && e.touches.length === 1) {
        e.preventDefault();
        st.x = st.panOX + (e.touches[0].clientX - st.panSX) / st.scale;
        st.y = st.panOY + (e.touches[0].clientY - st.panSY) / st.scale;
        clamp();
        apply();
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (st.pinching) {
        if (e.touches.length < 2) {
          st.pinching = false;
          // Snap back to 1x if barely zoomed
          if (st.scale < 1.05) {
            st.scale = 1;
            st.x = 0;
            st.y = 0;
            animateTo();
          } else if (e.touches.length === 1) {
            // Transition remaining finger to pan
            st.panning = true;
            st.panSX = e.touches[0].clientX;
            st.panSY = e.touches[0].clientY;
            st.panOX = st.x;
            st.panOY = st.y;
          }
        }
        e.preventDefault();
        return;
      }
      if (st.panning && e.touches.length === 0) {
        st.panning = false;
      }
    };

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{ transformOrigin: "center center", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}

function NavigationHint({ onDismiss }: { onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);
  const isMobile =
    typeof window !== "undefined" && "ontouchstart" in window;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        background: "rgba(0,0,0,0.5)",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease-out",
        cursor: "pointer",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "hint-bounce-left 1s ease-in-out infinite" }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span
        style={{
          color: "white",
          fontSize: "16px",
          fontFamily: "var(--font-body), system-ui, sans-serif",
          userSelect: "none",
        }}
      >
        {isMobile
          ? "Swipe to navigate \u00b7 Pinch to zoom"
          : "Use \u2190 \u2192 arrow keys to navigate"}
      </span>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "hint-bounce-right 1s ease-in-out infinite" }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

function CommentHint({ onDismiss }: { onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <div
      onClick={dismiss}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "100px",
        background: "rgba(0,0,0,0.5)",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease-out",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: "16px",
          fontFamily: "var(--font-body), system-ui, sans-serif",
          userSelect: "none",
          marginBottom: "8px",
        }}
      >
        Add anonymous comments here
      </span>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: "hint-bounce-down 1s ease-in-out infinite" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function EngagementBar({ publicId }: { publicId: string }) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      // keyboard height = full window height - visible viewport height - viewport offset
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(Math.max(0, offset));
    };

    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: keyboardOffset,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        transition: "bottom 0.1s ease-out",
      }}
    >
      <div
        className="flex items-center gap-3 p-4 pb-6 max-w-lg w-full"
        style={{ pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <HeartButton mediaId={publicId} />
        <div className="flex-1 min-w-0">
          <CommentOverlay mediaId={publicId} />
        </div>
      </div>
    </div>
  );
}

export default function LightboxWrapper({
  open,
  slides,
  index = 0,
  onClose,
}: LightboxWrapperProps) {
  const [hintSeen, setHintSeen] = useState(true);
  const [commentHintSeen, setCommentHintSeen] = useState(true);
  const [showCommentHint, setShowCommentHint] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [viewportOffset, setViewportOffset] = useState(0);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  // Lock body scroll and track viewport offset when lightbox is open
  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const vv = window.visualViewport;
    const onViewportChange = () => {
      if (vv) setViewportOffset(vv.offsetTop);
    };
    vv?.addEventListener("resize", onViewportChange);
    vv?.addEventListener("scroll", onViewportChange);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setViewportOffset(0);
      vv?.removeEventListener("resize", onViewportChange);
      vv?.removeEventListener("scroll", onViewportChange);
    };
  }, [open]);

  useEffect(() => {
    setHintSeen(localStorage.getItem("lightbox-hint-seen") === "true");
    setCommentHintSeen(
      localStorage.getItem("lightbox-comment-hint-seen") === "true"
    );
  }, []);

  const dismissHint = useCallback(() => {
    setHintSeen(true);
    localStorage.setItem("lightbox-hint-seen", "true");
    // After nav hint dismisses, show comment hint if not yet seen
    if (localStorage.getItem("lightbox-comment-hint-seen") !== "true") {
      setTimeout(() => setShowCommentHint(true), 300);
    }
  }, []);

  // If nav hint was already seen, show comment hint immediately on open
  useEffect(() => {
    if (open && hintSeen && !commentHintSeen) {
      const timer = setTimeout(() => setShowCommentHint(true), 600);
      return () => clearTimeout(timer);
    }
  }, [open, hintSeen, commentHintSeen]);

  const dismissCommentHint = useCallback(() => {
    setShowCommentHint(false);
    setCommentHintSeen(true);
    localStorage.setItem("lightbox-comment-hint-seen", "true");
  }, []);

  const currentSlide = slides[currentIndex] as EngagedSlide | undefined;
  const currentPublicId = currentSlide?.publicId;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            transform: `translateY(${-viewportOffset}px)`,
          }}
        >
          <Lightbox
            open={true}
            index={index}
            close={onClose}
            slides={slides}
            plugins={[Video, Counter]}
            video={{ controls: false, playsInline: true, autoPlay: true, loop: true }}
            controller={{
              closeOnBackdropClick: true,
              closeOnPullDown: true,
            }}
            counter={{ separator: " / " }}
            className="yarl-large-icons"
            on={{
              view: ({ index }) => setCurrentIndex(index),
            }}
            render={{
              slide: ({ slide, rect }) => {
                const engaged = slide as EngagedSlide;
                if (!("src" in slide) || !slide.src || !engaged.blurSrc)
                  return undefined;
                return (
                  <PinchZoomSlide key={engaged.publicId}>
                    <BlurSlide slide={engaged} rect={rect} />
                  </PinchZoomSlide>
                );
              },
              controls: () => (
                <>
                  {!hintSeen && (
                    <NavigationHint onDismiss={dismissHint} />
                  )}
                  {showCommentHint && (
                    <CommentHint onDismiss={dismissCommentHint} />
                  )}
                  {currentPublicId && (
                    <EngagementBar publicId={currentPublicId} />
                  )}
                </>
              ),
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

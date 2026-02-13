"use client";

import { useCallback, useState, useEffect } from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
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
        justifyContent: "center",
        gap: "1rem",
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
            plugins={[Video, Counter, Zoom]}
            video={{ controls: false, playsInline: true, autoPlay: true, loop: true }}
            controller={{
              closeOnBackdropClick: true,
              closeOnPullDown: true,
            }}
            counter={{ separator: " / " }}
            zoom={{
              maxZoomPixelRatio: 3,
              zoomInMultiplier: 2,
              doubleClickMaxStops: 2,
              scrollToZoom: false,
            }}
            animation={{ zoom: 300 }}
            className="yarl-large-icons"
            on={{
              view: ({ index }) => setCurrentIndex(index),
            }}
            render={{
              slide: ({ slide, rect }) => (
                <BlurSlide slide={slide as EngagedSlide} rect={rect} />
              ),
              buttonZoom: () => null,
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

"use client";

import { useCallback, useState, useEffect } from "react";
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
          ? "Swipe to navigate"
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

export default function LightboxWrapper({
  open,
  slides,
  onClose,
}: LightboxWrapperProps) {
  const [hintSeen, setHintSeen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setHintSeen(localStorage.getItem("lightbox-hint-seen") === "true");
  }, []);

  const dismissHint = useCallback(() => {
    setHintSeen(true);
    localStorage.setItem("lightbox-hint-seen", "true");
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
          }}
        >
          <Lightbox
            open={true}
            index={0}
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
              slide: ({ slide, rect }) => (
                <BlurSlide slide={slide as EngagedSlide} rect={rect} />
              ),
              controls: () => (
                <>
                  {!hintSeen && (
                    <NavigationHint onDismiss={dismissHint} />
                  )}
                  {currentPublicId && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        className="flex items-center gap-3 p-4 pb-6 max-w-lg w-full"
                        style={{ pointerEvents: "auto" }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <HeartButton mediaId={currentPublicId} />
                        <div className="flex-1 min-w-0">
                          <CommentOverlay mediaId={currentPublicId} />
                        </div>
                      </div>
                    </div>
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

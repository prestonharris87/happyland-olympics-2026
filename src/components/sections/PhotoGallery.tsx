"use client";

import { useState, useCallback, useEffect } from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { validPhotos, type GalleryPhoto } from "@/lib/gallery-data";
import AnimatedSection from "@/components/ui/AnimatedSection";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzj3gfw5k";
const DISPLAY_COUNT = 12;

function cloudinaryImageUrl(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

function cloudinaryBlurUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_30,w_50,e_blur:1000/${publicId}`;
}

function cloudinaryVideoThumb(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_jpg,q_auto,w_${width},c_fill/${publicId}`;
}

function cloudinaryVideoUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_mp4,q_auto/${publicId}`;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomSubset(photos: GalleryPhoto[], count: number): GalleryPhoto[] {
  return shuffleArray(photos).slice(0, count);
}

function buildSlide(photo: GalleryPhoto): Slide {
  if (photo.resourceType === "video") {
    return {
      type: "video",
      sources: [{ src: cloudinaryVideoUrl(photo.publicId), type: "video/mp4" }],
      width: photo.width,
      height: photo.height,
      poster: cloudinaryVideoThumb(photo.publicId, 800),
    };
  }
  return {
    src: cloudinaryImageUrl(photo.publicId, 1080),
    blurSrc: cloudinaryBlurUrl(photo.publicId),
    width: photo.width,
    height: photo.height,
  } as Slide;
}

function BlurSlide({ slide, rect }: { slide: Slide & { blurSrc?: string }; rect: { width: number; height: number } }) {
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
    <div style={{ position: "relative", width: displayWidth, height: displayHeight }}>
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

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    setPhotos(getRandomSubset(validPhotos, DISPLAY_COUNT));
  }, []);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<Slide[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);

  const handleShuffle = useCallback(() => {
    setPhotos(getRandomSubset(validPhotos, DISPLAY_COUNT));
    setShuffleKey((k) => k + 1);
  }, []);

  const imageCount = validPhotos.filter((p) => p.resourceType === "image").length;
  const videoCount = validPhotos.filter((p) => p.resourceType === "video").length;
  const countLabel = videoCount > 0
    ? `${imageCount} photos \u00b7 ${videoCount} videos`
    : `${validPhotos.length} photos`;

  if (validPhotos.length === 0) {
    return (
      <section id="gallery" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-gold mb-2">
              Moments from 2025
            </h2>
            <p className="text-center text-cream/40 font-body mb-10">
              Photos coming soon! Run the upload script to populate the gallery.
            </p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="relative py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-gold mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            Moments from 2025
          </h2>
          <p className="text-center text-cream/40 font-body mb-4">
            {countLabel}
          </p>

          <div className="flex justify-center mb-10">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/30 bg-gold/10 backdrop-blur-sm text-gold font-body font-semibold rounded-full shadow-md hover:shadow-gold/20 hover:bg-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              Shuffle
            </button>
          </div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          <motion.div
            key={shuffleKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {photos.map((photo, index) => {
              const rotation = ((index * 7 + 3) % 5) - 2;
              const isVideo = photo.resourceType === "video";
              const thumbSrc = isVideo
                ? cloudinaryVideoThumb(photo.publicId, 400)
                : cloudinaryImageUrl(photo.publicId, 400);

              return (
                <motion.div
                  key={photo.publicId}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  style={{ rotate: rotation }}
                  className="cursor-pointer rounded-lg overflow-hidden shadow-md shadow-black/30 hover:shadow-xl hover:shadow-gold/10 transition-shadow duration-300 bg-cream/90 p-1"
                  onClick={() => {
                    const clickedIndex = validPhotos.findIndex(
                      (vp) => vp.publicId === photo.publicId
                    );
                    const allSlides = validPhotos.map(buildSlide);
                    setLightboxSlides([
                      ...allSlides.slice(clickedIndex),
                      ...allSlides.slice(0, clickedIndex),
                    ]);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbSrc}
                      alt={`Happyland Olympics 2025 - ${isVideo ? "Video" : "Photo"} ${index + 1}`}
                      loading="lazy"
                      className="rounded-md w-full aspect-square object-cover"
                    />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <polygon points="6,3 21,12 6,21" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/30 bg-gold/10 backdrop-blur-sm text-gold font-body font-semibold rounded-full shadow-md hover:shadow-gold/20 hover:bg-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            Shuffle
          </button>
        </div>

        {lightboxOpen && (
          <Lightbox
            open={true}
            index={0}
            close={() => setLightboxOpen(false)}
            slides={lightboxSlides}
            plugins={[Video]}
            video={{ controls: true, playsInline: true, autoPlay: true }}
            render={{
              slide: ({ slide, rect }) => (
                <BlurSlide slide={slide as Slide & { blurSrc?: string }} rect={rect} />
              ),
            }}
          />
        )}
      </div>
    </section>
  );
}

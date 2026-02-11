"use client";

import { useState, useCallback, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { validPhotos, type GalleryPhoto } from "@/lib/gallery-data";
import AnimatedSection from "@/components/ui/AnimatedSection";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzj3gfw5k";
const DISPLAY_COUNT = 12;

function cloudinaryUrl(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
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

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    setPhotos(getRandomSubset(validPhotos, DISPLAY_COUNT));
  }, []);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string; width: number; height: number }[]>([]);
  const [shuffleKey, setShuffleKey] = useState(0);

  const handleShuffle = useCallback(() => {
    setPhotos(getRandomSubset(validPhotos, DISPLAY_COUNT));
    setShuffleKey((k) => k + 1);
  }, []);

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
            {validPhotos.length} photos
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
                    const allSlides = validPhotos.map((p) => ({
                      src: cloudinaryUrl(p.publicId, 1600),
                      width: p.width,
                      height: p.height,
                    }));
                    setLightboxSlides([
                      ...allSlides.slice(clickedIndex),
                      ...allSlides.slice(0, clickedIndex),
                    ]);
                    setLightboxOpen(true);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cloudinaryUrl(photo.publicId, 400)}
                    alt={`Happyland Olympics 2025 - Photo ${index + 1}`}
                    loading="lazy"
                    className="rounded-md w-full aspect-square object-cover"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {lightboxOpen && (
          <Lightbox
            open={true}
            index={0}
            close={() => setLightboxOpen(false)}
            slides={lightboxSlides}
          />
        )}
      </div>
    </section>
  );
}

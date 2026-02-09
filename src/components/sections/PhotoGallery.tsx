"use client";

import { useState, useRef, createContext, useContext } from "react";
import {
  useInfiniteLoader,
  useMasonry,
  usePositioner,
  useContainerPosition,
  useScroller,
} from "masonic";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import { galleryPhotos, type GalleryPhoto } from "@/lib/gallery-data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useWindowSize } from "@/lib/use-window-size";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzj3gfw5k";

function cloudinaryUrl(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

const GalleryContext = createContext<{
  onPhotoClick: (index: number) => void;
}>({ onPhotoClick: () => {} });

function MasonryCard({
  index,
  data,
  width,
}: {
  index: number;
  data: GalleryPhoto;
  width: number;
}) {
  const { onPhotoClick } = useContext(GalleryContext);
  const height = Math.round((data.height / data.width) * width);
  const rotation = ((index * 7 + 3) % 5) - 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      style={{ rotate: rotation }}
      className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white p-1"
      onClick={() => onPhotoClick(index)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloudinaryUrl(data.publicId, width * 2)}
        alt={`Happyland Olympics 2025 - Photo ${index + 1}`}
        width={width}
        height={height}
        loading="lazy"
        className="rounded-md w-full h-auto"
      />
    </motion.div>
  );
}

function MasonryGrid({ onPhotoClick }: { onPhotoClick: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const { offset, width: containerWidth } = useContainerPosition(containerRef, [
    windowSize.width,
    windowSize.height,
  ]);
  const { scrollTop, isScrolling } = useScroller(offset);

  const columnCount = containerWidth < 640 ? 2 : containerWidth < 1024 ? 3 : 4;
  const columnGutter = containerWidth < 640 ? 8 : 16;

  const positioner = usePositioner(
    {
      width: containerWidth,
      columnCount,
      columnGutter,
      rowGutter: columnGutter,
    },
    [galleryPhotos.length]
  );

  const infiniteLoader = useInfiniteLoader(() => {}, {
    totalItems: galleryPhotos.length,
    isItemLoaded: (index: number) => index < galleryPhotos.length,
  });

  const masonryElement = useMasonry({
    positioner,
    scrollTop,
    isScrolling,
    height: windowSize.height,
    containerRef,
    items: galleryPhotos,
    overscanBy: 3,
    render: MasonryCard,
    onRender: infiniteLoader,
  });

  return (
    <GalleryContext.Provider value={{ onPhotoClick }}>
      <div ref={containerRef}>{masonryElement}</div>
    </GalleryContext.Provider>
  );
}

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  if (galleryPhotos.length === 0) {
    return (
      <section id="gallery" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-dark mb-2">
              Moments from 2025
            </h2>
            <p className="text-center text-dark/50 font-body mb-10">
              Photos coming soon! Run the upload script to populate the gallery.
            </p>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-center uppercase text-dark mb-2">
            Moments from 2025
          </h2>
          <p className="text-center text-dark/50 font-body mb-10">
            {galleryPhotos.length} photos
          </p>
        </AnimatedSection>

        <MasonryGrid onPhotoClick={setLightboxIndex} />

        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={galleryPhotos.map((p) => ({
            src: cloudinaryUrl(p.publicId, 1600),
            width: p.width,
            height: p.height,
          }))}
        />
      </div>
    </section>
  );
}

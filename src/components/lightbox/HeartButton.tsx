"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEngagement } from "@/components/gallery/EngagementProvider";

interface HeartButtonProps {
  mediaId: string;
}

export default function HeartButton({ mediaId }: HeartButtonProps) {
  const { heartCounts, userHearts, toggleHeart } = useEngagement();
  const hearted = userHearts.has(mediaId);
  const count = heartCounts[mediaId] || 0;

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        toggleHeart(mediaId);
      }}
      whileTap={{ scale: 1.4 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-colors"
      aria-label={hearted ? "Remove heart" : "Add heart"}
    >
      <Heart
        size={20}
        className={
          hearted
            ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
            : "text-white/80"
        }
        strokeWidth={hearted ? 0 : 2}
      />
      {count > 0 && (
        <span className="text-sm font-body text-white/90 tabular-nums">
          {count}
        </span>
      )}
    </motion.button>
  );
}

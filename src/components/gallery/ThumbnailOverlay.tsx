"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useEngagement } from "./EngagementProvider";

interface ThumbnailOverlayProps {
  publicId: string;
  assetNumber: number;
}

export default function ThumbnailOverlay({
  publicId,
  assetNumber,
}: ThumbnailOverlayProps) {
  const { heartCounts, commentCounts, loaded } = useEngagement();
  const hearts = heartCounts[publicId] || 0;
  const comments = commentCounts[publicId] || 0;

  return (
    <>
      {/* Asset number - top left */}
      <div className="absolute top-1.5 left-1.5 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[10px] font-body font-bold text-white/80 tabular-nums">
        #{assetNumber}
      </div>

      {/* Engagement badges - bottom right */}
      {loaded && (hearts > 0 || comments > 0) && (
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-2">
          {hearts > 0 && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-md px-2 py-1">
              <Heart size={20} className="fill-red-500 text-red-500" strokeWidth={0} />
              <span className="text-xl font-body font-semibold text-white/80 tabular-nums">
                {hearts}
              </span>
            </div>
          )}
          {comments > 0 && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-md px-2 py-1">
              <MessageCircle size={20} className="text-white/80" />
              <span className="text-xl font-body font-semibold text-white/80 tabular-nums">
                {comments}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

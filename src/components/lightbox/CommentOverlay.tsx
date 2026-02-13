"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEngagement } from "@/components/gallery/EngagementProvider";
import {
  fetchComments,
  postComment,
  type CommentData,
} from "@/lib/engagement";

interface CommentOverlayProps {
  mediaId: string;
}

export default function CommentOverlay({ mediaId }: CommentOverlayProps) {
  const { incrementCommentCount } = useEngagement();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMediaId = useRef(mediaId);

  // Fetch comments when mediaId changes
  useEffect(() => {
    if (mediaId !== prevMediaId.current) {
      setComments([]);
      setExpanded(false);
      prevMediaId.current = mediaId;
    }

    fetchComments(mediaId)
      .then(({ comments: fetched }) => setComments(fetched))
      .catch(() => {});
  }, [mediaId]);

  const handleSubmit = useCallback(async () => {
    const body = inputValue.trim();
    if (!body || submitting) return;

    setSubmitting(true);
    try {
      const { comment } = await postComment(mediaId, body);
      setComments((prev) => [...prev, comment]);
      incrementCommentCount(mediaId);
      setInputValue("");
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  }, [inputValue, submitting, mediaId, incrementCommentCount]);

  const hasMore = comments.length > 3 && !expanded;
  const visibleComments = expanded ? comments : comments.slice(-3);

  return (
    <div
      // Stop navigation events from propagating to the lightbox
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-2 max-w-sm w-full"
    >
      {/* Comments list — always visible when comments exist */}
      {comments.length > 0 && (
        <div className="backdrop-blur-md bg-black/30 rounded-2xl p-3 space-y-2 overflow-hidden">
          {hasMore && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors font-body"
            >
              <MessageCircle size={12} />
              View all {comments.length} comments
            </button>
          )}
          <AnimatePresence initial={false}>
            {visibleComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="text-sm font-body"
              >
                <span className="text-white/90">
                  &ldquo;{comment.body}&rdquo;
                </span>
                <span className="text-white/50 italic">
                  {" "}
                  &mdash; {comment.username}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {expanded && comments.length > 3 && (
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors font-body"
            >
              <MessageCircle size={12} />
              Hide comments
            </button>
          )}
        </div>
      )}

      {/* Comment input */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Add a comment..."
          maxLength={500}
          className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 font-body focus:outline-none focus:border-white/40 transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !inputValue.trim()}
          className="p-2 rounded-full bg-gold/80 hover:bg-gold text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

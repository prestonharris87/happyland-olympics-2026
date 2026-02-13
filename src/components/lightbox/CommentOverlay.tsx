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
  const [showComments, setShowComments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMediaId = useRef(mediaId);

  // Fetch comments when mediaId changes
  useEffect(() => {
    if (mediaId !== prevMediaId.current) {
      setComments([]);
      setExpanded(false);
      setShowComments(false);
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
      setShowComments(true);
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  }, [inputValue, submitting, mediaId, incrementCommentCount]);

  const visibleComments = expanded ? comments : comments.slice(-3);
  const hasMore = comments.length > 3 && !expanded;

  return (
    <div
      // Stop navigation events from propagating to the lightbox
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-2 max-w-sm w-full"
    >
      {/* Toggle comments button */}
      {comments.length > 0 && (
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors text-sm font-body self-start"
        >
          <MessageCircle size={16} />
          <span>
            {showComments ? "Hide" : "View"} {comments.length} comment
            {comments.length !== 1 ? "s" : ""}
          </span>
        </button>
      )}

      {/* Comments list */}
      <AnimatePresence>
        {showComments && comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="backdrop-blur-md bg-black/30 rounded-2xl p-3 space-y-2 overflow-hidden"
          >
            {hasMore && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-white/50 hover:text-white/80 transition-colors font-body"
              >
                View all {comments.length} comments
              </button>
            )}
            {visibleComments.map((comment) => (
              <div key={comment.id} className="text-sm font-body">
                <span className="text-white/90">
                  &ldquo;{comment.body}&rdquo;
                </span>
                <span className="text-white/50 italic">
                  {" "}
                  &mdash; {comment.username}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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

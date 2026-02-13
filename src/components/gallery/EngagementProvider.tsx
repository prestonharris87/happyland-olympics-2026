"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  fetchEngagement,
  toggleHeart as apiToggleHeart,
  type EngagementData,
} from "@/lib/engagement";

interface EngagementContextValue {
  heartCounts: Record<string, number>;
  commentCounts: Record<string, number>;
  userHearts: Set<string>;
  userId: string;
  username: string;
  loaded: boolean;
  toggleHeart: (mediaId: string) => void;
  incrementCommentCount: (mediaId: string) => void;
}

const EngagementContext = createContext<EngagementContextValue>({
  heartCounts: {},
  commentCounts: {},
  userHearts: new Set(),
  userId: "",
  username: "",
  loaded: false,
  toggleHeart: () => {},
  incrementCommentCount: () => {},
});

export function useEngagement() {
  return useContext(EngagementContext);
}

export default function EngagementProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {}
  );
  const [userHearts, setUserHearts] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchEngagement()
      .then((data: EngagementData) => {
        setHeartCounts(data.heartCounts);
        setCommentCounts(data.commentCounts);
        setUserHearts(new Set(data.userHearts));
        setUserId(data.userId);
        setUsername(data.username);
        setLoaded(true);
      })
      .catch(() => {
        // Supabase not configured yet — run in offline mode
        setLoaded(true);
      });
  }, []);

  const toggleHeart = useCallback(
    (mediaId: string) => {
      const wasHearted = userHearts.has(mediaId);

      // Optimistic update
      setUserHearts((prev) => {
        const next = new Set(prev);
        if (wasHearted) next.delete(mediaId);
        else next.add(mediaId);
        return next;
      });
      setHeartCounts((prev) => ({
        ...prev,
        [mediaId]: (prev[mediaId] || 0) + (wasHearted ? -1 : 1),
      }));

      // API call with rollback on error
      apiToggleHeart(mediaId).catch(() => {
        setUserHearts((prev) => {
          const next = new Set(prev);
          if (wasHearted) next.add(mediaId);
          else next.delete(mediaId);
          return next;
        });
        setHeartCounts((prev) => ({
          ...prev,
          [mediaId]: (prev[mediaId] || 0) + (wasHearted ? 1 : -1),
        }));
      });
    },
    [userHearts]
  );

  const incrementCommentCount = useCallback((mediaId: string) => {
    setCommentCounts((prev) => ({
      ...prev,
      [mediaId]: (prev[mediaId] || 0) + 1,
    }));
  }, []);

  return (
    <EngagementContext.Provider
      value={{
        heartCounts,
        commentCounts,
        userHearts,
        userId,
        username,
        loaded,
        toggleHeart,
        incrementCommentCount,
      }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

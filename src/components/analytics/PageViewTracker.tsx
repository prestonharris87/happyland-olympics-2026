"use client";

import { useEffect, useRef } from "react";

const THROTTLE_MS = 2000;
const THROTTLE_KEY = "pv-last";
const SESSION_KEY = "pv-session-id";
const HEARTBEAT_INTERVAL = 30_000;
const ENGAGED_TIMEOUT = 5_000; // user is "engaged" if they interacted within 5s

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getColorScheme(): string {
  if (typeof window.matchMedia !== "function") return "unknown";
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "no-preference";
}

function getConnectionType(): string | null {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType ?? null;
}

function beacon(url: string, data: Record<string, unknown>) {
  const payload = JSON.stringify(data);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

// ── Duration / engagement tracker ──────────────────────────────────

class EngagementTracker {
  private pageViewId: string;
  private visibleSince: number | null = null;
  private engagedSince: number | null = null;
  private totalVisibleMs = 0;
  private totalEngagedMs = 0;
  private lastInteraction = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private engagedCheckTimer: ReturnType<typeof setInterval> | null = null;

  private static INTERACTION_EVENTS = [
    "scroll", "click", "mousemove", "touchstart", "touchmove", "keydown",
  ] as const;

  constructor(pageViewId: string) {
    this.pageViewId = pageViewId;
  }

  start() {
    // Start visible timer (page is in foreground)
    this.visibleSince = Date.now();

    // Listen for visibility changes
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("beforeunload", this.onBeforeUnload);

    // Listen for user interactions
    for (const evt of EngagementTracker.INTERACTION_EVENTS) {
      window.addEventListener(evt, this.onInteraction, { passive: true, capture: true });
    }

    // Check every second whether engagement has lapsed
    this.engagedCheckTimer = setInterval(() => this.checkEngaged(), 1000);

    // Heartbeat: persist durations every 30s
    this.heartbeatTimer = setInterval(() => this.sendUpdate(), HEARTBEAT_INTERVAL);
  }

  private onInteraction = () => {
    const now = Date.now();
    // If this is the start of a new engaged period, mark it
    if (now - this.lastInteraction > ENGAGED_TIMEOUT && this.engagedSince === null) {
      this.engagedSince = now;
    }
    this.lastInteraction = now;
  };

  private checkEngaged() {
    // If the user hasn't interacted recently, close the current engaged period
    if (this.engagedSince !== null && Date.now() - this.lastInteraction > ENGAGED_TIMEOUT) {
      this.totalEngagedMs += this.lastInteraction - this.engagedSince + ENGAGED_TIMEOUT;
      this.engagedSince = null;
    }
  }

  private onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      this.flushTimers();
      this.sendUpdate();
    } else {
      // Tab came back — resume visible timer
      this.visibleSince = Date.now();
    }
  };

  private onBeforeUnload = () => {
    this.flushTimers();
    this.sendUpdate();
  };

  /** Accumulate in-progress visible/engaged time and reset start marks */
  private flushTimers() {
    const now = Date.now();

    if (this.visibleSince !== null) {
      this.totalVisibleMs += now - this.visibleSince;
      this.visibleSince = null;
    }

    if (this.engagedSince !== null) {
      // Close engaged period at the later of: lastInteraction+timeout or now
      const engagedEnd = Math.min(now, this.lastInteraction + ENGAGED_TIMEOUT);
      this.totalEngagedMs += engagedEnd - this.engagedSince;
      this.engagedSince = null;
    }
  }

  private sendUpdate() {
    // Snapshot current totals (including any in-progress period)
    let durationMs = this.totalVisibleMs;
    let engagedMs = this.totalEngagedMs;

    const now = Date.now();
    if (this.visibleSince !== null) {
      durationMs += now - this.visibleSince;
    }
    if (this.engagedSince !== null) {
      const engagedEnd = Math.min(now, this.lastInteraction + ENGAGED_TIMEOUT);
      engagedMs += engagedEnd - this.engagedSince;
    }

    if (durationMs <= 0) return;

    beacon("/api/page-view", {
      id: this.pageViewId,
      durationMs,
      engagedDurationMs: engagedMs,
    });
  }

  destroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.engagedCheckTimer) clearInterval(this.engagedCheckTimer);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    for (const evt of EngagementTracker.INTERACTION_EVENTS) {
      window.removeEventListener(evt, this.onInteraction, { capture: true });
    }
  }
}

// ── Component ──────────────────────────────────────────────────────

export default function PageViewTracker() {
  const fired = useRef(false);
  const trackerRef = useRef<EngagementTracker | null>(null);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const pageViewId = crypto.randomUUID();

    const init = () => {
      // Throttle: skip if we fired within the last THROTTLE_MS
      const last = localStorage.getItem(THROTTLE_KEY);
      if (last && Date.now() - Number(last) < THROTTLE_MS) return;
      localStorage.setItem(THROTTLE_KEY, String(Date.now()));

      // Send initial page view
      beacon("/api/page-view", {
        id: pageViewId,
        path: window.location.pathname,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        colorScheme: getColorScheme(),
        connectionType: getConnectionType(),
        sessionId: getSessionId(),
      });

      // Start tracking duration & engagement
      const tracker = new EngagementTracker(pageViewId);
      tracker.start();
      trackerRef.current = tracker;
    };

    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(init);
    } else {
      setTimeout(init, 0);
    }

    return () => {
      trackerRef.current?.destroy();
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";

const THROTTLE_MS = 2000;
const THROTTLE_KEY = "pv-last";
const SESSION_KEY = "pv-session-id";

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

function collectPayload() {
  return {
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
  };
}

function sendPageView() {
  // Throttle: skip if we fired within the last THROTTLE_MS
  const last = localStorage.getItem(THROTTLE_KEY);
  if (last && Date.now() - Number(last) < THROTTLE_MS) return;
  localStorage.setItem(THROTTLE_KEY, String(Date.now()));

  const payload = JSON.stringify(collectPayload());

  // Prefer sendBeacon for reliability (survives tab close)
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/page-view", new Blob([payload], { type: "application/json" }));
  } else {
    fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Silently ignore tracking failures
    });
  }
}

export default function PageViewTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => sendPageView());
    } else {
      setTimeout(() => sendPageView(), 0);
    }
  }, []);

  return null;
}

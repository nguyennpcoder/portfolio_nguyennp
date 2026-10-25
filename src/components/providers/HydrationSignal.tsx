"use client";

import { useEffect } from "react";

/**
 * Fires a DOM event once React has hydrated the page.
 *
 * The inline guard in `app/layout.tsx` listens for it so it can stop stripping
 * browser-extension attributes: after hydration React never compares the DOM
 * again, so the observer is no longer needed.
 */
export const HYDRATED_EVENT = "app:hydrated";

export function HydrationSignal() {
  useEffect(() => {
    window.dispatchEvent(new Event(HYDRATED_EVENT));
  }, []);

  return null;
}

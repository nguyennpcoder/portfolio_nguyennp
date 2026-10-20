"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setupScrollFx } from "@/lib/scroll-fx";
import { scrollState } from "@/lib/scroll-state";

type ScrollTarget = string | number | HTMLElement | null;

type SmoothScrollContextValue = {
  /** Animated scroll to a selector, element, number (px) or top when null. */
  scrollTo: (target: ScrollTarget, options?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/** Height of the sticky navbar, used as the default anchor offset. */
const NAV_OFFSET = -84;

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    ScrollTrigger.defaults({ markers: false });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      // Snappy but still silky: a mid-range lerp settles in ~6 frames, which
      // keeps the glide without the "laggy" feel of a very low value.
      lerp: 0.14,
      smoothWheel: true,
      // Slightly above 1 so a wheel notch covers more ground per tick.
      wheelMultiplier: 1.28,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's single ticker and keep ScrollTrigger in sync.
    // The same callback publishes y/velocity for scroll-reactive decorations.
    lenis.on("scroll", (instance) => {
      scrollState.y = instance.scroll;
      scrollState.velocity = instance.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Page-wide transform-only scroll motion (drift / settle-in scrubs).
    const teardownFx = setupScrollFx();

    // Recalculate triggers once fonts/images have settled.
    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(refresh, 320);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    // Defensive: keep ScrollTrigger in sync even when the scroll happens
    // outside Lenis (anchor deep-links, instant jumps, scroll restoration).
    const syncScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", syncScroll, { passive: true });

    return () => {
      teardownFx();
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", refresh);
      window.removeEventListener("scroll", syncScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollTo = useCallback<SmoothScrollContextValue["scrollTo"]>(
    (target, options) => {
      const offset = options?.offset ?? NAV_OFFSET;
      const duration = options?.duration ?? 1.1;
      const lenis = lenisRef.current;

      if (typeof target === "number") {
        if (lenis) lenis.scrollTo(target, { offset, duration });
        else window.scrollTo({ top: target + offset, behavior: "smooth" });
        return;
      }

      const element =
        typeof target === "string" ? document.querySelector(target) : target;

      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element as HTMLElement, { offset, duration });
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [],
  );

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}

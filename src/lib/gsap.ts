"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once for the whole app.
gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP);

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Standard scroll-reveal: a small fade + rise that reads as a fade, never a
 * long slide. Honours reduced motion by rendering the final state instantly.
 */
export function revealFrom(
  targets: gsap.TweenTarget,
  options: {
    trigger: Element;
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  },
) {
  const { trigger, y = 22, duration = 0.5, stagger = 0, start = "top 85%" } = options;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: "all" });
    return;
  }

  // fromTo (not from): keeps the visible state as an explicit end value so a
  // ScrollTrigger refresh can never bake the hidden start state in as the end.
  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: "power2.out",
      stagger,
      scrollTrigger: {
        trigger,
        start,
        toggleActions: "play none none reverse",
      },
    },
  );
}

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };

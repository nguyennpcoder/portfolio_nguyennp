"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Thin progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;
      if (prefersReducedMotion()) {
        gsap.set(node, { scaleX: 1 });
        return;
      }

      gsap.set(node, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(node, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5">
      <div
        ref={ref}
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-accent to-accent-text"
      />
    </div>
  );
}

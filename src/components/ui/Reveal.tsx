"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /** When > 0, animate direct children one after another. */
  stagger?: number;
  /** Vertical offset of the rise. Keep it small (8–24px). */
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

/**
 * Fade + rise on scroll into view. Children stay in the DOM even with JS
 * disabled; under reduced motion they render in their final state.
 *
 * Uses `fromTo` rather than `from`: a ScrollTrigger refresh can re-record the
 * "current" style as the tween's end value, and with `from` that bakes the
 * hidden start state in as the destination — content would then stay invisible
 * forever. Explicit end values make the visible state impossible to lose.
 */
export function Reveal({
  children,
  className,
  stagger = 0,
  y = 22,
  delay = 0,
  duration = 0.55,
  start = "top 85%",
  once = false,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      if (prefersReducedMotion()) {
        gsap.set(node, { clearProps: "all" });
        return;
      }

      const targets: gsap.TweenTarget = stagger > 0 ? Array.from(node.children) : node;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          // power3.out lands softly — reads as "settling" rather than "snapping".
          ease: "power3.out",
          stagger,
          // Never let a later tween clobber a reveal that already ran.
          overwrite: "auto",
          scrollTrigger: {
            trigger: node,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...rest} className={cn(className)}>
      {children}
    </div>
  );
}

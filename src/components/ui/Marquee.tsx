"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee. Duplicates its children so the loop is seamless,
 * pauses on hover/focus and stays still under reduced motion. The scroll
 * velocity gently accelerates it — flick the page and the strip whips along,
 * then it eases back to its base speed when you stop.
 */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;
      if (prefersReducedMotion()) return;

      const tween = gsap.to(track, {
        xPercent: reverse ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      });
      if (reverse) gsap.set(track, { xPercent: -50 });

      // Scroll-reactive speed: smoothed so it never jumps.
      let rate = 1;
      const tick = () => {
        const rawVelocity = Math.abs(scrollState.velocity);
        const target = 1 + (Number.isFinite(rawVelocity) ? Math.min(rawVelocity / 16, 3) : 0);
        rate += (target - rate) * 0.07;
        tween.timeScale(rate);
      };
      gsap.ticker.add(tick);

      const pause = () => tween.pause();
      const play = () => tween.play();

      container.addEventListener("mouseenter", pause);
      container.addEventListener("mouseleave", play);
      container.addEventListener("focusin", pause);
      container.addEventListener("focusout", play);

      return () => {
        gsap.ticker.remove(tick);
        container.removeEventListener("mouseenter", pause);
        container.removeEventListener("mouseleave", play);
        container.removeEventListener("focusin", pause);
        container.removeEventListener("focusout", play);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={cn("mask-x group w-full overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max items-center">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

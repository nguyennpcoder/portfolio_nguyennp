"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Counts up to `value` once the element scrolls into view.
 * Renders the final value immediately under reduced motion.
 */
export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      const final = `${value}${suffix}`;

      if (prefersReducedMotion()) {
        node.textContent = final;
        return;
      }

      const counter = { current: 0 };
      gsap.to(counter, {
        current: value,
        duration: 1.2,
        ease: "power2.out",
        snap: { current: 1 },
        onUpdate: () => {
          node.textContent = `${Math.round(counter.current)}${suffix}`;
        },
        onComplete: () => {
          node.textContent = final;
        },
        scrollTrigger: { trigger: node, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={cn(className)}>
      {value}
      {suffix}
    </span>
  );
}

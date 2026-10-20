import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Page-wide scroll-linked motion that is purely transform based, so text keeps
 * its audited colour and contrast at every scroll position:
 *
 * - `[data-drift="16"]` — element floats from +16px to -16px across the whole
 *   viewport pass (soft parallax between eyebrow / title / description).
 * - `[data-scale="0.97"]` — element eases from 97% to 100% as it enters,
 *   which reads as the card "settling" into place.
 *
 * Both use a scrub with inertia so the motion trails the scroll instead of
 * snapping to it. Returns a cleanup that reverts everything.
 */
export function setupScrollFx(): () => void {
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
      const amount = Number(el.dataset.drift) || 16;
      gsap.fromTo(
        el,
        { y: amount },
        {
          y: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
      const from = Number(el.dataset.scale) || 0.97;
      gsap.fromTo(
        el,
        { scale: from },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 96%",
            end: "top 52%",
            scrub: 0.6,
          },
        },
      );
    });
  });

  return () => ctx.revert();
}

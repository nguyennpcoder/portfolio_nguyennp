/**
 * Live scroll metrics written by the Lenis driver and read by scroll-reactive
 * decorations (marquee speed, orbit field). A plain mutable object — no React
 * state — so high-frequency updates never trigger a render.
 */
export const scrollState = {
  /** Current (animated) scroll position in px. */
  y: 0,
  /** Lenis velocity in px per frame; ~0 when idle. */
  velocity: 0,
};

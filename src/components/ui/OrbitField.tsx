"use client";

import { useEffect, useRef } from "react";
import { drawGlow } from "@/lib/canvas-glow";
import { prefersReducedMotion } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];

type Ring = {
  /** Radius as a fraction of the scene scale (see `sceneScale`). */
  rx: number;
  /** Ellipse flatness — how far the ring is tilted away in 3D. */
  flat: number;
  /** Ring rotation, radians. */
  rot: number;
  /** Angular speed, radians/second (negative = the other way round). */
  speed: number;
  /** How many meteors ride this orbit. */
  count: number;
  phase: number;
  color: RGB;
  /** Dotted ring, like the dashed orbit in a star chart. */
  dash?: boolean;
};

/** Palette-only colours: violet #8c45ff · azure #3b3bff · their lighter tints. */
const VIOLET: RGB = [140, 69, 255];
const AZURE: RGB = [59, 59, 255];
const VIOLET_LIGHT: RGB = [201, 168, 255];
const AZURE_LIGHT: RGB = [143, 162, 255];
const WHITE: RGB = [255, 255, 255];

const RINGS: Ring[] = [
  { rx: 0.78, flat: 0.34, rot: -0.22, speed: 0.26, count: 2, phase: 0.6, color: VIOLET },
  { rx: 0.58, flat: 0.28, rot: 0.16, speed: -0.42, count: 2, phase: 2.6, color: AZURE, dash: true },
  { rx: 0.42, flat: 0.23, rot: -0.08, speed: 0.62, count: 1, phase: 4.4, color: VIOLET_LIGHT },
  { rx: 0.3, flat: 0.19, rot: 0.4, speed: -0.86, count: 1, phase: 3.2, color: AZURE_LIGHT, dash: true },
  { rx: 0.2, flat: 0.16, rot: -0.5, speed: 1.05, count: 1, phase: 1.4, color: VIOLET_LIGHT },
];

const TAU = Math.PI * 2;

type Comet = {
  /** Index into RINGS. */
  ring: number;
  phase: number;
  speed: number;
  /** Depth-scaled size multiplier so a ring can carry a big and a small rock. */
  size: number;
};

/** Every meteor of every orbit, flattened once — 7 rocks in total. */
const COMETS: Comet[] = RINGS.flatMap((ring, index) =>
  Array.from({ length: ring.count }, (_, k) => ({
    ring: index,
    phase: ring.phase + (k * TAU) / ring.count + index * 0.8,
    speed: ring.speed * (1 + k * 0.5),
    size: k === 0 ? 1 : 0.68,
  })),
);

const rgba = (c: RGB, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

/**
 * The hero banner's "deep space" canvas: tilted 3D orbits with comet-like
 * meteors racing along them, over an ambient palette glow.
 *
 * - designed to bleed edge to edge (place it in a `w-screen` wrapper)
 * - pointer tilts the scene at two depths
 * - scrolling speeds every meteor up via the shared scroll velocity
 * - pauses entirely when off-screen and renders one static frame under
 *   prefers-reduced-motion
 * - purely decorative (aria-hidden), never sits on top of content
 *
 * Stars, shooting stars and the pointer-chasing swarm are handled site-wide by
 * `CosmicField`, so this canvas stays focused on the banner's orbit rings.
 */
export function OrbitField({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const cometPhase = COMETS.map((comet) => comet.phase);

    let w = 1;
    let h = 1;
    let last = 0;
    let raf = 0;
    let boost = 1;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    /** Ambient glow is baked once per resize, then blitted every frame — the
     *  banner is large and re-filling two huge gradients would cost frames. */
    const GLOW_MARGIN = 64;
    const glowLayer = document.createElement("canvas");

    /** Orbits are sized from this so the scene reads well from an ultrawide
     *  monitor down to a phone, without rings collapsing off-screen. */
    const sceneScale = () => Math.min(w, h * 2.1);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderGlowLayer();
      render();
    };

    /** Draw the palette glows into an offscreen canvas sized to the host plus
     *  a margin (the pointer parallax slides the blit around). */
    const renderGlowLayer = () => {
      const gw = w + GLOW_MARGIN * 2;
      const gh = h + GLOW_MARGIN * 2;
      glowLayer.width = Math.round(gw * dpr);
      glowLayer.height = Math.round(gh * dpr);
      const gctx = glowLayer.getContext("2d");
      if (!gctx) return;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, gw, gh);
      gctx.globalCompositeOperation = "lighter";
      const cx = w * 0.5 + GLOW_MARGIN;
      const cy = h * 0.46 + GLOW_MARGIN;
      drawGlow(gctx, cx - w * 0.1, cy + h * 0.05, Math.max(w, h) * 0.5, VIOLET, 0.42);
      drawGlow(gctx, cx + w * 0.28, cy - h * 0.14, Math.max(w, h) * 0.34, AZURE, 0.28);
      drawGlow(gctx, cx - w * 0.42, cy - h * 0.2, Math.max(w, h) * 0.3, VIOLET, 0.2);
    };

    /** One orbit: the track line, a light sweep and its meteors. */
    const drawOrbit = (ring: Ring, ringIndex: number) => {
      const rx = ring.rx * sceneScale();
      const ry = rx * ring.flat;
      const cx = w * 0.5 + pointer.x * 16;
      const cy = h * 0.46 + pointer.y * 12;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.rot);

      // Orbit line — dotted for the "star chart" rings.
      ctx.lineWidth = 1;
      ctx.setLineDash(ring.dash ? [2, 9] : []);
      ctx.strokeStyle = rgba(ring.color, ring.dash ? 0.42 : 0.34);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      COMETS.forEach((comet, cometIndex) => {
        if (comet.ring !== ringIndex) return;

        const th = cometPhase[cometIndex];
        const dir = Math.sign(comet.speed) || 1;

        // Light sweep trailing the meteor, so the orbit reads as moving.
        const SEGMENTS = 24;
        const span = 1.6;
        for (let s = 0; s < SEGMENTS; s += 1) {
          const a1 = th - (span * s * dir) / SEGMENTS;
          const a0 = th - (span * (s + 1) * dir) / SEGMENTS;
          const fade = Math.pow(1 - s / SEGMENTS, 2.4);
          ctx.strokeStyle = rgba(ring.color, fade * 0.7);
          ctx.lineWidth = 1.8 - (s / SEGMENTS) * 1.1;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, a0, a1, dir < 0);
          ctx.stroke();
        }

        // The rock itself: tapered trail plus a glowing head with depth.
        const depth = Math.sin(th);
        const near = (depth + 1) / 2;
        const scale = (0.7 + near * 0.45) * comet.size;
        const alpha = 0.42 + near * 0.58;
        const hx = rx * Math.cos(th);
        const hy = ry * Math.sin(th);

        ctx.globalCompositeOperation = "lighter";
        const TRAIL = 14;
        for (let j = TRAIL; j >= 1; j -= 1) {
          const tj = th - j * 0.055 * dir;
          const k = 1 - j / TRAIL;
          ctx.fillStyle = rgba(ring.color, alpha * k * k * 0.6);
          ctx.beginPath();
          ctx.arc(rx * Math.cos(tj), ry * Math.sin(tj), 0.5 + k * k * 2.6 * scale, 0, TAU);
          ctx.fill();
        }
        drawGlow(ctx, hx, hy, 16 * scale, ring.color, alpha * 0.72);
        ctx.fillStyle = rgba(WHITE, alpha * 0.92);
        ctx.beginPath();
        ctx.arc(hx, hy, 2.2 * scale, 0, TAU);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      });

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Cached ambient glow layer, offset by the pointer for depth.
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(
        glowLayer,
        -GLOW_MARGIN + pointer.x * 22,
        -GLOW_MARGIN + pointer.y * 16,
        w + GLOW_MARGIN * 2,
        h + GLOW_MARGIN * 2,
      );
      ctx.globalCompositeOperation = "source-over";

      RINGS.forEach((ring, index) => drawOrbit(ring, index));
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;

      // Scrolling makes every meteor rush; idle scroll lets them glide.
      const rawVelocity = Math.abs(scrollState.velocity);
      const target = 1 + (Number.isFinite(rawVelocity) ? Math.min(rawVelocity / 22, 3.2) : 0);
      boost += (target - boost) * Math.min(1, dt * 4);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3.2);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3.2);

      COMETS.forEach((comet, index) => {
        cometPhase[index] += comet.speed * boost * dt;
      });

      render();
    };

    const start = () => {
      if (raf || reduce) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) {
        pointer.tx = 0;
        pointer.ty = 0;
        return;
      }
      pointer.tx = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      pointer.ty = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
    };

    const onPointerGone = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    resize();

    if (reduce) return () => resizeObserver.disconnect();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerGone);
    window.addEventListener("blur", onPointerGone);
    start();

    return () => {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerGone);
      window.removeEventListener("blur", onPointerGone);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}

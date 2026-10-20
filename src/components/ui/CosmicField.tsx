"use client";

import { useEffect, useRef } from "react";
import { drawGlow } from "@/lib/canvas-glow";
import { prefersReducedMotion } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";

type RGB = [number, number, number];

/**
 * Palette-only colours. Same source hexes as the rest of the site: violet
 * `#8c45ff`, azure `#3b3bff`, their readable tints, plus the neutral ramp the
 * sphere body is rebuilt from (primary-tint → background-subtle → black).
 */
const VIOLET: RGB = [140, 69, 255];
const AZURE: RGB = [59, 59, 255];
const VIOLET_LIGHT: RGB = [201, 168, 255];
const AZURE_LIGHT: RGB = [143, 162, 255];
const WHITE: RGB = [255, 255, 255];
const PRIMARY_TINT: RGB = [28, 17, 48]; /* --color-primary-tint */
const SUBTLE: RGB = [11, 11, 15]; /* --color-background-subtle */
const BLACK: RGB = [0, 0, 0];

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

/** Direction the sphere is lit from — top-left-front, matching the site glow. */
const LIGHT = (() => {
  const v: RGB = [-0.52, 0.46, 0.72];
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len] as RGB;
})();

const rgba = (c: RGB, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Sub-solar core and mid-tone of the lit face, straight off the violet ramp. */
const LIT_CORE = mix(PRIMARY_TINT, VIOLET, 0.5);
const LIT = mix(PRIMARY_TINT, VIOLET, 0.22);
/** Landmasses: a lighter step of the same violet ramp. */
const LAND_FILL = mix(VIOLET, VIOLET_LIGHT, 0.45);

/** Deterministic pseudo-random so the sky looks the same on every render. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  nx: number;
  ny: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  /** How far the star moves with the pointer — deeper stars move less. */
  depth: number;
  flare: boolean;
};

function makeStars(count: number): Star[] {
  const rand = mulberry32(20261020);
  return Array.from({ length: count }, (_, i) => ({
    nx: rand(),
    ny: rand(),
    size: 0.5 + rand() * 1.2,
    alpha: 0.16 + rand() * 0.5,
    speed: 0.4 + rand() * 1.4,
    phase: rand() * TAU,
    depth: 0.25 + rand() * 0.75,
    flare: i % 9 === 0,
  }));
}

type Point = { x: number; y: number };

type Follower = {
  x: number;
  y: number;
  /** Offset angle/radius around the pointer — gives the swarm its shape. */
  angle: number;
  radius: number;
  spin: number;
  /** Seconds to converge: small = snappy, large = lagging (organic depth). */
  tau: number;
  size: number;
  tail: number;
  color: RGB;
  trail: Point[];
};

/** The star swarm that chases the pointer across the whole site. */
function makeFollowers(count: number): Follower[] {
  const rand = mulberry32(778899);
  const palette: RGB[] = [VIOLET_LIGHT, AZURE_LIGHT, VIOLET, WHITE];
  return Array.from({ length: count }, (_, i) => ({
    x: 0,
    y: 0,
    angle: rand() * TAU,
    radius: 0.16 + rand() * 0.84,
    spin: (rand() > 0.5 ? 1 : -1) * (0.12 + rand() * 0.52),
    tau: 0.07 + rand() * 0.24,
    size: 0.7 + rand() * 1.5,
    tail: 6 + Math.floor(rand() * 9),
    color: palette[i % palette.length],
    trail: [],
  }));
}

type ShootingStar = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  color: RGB;
};

/**
 * Coarse landmasses in lat/lon degrees — a stylised Earth, not a survey map.
 * Each entry is an ellipse of `ry` degrees of latitude by `rx` of longitude.
 */
const LAND: { lat: number; lon: number; ry: number; rx: number }[] = [
  { lat: 6, lon: 20, ry: 36, rx: 24 }, // Africa
  { lat: 50, lon: 16, ry: 15, rx: 23 }, // Europe
  { lat: 48, lon: 92, ry: 27, rx: 58 }, // Asia
  { lat: 22, lon: 78, ry: 13, rx: 11 }, // India
  { lat: 2, lon: 112, ry: 11, rx: 20 }, // South-East Asia
  { lat: -25, lon: 134, ry: 11, rx: 17 }, // Australia
  { lat: 46, lon: -100, ry: 22, rx: 36 }, // North America
  { lat: 16, lon: -92, ry: 9, rx: 12 }, // Central America
  { lat: -14, lon: -60, ry: 27, rx: 16 }, // South America
  { lat: 72, lon: -42, ry: 9, rx: 14 }, // Greenland
  { lat: -80, lon: 0, ry: 13, rx: 180 }, // Antarctica
  { lat: -19, lon: 47, ry: 8, rx: 5 }, // Madagascar
  { lat: 38, lon: 140, ry: 7, rx: 5 }, // Japan
  { lat: -42, lon: 172, ry: 6, rx: 5 }, // New Zealand
];

type LandDot = {
  /** Pre-computed so the per-frame cost is only the rotating longitude. */
  sl: number;
  cl: number;
  lon: number;
  size: number;
  /** 1 at a landmass centre, 0 at its coast — keeps continents solid-looking. */
  strength: number;
  /** A few interior dots also read as city lights. */
  city: boolean;
};

/** Sample the land masks into a dotted cloud — uniform over the sphere. */
function makeLandDots(count: number): LandDot[] {
  const rand = mulberry32(5130420);
  const dots: LandDot[] = [];
  let guard = 0;
  while (dots.length < count && guard < count * 80) {
    guard += 1;
    // asin → uniform over the sphere's area, not over the lat/lon rectangle.
    const lat = Math.asin(rand() * 2 - 1) / DEG;
    const lon = rand() * 360 - 180;
    let strength = 0;
    for (const m of LAND) {
      const dl = (lat - m.lat) / m.ry;
      const dn = (lon - m.lon) / m.rx;
      const q = dl * dl + dn * dn;
      if (q <= 1) strength = Math.max(strength, 1 - q);
    }
    if (strength <= 0) continue;
    dots.push({
      sl: Math.sin(lat * DEG),
      cl: Math.cos(lat * DEG),
      lon: lon * DEG,
      size: 0.5 + rand() * 0.5,
      strength,
      city: dots.length % 23 === 7,
    });
  }
  return dots;
}

/** One landmass outline, pre-resolved into the trig the projection needs. */
type LandPoly = {
  /** Each vertex's latitude factors plus its own (still) longitude factors. */
  verts: { cl: number; sl: number; cosLon: number; sinLon: number }[];
  /** Centre factors — used to cull landmasses that have rotated away. */
  cl: number;
  sl: number;
  cosLon: number;
  sinLon: number;
};

/** Turn the coarse lat/lon masks into wobbly coastlines. */
const CONTINENTS: LandPoly[] = LAND.map((m, index) => {
  const rand = mulberry32(9001 + index * 131);
  const VERTS = 68;
  // Low-frequency harmonics only: a coastline should meander, not spike.
  const phases = [rand() * TAU, rand() * TAU, rand() * TAU];
  const wobble = (t: number) =>
    1 +
    0.15 * Math.sin(3 * t + phases[0]) +
    0.09 * Math.sin(5 * t + phases[1]) +
    0.05 * Math.sin(8 * t + phases[2]);
  const factor = (latDeg: number, lonDeg: number) => ({
    cl: Math.cos(latDeg * DEG),
    sl: Math.sin(latDeg * DEG),
    cosLon: Math.cos(lonDeg * DEG),
    sinLon: Math.sin(lonDeg * DEG),
  });
  const verts = Array.from({ length: VERTS }, (_, i) => {
    const t = (i / VERTS) * TAU;
    const w = wobble(t);
    const lat = Math.max(-89, Math.min(89, m.lat + m.ry * w * Math.sin(t)));
    const lon = m.lon + m.rx * w * Math.cos(t);
    return factor(lat, lon);
  });
  return { verts, ...factor(m.lat, m.lon) };
});

type Belt = {
  /** Orbit radius as a multiple of the globe radius. */
  rx: number;
  /** Ellipse flatness — how far the belt is tilted away in 3D. */
  flat: number;
  /** Belt tilt, radians. */
  rot: number;
  /** Angular speed, radians/second. */
  speed: number;
  /** How many constellation stars ride this belt. */
  count: number;
  phase: number;
  color: RGB;
  dash?: boolean;
  /** Draw the constellation line linking this belt's stars. */
  link?: boolean;
};

/** Constellations circling the planet, in the same tilted-ring language as the hero. */
const BELTS: Belt[] = [
  { rx: 1.3, flat: 0.32, rot: -0.28, speed: 0.2, count: 5, phase: 0.4, color: VIOLET_LIGHT, link: true },
  { rx: 1.6, flat: 0.25, rot: 0.2, speed: -0.28, count: 4, phase: 2.2, color: AZURE_LIGHT, dash: true },
  { rx: 1.88, flat: 0.2, rot: 0.44, speed: 0.15, count: 6, phase: 3.6, color: VIOLET, link: true },
];

const BELT_STARS = BELTS.map((belt) =>
  Array.from({ length: belt.count }, (_, k) => ({
    phase: belt.phase + (k / belt.count) * TAU,
    size: 0.9 + ((k * 7) % 5) * 0.22,
  })),
);

/**
 * Full-page "deep space" layer, pinned to the viewport:
 *
 * - a twinkling star field and a swarm of stars that chases the pointer —
 *   everywhere on the site, not only inside the hero banner
 * - the occasional shooting star
 * - from the Education section onwards: a half planet anchored to right edge
 *   (only its visible half is shown), rotating slowly on its own and speeding
 *   up with the scroll, growing as the page is scrolled down and shrinking
 *   again on the way back up, with constellations orbiting around it
 *
 * Everything is decorative (aria-hidden), sits behind the content and draws in
 * palette colours only. One static frame is rendered under
 * `prefers-reduced-motion`, and the whole layer pauses on a hidden tab.
 */
export function CosmicField({
  stars: starCount = 210,
  swarm: swarmCount = 26,
}: {
  stars?: number;
  swarm?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const starField = makeStars(starCount);
    const followers = makeFollowers(swarmCount);
    const landDots = makeLandDots(1100);
    const shooters: ShootingStar[] = [0, 1].map(() => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      ttl: 1,
      color: VIOLET_LIGHT,
    }));

    let w = 1;
    let h = 1;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let time = 0;
    let last = 0;
    let raf = 0;
    let boost = 1;
    let seeded = false;
    let nextShootingStar = 2.6;
    /** Document offset of the Education section and the scroll room after it. */
    let eduDocTop = Number.POSITIVE_INFINITY;
    let eduSpan = 1;
    let measureIn = 0;
    /** Planet rotation (radians) and the two scroll-driven 0 → 1 factors. */
    let spin = 0;
    let appear = 0;
    let progress = 0;
    const beltPhase = BELT_STARS.map((items) => items.map((item) => item.phase));

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0, sx: 0, sy: 0, inside: false };

    /** Where the swarm drifts when the pointer is elsewhere. */
    const idleAnchor = (): Point => ({
      x: w * 0.5 + Math.cos(time * 0.21) * w * 0.2,
      y: h * 0.46 + Math.sin(time * 0.17) * h * 0.12,
    });

    const seedFollowers = () => {
      const anchor = { x: w * 0.5, y: h * 0.46 };
      const base = Math.min(w, h) * 0.26;
      for (const f of followers) {
        f.x = anchor.x + Math.cos(f.angle) * f.radius * base;
        f.y = anchor.y + Math.sin(f.angle) * f.radius * base * 0.72;
        f.trail = Array.from({ length: f.tail }, () => ({ x: f.x, y: f.y }));
      }
      pointer.px = anchor.x;
      pointer.py = anchor.y;
      pointer.sx = anchor.x;
      pointer.sy = anchor.y;
    };

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
      if (!seeded) {
        seeded = true;
        seedFollowers();
        measure();
      }
      if (reduce) render(true);
    };

    /**
     * Cache the two layout numbers the planet needs. Reading them once per
     * second (instead of every frame) keeps `getBoundingClientRect` from
     * forcing a synchronous layout inside the animation loop.
     */
    const measure = () => {
      const doc = document.documentElement;
      const edu = document.getElementById("education");
      const docTop = edu
        ? edu.getBoundingClientRect().top + window.scrollY
        : doc.scrollHeight * 0.55;
      eduDocTop = docTop;
      eduSpan = Math.max(1, doc.scrollHeight - window.innerHeight - docTop);
    };

    const spawnShootingStar = () => {
      const m = shooters.find((item) => !item.active);
      if (!m) return;
      const fromLeft = Math.random() > 0.5;
      m.active = true;
      m.x = fromLeft ? -24 : w + 24;
      m.y = h * (0.04 + Math.random() * 0.5);
      const speed = 620 + Math.random() * 320;
      const angle = fromLeft ? 0.2 + Math.random() * 0.2 : Math.PI - 0.2 - Math.random() * 0.2;
      m.vx = Math.cos(angle) * speed;
      m.vy = Math.sin(angle) * speed;
      m.life = 0;
      m.ttl = 1 + Math.random() * 0.5;
      m.color = Math.random() > 0.5 ? VIOLET_LIGHT : AZURE_LIGHT;
    };

    /** Star field — each star drifts with the pointer at its own depth. */
    const drawSky = () => {
      ctx.fillStyle = rgba(WHITE, 1);
      for (const star of starField) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * star.speed + star.phase);
        const a = star.alpha * twinkle;
        if (a <= 0.01) continue;
        const x = star.nx * w + pointer.x * 14 * star.depth;
        const y = star.ny * h + pointer.y * 11 * star.depth;
        if (star.flare) drawGlow(ctx, x, y, star.size * 6, WHITE, a * 0.5);
        ctx.globalAlpha = a;
        ctx.fillRect(x, y, star.size, star.size);
      }
      ctx.globalAlpha = 1;
    };

    const drawShootingStars = () => {
      for (const m of shooters) {
        if (!m.active) continue;
        const p = m.life / m.ttl;
        const fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        const tailX = m.x - m.vx * 0.12;
        const tailY = m.y - m.vy * 0.12;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, rgba(m.color, 0.85 * fade));
        grad.addColorStop(1, rgba(m.color, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        drawGlow(ctx, m.x, m.y, 10, m.color, 0.5 * fade);
        ctx.fillStyle = rgba(WHITE, 0.9 * fade);
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.7, 0, TAU);
        ctx.fill();
      }
    };

    /** The star swarm: a comet tail per follower, chasing the pointer. */
    const drawSwarm = () => {
      ctx.globalCompositeOperation = "lighter";
      const white = rgba(WHITE, 0.82);
      for (const f of followers) {
        const n = f.trail.length;
        ctx.fillStyle = rgba(f.color, 1);
        for (let i = 0; i < n; i += 1) {
          const p = f.trail[i];
          const k = (i + 1) / n;
          ctx.globalAlpha = k * k * 0.45;
          ctx.beginPath();
          ctx.arc(p.x, p.y, f.size * (0.3 + k * 0.9), 0, TAU);
          ctx.fill();
        }
        const head = f.trail[n - 1];
        if (!head) continue;
        ctx.globalAlpha = 1;
        drawGlow(ctx, head.x, head.y, f.size * 7, f.color, 0.38);
        ctx.fillStyle = white;
        ctx.beginPath();
        ctx.arc(head.x, head.y, f.size * 0.7, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    /**
     * Continents as real coastline paths. Everything is projected exactly, and
     * vertices that have turned past the limb are clamped onto the limb circle
     * so a landmass never flips inside out. One path, one fill — overlaps
     * (Europe over Asia) stay seamless instead of stacking up.
     */
    const drawContinents = (k: number, R: number, cx: number, cy: number) => {
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);
      ctx.beginPath();
      let drawn = false;
      for (const poly of CONTINENTS) {
        const centre = poly.cosLon * cosSpin - poly.sinLon * sinSpin;
        if (centre < -0.25) continue; // rotated out of sight
        drawn = true;
        poly.verts.forEach((v, i) => {
          const sinL = v.sinLon * cosSpin + v.cosLon * sinSpin;
          const cosL = v.cosLon * cosSpin - v.sinLon * sinSpin;
          const beyond = cosL <= 0.02;
          const nx = beyond ? (sinL >= 0 ? v.cl : -v.cl) : v.cl * sinL;
          const x = cx + R * nx;
          const y = cy - R * v.sl;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
      if (!drawn) return;
      ctx.fillStyle = rgba(LAND_FILL, 0.3 * k);
      ctx.fill();
      ctx.strokeStyle = rgba(VIOLET_LIGHT, 0.16 * k);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    /**
     * The planet: a dotted/graticule globe drawn with an exact orthographic
     * projection, so it reads as a real sphere while staying cheap — only the
     * meridians' longitude has to be recomputed as it turns.
     */
    const drawGlobe = (k: number, R: number, cx: number, cy: number) => {
      const landFill = rgba(VIOLET, 1);
      const cityFill = rgba(VIOLET_LIGHT, 1);

      // 1. Sphere body — lit from the front-left, so the sub-solar point (bright
      //    core) sits well inside the visible half and the falloff is gentle.
      const sunX = cx - R * 0.5;
      const sunY = cy - R * 0.44;
      const body = ctx.createRadialGradient(sunX, sunY, R * 0.05, sunX, sunY, R * 1.6);
      body.addColorStop(0, rgba(LIT_CORE, k));
      body.addColorStop(0.45, rgba(LIT, k));
      body.addColorStop(0.78, rgba(PRIMARY_TINT, k));
      body.addColorStop(1, rgba(SUBTLE, k));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      // 1b. Landmasses — real coastlines under the dot stipple.
      drawContinents(k, R, cx, cy);

      // 2. Land dot cloud — only the near hemisphere, lit from the top-left.
      ctx.fillStyle = landFill;
      for (const dot of landDots) {
        const lon = dot.lon + spin;
        const slo = Math.sin(lon);
        const clo = Math.cos(lon);
        if (clo <= 0.04) continue;
        const nx = dot.cl * slo;
        const ny = dot.sl;
        const nz = dot.cl * clo;
        const lit = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
        const a =
          clamp01(lit + 0.1) ** 0.9 *
          (0.32 + 0.68 * nz) *
          (0.28 + 0.72 * dot.strength) *
          k *
          0.42;
        if (a <= 0.012) continue;
        const x = cx + R * nx;
        const y = cy - R * ny;
        const s = dot.size * (0.9 + nz * 0.9) * (1 + progress * 0.5);
        ctx.globalAlpha = a;
        if (dot.city && dot.strength > 0.3) {
          // Interior dots double as city lights: brighter and lighter violet.
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = cityFill;
          ctx.fillRect(x - s, y - s, s * 2, s * 2);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = landFill;
        } else {
          ctx.fillRect(x - s * 0.75, y - s * 0.75, s * 1.5, s * 1.5);
        }
      }
      ctx.globalAlpha = 1;

      // 3. Graticule — exact for an orthographic sphere.
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(VIOLET_LIGHT, 0.12 * k);
      ctx.beginPath();
      for (const lat of [-60, -30, 30, 60]) {
        const rad = lat * DEG;
        const y = cy - R * Math.sin(rad);
        const half = R * Math.cos(rad);
        ctx.moveTo(cx - half, y);
        ctx.lineTo(cx + half, y);
      }
      ctx.stroke();
      // Equator slightly brighter so the horizon reads.
      ctx.strokeStyle = rgba(VIOLET_LIGHT, 0.18 * k);
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.stroke();

      ctx.strokeStyle = rgba(AZURE_LIGHT, 0.09 * k);
      ctx.beginPath();
      for (let deg = 0; deg < 360; deg += 30) {
        const lon = (deg + spin / DEG) * DEG;
        const c = Math.cos(lon);
        if (c <= 0.02) continue; // far side of the sphere
        ctx.ellipse(cx, cy, R * Math.abs(Math.sin(lon)), R, 0, 0, TAU);
      }
      ctx.stroke();

      // 4. Light falloff: limb darkening, then the terminator.
      const limb = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
      limb.addColorStop(0, rgba(BLACK, 0));
      limb.addColorStop(0.78, rgba(BLACK, 0.2 * k));
      limb.addColorStop(1, rgba(BLACK, 0.55 * k));
      ctx.fillStyle = limb;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      // Terminator: the disc darkens away from the sub-solar point, which also
      // keeps muted copy readable where it overlaps the planet's lower half.
      const shadow = ctx.createLinearGradient(cx - R * 0.9, cy - R, cx + R, cy + R * 0.9);
      shadow.addColorStop(0, rgba(BLACK, 0));
      shadow.addColorStop(0.3, rgba(BLACK, 0.2 * k));
      shadow.addColorStop(0.7, rgba(BLACK, 0.46 * k));
      shadow.addColorStop(1, rgba(BLACK, 0.62 * k));
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      // 5. Rim light on the lit limb + atmosphere spilling off the edge.
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = rgba(VIOLET_LIGHT, 0.42 * k);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, Math.PI * 0.86, Math.PI * 1.62);
      ctx.stroke();

      const atmo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.18);
      atmo.addColorStop(0, rgba(VIOLET, 0.26 * k));
      atmo.addColorStop(0.42, rgba(AZURE, 0.12 * k));
      atmo.addColorStop(1, rgba(AZURE, 0));
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    /**
     * Constellations orbiting the planet. The far half is drawn before the
     * globe (so the sphere hides it) and the near half after it; `sin(t + phi)`
     * tells the two apart for both the ring and its stars.
     */
    const drawBelts = (k: number, R: number, cx: number, cy: number, near: boolean) => {
      BELTS.forEach((belt, beltIndex) => {
        const rx = Math.min(R * belt.rx, w * 0.46);
        const ry = rx * belt.flat;
        const phi = Math.atan2(rx * Math.sin(belt.rot), ry * Math.cos(belt.rot));
        const stars = BELT_STARS[beltIndex];

        // Ring: near half [-phi, PI - phi], far half the complement.
        ctx.lineWidth = 1;
        ctx.setLineDash(belt.dash ? [2, 9] : []);
        ctx.strokeStyle = rgba(belt.color, (near ? 0.34 : 0.18) * k);
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          rx,
          ry,
          belt.rot,
          near ? -phi : Math.PI - phi,
          near ? Math.PI - phi : TAU - phi,
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Constellation line linking the stars of a linked belt.
        if (belt.link && !near) {
          ctx.strokeStyle = rgba(belt.color, 0.2 * k);
          ctx.beginPath();
          stars.forEach((star, i) => {
            const t = beltPhase[beltIndex][i];
            const x = cx + rx * Math.cos(t) * Math.cos(belt.rot) - ry * Math.sin(t) * Math.sin(belt.rot);
            const y = cy + rx * Math.cos(t) * Math.sin(belt.rot) + ry * Math.sin(t) * Math.cos(belt.rot);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.stroke();
        }

        ctx.globalCompositeOperation = "lighter";
        stars.forEach((star, i) => {
          const t = beltPhase[beltIndex][i];
          const front = Math.sin(t + phi) > 0;
          if (front !== near) return;
          const x = cx + rx * Math.cos(t) * Math.cos(belt.rot) - ry * Math.sin(t) * Math.sin(belt.rot);
          const y = cy + rx * Math.cos(t) * Math.sin(belt.rot) + ry * Math.sin(t) * Math.cos(belt.rot);
          const a = (near ? 0.5 : 0.2) * k;
          drawGlow(ctx, x, y, star.size * 8, belt.color, a * 0.8);
          ctx.fillStyle = rgba(WHITE, a);
          ctx.beginPath();
          ctx.arc(x, y, star.size, 0, TAU);
          ctx.fill();
        });
        ctx.globalCompositeOperation = "source-over";
      });
    };

    /**
     * `still` is the reduced-motion frame: one snapshot of the star field
     * with no planet, no shooting stars and no pointer swarm.
     */
    const render = (still = false) => {
      ctx.clearRect(0, 0, w, h);

      const k = appear;
      if (k > 0.004) {
        const rBase = Math.min(h * 0.36, w * 0.3);
        const base = Math.max(120, Math.min(rBase, 470));
        const R = base * (0.84 + 0.5 * progress);
        const cx = w + R * 0.04; /* only the visible half of the planet shows */
        const cy = h * 0.5;

        drawBelts(k, R, cx, cy, false);
        drawGlobe(k, R, cx, cy);
        drawBelts(k, R, cx, cy, true);
      }

      ctx.globalCompositeOperation = "lighter";
      drawSky();
      if (!still) drawShootingStars();
      ctx.globalCompositeOperation = "source-over";
      if (!still) drawSwarm();
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      time += dt;

      measureIn -= dt;
      if (measureIn <= 0) {
        measureIn = 1;
        measure();
      }

      // Scrolling makes everything rush; idle scroll lets it glide.
      const rawVelocity = Math.abs(scrollState.velocity);
      const target = 1 + (Number.isFinite(rawVelocity) ? Math.min(rawVelocity / 22, 3.2) : 0);
      boost += (target - boost) * Math.min(1, dt * 4);
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3.2);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3.2);

      const follow = 1 - Math.exp(-dt / 0.11);
      pointer.sx += (pointer.px - pointer.sx) * follow;
      pointer.sy += (pointer.py - pointer.sy) * follow;

      // Planet state: appear as Education scrolls in, then grow to the bottom.
      const y = scrollState.y;
      appear +=
        (clamp01((y - eduDocTop + h) / (h * 0.7)) - appear) * Math.min(1, dt * 3.4);
      progress = clamp01((y - (eduDocTop - h * 0.3)) / eduSpan);

      // A slow idle turn that picks up speed while the page moves.
      spin += (0.06 + (boost - 1) * 0.3) * dt;
      BELTS.forEach((belt, beltIndex) => {
        const phases = beltPhase[beltIndex];
        const stars = BELT_STARS[beltIndex];
        for (let i = 0; i < stars.length; i += 1) {
          phases[i] = stars[i].phase + time * belt.speed;
        }
      });

      const anchor = pointer.inside ? { x: pointer.sx, y: pointer.sy } : idleAnchor();
      const base = Math.min(w, h) * 0.26;
      for (const f of followers) {
        f.angle += f.spin * dt;
        const gx = anchor.x + Math.cos(f.angle) * f.radius * base;
        const gy = anchor.y + Math.sin(f.angle) * f.radius * base * 0.72;
        const a = 1 - Math.exp(-dt / f.tau);
        f.x += (gx - f.x) * a;
        f.y += (gy - f.y) * a;
        f.trail.push({ x: f.x, y: f.y });
        if (f.trail.length > f.tail) f.trail.shift();
      }

      nextShootingStar -= dt * boost;
      if (nextShootingStar <= 0) {
        spawnShootingStar();
        nextShootingStar = 2.2 + Math.random() * 3.2;
      }
      for (const m of shooters) {
        if (!m.active) continue;
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.life >= m.ttl || m.x < -80 || m.x > w + 80) m.active = false;
      }

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
      pointer.inside = true;
      pointer.tx = clamp((event.clientX / w) * 2 - 1);
      pointer.ty = clamp((event.clientY / h) * 2 - 1);
      pointer.px = event.clientX;
      pointer.py = event.clientY;
    };

    const onPointerGone = () => {
      pointer.inside = false;
      pointer.tx = 0;
      pointer.ty = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    resize();

    if (reduce) return () => resizeObserver.disconnect();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerGone);
    window.addEventListener("blur", onPointerGone);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerGone);
      window.removeEventListener("blur", onPointerGone);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [starCount, swarmCount]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
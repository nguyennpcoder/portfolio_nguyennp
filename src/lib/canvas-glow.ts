/**
 * Soft glow sprites, cached per colour.
 *
 * A radial-gradient fill rebuilt every frame is the single most expensive thing
 * the canvas decorations do (each `createRadialGradient` allocates). Baking the
 * gradient once into a small sprite and blitting it with `globalAlpha` is
 * visually identical and far cheaper, so the full-page field can afford its
 * star flares, comet trails and constellation glows at 120 fps.
 */

type RGB = readonly [number, number, number];

const SPRITE_SIZE = 96;
const sprites = new Map<string, HTMLCanvasElement | null>();

function glowSprite(color: RGB): HTMLCanvasElement | null {
  const key = color.join(",");
  const cached = sprites.get(key);
  if (cached !== undefined) return cached;

  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext("2d");
  if (!ctx) {
    sprites.set(key, null);
    return null;
  }

  const c = SPRITE_SIZE / 2;
  const [r, g, b] = color;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.36)`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  sprites.set(key, sprite);
  return sprite;
}

/** Blit a cached radial glow centred on (x, y) with the given radius. */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: RGB,
  alpha: number,
) {
  if (alpha <= 0.004 || radius <= 0) return;
  const sprite = glowSprite(color);
  if (!sprite) return;
  const previous = ctx.globalAlpha;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
  ctx.globalAlpha = previous;
}
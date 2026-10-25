import Image from "next/image";
import { profile } from "@/data/cv";
import { cn } from "@/lib/utils";

const SIZES = {
  /** Navbar — a compact badge next to the name. */
  sm: "size-9",
  /** Inline / list contexts. */
  md: "size-14",
  /** Hero profile panel. */
  lg: "size-20",
} as const;

/**
 * Portrait with a violet→azure gradient ring. The photo has a light
 * background, which reads as an intentional badge against the black canvas.
 *
 * The ring is the wrapper's own background showing through `p-0.5`, so the
 * gradient can never be hidden by the photo. `overflow-hidden` + `rounded-full`
 * on the wrapper guarantees that a mis-sized or non-square source is still
 * clipped to the circle instead of spilling past it.
 */
export function Avatar({
  size = "md",
  className,
  priority = false,
}: {
  size?: keyof typeof SIZES;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#b18cff,#8c45ff_45%,#3b3bff)] p-0.5",
        SIZES[size],
        className,
      )}
    >
      <Image
        src="/avatar.png"
        alt={`Portrait of ${profile.name}`}
        width={720}
        height={720}
        priority={priority}
        sizes="96px"
        className="block size-full rounded-full object-cover"
      />
    </span>
  );
}

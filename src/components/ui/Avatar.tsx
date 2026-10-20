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
      className={cn("relative grid shrink-0 place-items-center rounded-full p-0.5", SIZES[size], className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#b18cff,#8c45ff_45%,#3b3bff)]"
      />
      <Image
        src="/avatar.png"
        alt={`Portrait of ${profile.name}`}
        width={720}
        height={720}
        priority={priority}
        sizes="144px"
        className="relative size-full rounded-full object-cover"
      />
    </span>
  );
}
import { cn } from "@/lib/utils";

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "primary" | "accent";
}) {
  const tones = {
    neutral:
      "border-border bg-surface/70 text-muted-foreground hover:border-line-strong hover:text-foreground",
    primary: "border-transparent bg-primary-tint text-primary-text",
    accent: "border-transparent bg-accent/15 text-accent-text",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-3 py-1 text-xs font-medium transition-colors duration-200",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

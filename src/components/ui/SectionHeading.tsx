import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <span
        data-drift="16"
        className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-accent-text" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2
        data-drift="10"
        className="max-w-2xl font-display text-3xl leading-[1.08] tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem]"
      >
        {title}
      </h2>
      {description ? (
        <p
          data-drift="6"
          className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

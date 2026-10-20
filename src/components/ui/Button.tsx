"use client";

import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "soft";
type Size = "md" | "lg";

const base =
  "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary shadow-soft hover:bg-primary-hover hover:shadow-lift",
  ghost:
    "border border-border bg-surface/70 text-foreground backdrop-blur-sm hover:border-line-strong hover:bg-surface",
  soft: "bg-primary-tint text-primary-text hover:bg-primary/20",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
  /** Triggers a same-origin file download instead of a navigation. */
  download?: string;
  "aria-label"?: string;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  external,
  download,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    // `download` and `target="_blank"` are mutually exclusive intents.
    const linkTarget = external && !download ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        download={download}
        {...linkTarget}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

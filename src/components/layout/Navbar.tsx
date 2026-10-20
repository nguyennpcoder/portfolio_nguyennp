"use client";

import { useEffect, useState } from "react";
import { DownloadSimple, EnvelopeSimple, List, X } from "@phosphor-icons/react";
import { cv, navItems, profile } from "@/data/cv";
import { useActiveSection } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const NAV_IDS = navItems.map((item) => item.id) as readonly string[];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);
  const { scrollTo, stop, start } = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    if (open) {
      stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, stop, start]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "flex w-full max-w-6xl items-center justify-between gap-4 rounded-pill px-3 py-2.5 transition-all duration-300 md:px-4",
          scrolled ? "glass-strong" : "border border-transparent",
        )}
      >
        <button
          type="button"
          onClick={() => go("home")}
          className="group flex h-11 cursor-pointer items-center gap-2.5 rounded-pill pl-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar size="sm" priority className="transition-transform duration-300 group-hover:-rotate-6" />
          <span className="hidden font-display text-sm font-semibold tracking-[-0.01em] text-foreground sm:block">
            {profile.name}
          </span>
          {/* Name comes from the content, so the accessible name always contains
              the visible label (WCAG 2.5.3). */}
          <span className="sr-only">— back to top</span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative cursor-pointer rounded-pill px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "text-primary-text"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={cv.file}
            download={cv.fileName}
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-pill border border-border bg-surface/70 px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-line-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <DownloadSimple size={16} weight="bold" aria-hidden="true" />
            <span className="hidden md:inline">Download CV</span>
          </a>
          <button
            type="button"
            onClick={() => go("contact")}
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-pill bg-primary px-4 text-sm font-medium text-on-primary shadow-soft transition-all duration-200 hover:bg-primary-hover hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
          >
            <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
            Let&apos;s talk
          </button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-surface/70 text-foreground transition-colors duration-200 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "fixed inset-x-4 top-20 z-40 origin-top rounded-card p-2.5 lg:hidden",
          open ? "glass-strong" : "",
        )}
      >
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  "w-full cursor-pointer rounded-xl px-4 py-3 text-left text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active === item.id
                    ? "bg-primary-tint text-primary-text"
                    : "text-foreground hover:bg-surface-muted",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex gap-2 px-1 pb-1">
          <a
            href={cv.file}
            download={cv.fileName}
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-pill border border-border bg-surface text-sm font-medium text-foreground"
          >
            <DownloadSimple size={16} weight="bold" aria-hidden="true" />
            CV
          </a>
          <button
            type="button"
            onClick={() => go("contact")}
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-pill bg-primary text-sm font-medium text-on-primary"
          >
            <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
            Contact
          </button>
        </div>
      </div>
    </header>
  );
}

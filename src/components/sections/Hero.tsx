"use client";

import { useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { cv, profile, skillGroups, stats } from "@/data/cv";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { OrbitField } from "@/components/ui/OrbitField";

const HERO_STACK = ["Java 17", "Spring Boot 3", "React", "Next.js 14", "Kafka", "Redis"];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      let removeTilt: (() => void) | undefined;

      if (prefersReducedMotion()) return;

      const heading = headingRef.current;

      // Masked word reveal for the headline, once fonts have settled.
      let split: SplitText | null = null;
      let cancelled = false;
      const runSplit = () => {
        if (cancelled || !heading) return;
        split = new SplitText(heading, { type: "lines,words", linesClass: "overflow-hidden" });
        // Mask reveal only — no opacity fade, so the first viewport is never
        // rendered at reduced contrast while animating in.
        gsap.from(split.words, {
          yPercent: 115,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.035,
          delay: 0.1,
        });
      };

      if (document.fonts?.status === "loaded") runSplit();
      else document.fonts?.ready.then(runSplit);

      // Entrance for the supporting copy and panel. Transform-only for the same
      // reason as above: text keeps its final, audited colour from frame one.
      gsap.from("[data-hero-fade]", {
        y: 18,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.35,
      });

      // Parallax on decorative layers only — never on text.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((layer) => {
        const speed = Number(layer.dataset.parallax) || 10;
        gsap.to(layer, {
          yPercent: speed,
          xPercent: speed * 0.35,
          scale: 1 + Math.abs(speed) / 120,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      // Hero settles away as you scroll past it: transform only, so the copy
      // keeps its audited colour and contrast at every scroll position.
      const exit = rootRef.current?.querySelector<HTMLElement>("[data-hero-exit]");
      if (exit) {
        gsap.to(exit, {
          y: -56,
          scale: 0.985,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom 45%",
            scrub: 0.9,
          },
        });
      }

      // Pointer tilt on the profile panel — a small 3D lean that follows the
      // cursor and eases back to rest, matching the orbit field inside it.
      const tilt = rootRef.current?.querySelector<HTMLElement>("[data-tilt]");
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (tilt && finePointer) {
        gsap.set(tilt, { transformPerspective: 1100, transformOrigin: "50% 50%" });
        const toX = gsap.quickTo(tilt, "rotationX", { duration: 0.75, ease: "power3.out" });
        const toY = gsap.quickTo(tilt, "rotationY", { duration: 0.75, ease: "power3.out" });
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));

        const onMove = (event: PointerEvent) => {
          const rect = tilt.getBoundingClientRect();
          const near =
            event.clientX > rect.left - 180 &&
            event.clientX < rect.right + 180 &&
            event.clientY > rect.top - 180 &&
            event.clientY < rect.bottom + 180;
          if (!near) {
            toX(0);
            toY(0);
            return;
          }
          const nx = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
          const ny = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
          toY(nx * 5);
          toX(ny * -4);
        };
        const onLeaveWindow = () => {
          toX(0);
          toY(0);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeaveWindow);
        removeTilt = () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
        };
      }

      return () => {
        cancelled = true;
        split?.revert();
        removeTilt?.();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pb-20 pt-32 md:px-8 md:pt-36"
    >
      {/* Deep-space stage bleeding edge to edge: tilted 3D orbits and their
          meteors, scroll-reactive speed (see ui/OrbitField). Stars, shooting
          stars and the pointer-following swarm live in the site-wide
          CosmicField instead, so they cover the whole page rather than just
          this banner. `w-screen` + `left-1/2` escapes the max-w content
          column so the orbits truly span the whole viewport. */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-20 w-screen -translate-x-1/2">
        <OrbitField className="size-full" />
      </div>
      {/* Vignette + text-side scrim keep every label on a dark, auditable
          background (WCAG AA) while the scene stays full-bleed. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[radial-gradient(130%_100%_at_50%_46%,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.4)_66%,rgba(0,0,0,0.72)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.44)_16%,rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.16)_58%,rgba(0,0,0,0.4)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-44 w-screen -translate-x-1/2 bg-gradient-to-b from-transparent to-background"
      />

      {/* Decorative background layers */}
      <div
        data-parallax="18"
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 -z-10 size-72 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        data-parallax="-12"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-40 -z-10 size-80 rounded-full bg-accent/25 blur-3xl"
      />

      <div data-hero-exit className="grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col items-start">
          <span
            data-hero-fade
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface/70 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-primary/50" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Open to fullstack opportunities
          </span>

          <h1
            ref={headingRef}
            className="mt-6 font-display text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground"
          >
            {profile.name}
          </h1>

          <p
            data-hero-fade
            className="mt-4 font-display text-xl font-medium tracking-[-0.01em] text-muted-foreground md:text-2xl"
          >
            <span className="text-accent-gradient">{profile.role}</span> — building fintech-scale
            web systems end-to-end.
          </p>

          <p
            data-hero-fade
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Java 17 / Spring Boot 3 on the backend, React &amp; Next.js on the frontend. Secure
            REST APIs, event-driven architecture with Kafka and Redis, and multi-gateway payments.
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => scrollTo("#projects")}>
              View projects
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="ghost" href={cv.file} download={cv.fileName}>
              <DownloadSimple size={18} weight="bold" aria-hidden="true" />
              Download CV
            </Button>
          </div>

          <ul data-hero-fade className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <li>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary-text"
              >
                <GithubLogo size={18} weight="bold" aria-hidden="true" />
                {profile.githubHandle}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary-text"
              >
                <LinkedinLogo size={18} weight="bold" aria-hidden="true" />
                {profile.linkedinHandle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary-text"
              >
                <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
                {profile.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin size={18} weight="bold" aria-hidden="true" />
              {profile.location}
            </li>
          </ul>
        </div>

        {/* Profile panel */}
        <div data-hero-fade className="relative" data-tilt>
          <div className="glass rounded-card p-6 md:p-7">
            <div className="flex items-center gap-4">
              <Avatar size="lg" priority />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-semibold text-foreground">
                  {profile.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Core stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {HERO_STACK.map((item) => (
                  <Chip key={item} tone="primary">
                    {item}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.slice(0, 2).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-surface/70 p-4"
                >
                  <p className="font-display text-2xl font-semibold text-foreground">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/70 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} weight="bold" aria-hidden="true" />
                {profile.phone}
              </div>
              <a
                href={`tel:${profile.phoneHref}`}
                className="inline-flex items-center gap-1 rounded-pill bg-primary-tint px-3 py-1.5 text-xs font-medium text-primary-text transition-colors duration-200 hover:bg-primary/20"
              >
                Call
                <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 pl-1 text-xs text-muted-foreground">
            <ArrowDown size={14} weight="bold" aria-hidden="true" />
            {skillGroups.length} skill areas · scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}

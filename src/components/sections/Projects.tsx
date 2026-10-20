"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  GithubLogo,
  LockKey,
  Sparkle,
} from "@phosphor-icons/react";
import { projects } from "@/data/cv";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";

export function Projects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      // Horizontal scroll-pin on desktop; plain vertical stack on small screens
      // and a static layout under reduced motion.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 64);

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: pinRef },
  );

  return (
    <section id="projects" className="py-24 md:py-32 lg:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Five production projects, end-to-end."
            description="Booking platforms, e-commerce stacks and service scheduling — backend, frontend and deployment."
          />
        </Reveal>
        <Reveal className="hidden shrink-0 lg:block">
          <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface/70 px-4 py-2 text-xs text-muted-foreground">
            <Sparkle size={14} weight="bold" className="text-accent-text" aria-hidden="true" />
            Scroll to move through projects
          </span>
        </Reveal>
      </div>

      {/* Pinned horizontal track (desktop) / vertical stack (mobile) */}
      <div
        ref={pinRef}
        className="mt-10 lg:mt-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden"
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-5 px-6 md:px-8 lg:w-max lg:flex-row lg:items-stretch lg:gap-6"
        >
          {projects.map((project, index) => (
            <TiltCard
              key={project.slug}
              className="lg:w-[min(78vw,420px)] lg:shrink-0"
              max={4}
            >
              <article className="group/article flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface/85 shadow-soft backdrop-blur-sm transition-shadow duration-300 hover:shadow-lift">
                {/* Representative screenshot for the project. Height follows the viewport
                    so the whole card always fits inside the pinned full-height band. */}
                <div className="relative h-[clamp(8rem,17svh,11rem)] shrink-0 overflow-hidden border-b border-border">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, 92vw"
                    className="object-cover object-top opacity-85 transition-all duration-700 ease-out group-hover/article:scale-[1.04] group-hover/article:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-pill bg-primary-tint px-3 py-1 font-mono text-[11px] text-primary-text">
                      {project.period}
                    </span>
                  </div>

                  <h3 className="mt-3.5 font-display text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                    {project.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-primary-text">
                    {project.role}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Chip key={tag} tone="primary">
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="my-3.5 hairline" />

                  <ul className="flex flex-col gap-2.5">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-2.5 text-[13px] leading-[1.55] text-muted-foreground lg:text-[13.5px]"
                      >
                        <Check
                          size={15}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-primary-text"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Source + live deployment */}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.repos.map((repo) => (
                        <a
                          key={repo.url}
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-line-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <GithubLogo size={14} weight="bold" aria-hidden="true" />
                          {repo.label}
                          <span className="sr-only">repository on GitHub</span>
                        </a>
                      ))}
                      {project.repos.length === 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          <LockKey size={14} weight="bold" aria-hidden="true" />
                          Private repository
                        </span>
                      ) : null}
                    </div>

                    {project.demo ? (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Live demo
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}

          {/* End card */}
          <div className="flex lg:w-[min(56vw,320px)] lg:shrink-0">
            <div className="ring-gradient flex w-full flex-col items-start justify-center gap-5 rounded-card p-8">
              <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
                Want the full story?
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every project ships with a Spring Boot backend, secure auth and a modern frontend.
                Let&apos;s talk about the one closest to your team.
              </p>
              <Button onClick={() => scrollTo("#contact")}>
                Get in touch
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

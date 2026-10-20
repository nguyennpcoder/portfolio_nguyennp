"use client";

import { useRef } from "react";
import { Certificate, GraduationCap } from "@phosphor-icons/react";
import { certificates, education } from "@/data/cv";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Entry = {
  kind: "Education" | "Certificate";
  org: string;
  detail: string;
  period: string;
};

const ENTRIES: Entry[] = [
  ...education.map((item) => ({ kind: "Education" as const, ...item })),
  ...certificates.map((item) => ({ kind: "Certificate" as const, ...item })),
];

export function Education() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const line = lineRef.current;
      const wrap = wrapRef.current;
      if (!line || !wrap) return;
      if (prefersReducedMotion()) {
        gsap.set(line, { scaleY: 1 });
        return;
      }

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: wrap,
            start: "top 72%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: wrapRef },
  );

  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Education & certificates"
          title="Foundations, then hands-on training."
        />
      </Reveal>

      <div ref={wrapRef} className="relative mt-12 pl-10 sm:pl-12">
        <span className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-border sm:left-[17px]" aria-hidden="true">
          <span ref={lineRef} className="absolute inset-0 block origin-top bg-gradient-to-b from-primary to-accent" />
        </span>

        <Reveal stagger={0.12} className="flex flex-col gap-8">
          {ENTRIES.map((entry) => {
            const Icon = entry.kind === "Education" ? GraduationCap : Certificate;
            return (
              <article key={`${entry.kind}-${entry.org}`} className="relative">
                <span className="absolute -left-10 top-4 grid size-7 place-items-center rounded-full border border-border bg-surface text-primary-text sm:-left-12 sm:size-9">
                  <Icon size={16} weight="bold" aria-hidden="true" />
                </span>
                <div className="rounded-card border border-border bg-surface/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft sm:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-pill bg-primary-tint px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-primary-text">
                      {entry.kind}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{entry.period}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                    {entry.org}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.detail}</p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

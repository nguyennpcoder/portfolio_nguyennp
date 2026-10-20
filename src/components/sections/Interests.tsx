"use client";

import { AirplaneTilt, Article, BookOpen } from "@phosphor-icons/react";
import { interests } from "@/data/cv";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICONS = {
  book: BookOpen,
  plane: AirplaneTilt,
  article: Article,
} as const;

export function Interests() {
  return (
    <section id="interests" className="mx-auto max-w-6xl px-6 pb-8 md:px-8">
      <Reveal
        data-scale="0.97"
        className="flex flex-col gap-8 rounded-card border border-border bg-surface/60 p-8 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-10"
      >
        <SectionHeading
          eyebrow="Interests"
          title="Outside the editor."
          className="max-w-md"
        />
        <ul className="flex flex-wrap gap-3">
          {interests.map((interest) => {
            const Icon = ICONS[interest.icon];
            return (
              <li
                key={interest.label}
                className="inline-flex items-center gap-2.5 rounded-pill border border-border bg-surface/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-line-strong hover:text-primary-text"
              >
                <Icon size={18} weight="bold" className="text-primary-text" aria-hidden="true" />
                {interest.label}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

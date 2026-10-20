"use client";

import {
  Browser,
  Cloud,
  Code,
  CreditCard,
  Database,
  HardDrives,
  LockKey,
  Stack,
} from "@phosphor-icons/react";
import type { SkillGroup } from "@/data/cv";
import { skillGroups } from "@/data/cv";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Chip } from "@/components/ui/Chip";

const ICONS: Record<SkillGroup["icon"], typeof Code> = {
  code: Code,
  server: HardDrives,
  stack: Stack,
  browser: Browser,
  database: Database,
  lock: LockKey,
  credit: CreditCard,
  cloud: Cloud,
};

const MARQUEE_ITEMS = [
  "Java",
  "TypeScript",
  "Spring Boot 3",
  "Spring Security",
  "Hibernate",
  "Apache Kafka",
  "Redis",
  "MySQL",
  "PostgreSQL",
  "React",
  "Next.js 14",
  "Angular 17",
  "Redux Toolkit",
  "RxJS",
  "Tailwind CSS",
  "Docker",
  "WebSocket",
  "JWT / OAuth2",
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative border-y border-border/70 bg-background-subtle/60 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Technical skills"
            title="A fullstack toolkit for production systems."
            description="Eight areas spanning backend, frontend, data, security, payments and delivery."
          />
        </Reveal>

        <Reveal stagger={0.06} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = ICONS[group.icon];
            return (
              <article
                key={group.id}
                className="group flex flex-col rounded-card border border-border bg-surface/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                    <Icon size={20} weight="bold" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {group.label}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
                {group.note ? (
                  <p className="mt-auto pt-3 text-xs leading-relaxed text-muted-foreground">
                    {group.note}
                  </p>
                ) : null}
              </article>
            );
          })}
        </Reveal>
      </div>

      <div className="mt-14">
        <Marquee duration={42}>
          {MARQUEE_ITEMS.map((item) => (
            <span
              key={item}
              className="mx-3 inline-flex items-center gap-3 font-display text-2xl font-medium tracking-[-0.01em] text-muted-foreground md:text-3xl"
            >
              {item}
              <span className="size-1.5 rounded-full bg-accent-text" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

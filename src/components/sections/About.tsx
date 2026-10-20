"use client";

import { CheckCircle, Lightning, LockKey, PlugsConnected, Broadcast } from "@phosphor-icons/react";
import { profile, stats } from "@/data/cv";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";

const PILLARS = [
  {
    icon: LockKey,
    title: "Secure APIs",
    body: "JWT, OAuth2 / OIDC and RBAC designed into every REST layer.",
  },
  {
    icon: Broadcast,
    title: "Event-driven",
    body: "Kafka and Redis keep throughput high and load off the database.",
  },
  {
    icon: PlugsConnected,
    title: "Multi-gateway payments",
    body: "VNPay, MoMo, ZaloPay and SePay with async transaction handling.",
  },
  {
    icon: Lightning,
    title: "Real-time UI",
    body: "WebSocket (STOMP/SockJS) interfaces with SSR and SEO in mind.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionHeading
              eyebrow="About me"
              title="Owning features from schema to shipped UI."
            />
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle size={18} weight="fill" className="text-primary-text" aria-hidden="true" />
              Clean, maintainable, testable code
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal>
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl md:leading-relaxed">
              {profile.about}
            </p>
          </Reveal>

          <Reveal stagger={0.08} className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-card border border-border bg-surface/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft"
              >
                <span className="grid size-10 place-items-center rounded-full bg-primary-tint text-primary-text transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                  <pillar.icon size={20} weight="bold" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface/80 p-5">
                  <p className="font-display text-3xl font-semibold tracking-[-0.02em] text-primary-text">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

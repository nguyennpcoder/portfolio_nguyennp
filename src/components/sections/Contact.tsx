"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { cv, profile } from "@/data/cv";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — the mailto link is always there as a fallback.
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-4 pt-16 md:px-8 md:pt-24">
      <div data-scale="0.975" className="glass overflow-hidden rounded-card p-8 md:p-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <Reveal>
              <SectionHeading
                eyebrow="Contact"
                title="Let's build something reliable."
                description="Open to fullstack roles and freelance work. Reach out and I'll reply quickly."
              />
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" href={`mailto:${profile.email}`}>
                <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
                Send an email
              </Button>
              <Button size="lg" variant="ghost" href={cv.file} download={cv.fileName}>
                <DownloadSimple size={18} weight="bold" aria-hidden="true" />
                Download CV
              </Button>
            </Reveal>
          </div>

          <Reveal stagger={0.08} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-card border border-border bg-surface/80 p-5 text-left transition-colors duration-300 hover:border-line-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text">
                  <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">
                    {profile.email}
                  </span>
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                  copied
                    ? "border-primary-text/40 bg-primary/15 text-primary-text"
                    : "border-border text-muted-foreground group-hover:text-primary-text",
                )}
              >
                {copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              </span>
            </button>

            <a
              href={`tel:${profile.phoneHref}`}
              className="flex items-center gap-3 rounded-card border border-border bg-surface/80 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text">
                <Phone size={18} weight="bold" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Phone
                </span>
                <span className="block text-sm font-medium text-foreground">{profile.phone}</span>
              </span>
            </a>

            <div className="flex items-center gap-3 rounded-card border border-border bg-surface/80 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text">
                <MapPin size={18} weight="bold" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Location
                </span>
                <span className="block text-sm font-medium text-foreground">
                  {profile.location}
                </span>
              </span>
            </div>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface/80 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text">
                  <GithubLogo size={18} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    GitHub
                  </span>
                  <span className="block text-sm font-medium text-foreground">
                    {profile.githubHandle}
                  </span>
                </span>
              </span>
              <ArrowUpRight size={18} weight="bold" className="text-muted-foreground" aria-hidden="true" />
            </a>

            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface/80 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary-text">
                  <LinkedinLogo size={18} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    LinkedIn
                  </span>
                  <span className="block text-sm font-medium text-foreground">
                    {profile.linkedinHandle}
                  </span>
                </span>
              </span>
              <ArrowUpRight size={18} weight="bold" className="text-muted-foreground" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Copy confirmation — one status region, announced exactly once. */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "glass-strong pointer-events-none fixed bottom-6 left-1/2 z-70 -translate-x-1/2 rounded-pill px-4 py-2 text-sm font-medium text-foreground transition-all duration-300",
          copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        {copied ? "Email copied to clipboard" : null}
      </div>
    </section>
  );
}

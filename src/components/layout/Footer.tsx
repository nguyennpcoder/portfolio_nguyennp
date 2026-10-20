import { GithubLogo, LinkedinLogo, EnvelopeSimple, MapPin } from "@phosphor-icons/react/dist/ssr";
import { navItems, profile } from "@/data/cv";
import { Avatar } from "@/components/ui/Avatar";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70">
      {/* pb-24 keeps the last row clear of the fixed BackToTop button. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-14 pb-24 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm" />
              <span className="font-display text-base font-semibold text-foreground">
                {profile.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {profile.role} building reliable, fintech-scale web systems end-to-end.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} weight="bold" className="text-primary-text" aria-hidden="true" />
              {profile.location}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Sections
            </span>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground transition-colors duration-200 hover:text-primary-text"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Elsewhere
            </span>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary-text"
            >
              <GithubLogo size={18} weight="bold" aria-hidden="true" />
              github.com/{profile.githubHandle}
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary-text"
            >
              <LinkedinLogo size={18} weight="bold" aria-hidden="true" />
              linkedin.com/in/{profile.linkedinHandle}
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary-text"
            >
              <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </div>

        <div className="hairline" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono">
            Built with Next.js, Tailwind CSS &amp; GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}

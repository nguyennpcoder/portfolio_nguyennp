import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { education, profile } from "@/data/cv";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CosmicField } from "@/components/ui/CosmicField";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Absolute origin used to resolve open-graph asset URLs. Set
 *  NEXT_PUBLIC_SITE_URL at deploy time (static export, so it is baked in). */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nguyen Phuoc Nguyen — Fullstack Developer",
  description:
    "Fullstack Developer building production-grade web apps with Java 17 / Spring Boot 3, React, Next.js and Angular. Secure REST APIs, Kafka & Redis, and multi-gateway payments.",
  keywords: [
    "Nguyen Phuoc Nguyen",
    "Fullstack Developer",
    "Spring Boot",
    "Java",
    "React",
    "Next.js",
    "Angular",
    "Kafka",
    "Redis",
    "Portfolio",
  ],
  authors: [{ name: "Nguyen Phuoc Nguyen" }],
  creator: "Nguyen Phuoc Nguyen",
  openGraph: {
    title: "Nguyen Phuoc Nguyen — Fullstack Developer",
    description:
      "Java 17 / Spring Boot 3 backend, React & Next.js frontend. Secure APIs, event-driven architecture and multi-gateway payments.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/avatar.png", width: 720, height: 720, alt: profile.name }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/** Schema.org Person — lets search engines build a rich result. */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: profile.githubUrl,
  sameAs: [profile.githubUrl, profile.linkedinUrl],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
  },
  alumniOf: education.map((entry) => ({
    "@type": "CollegeOrUniversity",
    name: entry.org,
  })),
  knowsAbout: [
    "Java",
    "Spring Boot",
    "TypeScript",
    "React",
    "Next.js",
    "Angular",
    "Apache Kafka",
    "Redis",
    "REST API",
    "OAuth2",
    "WebSocket",
    "Docker",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <div className="ambient-canvas" aria-hidden="true" />
        {/* Site-wide deep space: star field + pointer-chasing swarm everywhere,
            and the half planet from the Education section down. */}
        <CosmicField />
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-primary"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </body>
    </html>
  );
}

/**
 * Static portfolio content — transcribed verbatim from the CV.
 * No network, no CMS: this file is the single source of truth.
 */

/** A source repository split by side of the stack (frontend / backend). */
export type RepoLink = {
  label: string;
  url: string;
};

export type Project = {
  slug: string;
  name: string;
  role: string;
  period: string;
  tags: string[];
  highlights: string[];
  /** Card banner. Optimized screenshots live in `public/projects/`. */
  image: {
    src: string;
    alt: string;
  };
  /** Empty when the source is private. */
  repos: RepoLink[];
  /** Live deployment, when the project has one. */
  demo?: string;
};

export const profile = {
  name: "Nguyen Phuoc Nguyen",
  shortName: "Nguyen Phuoc Nguyen",
  role: "Fullstack Developer",
  location: "Ho Chi Minh, Vietnam",
  email: "nguyennpcoder@gmail.com",
  phone: "(+84) 393 204 904",
  phoneHref: "+84393204904",
  githubHandle: "nguyennpcoder",
  githubUrl: "https://github.com/nguyennpcoder",
  linkedinHandle: "nguyennp-coder",
  linkedinUrl: "https://www.linkedin.com/in/nguyennp-coder/",
  handle: "nguyennpcoder",
  about:
    "Full-Stack Developer building end-to-end web applications with Java 17 / Spring Boot 3 on the backend and React, Next.js 14, and Angular 17 on the frontend. Strongest in secure REST API design (JWT / OAuth2, RBAC), event-driven services with Kafka and Redis, and multi-gateway payment integrations (VNPay, MoMo, ZaloPay, SePay). Owns a feature from database schema and API design through to SSR/SEO UI and Docker-based deployment, including real-time functionality over WebSocket (STOMP/SockJS).",
} as const;

export type SkillGroup = {
  id: string;
  label: string;
  icon: "code" | "server" | "stack" | "browser" | "database" | "lock" | "credit" | "cloud";
  items: string[];
  /** Optional footnote for cards whose detail does not fit in a chip. */
  note?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    icon: "code",
    items: ["Java", "TypeScript", "JavaScript", "SQL"],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "server",
    items: [
      "Spring Boot 3",
      "Spring MVC",
      "Spring Data JPA / Hibernate",
      "Spring Security",
      "Spring AOP",
      "REST APIs",
      "WebSocket (STOMP/SockJS)",
      "Apache Kafka",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    icon: "browser",
    items: [
      "React.js",
      "Next.js 14",
      "Angular 17",
      "Redux Toolkit",
      "RxJS",
      "Tailwind CSS",
      "Ant Design",
      "Bootstrap",
      "SSR & SEO",
      "Responsive / mobile-first UI",
    ],
  },
  {
    id: "database",
    label: "Data & Caching",
    icon: "database",
    items: ["MySQL", "PostgreSQL", "Redis", "Flyway (schema migrations)"],
  },
  {
    id: "auth",
    label: "Authentication & Security",
    icon: "lock",
    items: [
      "JWT",
      "OAuth2 / OIDC",
      "RBAC",
      "SMS & email verification",
      "Checksum validation",
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: "credit",
    items: ["VNPay", "MoMo", "ZaloPay", "SePay"],
    note: "Multi-gateway integration, async transaction handling",
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    icon: "cloud",
    items: [
      "Docker",
      "Docker Compose",
      "Git / GitHub",
      "Swagger / OpenAPI",
      "Vite",
      "Bruno",
      "Figma",
    ],
  },
  {
    id: "core",
    label: "Core CS",
    icon: "stack",
    items: ["Data Structures", "Algorithms", "System Design"],
  },
];

export const projects: Project[] = [
  {
    slug: "airbnb-booking-platform",
    name: "Airbnb Booking Platform",
    role: "Fullstack Developer",
    period: "Sep 2025 – Jan 2026",
    tags: ["Spring Boot 3", "Next.js 14", "WebSocket", "JWT", "Payments"],
    highlights: [
      "Built an end-to-end homestay booking platform: a Spring Boot 3 REST API with secure authentication and a server-rendered Next.js 14 frontend optimised for SEO.",
      "Delivered real-time messaging and booking notifications over WebSocket (STOMP) and SockJS.",
      "Implemented booking and scheduling logic with availability conflict detection and automated status updates — the most complex piece of the system.",
      "Integrated four payment gateways (VNPay, MoMo, ZaloPay, SePay) with QR check-in and analytics dashboards.",
      "Secured the API with Spring Security, JWT, RBAC, SMS verification, and email confirmation.",
    ],
    image: {
      src: "/projects/airbnb.jpg",
      alt: "Homestay booking homepage listing stays in Hanoi, Da Lat and Vung Tau with nightly prices and guest ratings",
    },
    repos: [
      {
        label: "Frontend",
        url: "https://github.com/nguyennpcoder/airbnb-homestay-frontend",
      },
      {
        label: "Backend",
        url: "https://github.com/nguyennpcoder/airbnb-homestay-backend",
      },
    ],
    demo: "https://airbnb-homestay-frontend.vercel.app/",
  },
  {
    slug: "audi-service-booking",
    name: "Audi Service Booking",
    role: "Fullstack Developer",
    period: "Apr 2025 – Oct 2025",
    tags: ["Spring Boot 3", "Spring Data JPA / Hibernate", "React (Vite)", "MySQL", "Redis"],
    highlights: [
      "Built the backend service with Spring Boot 3, MySQL, and Redis, including checksum validation and asynchronous transaction handling.",
      "Built a React (Vite) frontend with a real-time scheduling interface covering slot management and conflict detection.",
      "Automated PDF invoice generation and revenue dashboard reporting.",
      "Integrated VNPay, MoMo, and ZaloPay checkout flows plus a customer-support chat.",
      "Implemented RBAC authentication using Spring Security and JWT.",
    ],
    image: {
      src: "/projects/audi.jpg",
      alt: "Audi Vietnam landing page hero showing a 2023 Audi RS e-tron GT with power, battery and acceleration figures",
    },
    repos: [
      { label: "Frontend", url: "https://github.com/nguyennpcoder/AudiFE" },
      { label: "Backend", url: "https://github.com/nguyennpcoder/AudiBE" },
    ],
    demo: "https://audivn.web.app/",
  },
  {
    slug: "apple-clone-ecommerce",
    name: "Apple-Style E-commerce Storefront",
    role: "Fullstack Developer",
    period: "Aug 2024 – Dec 2024",
    tags: ["Spring Boot", "React (Vite)", "OAuth2 / OIDC", "Redis", "Docker"],
    highlights: [
      "Built a full e-commerce stack — Spring Boot backend and React (Vite) storefront — with reusable components shared across product, cart, and checkout flows.",
      "Reduced database load by caching product retrieval in Redis.",
      "Containerised the stack with Docker and Docker Compose for consistent environments.",
      "Secured authentication with Spring Security, JWT, OAuth2 / OIDC, and RBAC.",
    ],
    image: {
      src: "/projects/apple.jpg",
      alt: "Apple Store clone with product category icons and a grid of the latest iPhone, iPad and Apple Watch cards",
    },
    // Source lives in private repositories — only the live deployment is public.
    repos: [],
    demo: "https://host-apple.web.app/",
  },
  {
    slug: "book-views-online",
    name: "Book Views Online (E-commerce)",
    role: "Backend Developer",
    period: "Apr 2024 – Aug 2024",
    tags: ["Spring Boot 3", "Angular 17 SSR", "Apache Kafka", "Redis", "Flyway"],
    highlights: [
      "Designed an event-driven architecture with Apache Kafka and Redis caching, cutting database load and raising throughput on the ordering flow.",
      "Built a scalable e-commerce platform on Spring Boot 3 (Java 17) with an Angular 17 SSR frontend for performance and SEO.",
      "Managed MySQL schema migrations with Flyway and documented REST APIs with OpenAPI (Swagger).",
      "Implemented JWT / OAuth2 authentication with Spring Security and RBAC.",
    ],
    image: {
      src: "/projects/bookview.jpg",
      alt: "Book Views Online sign-in screen with phone and password fields on a green background",
    },
    repos: [
      { label: "Frontend", url: "https://github.com/nguyennpcoder/BookOnlineFE" },
      { label: "Backend", url: "https://github.com/nguyennpcoder/BookOnlineBE" },
    ],
    demo: "https://book-online-fe.vercel.app/",
  },
  {
    slug: "vti-store-b2c",
    name: "VTI Store (B2C E-commerce)",
    role: "Fullstack Developer",
    period: "Jun 2023 – Feb 2024",
    tags: ["Spring Boot", "React 18", "OAuth2", "Redis", "MySQL", "Flyway", "Docker"],
    highlights: [
      "Built a B2C e-commerce application end-to-end: a Spring Boot backend and a React 18 storefront covering product browsing, checkout, and order processing.",
      "Integrated REST APIs with Redis-backed caching to speed up product search.",
      "Managed MySQL migrations with Flyway and containerised environments with Docker.",
      "Implemented authentication with Spring Security, JWT, OAuth2, and RBAC.",
    ],
    image: {
      src: "/projects/vti.jpg",
      alt: "VTI Shop storefront with a gaming laptop hero banner, search bar and category navigation",
    },
    repos: [
      { label: "Frontend", url: "https://github.com/nguyennpcoder/VTI_Store-Frontend" },
      { label: "Backend", url: "https://github.com/nguyennpcoder/VTI_Store-Backend" },
    ],
  },
];

export const education = [
  {
    org: "Saigon Technology University",
    detail: "Information Technology",
    period: "Oct 2020 – Nov 2024",
  },
];

export const certificates = [
  {
    org: "VTI Academy",
    detail: "Fullstack web",
    period: "Jun 2023 – Feb 2024",
  },
];

export const interests = [
  { label: "Reading", icon: "book" as const },
  { label: "Traveling", icon: "plane" as const },
  { label: "Topical blogs & research", icon: "article" as const },
];

/** Small, CV-derived facts — no invented metrics. */
export const stats = [
  { value: 5, suffix: "", label: "Full-stack projects" },
  { value: 4, suffix: "", label: "Payment gateways integrated" },
  { value: 8, suffix: "", label: "Skill areas" },
  { value: 4, suffix: "", label: "Years of IT study" },
];

/** The CV PDF lives in `public/` so it ships with the static export. */
export const cv = {
  file: "/CV_NguyenPhuocNguyen_FullstackDeveloper.pdf",
  fileName: "CV_NguyenPhuocNguyen_FullstackDeveloper.pdf",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

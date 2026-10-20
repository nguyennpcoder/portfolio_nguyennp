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
    "Fullstack Developer with hands-on experience building 5+ production-grade web applications end-to-end using Java 17 / Spring Boot 3 on the backend and React, Next.js 14, and Angular 17 on the frontend. Skilled in designing secure REST APIs (JWT/OAuth2, RBAC), event-driven architectures with Kafka and Redis, and multi-gateway payment integrations (VNPay, MoMo, ZaloPay, SePay), alongside responsive SSR/SEO UIs and real-time interfaces over WebSocket. Comfortable owning features from database schema and API design through to UI and production deployment. Passionate about clean, maintainable, testable code and building reliable systems for fintech-scale workloads.",
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
      "REST API",
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
      "Ant Design",
      "Tailwind CSS",
      "Bootstrap",
      "SSR & SEO",
      "Responsive / mobile-first UI",
      "Real-time UI (WebSocket)",
    ],
  },
  {
    id: "database",
    label: "Database & Caching",
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
      "SMS / email verification",
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
    items: ["Data Structures", "Algorithms", "System Design", "RESTful Architecture"],
  },
];

export const projects: Project[] = [
  {
    slug: "airbnb-booking-platform",
    name: "Airbnb Booking Platform",
    role: "Fullstack Developer",
    period: "Sep 2025 – Jan 2026",
    tags: ["Next.js 14", "Spring Boot 3", "WebSocket", "Payments"],
    highlights: [
      "Built an end-to-end booking platform with a Spring Boot 3 (Java 17) REST API and a responsive Next.js 14 frontend with SSR and SEO optimization.",
      "Designed secure authentication and RBAC using Spring Security, JWT, SMS verification, and email confirmation.",
      "Implemented real-time messaging and booking notifications via WebSocket (STOMP) and SockJS.",
      "Integrated multi-gateway payments (VNPay, MoMo, ZaloPay, SePay), QR check-in, and analytics dashboards.",
      "Developed booking/scheduling logic with availability conflict detection and automated status updates.",
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
    tags: ["Spring Boot 3", "React (Vite)", "MySQL", "Redis"],
    highlights: [
      "Developed the backend with Spring Boot 3, Spring Data JPA/Hibernate, MySQL, and Redis, with secure checksum validation and async transaction handling.",
      "Built the frontend with React (Vite), including a real-time scheduling interface with conflict detection and slot management.",
      "Implemented RBAC authentication using Spring Security and JWT.",
      "Integrated VNPay, MoMo, and ZaloPay checkout flows and a customer-support chat feature.",
      "Automated PDF invoice generation and revenue dashboard reporting.",
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
    name: "Apple Clone (E-commerce)",
    role: "Fullstack Developer",
    period: "Aug 2024 – Dec 2024",
    tags: ["Spring Boot", "React (Vite)", "OAuth2", "Redis", "Docker"],
    highlights: [
      "Built a full e-commerce stack with a Spring Boot backend and a React (Vite) storefront following a scalable, maintainable component architecture.",
      "Implemented secure authentication with Spring Security, JWT, OAuth2 OIDC, and RBAC.",
      "Optimized product retrieval and page performance using Redis caching to reduce database load.",
      "Containerized the stack with Docker and Docker Compose for consistent deployment environments.",
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
    tags: ["Angular 17", "Spring Boot 3", "Kafka", "Flyway"],
    highlights: [
      "Built a scalable e-commerce platform with Spring Boot 3 (Java 17) and Angular 17 SSR for performance and SEO.",
      "Implemented JWT/OAuth2 authentication with Spring Security and RBAC.",
      "Designed an event-driven architecture with Apache Kafka and Redis caching to reduce database load and improve throughput.",
      "Managed MySQL schema migrations with Flyway and documented REST APIs with OpenAPI (Swagger).",
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
    tags: ["Spring Boot", "React 18", "OAuth2", "Flyway"],
    highlights: [
      "Built a B2C e-commerce application end-to-end with a Spring Boot backend and a React 18 storefront supporting product browsing, checkout, and order processing.",
      "Implemented secure authentication using Spring Security, JWT, OAuth2, and RBAC.",
      "Consumed RESTful APIs with Redis-backed caching to improve search performance.",
      "Managed MySQL migrations with Flyway and containerized environments with Docker.",
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
  { value: 5, suffix: "+", label: "Production-grade web apps" },
  { value: 5, suffix: "", label: "End-to-end projects" },
  { value: 4, suffix: "", label: "Payment gateways integrated" },
  { value: 8, suffix: "", label: "Skill areas" },
];

/** The CV PDF lives in `public/` so it ships with the static export. */
export const cv = {
  file: "/cv.pdf",
  fileName: "CV-NguyenPhuocNguyen-FullstackDeveloper.pdf",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

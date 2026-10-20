# PROMPT — Xây dựng Portfolio Web App (Next.js, client-only, soft-sky, smooth scroll 2026)

> Copy toàn bộ nội dung bên dưới (từ dòng "## 0. VAI TRÒ" trở xuống) và dán vào coding agent.
> Ngôn ngữ giao tiếp: tiếng Việt. Ngôn ngữ code/comment: tiếng Anh.

---

## 0. VAI TRÒ & MỤC TIÊU

Bạn là **Senior Frontend Engineer + Product Designer** (design engineer). Hãy dùng **skill `ui-ux-pro-max`** tại `~/.agents/skills/ui-ux-pro-max` (chạy `python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py ...` khi cần tra cứu style/color/typography/motion/ux) để đảm bảo UI/UX ở mức **pro-max** (pixel-perfect, accessible, có hệ thống design token, motion có chủ đích).

Nhiệm vụ: code **một web app portfolio cá nhân** cho **Nguyen Phuoc Nguyen — Fullstack Developer**, dùng **Next.js (App Router) + TypeScript + Tailwind CSS**, **CHỈ chạy phía client — tuyệt đối không đụng tới server**.

### Ràng buộc bắt buộc (hard constraints)

1. **Client-only 100%**:
   - Mọi component tương tác đều `'use client'`. Toàn bộ trang là client-rendered.
   - **KHÔNG** tạo API routes (`app/api/**`), **KHÔNG** Server Actions, **KHÔNG** middleware, **KHÔNG** database, **KHÔNG** fetch dữ liệu từ backend, **KHÔNG** biến môi trường server-side, **KHÔNG** secret.
   - Trong `next.config.ts` đặt `output: 'export'` và `images: { unoptimized: true }` để build ra site tĩnh (static export) deploy lên Vercel/GitHub Pages/Netlify/Cloudflare Pages không cần server.
   - Toàn bộ nội dung (CV) là **dữ liệu tĩnh hardcode** trong `src/data/cv.ts` (typed bằng TypeScript). Không gọi mạng.
   - Form liên hệ: **không** submit qua server. Dùng `mailto:` link và/hoặc nút copy email vào clipboard (`navigator.clipboard`) + toast xác nhận.
   - Mọi thứ phải **hoạt động khi tắt JS ở mức chấp nhận được** (nội dung vẫn đọc được; animation chỉ là lớp tăng cường, không giấu nội dung).

2. **Không phá vỡ khả năng truy cập (a11y) và SEO cơ bản**: semantic HTML, `metadata` export cho title/description/OG, contrast ≥ 4.5:1 cho text thường.

3. **Tôn trọng `prefers-reduced-motion`**: mọi animation scroll phải có nhánh giảm chuyển động (render trạng thái cuối ngay lập tức).

---

## 1. TECH STACK (bắt buộc)

- **Next.js** (App Router, TypeScript, `strict: true`)
- **Tailwind CSS v4** (CSS-first, dùng `@theme` để khai báo token — xem mục 3)
- **GSAP 3.13+** với plugins: `ScrollTrigger`, `Flip`, `SplitText` (miễn phí từ 3.13) + **`@gsap/react`** (`useGSAP`)
- **Lenis** (`lenis` package) cho smooth/inertia scroll — sync với ScrollTrigger
- **@phosphor-icons/react** làm icon library duy nhất (KHÔNG dùng emoji làm icon cấu trúc). Fallback: `@heroicons/react` (giữ cùng style line/fill + stroke).
- **next/font/google**: `Space Grotesk` (display/heading), `Inter` (body), `JetBrains Mono` (code/label). Subset `latin`, `display: 'swap'`, khai báo CSS variables.
- Không dùng UI kit nặng (không MUI/AntD). Nếu cần primitive thì dùng tự viết + Tailwind. (Có thể dùng `shadcn/ui` chỉ khi thật cần, nhưng mặc định là tự viết.)

**KHÔNG dùng**: bất kỳ thư viện nào cần server/SSR runtime, analytics server, CMS, hay fetch API.

---

## 2. IA & NỘI DUNG (lấy CHÍNH XÁC từ CV — không bịa thêm)

Build một trang single-page với các section theo thứ tự (dùng anchor id):

1. **Hero** — `#home`
2. **About** — `#about`
3. **Skills** — `#skills`
4. **Projects** — `#projects`
5. **Education & Certificates** — `#education`
6. **Interests** — `#interests`
7. **Contact / Footer** — `#contact`

Nav (glass, sticky) có scrollspy highlight theo section đang xem + nút CTA "Contact" + nút "Download CV".

### Dữ liệu tĩnh (đưa vào `src/data/cv.ts`)

```ts
export const profile = {
  name: "Nguyen Phuoc Nguyen",
  role: "Fullstack Developer",
  location: "Ho Chi Minh, Vietnam",
  email: "nguyennpcoder@gmail.com",
  phone: "(+84) 393 204 904",
  github: "nguyennp-coder",
  githubUrl: "https://github.com/nguyennp-coder",
  handle: "nguyennpcoder",
  about:
    "Fullstack Developer with hands-on experience building 5+ production-grade web applications end-to-end using Java 17 / Spring Boot 3 on the backend and React, Next.js 14, and Angular 17 on the frontend. Skilled in designing secure REST APIs (JWT/OAuth2, RBAC), event-driven architectures with Kafka and Redis, and multi-gateway payment integrations (VNPay, MoMo, ZaloPay, SePay), alongside responsive SSR/SEO UIs and real-time interfaces over WebSocket. Comfortable owning features from database schema and API design through to UI and production deployment. Passionate about clean, maintainable, testable code and building reliable systems for fintech-scale workloads.",
};

export const skills = {
  languages: ["Java", "TypeScript", "JavaScript", "SQL"],
  backend: ["Spring Boot 3", "Spring MVC", "Spring Data JPA / Hibernate", "Spring Security", "Spring AOP", "REST API", "WebSocket (STOMP/SockJS)", "Apache Kafka"],
  coreCs: ["Data Structures", "Algorithms", "System Design", "RESTful Architecture"],
  devops: ["Docker", "Docker Compose", "Git/GitHub", "Swagger/OpenAPI", "Vite", "Bruno", "Figma"],
  frontend: ["React.js", "Next.js 14", "Angular 17", "Redux Toolkit", "RxJS", "Ant Design", "Tailwind CSS", "Bootstrap", "SSR & SEO", "Responsive/mobile-first UI", "Real-time UI (WebSocket)"],
  database: ["MySQL", "PostgreSQL", "Redis", "Flyway (schema migrations)"],
  auth: ["JWT", "OAuth2 / OIDC", "RBAC", "SMS/email verification", "Checksum validation"],
  payments: ["VNPay", "MoMo", "ZaloPay", "SePay (multi-gateway integration, async transaction handling)"],
};

export const projects = [
  {
    name: "Airbnb Booking Platform", role: "Fullstack Developer", period: "Sep 2025 – Jan 2026",
    tags: ["Next.js 14", "Spring Boot 3", "WebSocket", "Payments"],
    highlights: [
      "Built an end-to-end booking platform with a Spring Boot 3 (Java 17) REST API and a responsive Next.js 14 frontend with SSR and SEO optimization.",
      "Designed secure authentication and RBAC using Spring Security, JWT, SMS verification, and email confirmation.",
      "Implemented real-time messaging and booking notifications via WebSocket (STOMP) and SockJS.",
      "Integrated multi-gateway payments (VNPay, MoMo, ZaloPay, SePay), QR check-in, and analytics dashboards.",
      "Developed booking/scheduling logic with availability conflict detection and automated status updates.",
    ],
  },
  {
    name: "Audi Service Booking", role: "Fullstack Developer", period: "Apr 2025 – Oct 2025",
    tags: ["Spring Boot 3", "React (Vite)", "MySQL", "Redis"],
    highlights: [
      "Developed the backend with Spring Boot 3, Spring Data JPA/Hibernate, MySQL, and Redis, with secure checksum validation and async transaction handling.",
      "Built the frontend with React (Vite), including a real-time scheduling interface with conflict detection and slot management.",
      "Implemented RBAC authentication using Spring Security and JWT.",
      "Integrated VNPay, MoMo, and ZaloPay checkout flows and a customer-support chat feature.",
      "Automated PDF invoice generation and revenue dashboard reporting.",
    ],
  },
  {
    name: "Apple Clone (E-commerce)", role: "Fullstack Developer", period: "Aug 2024 – Dec 2024",
    tags: ["Spring Boot", "React (Vite)", "OAuth2", "Redis", "Docker"],
    highlights: [
      "Built a full e-commerce stack with a Spring Boot backend and a React (Vite) storefront following a scalable, maintainable component architecture.",
      "Implemented secure authentication with Spring Security, JWT, OAuth2 OIDC, and RBAC.",
      "Optimized product retrieval and page performance using Redis caching to reduce database load.",
      "Containerized the stack with Docker and Docker Compose for consistent deployment environments.",
    ],
  },
  {
    name: "Book Views Online (E-commerce)", role: "Backend Developer", period: "Apr 2024 – Aug 2024",
    tags: ["Angular 17", "Spring Boot 3", "Kafka", "Flyway"],
    highlights: [
      "Built a scalable e-commerce platform with Spring Boot 3 (Java 17) and Angular 17 SSR for performance and SEO.",
      "Implemented JWT/OAuth2 authentication with Spring Security and RBAC.",
      "Designed an event-driven architecture with Apache Kafka and Redis caching to reduce database load and improve throughput.",
      "Managed MySQL schema migrations with Flyway and documented REST APIs with OpenAPI (Swagger).",
    ],
  },
  {
    name: "VTI Store (B2C E-commerce)", role: "Fullstack Developer", period: "Jun 2023 – Feb 2024",
    tags: ["Spring Boot", "React 18", "OAuth2", "Flyway"],
    highlights: [
      "Built a B2C e-commerce application end-to-end with a Spring Boot backend and a React 18 storefront supporting product browsing, checkout, and order processing.",
      "Implemented secure authentication using Spring Security, JWT, OAuth2, and RBAC.",
      "Consumed RESTful APIs with Redis-backed caching to improve search performance.",
      "Managed MySQL migrations with Flyway and containerized environments with Docker.",
    ],
  },
];

export const education = [
  { org: "Saigon Technology University", detail: "Information Technology", period: "Oct 2020 – Nov 2024" },
];
export const certificates = [
  { org: "VTI Academy", detail: "Fullstack web", period: "Jun 2023 – Feb 2024" },
];
export const interests = ["Reading", "Traveling", "Topical blogs & research"];
```

**Quy tắc nội dung**: giữ nguyên câu chữ tiếng Anh trong CV. Không thêm số liệu, công ty, hay thành tựu không có trong CV. Nếu bịa "stats" thì chỉ được bịa dạng *đếm từ chính dữ liệu* (ví dụ "5+ production apps" — đã có trong About; "5 projects" — đếm được), không bịa metric hiệu năng.

---

## 3. HỆ MÀU — "SOFT SKY" (dịu, hài hòa, KHÔNG quá tối, KHÔNG quá sáng)

Định hướng thị giác: **bầu trời sớm mai** — nền xanh sky rất nhẹ (không dùng trắng tinh `#FFFFFF` làm nền trang), chữ xanh-slate đậm, một điểm nhấn **apricot ấm** dùng rất tiết chế, kính mờ (glassmorphism) nhẹ, bóng đổ mềm và rộng.

**Nguyên tắc chọn màu:**
- Nền trang là **mid-tone soft sky** `#EDF4FA` (sáng vừa, đủ dịu mắt — không chói như trắng, không nặng như xám đậm).
- Chữ chính là **deep slate blue** `#132A3F` → tương phản cao trên nền sáng, vẫn "ấm" và đồng bộ với sky.
- **Primary sky** đủ đậm để chữ trắng đạt ≥ 4.5:1 (`#3576A8`).
- **Accent apricot** chỉ dùng cho điểm nhấn nhỏ (underline, badge, highlight 1 từ khoá) — không dùng làm nền lớn.
- Tổng thể: ~**90% trung tính (sky/slate) + 8% primary + 2% accent**. Ít màu, nhiều khoảng thở → "pro".

### 3.1 Design tokens (Tailwind v4 — `@theme` trong `src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* ---- Primitive: Soft Sky ramp ---- */
  --color-sky-50:  #F4F9FD;
  --color-sky-100: #E8F2FA;
  --color-sky-200: #D5E6F4;
  --color-sky-300: #BCD7EC;
  --color-sky-400: #94BEDD;
  --color-sky-500: #6BA3CC;
  --color-sky-600: #4E8AB8;  /* sky chủ đạo khi cần đậm vừa */
  --color-sky-700: #3576A8;  /* PRIMARY — white text đạt ~4.9:1 */
  --color-sky-800: #2A5D86;
  --color-sky-900: #1E4363;

  /* ---- Primitive: deep slate (text/dark) ---- */
  --color-slate-ink: #132A3F;  /* foreground chính */
  --color-slate-soft: #5A7288; /* muted foreground */
  --color-slate-line: #D4E3F0; /* border subtle */
  --color-slate-line-strong: #BBD2E6;

  /* ---- Accent ấm, dùng tiết chế ---- */
  --color-apricot-400: #EFB489;
  --color-apricot-500: #E39A63;
  --color-apricot-600: #C97E46;

  /* ---- Semantic accents ---- */
  --color-teal-soft: #5FB0A6;   /* tag phụ, biểu đồ */
  --color-success:   #3F9E68;
  --color-warning:   #D69A3A;
  --color-danger:    #D4635C;

  /* ---- Semantic tokens (dùng cái này trong component, KHÔNG hardcode hex) ---- */
  --color-background:        #EDF4FA;   /* nền trang */
  --color-background-subtle: #F6FAFD;   /* nền section xen kẽ */
  --color-surface:           #FFFFFF;   /* card solid */
  --color-surface-muted:     #E4EEF8;   /* card phụ, hover */
  --color-foreground:        #132A3F;
  --color-muted-foreground:  #5A7288;
  --color-primary:           #3576A8;
  --color-primary-hover:     #2A5D86;
  --color-primary-tint:      #DCEBF7;   /* nền nhạt của primary */
  --color-on-primary:        #FFFFFF;
  --color-accent:            #E39A63;
  --color-on-accent:         #3A2418;
  --color-border:            #D4E3F0;
  --color-ring:              #3576A8;

  /* ---- Typography ---- */
  --font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-sans:    var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains-mono), ui-monospace, monospace;

  /* ---- Radius & shadow mềm ---- */
  --radius-card: 20px;
  --radius-pill: 999px;
  --shadow-soft:  0 1px 2px rgba(19,42,63,.04), 0 8px 24px rgba(19,42,63,.06);
  --shadow-lift:  0 2px 6px rgba(19,42,63,.05), 0 20px 48px rgba(53,118,168,.12);
  --shadow-glass: 0 8px 32px rgba(19,42,63,.10);
}
```

> Tailwind v4 sẽ tự sinh utility từ `@theme`: dùng `bg-background`, `text-foreground`, `border-border`, `text-primary`, `bg-primary`, `shadow-soft`, `rounded-card`, `font-display`… **Tuyệt đối không** viết `bg-[var(--color-primary)]` hay rải `bg-sky-700` khắp component. Chỉ dùng token semantic.

### 3.2 Công thức nền & "glass" (dán vào `globals.css`)

```css
:root { color-scheme: light; }

html { scroll-behavior: smooth; }        /* fallback khi không có Lenis */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Nền "bầu trời sớm" nhiều lớp, rất dịu — đặt ở một div cố định sau nội dung */
.sky-canvas {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(1200px 600px at 15% -10%, #E3F0FA 0%, transparent 60%),
    radial-gradient(900px 500px at 90% 0%,   #EAF4FB 0%, transparent 55%),
    radial-gradient(700px 700px at 50% 110%, #E7F1F9 0%, transparent 60%),
    linear-gradient(180deg, #EEF5FB 0%, #EDF4FA 45%, #E9F1F8 100%);
}

/* Card kính mờ — dùng cho nav, hero panel, project card */
.glass {
  background: color-mix(in oklab, #FFFFFF 72%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
          backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid color-mix(in oklab, #FFFFFF 65%, #D4E3F0);
  box-shadow: var(--shadow-glass);
}

/* Viền gradient mảnh cho card nổi bật */
.ring-gradient {
  background:
    linear-gradient(var(--color-surface), var(--color-surface)) padding-box,
    linear-gradient(135deg, #BCD7EC, #E39A63) border-box;
  border: 1px solid transparent;
}

/* Text gradient tiết chế cho 1–2 từ khoá ở hero */
.text-sky-gradient {
  background: linear-gradient(92deg, #3576A8 0%, #4E8AB8 55%, #E39A63 120%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .sky-canvas { background: #EDF4FA; }
}
```

### 3.3 Quy tắc dùng màu trong Tailwind (để trông "pro")

- **Nền**: `bg-background` cho trang, xen kẽ section bằng `bg-background-subtle`; **không** xếp quá 2 tông nền cạnh nhau.
- **Chữ**: `text-foreground` cho tiêu đề/đoạn quan trọng; `text-muted-foreground` cho phụ đề, meta, nhãn. Không dùng xám lạnh lẫn xanh lạnh tùy tiện.
- **Nhấn**: `text-primary` cho link/CTA; `bg-primary text-on-primary` cho nút chính; **accent `text-accent`/`bg-accent`** chỉ cho ≤ 2 điểm/trang.
- **Viền**: `border-border` mặc định; chỉ tăng lên `border-slate-line-strong` khi cần phân tách rõ (bảng, timeline).
- **Bóng**: `shadow-soft` cho card nghỉ; `shadow-lift` khi hover. Không dùng bóng đen đậm/`shadow-2xl` mặc định.
- **Focus**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` trên MỌI phần tử tương tác.
- **Bo góc**: card `rounded-card`, nút/badge `rounded-pill`, input `rounded-xl`. Nhất quán, không trộn góc vuông với góc tròn tùy tiện.
- **Opacity/kính**: nền kính ~62–75% trắng; **kiểm tra contrast chữ trên kính** trên nền thật (không giả định).
- Tránh: gradient cầu vồng nhiều màu, glow neon, nền tối, viền đen, đổ bóng gắt, quá 3 màu nhấn.

Nếu cần thêm lựa chọn màu/style/font, chạy skill:
`python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "portfolio soft sky calm airy" --domain color`
`python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "glassmorphism airy light soft" --domain style`

---

## 4. TYPOGRAPHY & BỐ CỤC

- Font: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (label/mã/số).
- Thang chữ (clamp, responsive):
  - Display/Hero: `clamp(2.75rem, 6vw, 5.5rem)`, tracking `-0.03em`, weight 600/700.
  - H2 section: `clamp(1.75rem, 3.2vw, 2.75rem)`, tracking `-0.02em`.
  - Body: 16–18px, `leading-relaxed` (1.65–1.75), đoạn văn tối đa `max-w-[68ch]`.
  - Label/meta: mono 12–13px, `uppercase tracking-[0.12em]`, `text-muted-foreground`.
- Nhịp dọc: scale 4/8 — section padding `py-24 md:py-32`; grid gap `gap-6 md:gap-8`. Container `max-w-6xl mx-auto px-6 md:px-8`.
- Layout hero bất đối xứng nhẹ (variance 5–6/10): chữ lớn lệch trái, panel kính lệch phải; không căn giữa mọi thứ.
- Trên mobile: 1 cột, giảm/khử parallax, touch target ≥ 44px.

---

## 5. TÍNH NĂNG SCROLL SIÊU MƯỢT (kiểu web hiện đại 2026)

Mục tiêu: cảm giác **inertia mượt như app native**, animation **có chủ đích** (phục vụ kể chuyện, không phô diễn), **60fps**, **không giật**, **tôn trọng reduced-motion**.

### 5.1 Nền tảng smooth scroll

1. **Lenis inertia scroll**: lerp ~`0.1`, `wheelMultiplier: 1`, bật `smoothWheel`; tắt hẳn khi `prefers-reduced-motion` hoặc thiết bị yếu.
2. **Sync Lenis ↔ GSAP ScrollTrigger** đúng chuẩn (không tạo 2 vòng RAF riêng):
   ```ts
   gsap.ticker.add((t) => lenis.raf(t * 1000));
   gsap.ticker.lagSmoothing(0);
   lenis.on('scroll', ScrollTrigger.update);
   ```
3. **Anchor navigation** đi qua `lenis.scrollTo(target, { offset: -88, duration: 1.1 })` (offset bằng chiều cao nav) — không nhảy cứng.
4. **Dọn dẹp** mọi ScrollTrigger + Lenis khi unmount (`useGSAP` scope + `lenis.destroy()`), có `matchMedia` cho reduced-motion.

### 5.2 Các hiệu ứng scroll cần có

| # | Hiệu ứng | Chi tiết kỹ thuật | Nguồn skill (đã đối chiếu) |
|---|---|---|---|
| 1 | **Scroll progress bar** | Thanh mảnh trên cùng (hoặc vòng tròn góc phải), `scaleX` theo tiến độ trang, `transform-origin: left`, màu `primary`. | Scroll-Triggered Storytelling |
| 2 | **Reveal on enter** | `gsap.from(el, { opacity: 0, y: 22, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } })`. Offset y nhỏ 16–24px để đọc như *fade*, không phải *slide*. | Scroll Reveal (Standard) ✓ |
| 3 | **Stagger con** | Stagger ≤ 8 phần tử: `stagger: 0.08`, `ease: 'power2.out'`. Với grid dùng `stagger: { grid: 'auto', from: 'start', each: 0.06 }`. | Stagger List ✓ |
| 4 | **Hero text reveal** | `SplitText` tách theo dòng/từ, mask reveal (`yPercent: 110 → 0`, `clip-path`), delay nhỏ sau khi Lenis sẵn sàng. Chỉ chạy 1 lần. | Complex tier |
| 5 | **Parallax trang trí** | CHỈ cho layer nền/trang trí (blob, lưới, ảnh nền mờ): `yPercent` 5–15, `scrub: true`. **Không parallax chữ/đoạn văn.** `will-change: transform` chỉ lúc scroll, gỡ sau khi settle. | Parallax Scroll ✓ |
| 6 | **Pin + horizontal scroll gallery** | Section Projects: pin container rồi dịch ngang các project card theo scroll (`xPercent`) với `scrub: 1`; mobile fallback về grid dọc + snap. | Pinned storytelling |
| 7 | **Sticky "About" timeline** | Ảnh/khối mô tả dính (`sticky top-24`) trong khi cột phải cuộn; đường kẻ tiến trình `scaleY` theo scroll. | Scroll-scrub |
| 8 | **Scrollspy nav** | Nav kính sticky; đổi kích thước/độ mờ khi cuộn; highlight mục active bằng ScrollTrigger `onToggle`; hover có line-grow mảnh. | Navigation/UX |
| 9 | **Number counters** | Đếm số khi vào viewport (5+ apps, 5 projects, 8 nhóm kỹ năng…) `gsap.to(obj,{ val, snap, duration: 1.2 })` + format. Chỉ đếm số suy ra từ CV. | Motion |
| 10 | **Marquee tech stack** | Dải từ khoá công nghệ chạy ngang, `xPercent` vô hạn, **pause on hover**, dừng hoàn toàn khi reduced-motion. | UX: continuous motion |
| 11 | **Magnetic / custom cursor** | Chỉ desktop (`@media (pointer: fine)`), con trỏ lệch nhẹ về target, `gsap.quickTo`. Tôn trọng reduced-motion; không che text. | Complex tier |
| 12 | **Card tilt + shine** | Hover: `rotateX/Y` nhẹ (±6°) + lớp sáng chạy theo con trỏ; reset `transform` khi out. Không dịch layout bounds. | Interaction |
| 13 | **Section divider scroll** | Đường/gradient line `scaleX` từ 0→1 khi qua section; blob nền trôi chậm ở background. | Visual polish |
| 14 | **Back-to-top** | Nút kính xuất hiện sau 60vh, `lenis.scrollTo(0)`, có nhãn a11y. | UX |
| 15 | **Clip/pin progress cho "Skills"** | Skills pin nhẹ + phân nhóm reveal lần lượt khi scroll qua. | Scroll-scrub |

### 5.3 Guardrails hiệu năng (BẮT BUỘC)

- Chỉ animate **`transform`** và **`opacity`** — không animate `width/height/top/left` (trừ `clip-path` có chủ đích). *(UX: Transform Performance — High)*
- **Batch ScrollTrigger** theo container; tắt `markers` ở production; `ScrollTrigger.normalizeScroll` chỉ bật khi cần.
- `will-change` chỉ đặt trên layer parallax khi đang scroll, gỡ sau.
- Không quá 3–4 layer parallax/section.
- Không loop animation vô hạn cho phần tử trang trí (chỉ dùng cho loader / marquee có pause).
- Lazy-mount animation nặng bằng `IntersectionObserver`/`ScrollTrigger` (`once: true`), không chạy hết một lần lúc load.
- Tránh **layout shift**: chừa không gian cho ảnh/card, dùng `aspect-ratio`, không nhét quảng cáo/nội dung đẩy layout.
- Không có **horizontal scrollbar** ngoài ý muốn: `overflow-x-hidden` ở wrapper cần thiết, kiểm tra 375px.
- Mọi animation phải **tắt mượt** khi `prefers-reduced-motion: reduce`: render trạng thái cuối, bỏ parallax/scrub.

### 5.4 Skeleton code bắt buộc (Lenis + GSAP + reduced-motion)

```tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
  return <>{children}</>;
}
```

Reveal component mẫu (scoped, tự cleanup):

```tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({ children, stagger = 0 }: { children: React.ReactNode; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = stagger ? ref.current!.children : ref.current!;
    gsap.from(targets, {
      opacity: 0, y: 22, duration: 0.5, ease: 'power2.out',
      stagger: stagger || 0,
      scrollTrigger: { trigger: ref.current!, start: 'top 85%', toggleActions: 'play none none reverse' },
      ...(reduce ? { opacity: 1, y: 0, scrollTrigger: undefined } : {}),
    });
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
```

---

## 6. CẤU TRÚC FILE (đề xuất)

```
portfolio/
├─ next.config.ts                 # output:'export', images.unoptimized
├─ package.json
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # fonts, metadata, SmoothScrollProvider, skip-link
│  │  ├─ page.tsx                 # 'use client' — compose toàn bộ section
│  │  └─ globals.css              # @theme tokens + .glass + .sky-canvas
│  ├─ components/
│  │  ├─ providers/SmoothScrollProvider.tsx
│  │  ├─ layout/{Navbar,ScrollProgress,BackToTop,Footer}.tsx
│  │  ├─ sections/{Hero,About,Skills,Projects,Education,Interests,Contact}.tsx
│  │  └─ ui/{Reveal,Marquee,Counter,TiltCard,SectionHeading,Badge,Button,IconLink}.tsx
│  ├─ lib/{animations.ts, useReducedMotion.ts}
│  └─ data/cv.ts
└─ public/{cv.pdf, og.png}
```

---

## 7. TIÊU CHÍ NGHIỆM THU (Definition of Done)

**Chức năng**
- [ ] `npm run build` chạy **không lỗi**, sinh ra `out/` (static export) — **không** có route API/server.
- [ ] Không có network request nào khi dùng trang (ngoài font tĩnh cùng origin).
- [ ] Nút "Download CV" tải `public/cv.pdf`; nút email hoạt động (`mailto` + copy-to-clipboard có toast).
- [ ] Nav scrollspy đúng; anchor cuộn mượt có offset; nút back-to-top hoạt động.

**UI/UX (đối chiếu skill `ui-ux-pro-max`)**
- [ ] Không dùng emoji làm icon cấu trúc; icon đồng nhất 1 họ (Phosphor), 1 style, stroke nhất quán, size theo token.
- [ ] Mọi phần tử click được có `cursor-pointer` + hover/focus mượt (150–300ms) + focus ring rõ.
- [ ] **Contrast ≥ 4.5:1** cho text thường (kiểm tra riêng chữ trên nền kính và trên primary).
- [ ] Nền/viền/bóng dùng **token semantic**, không hardcode hex rải rác.
- [ ] Nhịp spacing 4/8 nhất quán; section `py-24 md:py-32`.
- [ ] Bố cục đúng ở **375 / 768 / 1024 / 1440** px, không có horizontal scrollbar.
- [ ] `prefers-reduced-motion: reduce` → nội dung hiện đủ, animation tắt mượt.
- [ ] Touch target ≥ 44×44px trên mobile.

**Motion**
- [ ] Chỉ animate transform/opacity; ScrollTrigger `markers:false` ở production.
- [ ] Lenis + ScrollTrigger chạy chung một RAF, không double-scroll, không jank trên trackpad/chuột.
- [ ] Parallax chỉ ở layer trang trí; chữ không bị parallax.
- [ ] Tất cả listener/ScrollTrigger/Lenis được cleanup khi unmount (không rò rỉ, không double-init ở Strict Mode).

**Chất lượng code**
- [ ] TypeScript strict, không `any` bừa, props có type rõ.
- [ ] Component nhỏ, tách bạch; logic animation gom vào `lib/animations.ts` / hooks.
- [ ] Không lặp class Tailwind quá dài — tách variant/`cn()` helper khi cần.
- [ ] Comment tiếng Anh, ngắn, giải thích *tại sao* với các đoạn GSAP.

---

## 8. THỨ TỰ THỰC THI (agent hãy làm theo)

1. Khởi tạo Next.js + TS + Tailwind v4; cấu hình `output:'export'`; cài `gsap`, `@gsap/react`, `lenis`, `@phosphor-icons/react`.
2. Viết `globals.css` (mục 3.1 + 3.2) và `src/data/cv.ts` (mục 2). Chạy dev, xác nhận token render.
3. Dựng layout + Navbar + ScrollProgress + SmoothScrollProvider + Footer (khung tĩnh trước, chưa animation).
4. Lần lượt dựng từng section với nội dung thật; chỉ áp `.glass`, token màu, typography — **chưa** thêm motion.
5. Thêm `Reveal`, stagger, counters, marquee (mục 5.2 #1–4, #9–10).
6. Thêm pin/horizontal projects, sticky about, parallax trang trí, scrollspy, tilt, cursor, back-to-top (#5–8, #11–14).
7. Chạy checklist mục 7; test 375px + reduced-motion; đo cảm giác cuộn; tinh chỉnh lerp/easing/duration cho "êm".
8. `npm run build` + `npm run start` kiểm tra `out/`; đảm bảo không có lỗi server/export.

**Khi cần tra cứu thêm, dùng skill `ui-ux-pro-max`:**
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "personal portfolio glassmorphism soft sky" --design-system -f markdown -p "Nguyen Portfolio" --variance 6 --motion 8 --density 4
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "scroll reveal smooth parallax" --domain gsap
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "transform performance scroll" --domain ux
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "client component scroll performance" --stack nextjs
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "glass card color tokens" --stack html-tailwind
```

---

## 9. KHÔNG ĐƯỢC LÀM (anti-patterns)

- ❌ Tạo bất kỳ API route / server action / SSR data-fetch / middleware / DB.
- ❌ Emoji làm icon; trộn nhiều họ icon; stroke/kiểu không nhất quán.
- ❌ Nền trắng tinh hoặc nền tối/OLED; nhiều hơn 3 màu nhấn; gradient cầu vồng; glow neon.
- ❌ Parallax/scroll animation lên chữ và đoạn văn.
- ❌ Animate `width/height/top/left`; loop animation trang trí vô hạn.
- ❌ Bịa nội dung/metric ngoài CV.
- ❌ Bỏ qua `prefers-reduced-motion`; layout shift; horizontal scrollbar.
- ❌ Hardcode hex trong component thay vì token semantic.

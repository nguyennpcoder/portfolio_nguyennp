# Portfolio — Nguyen Phuoc Nguyen

Portfolio cá nhân (Fullstack Developer) xây dựng bằng Next.js App Router, **client-only**:
toàn bộ trang render ở client và build ra static site trong `out/`. Không có API route,
server action, middleware hay database — deploy lên bất kỳ static host nào (Vercel, Netlify,
Cloudflare Pages, GitHub Pages, S3…).

## Tech stack

| Lớp | Công nghệ |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v4 (CSS-first `@theme`), token semantic |
| Motion | GSAP 3 (`ScrollTrigger`, `SplitText`, `matchMedia`) + `@gsap/react` |
| Smooth scroll | Lenis (chạy chung 1 RAF với GSAP ticker) |
| Icons | `@phosphor-icons/react` (1 họ icon, stroke nhất quán) |
| Font | Space Grotesk (display) · Inter (body) · JetBrains Mono (số liệu) — self-host qua `next/font` |

## Lệnh

```bash
npm install          # cài dependencies
npm run dev          # dev server → http://localhost:3000
npm run build        # build + static export → out/
npm run lint         # ESLint
```

Xem thử bản build tĩnh (khuyến nghị khi đo cảm giác cuộn):

```bash
npx serve out        # hoặc: python3 -m http.server 4173 --directory out
```

## Cấu trúc

```
src/
├─ app/
│  ├─ layout.tsx        # font, metadata, JSON-LD Person, SmoothScrollProvider, CosmicField
│  ├─ page.tsx          # ghép các section
│  └─ globals.css       # design system: token, .glass, .ambient-canvas, Lenis CSS
├─ components/
│  ├─ providers/        # SmoothScrollProvider (Lenis + context scrollTo)
│  ├─ layout/           # Navbar, ScrollProgress, BackToTop, Footer
│  ├─ sections/         # Hero, About, Skills, Projects, Education, Interests, Contact
│  └─ ui/               # Reveal, Counter, Marquee, TiltCard, Chip, Button, Avatar, OrbitField, CosmicField, SectionHeading
├─ data/cv.ts           # TOÀN BỘ nội dung (nguồn sự thật duy nhất)
└─ lib/                 # gsap.ts, hooks.ts, utils.ts, scroll-fx.ts (scrub toàn trang), scroll-state.ts, canvas-glow.ts
```

## Sửa nội dung

Mọi nội dung nằm ở `src/data/cv.ts` — sửa trực tiếp, không cần CMS:

- `profile` — tên, chức danh, email, điện thoại, GitHub (`githubUrl` / `githubHandle`),
  LinkedIn (`linkedinUrl` / `linkedinHandle`), đoạn giới thiệu
- `skillGroups` — 8 nhóm kỹ năng (nhóm nào có mô tả dài hơn một chip thì để ở `note`,
  hiện thành dòng chú thích nhỏ dưới hàng chip — ví dụ `Multi-gateway integration…`)
- `projects` — 5 dự án: `tags` + `highlights`, kèm `image` (ảnh đại diện), `repos`
  (link GitHub FE/BE; để `[]` khi source private) và `demo` (link live, bỏ trống nếu không có)
- `education` / `certificates` / `interests` / `stats` / `navItems`

Card dự án ở `components/sections/Projects.tsx` render: ảnh đại diện trên cùng (zoom nhẹ khi
hover card), rồi chip GitHub `Frontend` / `Backend` (hoặc nhãn "Private repository")
và nút **Live demo**. Ảnh đại diện nằm ở `public/projects/*.jpg` (1400px, ~50–230 KB/ảnh);
bản gốc độ phân giải cao ở `assets/projects-src/` (không ship ra `out/`). Thêm dự án mới thì
xuất ảnh về `public/projects/` rồi khai báo `image.src` / `image.alt` (alt phải mô tả nội dung
ảnh, không viết "ảnh dự án").

CV tải về nằm ở `public/cv.pdf`; đổi file thì cập nhật `cv.file` / `cv.fileName`.

Ảnh chân dung: `public/avatar.png` (720×720, ~199 KB) dùng ở navbar, hero và footer qua
`components/ui/Avatar.tsx`. Bản gốc dung lượng lớn nằm ở `assets/avatar-source.png`
(không ship ra `out/`). Thay ảnh thì xuất lại về đúng 720×720 PNG (palette 256 màu, nén tối đa)
để giữ tải trang nhẹ.

## Design system

Bảng màu lấy từ `SKILL.md` / `DESIGN.md` — **chỉ lấy hệ màu**, còn typography, spacing, bo góc,
bố cục và motion giữ nguyên như cũ. Nền đen tuyền + trắng + tím `#8c45ff` (fill chính) +
xanh `#0000ee`, tỉ lệ ~90% neutral / 8% primary / 2% accent:

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--color-background` | `#000000` | nền trang (`surface.base`) |
| `--color-surface` | `#1C1C24` | card |
| `--color-foreground` | `#FFFFFF` | chữ chính (`text.primary`) |
| `--color-muted-foreground` | `#A1A1AA` | chữ phụ (~8.8:1) |
| `--color-primary` | `#8C45FF` | CTA, dot, active (`surface.raised`) |
| `--color-primary-text` | `#B18CFF` | chữ/icon tím trên nền đen (8.1:1) |
| `--color-accent` | `#3B3BFF` | graphic xanh, rất tiết chế |
| `--color-border` | `#2B2B34` | viền hairline |
| `--color-line-strong` | `#3D3D3D` | viền hover (`surface.strong`) |

Hai màu gốc được nâng sáng để đạt WCAG AA trên nền `#000000`: `#0000ee` chỉ đạt 2.2:1 nên
graphic dùng `#3B3BFF` và chữ dùng `#8FA2FF`; `#8C45FF` đạt 4.4:1 nên chữ dùng tint `#B18CFF`.
Dùng làm **fill** (nút, dot) thì cả hai màu gốc vẫn giữ nguyên và đạt chuẩn.

Đổi theme = sửa giá trị trong `@theme`. Tiện ích dùng chung: `.glass` / `.glass-strong`
(kính mờ), `.ambient-canvas` (nền glow tím/xanh), `.text-accent-gradient`, `.hairline`, `.mask-x`.

## Motion

- **Lenis + GSAP chung một RAF**: `gsap.ticker.add((t) => lenis.raf(t * 1000))`, kèm
  `lenis.on("scroll", ...) -> ScrollTrigger.update()`; chỉ animate `transform` / `opacity`.
  Callback đó cũng ghi `y` / `velocity` vào `lib/scroll-state.ts` (object mutable, không
  re-render React) để các hiệu ứng phản ứng với vận tốc cuộn đọc chung.
- **Cấu hình cuộn** (`providers/SmoothScrollProvider.tsx`): `lerp: 0.14` (hội tụ ~6 frame —
  nhanh nhưng vẫn mượt), `wheelMultiplier: 1.28` (mỗi nốt lăn đi xa hơn ~28%),
  `touchMultiplier: 2`. Tăng `lerp` = phản hồi nhanh hơn/nhạy hơn; giảm = trôi dài hơn.
  Track ngang của Projects dùng `scrub: 0.5` để bám scroll sát hơn.
- **Reveal** (`components/ui/Reveal.tsx`) fade + rise bằng `fromTo` với giá trị cuối tường minh
  (`opacity: 1, y: 0`) — `from` + `ScrollTrigger.refresh()` từng ghi đè trạng thái ẩn vào cuối
  tween nên nội dung bị kẹt `opacity: 0`; có `stagger` cho lưới card.
- **Scroll toàn trang** (`lib/scroll-fx.ts`, chạy trong provider): `[data-drift="16"]` cho
  eyebrow/tiêu đề/mô tả trôi ngược chiều nhẹ khi cuộn qua; `[data-scale="0.97"]` cho card
  "hạ cánh" từ 97% → 100%. Cả hai chỉ dùng transform nên màu chữ luôn đạt AA.
- **Hero**: `SplitText` mask reveal cho tên; parallax (+scale) chỉ trên layer trang trí;
  cả hero `data-hero-exit` lùi lên + thu nhỏ nhẹ khi cuộn qua; panel hồ sơ nghiêng theo
  con trỏ (`rotationX/Y`, `pointer: fine` mới bật).
- **OrbitField** (`ui/OrbitField.tsx`, canvas): quỹ đạo 3D nghiêng với 7 thiên thạch có vệt sáng
  + glow tím/xanh đúng palette, phủ **tràn viền toàn banner** bằng wrapper `w-screen left-1/2
  -translate-x-1/2` (`-z-20`; section cần `isolate` để không bị nền `body` đè — nếu thiếu, canvas
  sẽ vô hình). Glow pre-render 1 lần mỗi resize rồi blit mỗi frame nên giữ 120fps trên canvas
  toàn màn hình. Thiên thạch tăng tốc theo `scrollState.velocity`; scene ngừng chạy khi ra khỏi
  màn hình; vignette + scrim hai bên giữ chữ đạt AA.
- **CosmicField** (`ui/CosmicField.tsx`, canvas `fixed inset-0 z-[-1]`, mount trong `layout.tsx`
  ngay sau `.ambient-canvas`): lớp vũ trụ **dùng chung cho cả trang** — 210 sao nhấp nháy (parallax
  theo con trỏ chia 3 lớp chiều sâu), **đàn 26 sao bám con trỏ** (mỗi sao có độ trễ + đuôi riêng),
  2 sao băng định kỳ, và **nửa Trái Đất bên phải**.
  - Vì sao tách khỏi hero: nếu để trong hero thì hiệu ứng chỉ chạy trong banner; đặt ở `layout`
    đảm bảo **một** lớp duy nhất phủ toàn site (không nhân đôi đàn sao).
  - Hành tinh chỉ hiện từ **Education trở xuống**: `appear` fade in khi Education vào khung,
    `progress` cho bán kính `R = base * (0.84 + 0.5 * progress)` — **to dần khi cuộn xuống, nhỏ lại
    khi cuộn lên**; tâm đặt ở `w + R * 0.04` nên chỉ thấy **nửa bên phải**. Xoay `0.06 rad/s` khi
    đứng yên và nhanh hơn theo `scrollState.velocity` (tối đa ~1 rad/s).
  - Vẽ bằng **phép chiếu orthographic chính xác** (rẻ, không tính từng pixel): lục địa là path thật
    (68 đỉnh/mảng, nhiễu tần số thấp) cắt đúng ở đường chân trời, phủ 1.100 hạt đất liền lấy mẫu
    từ mặt nạ lat/lon thô, lưới kinh/vĩ tuyến `ctx.ellipse`, tối rìa, đường phân giới sáng/tối,
    viền sáng + quầng khí quyển. Sau đó **3 vành chòm sao nghiêng** quay quanh hành tinh,
    nửa xa vẽ trước (bị khối cầu che), nửa gần vẽ sau — tách đúng bằng `sin(t + phi) > 0`.
  - Một số dùng chung `lib/canvas-glow.ts`: sprite glow 96px cache theo màu rồi blit bằng
    `globalAlpha` thay vì `createRadialGradient` mỗi frame.
  - `prefers-reduced-motion`: **một khung tĩnh chỉ có sao** (không hành tinh, không sao băng, không
    đàn bám con trỏ); canvas tự dừng khi tab bị ẩn (`visibilitychange`).
- **Marquee** phản ứng với vận tốc cuộn (mượt, tự lerp về 1×), **Projects**: pin + cuộn ngang
  trên desktop (`gsap.matchMedia`), stack dọc trên mobile.
- **`prefers-reduced-motion: reduce`**: tắt Lenis + scroll-fx, bỏ mọi animation, nội dung hiện đủ ngay.

## Kiểm tra chất lượng

Đã đo bằng Lighthouse trên bản static export:

```
Accessibility: 100 · Best Practices: 100 · SEO: 100
0 request ra domain ngoài (font self-host cùng origin)
```

Kiểm tra bằng script trên bản export:

```
Contrast DOM:  277 phần tử chữ → 0 lỗi WCAG AA thực sự (2 kết quả bị bỏ qua là artefact của
               phép đo: tiêu đề dùng `bg-clip-text` gradient và màu hệ `oklab`)
Contrast thực: chụp ảnh ở 5 mốc cuộn (hero → footer, lấy cả lúc đàn sao nằm đè lên chữ) rồi đo
               lại pixel đã composite theo đúng rect của từng ảnh: 120 phần tử → 0 dưới AA;
               xấu nhất 4.77:1 (nút "View projects" — trắng trên #8c45ff, đúng thiết kế);
               chữ nằm trên hành tinh xấu nhất 5.32:1 (link footer) → vẫn ≥ AA
Canvas:        8.3 ms/frame (120fps) ở hero, giữa trang và khi hành tinh đang chạy · max 9.4 ms
Responsive:    chạy lại toàn bộ phép đo ở 800×928 (bảng ngang): 89 phần tử chữ → 0 dưới AA,
               xấu nhất 4.76:1; không tràn ngang; nav thu về nút menu; toàn bộ Reveal hiện đủ
               khi cuộn (15 → 0 wrapper còn ẩn theo tiến trình xuống trang)
Ảnh dự án:     21 MB PNG gốc → 764 KB JPEG trong out/projects/ (1400px, quality 68)
```

Chi tiết hơn xem `PROMPT_NEXTJS_PORTFOLIO.md` (spec + Definition of Done).

## Triển khai

Repo: `https://github.com/nguyennpcoder/portfolio_nguyennp` (nhánh `main`).

Bản build là static export (`out/`) nên Vercel không cần thêm cấu hình:

1. Vercel → **Add New → Project → Import** repo `portfolio_nguyennp`.
2. Framework Preset để **Next.js**: Vercel tự chạy `npm run build` và nhận thư mục `out/`
   (không cần đặt Output Directory).
3. Sau lần deploy đầu: **Project → Settings → Domains → Add** `nguyennpcoder.is-a.dev`,
   tắt tuỳ chọn "Redirect to www", rồi bấm **Continue manually** và copy giá trị TXT
   verification mà Vercel hiển thị.

Trỏ subdomain `is-a.dev` (gửi PR vào [is-a-dev/register](https://github.com/is-a-dev/register)):

`domains/nguyennpcoder.json`

```json
{
  "owner": { "username": "nguyennpcoder" },
  "records": { "A": ["216.198.79.1"] }
}
```

`domains/_vercel.nguyennpcoder.json`

```json
{
  "owner": { "username": "nguyennpcoder" },
  "records": { "TXT": "<chuỗi TXT Vercel cấp>" }
}
```

Thay bản ghi `A` bằng đúng giá trị Vercel hiển thị (một số project vẫn dùng `76.76.21.21`),
sau đó chờ PR merge — DNS cập nhật trong vài phút và Vercel tự cấp certificate.

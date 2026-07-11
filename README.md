# Kashi Shakti

A Hindu spiritual content website focused on Kashi (Varanasi), providing Panchang tracking, festival details, Vrat Katha reading, and temple information.

---

## What It Does

- **Panchang Tracking** — displays upcoming Ekadashi, Purnima, Amavasya, and Pradosh fasts with precise tithi timings and live countdown timers
- **Festival & Fast Detail Pages** — rich content pages per event with TOC sidebar, FAQ accordion, and related article cards
- **Vrat Katha** — sacred story reading pages
- **Temple Directory & Puja Vidhi** — guides (partially placeholder, coming soon)
- **Blog** — placeholder, coming soon

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 18 |
| Language | TypeScript 5 |
| State Management | Redux Toolkit + React Redux |
| Styling | Plain CSS with custom properties (`globals.css`) |
| CMS / Backend | Strapi Cloud (headless CMS, externally hosted) |
| Notifications | react-hot-toast |
| Analytics | Google Analytics via `@next/third-parties` |
| Deployment | Netlify (`@netlify/plugin-nextjs`) |
| Node Version | 20.11.0 (pinned via `.nvmrc`) |

> `react-router-dom` is listed as a dependency but unused — all routing is handled by the Next.js App Router.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — fetches global data server-side, mounts Navbar/Footer
│   ├── page.tsx                # Home route — fetches landing page + upcoming events
│   ├── loading.tsx             # Global suspense loading screen
│   ├── providers.tsx           # Redux <Provider> wrapper (client component)
│   ├── globals.css             # Full design system (~650 lines, CSS variables)
│   ├── ekadashi/[slug]/        # Ekadashi detail page
│   ├── amavasya/[slug]/        # Amavasya detail page
│   ├── purnima/[slug]/         # Purnima detail page
│   ├── pradosh/[slug]/         # Pradosh detail page
│   ├── vrat-katha/[slug]/      # Vrat Katha detail page
│   ├── festival/[slug]/        # Festival detail page
│   ├── festivals/              # Festivals listing (placeholder)
│   ├── blogs/                  # Blog listing (placeholder)
│   ├── puja/                   # Puja Vidhi (placeholder)
│   ├── temples/                # Temple directory (static HTML)
│   └── vrat/                   # Vrat listing (static HTML)
│
├── features/                   # Full-page "use client" feature components
│   ├── Home.tsx                # Homepage sections: hero, countdown, lunar cards, temples, calendar
│   ├── EkadashiDetails.tsx     # Ekadashi detail layout
│   ├── AmavasyaDetails.tsx     # Amavasya detail layout
│   ├── PurnimaDetails.tsx      # Purnima detail layout (adds moon-rise timing)
│   ├── PradoshDetails.tsx      # Pradosh detail layout (adds Muhurat/Trayodashi timings)
│   ├── FestivalDetails.tsx     # Festival detail (Markdown → HTML parser)
│   ├── VratDetails.tsx         # Vrat Katha detail layout
│   ├── Festivals.tsx           # "Coming Soon" placeholder
│   ├── Blogs.tsx               # "Coming Soon" placeholder
│   ├── Puja.tsx                # "Coming Soon" placeholder
│   ├── Temples.tsx             # Static temple grid (Ram Mandir, Kashi Vishwanath)
│   └── Vrat.tsx                # Static vrat table (Ekadashi, Amavasya rows)
│
├── components/                 # Shared UI / layout components
│   ├── Navbar.tsx              # Responsive navbar with mobile hamburger overlay
│   ├── Footer.tsx              # Multi-column footer with grouped link menus
│   ├── GlobalLoader.tsx        # Full-screen spinner overlay (reads Redux loading state)
│   ├── GlobalDataInitializer.tsx  # Dispatches Redux global thunks (defined, not mounted)
│   ├── Loading.tsx             # Full-screen spinner component
│   ├── ScrollToTop.tsx         # Scrolls to top on route change
│   └── ToastProvider.tsx       # react-hot-toast Toaster
│
├── store/
│   ├── store.ts                # Redux store with 3 reducers
│   ├── globalSlice.ts          # global + nearestData state
│   ├── homeSlice.ts            # homeData state
│   └── detailSlice.ts          # per-content-type detail state
│
├── common/
│   └── functions.ts            # Date helpers: formatDate, getDayFromDate, formatDateTime
│
└── constants.ts                # BASE_URL pointing to the Strapi Cloud API
```

---

## Pages & Routes

| Route | Feature Component | Data |
|---|---|---|
| `/` | `Home` | `/landing-page-full` + `/upcoming-events` |
| `/ekadashi/[slug]` | `EkadashiDetails` | `/ekadashis/slug/{slug}` |
| `/amavasya/[slug]` | `AmavasyaDetails` | `/amavasyas/slug/{slug}` |
| `/purnima/[slug]` | `PurnimaDetails` | `/purnimas/slug/{slug}` |
| `/pradosh/[slug]` | `PradoshDetails` | `/pradoshes/slug/{slug}` |
| `/vrat-katha/[slug]` | `VratDetails` | `/vrat-kathas/slug/{slug}` |
| `/festival/[slug]` | `FestivalDetails` | `/festivals/slug/{slug}` |
| `/festivals` | `Festivals` | None (placeholder) |
| `/blogs` | `Blogs` | None (placeholder) |
| `/puja` | `Puja` | None (placeholder) |
| `/temples` | `Temples` | None (static HTML) |
| `/vrat` | `Vrat` | None (static HTML) |

All dynamic `[slug]` pages export `generateMetadata`, reading `SEO.MetaTitle`, `SEO.MetaDescription`, `SEO.MetaRobots`, and Open Graph fields from the API response using the same cached `fetch`.

---

## API Calls

All calls go to the Strapi Cloud base URL defined in `src/constants.ts`:

```
BASE_URL = https://productive-breeze-327fa74162.strapiapp.com/api
```

| Endpoint | Caller | Purpose |
|---|---|---|
| `GET /global-full` | `app/layout.tsx` (server) | Header + footer content for every page |
| `GET /upcoming-events` | `app/page.tsx` (server) | Nearest Ekadashi, Purnima, Amavasya, Festival |
| `GET /landing-page-full` | `app/page.tsx` (server) | All homepage content blocks |
| `GET /ekadashis/slug/:slug` | `app/ekadashi/[slug]/page.tsx` (server) | Ekadashi detail + SEO + related content |
| `GET /amavasyas/slug/:slug` | `app/amavasya/[slug]/page.tsx` (server) | Amavasya detail |
| `GET /purnimas/slug/:slug` | `app/purnima/[slug]/page.tsx` (server) | Purnima detail |
| `GET /pradoshes/slug/:slug` | `app/pradosh/[slug]/page.tsx` (server) | Pradosh detail |
| `GET /vrat-kathas/slug/:slug` | `app/vrat-katha/[slug]/page.tsx` (server) | Vrat Katha detail |
| `GET /festivals/slug/:slug` | `app/festival/[slug]/page.tsx` (server) | Festival detail |

**Caching:** Every server-side fetch uses `next: { revalidate: 600 }` (10-minute ISR). Within a single request, `generateMetadata` and `Page` share one fetch result via React's `cache()`.

**No auth headers** — the Strapi API is publicly accessible.

---

## Data Flow

```
Strapi Cloud API
      │
      │  Native fetch() inside Next.js Server Components
      │  with { next: { revalidate: 600 } }
      ▼
Server Component  (layout.tsx / page.tsx / [slug]/page.tsx)
      │
      │  Passed as props
      ▼
"use client" Feature Component  (Home, EkadashiDetails, etc.)
      │
      │  Renders using prop data + local useState for timers/accordions
      ▼
Browser DOM
```

**Global layout data** (`/global-full`) is fetched once in `layout.tsx`, split into `headerData` → `<Navbar>` and `footerData` → `<Footer>`.

---

## Redux Store (Defined but Dormant)

Three slices follow the same `createAsyncThunk` + `extraReducers` pattern:

| Slice | State Keys | Thunks |
|---|---|---|
| `globalSlice` | `globalData`, `nearestData`, `loading`, `error` | `fetchGlobalData`, `fetchNextEkadashiData` |
| `homeSlice` | `homeData`, `loading`, `error` | `fetchHomeData` |
| `detailSlice` | `ekadashiDetailData`, `amavasyaDetailData`, `purnimaDetailData`, `pradoshDetailData`, `vratKathaDetailData`, `loading`, `error` | Five `fetchXDetails(slug)` thunks |

> The Redux thunks mirror every API call above, but are **not currently dispatched** — data arrives exclusively via server-side `fetch`. `GlobalDataInitializer` (which would have dispatched the global thunks) is defined but never mounted. `GlobalLoader` watches the Redux `loading` booleans but always returns null since no thunks run.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | Yes (production) | Google Analytics measurement ID |

Set this in your Netlify dashboard or a local `.env.local` file. The Strapi `BASE_URL` is hardcoded in `src/constants.ts`.

---

## Local Development

```bash
nvm use          # switches to Node 20.11.0
npm install
npm run dev      # starts on http://localhost:3000
```

---

## Deployment

The project deploys to **Netlify** automatically:

- Build command: `npm run build`
- Publish directory: `.next`
- Plugin: `@netlify/plugin-nextjs`
- Node version: `20.11.0` (set in `netlify.toml` and `.nvmrc`)

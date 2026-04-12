# TuLink - Project Context

## Project Overview

**TuLink** is a SaaS web application that allows sellers (primarily in LATAM markets, specifically Dominican Republic) to create a virtual product catalog and receive orders directly via WhatsApp. It enables entrepreneurs to showcase their products online without paying sales commissions. The application targets small business owners who sell through WhatsApp and need a simple, professional catalog solution.

**Core Value Proposition:** "Tu catálogo virtual, pedidos por WhatsApp" — Your virtual catalog, orders via WhatsApp.

### Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (strict mode)
- **Database/Auth:** Supabase (SSR auth with `@supabase/ssr`)
- **Icons:** FontAwesome 6
- **Font:** Inter (Google Fonts)
- **Linting:** ESLint 9

### Architecture
- **App Router** structure under `/app`
- **Middleware-based route protection** (`middleware.ts`)
- **Supabase Auth** with session management via HTTP-only cookies
- **React Context** for global auth state (`AuthProvider` in root layout)
- **Server + Browser Supabase clients** for SSR/CSR flexibility

---

## Key Directories & Files

```
tulink/
├── app/
│   ├── layout.tsx             # Root layout with AuthProvider, Inter font, SEO metadata
│   ├── page.tsx               # Landing page (marketing/conversion-focused)
│   ├── globals.css            # Global styles, custom utilities, animations
│   ├── favicon.ico
│   ├── dashboard/
│   │   └── page.tsx           # Protected dashboard (requires auth)
│   ├── login/
│   │   └── page.tsx           # Login page
│   └── registro/
│       └── page.tsx           # Registration page (30-day free trial signup)
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   ├── server.ts          # Server Supabase client
│   │   └── middleware.ts      # Middleware Supabase client
│   └── auth/
│       ├── auth.ts            # Auth utility functions
│       └── AuthContext.tsx    # React context provider for auth state
├── types/
│   └── database.types.ts      # TypeScript types for database schema
├── supabase/
│   └── setup.sql              # Database setup script (profiles table, RLS, triggers)
├── middleware.ts               # Route protection middleware
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS config (Tailwind v4)
├── eslint.config.mjs           # ESLint configuration
├── DESIGN_GUIDE.md             # Comprehensive design system guide
├── AUTH_SETUP.md               # Supabase auth setup documentation
├── IMPLEMENTATION_SUMMARY.md   # Auth implementation summary
└── .env.local.example          # Environment variables template
```

---

## Building & Running

### Development
```bash
npm run dev
```
Starts the Next.js development server. Open `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Builds the application for production.

### Start Production Server
```bash
npm run start
```

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality.

### Environment Setup
1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run `supabase/setup.sql` in Supabase SQL Editor to create the `profiles` table

---

## Brand & Design System

### Brand Colors (OFFICIAL)
- **Primary:** `#2ECC71` (Emerald Green)
- **Primary Dark:** `#27ae60` (hover/active states)
- **Primary Light:** `#58d68d` (accents)
- **Primary Glow:** `rgba(46, 204, 113, 0.4)` (shadows/glows)
- **Gradient:** `linear-gradient(135deg, #2ECC71 0%, #27ae60 100%)`

### Typography
- **Font Family:** Inter (weights: 300–900)
- **Hero Headline:** `text-[38px] sm:text-[46px] md:text-[54px] lg:text-[62px]`
- **Section Titles:** `text-3xl sm:text-4xl lg:text-5xl`
- **Body Text:** `text-base sm:text-lg`

### Border Radius
- **Buttons/Inputs:** `12px` (`rounded-[12px]`)
- **Cards:** `24px` (`rounded-[24px]`)
- **Icons (squircle):** `rounded-2xl`
- **Badges:** `rounded-full`

### Responsive Strategy
- **Mobile-first** approach
- **Breakpoints:** sm (640px), md (768px), lg (1024px)
- **Touch-friendly:** minimum 48px height for inputs/buttons
- **Decorative elements:** hidden on mobile via `hidden sm:block`

### Key Visual Effects
- **Glassmorphism:** `bg-white/70 backdrop-blur-xl`
- **Card hover:** `translateY(-12px)` + enhanced shadow
- **Primary button hover:** glow shadow + subtle lift
- **Animations:** `float`, `pulse-glow`, `fade-in-up`

> **Full design reference:** See `DESIGN_GUIDE.md` for comprehensive styles and `DESIGN_GUIDE.md` / `.qwen/skills/` for brand guidelines.

---

## Authentication Flow

### Registration (`/registro`)
1. User clicks "Comenzar prueba gratis" on landing page
2. Fills name, email, password (real-time validation)
3. Creates user in Supabase Auth
4. Automatically creates profile with **30-day free trial**
5. Redirects to `/dashboard`

### Login (`/login`)
1. User enters email + password
2. Authenticates with Supabase
3. Redirects to `/dashboard`

### Route Protection (middleware.ts)
- `/dashboard` → requires authentication, redirects to `/login` if not authenticated
- `/login` and `/registro` → redirect to `/dashboard` if already authenticated
- Server-side session validation via Supabase middleware client

### Database Schema (`profiles` table)
```sql
id                  UUID (PK, references auth.users)
name                TEXT (business name)
email               TEXT
trial_start_date    TIMESTAMP
trial_end_date      TIMESTAMP (30 days from start)
created_at          TIMESTAMP (auto)
updated_at          TIMESTAMP (auto-updated)
```

> **Full setup reference:** See `AUTH_SETUP.md`

---

## Development Conventions

### TypeScript
- **Strict mode enabled** (`"strict": true`)
- All files use `.ts` / `.tsx`
- Path aliases: `@/*` maps to project root
- Next.js plugin for type-safe routing and pages

### Component Patterns
- Server components by default (App Router)
- Client components marked with `"use client"` directive
- Auth state accessed via `AuthProvider` context
- Supabase clients split by context: browser, server, middleware

### Styling
- **Tailwind CSS v4** for all styling
- Custom utilities in `globals.css` (gradients, glassmorphism, animations)
- FontAwesome icons loaded via CDN in root layout
- Design tokens defined in `DESIGN_GUIDE.md`

### Copywriting & Tone
- **Language:** Spanish (LATAM, using "tú")
- **Tone:** Friendly, professional, benefit-oriented
- **Key phrases:** "Sin comisiones", "100% de tus ventas", "Prueba gratis"
- **CTAs:** "Empezar ahora", "Probar gratis", "Comenzar prueba gratis"

### SEO & Metadata
- Full Open Graph and Twitter Card metadata configured in `layout.tsx`
- Locale: `es_DO` (Dominican Republic)
- Canonical URL: `https://tulink.do`

---

## Security Features
- **Row Level Security (RLS)** — users can only access their own data
- **HTTP-only cookies** for session storage
- **Password validation:** minimum 6 characters
- **Server-side route protection** via middleware
- **Never commit `.env.local`** (gitignored)

---

## Future Enhancements (Planned)
- Email verification
- Password reset functionality
- OAuth providers (Google, GitHub)
- Profile editing page
- Subscription management post-trial
- Trial expiration notifications
- Two-factor authentication (2FA)

---

## Useful Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint check
npm run lint

# Type check (via Next.js build)
npm run build
```

---

## Important Notes for Agents
1. **Next.js 16 has breaking changes** from earlier versions — always consult `node_modules/next/dist/docs/` before writing code
2. **Design consistency is critical** — follow `DESIGN_GUIDE.md` and brand guidelines strictly
3. **Brand color `#2ECC71`** must be used as the primary color throughout
4. **Mobile-first responsive** — test at 375px, 768px, and 1024px viewports
5. **Supabase SSR** — use the correct client for each context (browser, server, middleware)
6. **Never expose `.env.local`** or service_role keys
7. **Output language:** Always respond in English (per user preference)

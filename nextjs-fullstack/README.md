# Ahmad Sami Aljaafar — Full-Stack 3D Portfolio & Interactive CV

Full-stack portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **React Three Fiber**, and **PostgreSQL**.

## Features
- **Cinematic 3D Stack Hero**: Floating 3-layer stack (UI, API, Database) with an animated request pulse, subtle scroll-linked layer separation, pointer parallax on desktop, lightweight static SVG on mobile, and `prefers-reduced-motion` support.
- **Editable Profile & Skills**: Stored in PostgreSQL and editable from `/admin`.
- **Filterable Projects**: Draft/Published workflow, screenshot upload (`/api/upload`), optional GitHub & live-demo links. Unpublished projects remain hidden from the public site and CV.
- **Interactive Automation Demo**: Local-only 4-step workflow simulator (`Form submission → Validate details → Create task → Notify team`) with JSON input/output inspection.
- **Validated Contact Form + Rate Limiting**: Server-side Zod validation and PostgreSQL-backed rate limiting (`/api/contact`).
- **Printable CV (`/cv`)**: Clean, text-based print layout ready for Print / Save as PDF.
- **Protected Admin Area (`/admin`)**: HttpOnly HMAC-signed session cookies + `scrypt` password verification.

## Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Generate an admin password hash and paste it into `ADMIN_PASSWORD_HASH`:
   ```bash
   npm run auth:hash -- "ChooseAStrongPassword!"
   ```
   Update `DATABASE_URL` and `SESSION_SECRET` in `.env.local`.

3. **Run PostgreSQL migrations**
   ```bash
   # Ensure the database exists first, e.g. createdb ahmad_portfolio
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ahmad_portfolio" npm run db:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   - Public Portfolio: `http://localhost:3000`
   - Printable CV: `http://localhost:3000/cv`
   - Admin Area: `http://localhost:3000/admin`

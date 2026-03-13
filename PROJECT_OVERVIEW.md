# Project Overview: NextJS Multi-Worker Monorepo

Welcome to the project! This document provides a comprehensive overview of the architecture, tech stack, file structure, and database schemas. It is designed to give any developer a full "mental map" of the project for future maintenance and feature development.

---

## 🏗️ Architecture Overview

This project is a **monorepo** managed with **Bun Workspaces**. It separates concerns into independent applications and shared packages, optimized for high-performance development and deployment on Vercel.

### Core Philosophy
- **Unified Logic**: Shared business logic, authentication, and database schemas reside in `packages/core`.
- **Decoupled Frontend/Backend**: The Next.js app handles the UI, while a lightweight Hono service handles the API logic.
- **Type Safety**: End-to-end type safety from the database (Drizzle) to the frontend (Hono RPC).

---

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: [Bun](https://bun.sh/) (Fast all-in-one JavaScript runtime).
- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components).
- **Backend API**: [Hono](https://hono.dev/) (High-performance web framework with OpenAPI support).
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/) (TypeScript-first PostgreSQL ORM).
- **Authentication**: [Better Auth](https://better-auth.com/) (Modular framework for auth).
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion.
- **Validation**: [Zod](https://zod.dev/) (Schema validation).

### Key Libraries & Services
- **Image Processing**:
  - `browser-image-compression`: Client-side image compression with web workers.
  - HTML5 Canvas API: Shape masking, image manipulation, and format conversion.
- **PDF Processing**:
  - `pdf-lib`: Create and modify PDFs entirely in the browser.
  - `pdfjs-dist`: Render PDF pages to HTML5 Canvas for re-encoding as JPEG.
- **External APIs**:
  - remove.bg API: AI-powered background removal.
  - Google Analytics 4 Data API: Real-time analytics dashboard.
- **Payment**: PayPal REST API for subscription management.
- **UI Components**: Shadcn UI, Radix UI primitives, Lucide Icons.
- **Animation**: Framer Motion for smooth transitions and psychological UI patterns.

---

## 🌐 Deployment & Domains

The project is deployed on **Vercel** with the following domain configuration:

### API Service (`apps/api`)
- **Primary Domain**: [api.ghostcod.com](https://api.ghostcod.com)
- **Vercel URL**: [nextjs-multiworker-api.vercel.app](https://nextjs-multiworker-api.vercel.app)

### Web Application (`apps/web`)
- **Primary Domains**: [ghostcod.com](https://ghostcod.com), [www.ghostcod.com](https://www.ghostcod.com)
- **Vercel URL**: [nextjs-multiworker-web.vercel.app](https://nextjs-multiworker-web.vercel.app)

---

## 📁 Full File Structure

### Root Directory
- `/apps/`: Contains the main applications.
- `/packages/`: Contains shared logic and configurations.
- `/scripts/`: Support scripts for setup, migrations, and CI/CD.
- `package.json`: Root workspace configuration.
- `PROJECT_OVERVIEW.md`: This document.

### `apps/web` (Next.js Frontend)
- `src/app/`: The main App Router.
    - `(auth)/`: Authentication routes:
        - `signin/`: Email + Google OAuth sign-in.
        - `signup/`: New account registration with email OTP.
        - `verify-email/`: Email OTP verification page (compact minimalist card design, works inside auth layout).
        - `reset-password/`: Password reset with OTP code input + new password fields.
        - `forgot-password/`: Request a password reset email.
        - `setup/`: Post-signup agent profile setup.
    - `(tools)/`: Core utility tools (all share a common tools layout):
        - `image-crop/`: Advanced image cropper with 8 Pro shapes (rect, circle, triangle, star, heart, diamond, hexagon, pentagon). Includes free-crop canvas mode.
        - `background-remover/`: AI-powered background removal with client-side image compression.
        - `pdf-compressor/`: Client-side PDF compression using pdf-lib + pdfjs-dist (zero external API).
        - `image-converter/`: Client-side image format conversion — PNG, JPG, WEBP (Pro), BMP (Pro).
        - `youtube-thumbnail-downloader/`: YouTube thumbnail downloader — fetch by URL, download by resolution (maxres, hq, mq, sd). Two variants: `hero` (compact homepage card) and `full` (tool page with resolution cards and cross-sell CTAs). Anonymous-friendly (no login required).
        - `tiktok-thumbnail-downloader/`: TikTok video thumbnail downloader — paste TikTok URL, fetches available thumbnails. Similar dual-variant pattern to YouTube downloader.
        - `word-counter/`: Real-time text analysis tool — character/word/sentence counts, reading time, platform limit bars (Twitter, SMS, Meta), keyword density, and contextual upsell prompts. Fully client-side, no credits consumed.
        - `invoice-generator/`: PDF invoice generator — fill in company/client details, line items, tax, and generate a professionally formatted PDF for download.
    - `api/`: Next.js API routes for external service integration.
        - `bg-removal/remove/`: Proxy route for remove.bg API integration.
        - `thumbnail/`: Next.js route for YouTube thumbnail download proxying.
        - `tiktok/`: Next.js route for TikTok thumbnail download proxying.
        - `[[...path]]/`: Catch-all proxy to Hono API for RPC.
    - `billing/`: Subscription management UI.
    - `dashboard/`: Main user dashboard.
        - `articles/`: Agent article editor and management.
        - `projects/`: User project listing (linked to service requests).
    - `admin/`: Admin dashboard.
        - `articles/`: Admin article review and approval system.
        - `reviews/`: User review moderation with status filter (pending/approved/rejected).
        - `analytics/`: Google Analytics 4 embedded dashboard.
        - `sales/`: Subscription and revenue analytics.
        - `users/`: User management.
        - `service-requests/`: Admin management of incoming freelance/service requests (full CRUD, status progression, admin notes).
        - `projects/`: Admin project tracking.
    - `blog/`: Public blog pages (SEO-optimized).
        - `[slug]/`: Individual blog post pages.
    - `services/`: Public services/freelance landing page with service request form.
        - `request/`: Multi-step service request submission form (no login required).
    - `about/`: About page.
    - `faq/`: FAQ page.
    - `privacy/`: Privacy policy page.
    - `terms/`: Terms of service page.
    - `qr/`: QR code generator tool with Pro color customization.
    - `signature/`: Digital signature generator tool.
    - `tasks/`: Task management tool.
- `src/components/`: Reusable UI components including:
    - `background-remover.tsx`: Full background removal component with compression.
    - `advanced-image-cropper.tsx`: Image crop with Pro shape gating and free-crop canvas mode.
    - `free-crop-canvas.tsx`: Canvas component for freeform crop mode.
    - `pdf-compressor.tsx`: Client-side PDF compressor with auth gate, quality presets, and Pro upsell.
    - `image-format-converter.tsx`: Client-side image format converter with Pro gating for WEBP/BMP.
    - `youtube-thumbnail-downloader.tsx`: YouTube thumbnail downloader with hero and full variants.
    - `tiktok-thumbnail-downloader.tsx`: TikTok thumbnail downloader with hero and full variants.
    - `word-counter.tsx`: Real-time word/character analysis tool with platform limit bars.
    - `reviews.tsx`: Public reviews display component.
    - `tool-card.tsx`: Reusable tool card used on homepage and tools carousel.
    - `tools-carousel.tsx`: Scrollable carousel of available tools for the homepage.
    - `tool-search.tsx`: Keyboard-accessible (Ctrl+K) search bar with filtered tool results.
    - `credit-assistant.tsx`: Contextual credit assistant widget.
    - `header.tsx`: Main navigation header with search, auth state, and mobile menu.
    - `footer.tsx`: Site footer with links and branding.
    - `animated-background.tsx`: Animated grid/glow background component.
    - `otp-input.tsx`: 6-digit OTP input (compact minimalist design, `w-10 h-11` boxes, auto-advance, paste support).
    - `subscription-plans.tsx`: Pricing plan cards component.
    - `pro-upgrade-card.tsx`: Reusable Pro upsell card component.
    - `upgrade-button.tsx`: Inline upgrade button component.
- `src/lib/`: Frontend-specific utilities.
    - `crop-utils.ts`: Canvas-based image cropping with shape masking.
    - `rpc/client.ts`: Type-safe Hono RPC client factory.
- `src/modules/`: Larger feature-based modules.
    - `auth/components/`: Auth form components:
        - `signin-form.tsx`, `signup-form.tsx`, `forget-password-form.tsx`
        - `reset-password-form.tsx`: Reset password with OTP + new password fields. Compact card design inside auth layout.
        - `agent-setup-form.tsx`: Post-signup agent profile form.
        - `signout-button.tsx`: Sign-out action button.
    - `qr/components/`: QR generator with psychological Pro color lock UI.
    - `signature/components/`: Digital signature view/editor.
    - `invoice/components/InvoicePreview.tsx`: PDF invoice preview and generation component.
    - `tasks/`: Task management UI.
- `src/middleware.ts`: Next.js middleware for route protection.

### `apps/api` (Hono API Server)
- `src/app.ts`: Entry point for the Hono server.
- `src/handlers/`: Contains the business logic for each route:
    - `billing.handlers.ts`: Subscription and credit management.
    - `blog.handlers.ts`: Blog post CRUD and approval workflow.
    - `bg-removal.handlers.ts`: Background removal usage tracking and credit deduction.
    - `pdf-compression.handlers.ts`: PDF compression usage tracking and credit deduction.
    - `image-conversion.handlers.ts`: Image format conversion credit deduction and usage tracking.
    - `crops.handlers.ts`: Image crop/download credit tracking.
    - `qr.handlers.ts`: QR code generation credit tracking.
    - `signatures.handlers.ts`: Digital signature CRUD and credit management.
    - `tasks.handlers.ts`: Task CRUD operations.
    - `reviews.handlers.ts`: Review submission and moderation.
    - `admin.handlers.ts`: User management, analytics, and review/service request moderation.
    - `analytics.handlers.ts`: Google Analytics 4 integration.
    - `invoice.handlers.ts`: Invoice download tracking and credit deduction.
    - `thumbnail.handlers.ts`: YouTube thumbnail fetch/download proxy with download count tracking.
    - `tiktok.handlers.ts`: TikTok thumbnail fetch/download proxy.
    - `services.handlers.ts`: Service request submission, admin status management, client messaging.
    - `test-ga4.handlers.ts`: GA4 integration test handler.
- `src/routes/`: Route definitions with Zod OpenAPI schemas:
    - `bg-removal.route.ts`, `pdf-compression.route.ts`, `image-conversion.route.ts`
    - `billing.route.ts`, `blog.route.ts`, `admin.route.ts`
    - `crops.route.ts`, `qr.route.ts`, `signatures.route.ts`, `tasks.route.ts`
    - `reviews.route.ts`, `invoice.route.ts`, `services.route.ts`
    - `thumbnail.route.ts`: YouTube thumbnail fetch and download routes.
    - `tiktok.route.ts`: TikTok thumbnail fetch and download routes.
    - `index.route.ts`: Health check route.
- `src/registry/`: Links routes and handlers together and exports the type-safe Router for RPC.
- `src/middlewares/`: Custom API middlewares.
    - `auth.middleware.ts`: Session verification.
    - `credits.middleware.ts`: Credit balance enforcement.
    - `admin.middleware.ts`: Admin role verification.
- `builders/`: Build scripts for Vercel deployment.
    - `build-types.ts`: Generates TypeScript declaration files from Hono router for RPC type safety.

### `packages/core` (Shared Infrastructure)
- `src/auth/`: Centralized authentication setup and helpers.
- `src/database/`: Core database connection and schema definitions.
    - `schema/`: All Drizzle table schemas.
    - `queries/`: Reusable database query functions.
- `src/zod/`: Shared validation schemas.
- `types/`: Auto-generated TypeScript declarations for Hono Router (used for RPC).

---

## 🗄️ Database Schema Details

All schemas are defined in `packages/core/src/database/schema/`.

### 1. `users` (Core Profiles)
Core user profiles managed by Better Auth.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `email` | `text` | Not Null, Unique |
| `email_verified` | `boolean` | Default: `false` |
| `plan` | `text` | `basic`, `pro`, `premium`. Default: `basic` |
| `subscription_id` | `text` | PayPal Subscription ID |
| `subscription_status` | `text` | `active`, `cancelled`, `expired` |
| `credits_remaining` | `integer` | Default: `5` |
| `credits_used` | `integer` | Default: `0` |

### 2. `qr_codes` (QR Generator)
Stores generated QR codes and their metadata.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` |
| `url` | `text` | Targeted URL |
| `color` | `varchar(16)` | Hex code (Default: `#000000`) |
| `background_color` | `varchar(16)` | Hex code (Default: `#ffffff`) |

### 3. `signatures` (Digital Signatures)
Stores digital signature records and asset paths.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` |
| `name` | `varchar(255)` | Name/Label of the signature |
| `type` | `text` | `draw`, `type`, `upload` |
| `image_url` | `text` | URL to the signature image |
| `is_default` | `boolean` | Default status |

### 4. `crop_downloads` (Image Tool)
Tracks history of image cropping operations.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` |
| `file_name` | `text` | Default: `image` |
| `created_at` | `timestamp` | Timestamp of download |

### 5. `bg_removals` (Background Remover)
Tracks background removal operations for usage analytics and credit tracking.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` (Cascade delete) |
| `file_name` | `text` | Original filename (Default: `image`) |
| `created_at` | `timestamp` | Timestamp of removal |

### 6. `pdf_compressions` (PDF Compressor)
Tracks PDF compression operations for usage analytics and credit tracking.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` (Cascade delete) |
| `file_name` | `text` | Original filename (Default: `document`) |
| `created_at` | `timestamp` | Timestamp of compression |

### 7. `reviews` (User Reviews)
Stores user-submitted reviews with admin moderation workflow.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` |
| `content` | `text` | Review text content |
| `rating` | `integer` | Star rating (1-5) |
| `status` | `text` | `pending`, `approved`, `rejected` (Default: `pending`) |
| `created_at` | `timestamp` | Submission timestamp |

### 8. `tasks` (Tasks Tool)
Track background or user-specific tasks.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `integer` | Primary Key (Serial) |
| `name` | `text` | Task name |
| `done` | `boolean` | Status (Default: `false`) |

### 9. `image_conversions` (Image Format Converter)
Tracks image format conversion operations for credit tracking.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` (Cascade delete) |
| `file_name` | `text` | Original filename (Default: `image`) |
| `from_format` | `text` | Source format (e.g. `png`) |
| `to_format` | `text` | Target format (e.g. `webp`) |
| `created_at` | `timestamp` | Timestamp of conversion |

### 10. `blog_posts` (Blog/CMS System)
Stores blog articles with agent-to-admin approval workflow for SEO content marketing.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `title` | `varchar(255)` | Article title |
| `slug` | `text` | URL-friendly unique slug |
| `content` | `text` | Markdown content |
| `excerpt` | `text` | Short preview (SEO) |
| `author_id` | `text` | References `users.id` |
| `status` | `text` | `draft`, `pending`, `approved`, `rejected` |
| `featured_image` | `text` | Cover image URL |
| `meta_title` | `text` | SEO meta title |
| `meta_description` | `text` | SEO meta description |
| `tags` | `text` | Comma-separated tags |
| `reading_time` | `text` | Estimated reading time |
| `views` | `text` | View count tracker |
| `approved_at` | `timestamp` | Approval timestamp |
| `approved_by` | `text` | Admin who approved |
| `published_at` | `timestamp` | Publication date |

### 11. `invoice_downloads` (Invoice Generator)
Tracks invoice PDF generation for credit tracking and history.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `user_id` | `text` | References `users.id` (Cascade delete) |
| `invoice_number` | `text` | Invoice number/identifier |
| `client_name` | `text` | Name of the billed client |
| `total_amount` | `text` | Total invoice amount |
| `currency` | `text` | Currency code (Default: `USD`) |
| `created_at` | `timestamp` | Generation timestamp |

### 12. `thumbnail_downloads` (YouTube Thumbnail Downloader)
Tracks YouTube thumbnail downloads — supports anonymous and authenticated users.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `video_id` | `text` | YouTube video ID |
| `resolution` | `text` | `maxres`, `hq`, `mq`, `sd`, `default` |
| `user_id` | `text` | References `users.id` (Nullable — anonymous allowed) |
| `created_at` | `timestamp` | Download timestamp |
| `updated_at` | `timestamp` | Last updated |

### 13. `tiktok_downloads` (TikTok Thumbnail Downloader)
Tracks TikTok thumbnail downloads.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `video_id` | `text` | TikTok video identifier |
| `user_id` | `text` | References `users.id` (Nullable — anonymous allowed) |
| `created_at` | `timestamp` | Download timestamp |
| `updated_at` | `timestamp` | Last updated |

### 14. `service_requests` (Freelance/Services System)
Stores incoming freelance service requests from prospective clients. No login required to submit.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `client_name` | `text` | Client's full name |
| `client_email` | `text` | Client's email address |
| `client_company` | `text` | Company name (optional) |
| `client_website` | `text` | Website URL (optional) |
| `project_type` | `text` | `saas`, `landing`, `ecommerce`, `tool`, `portfolio`, `other` |
| `project_title` | `text` | Short project title |
| `project_description` | `text` | Detailed project brief |
| `budget_range` | `text` | `under500`, `500to1k`, `1kto3k`, `3kto5k`, `5kplus` |
| `timeline` | `text` | `asap`, `1month`, `3months`, `flexible` |
| `referral_source` | `text` | `google`, `social`, `friend`, `ghostcod_tool`, `other` |
| `status` | `text` | `pending` → `approved` → `in_discussion` → `quoted` → `paid` → `in_progress` → `delivered` \| `rejected` |
| `user_id` | `text` | Nullable — links to registered user if they sign up later |
| `admin_note` | `text` | Internal admin notes |
| `rejection_reason` | `text` | Reason if rejected |
| `approved_at` | `timestamp` | Approval timestamp |
| `rejected_at` | `timestamp` | Rejection timestamp |
| `created_at` | `timestamp` | Submission timestamp |
| `updated_at` | `timestamp` | Last updated |

### 15. `service_messages` (Service Request Messaging)
Threaded messages between admin and client within a service request.

| Column | Type | Options |
| :--- | :--- | :--- |
| `id` | `text` | Primary Key |
| `request_id` | `text` | References `service_requests.id` |
| `sender_type` | `text` | `admin` or `client` |
| `message` | `text` | Message content |
| `created_at` | `timestamp` | Message timestamp |

---

## 🔑 Core Workflows

### 🛠️ Available Tools Overview
The platform offers a suite of productivity and creative tools with tiered access:

**Free Tools (no login required)**:
- YouTube Thumbnail Downloader (all resolutions, anonymous)
- TikTok Thumbnail Downloader (anonymous)
- Word Counter (fully free, no credits)

**Free Tools (Basic Plan - 5 credits/month)**:
- QR Code Generator (black & white only)
- Image Crop Tool (rectangle and circle shapes only)
- Digital Signature Generator
- Background Remover (5 removals/month)
- PDF Compressor (5 compressions/month, 100% client-side)
- Image Format Converter (PNG ↔ JPG only, 5 conversions/month)
- Invoice Generator (5 downloads/month)
- Task Management

**Pro Tools ($1.99/month - 50 credits/month)**:
- QR Code Generator with full color customization
- Image Crop Tool with 8 shapes (triangle, star, heart, diamond, hexagon, pentagon + basic shapes)
- Background Remover (50 removals/month)
- PDF Compressor (50 compressions/month)
- Image Format Converter (all formats incl. WEBP & BMP, 50 conversions/month)
- Invoice Generator (50 downloads/month)
- Digital Signature with unlimited signatures
- Priority support

**Admin Tools**:
- User Management Dashboard
- Blog Post Approval System
- Review Moderation System (with status filter: pending/approved/rejected)
- Google Analytics 4 Integration
- Sales & Subscription Analytics
- Service Request Management (full pipeline from `pending` → `delivered`)

### 🎥 YouTube Thumbnail Downloader (Free, No Login Required)
Fetch and download YouTube video thumbnails in all available resolutions.

**Technical Flow**:
1. User pastes a YouTube URL (supports `youtube.com/watch?v=`, `youtu.be/`, `shorts/`, `embed/` formats).
2. Frontend calls Hono RPC `POST /api/thumbnail/fetch` → API resolves video ID + checks availability of each resolution.
3. Available thumbnails are shown as resolution cards (maxres → sd).
4. Download call goes to `GET /api/thumbnail/download?url=...` — API proxies the image as a blob to bypass CORS.
5. Download tracked in `thumbnail_downloads` table (anonymous-friendly: `user_id` is nullable).
6. Live download count shown in UI via `GET /api/thumbnail/stats`.

**Two UI Variants**:
- **`hero`**: Compact white card used on the homepage — input, example buttons, best thumbnail preview, 3 resolution buttons.
- **`full`**: Full tool page — large preview, all resolution cards, cross-sell CTAs to other tools.

**Key Features**:
- No login or credits required — fully public.
- Anonymous download tracking for real social proof numbers.
- Live count: "✓ N thumbnails downloaded" stat.
- Cross-sell panel to image editing tools and sign-up CTA for anonymous users.

### 🎵 TikTok Thumbnail Downloader (Free, No Login Required)
Fetch thumbnail images from TikTok video URLs.

**Technical Flow**:
1. User pastes TikTok URL → Hono `POST /api/tiktok/fetch` resolves cover image.
2. Download proxied through `GET /api/tiktok/download` to avoid CORS issues.
3. Downloads tracked in `tiktok_downloads` table.

### 📝 Word Counter (Free Tool — No Credits)
Real-time text analysis with platform limit warnings and contextual upsell prompts.

**Features**:
- **Core Stats**: Words, characters (with/without spaces), sentences, paragraphs, lines.
- **Reading Metrics**: Reading time (200 wpm) and speaking time (130 wpm).
- **Platform Limit Bars**: Animated progress bars for Twitter/X (280), SMS (160), Meta Description (160), Meta Title (60).
- **Keyword Density**: Top 5 keywords by frequency, excluding stop words.
- **Contextual Upsells**: Banner appears at >160 chars ("Too long for SEO meta") and >280 chars ("Over Twitter limit").
- **Engaged Upsell**: After 50+ words, an upsell card appears suggesting other tools.
- **No backend dependency** — 100% client-side analysis, `useMemo` for performance.

### 🧾 Invoice Generator (Credit-Based)
Generate professionally formatted PDF invoices in the browser.

**Technical Flow**:
1. User fills in sender company details, client info, line items, tax rate, and notes.
2. Credit is deducted via Hono RPC `POST /api/invoice/generate`.
3. Frontend assembles the PDF using the `InvoicePreview` component.
4. Download triggered client-side — no server upload.
5. Record saved in `invoice_downloads` table for history tracking.

**Integration Points**:
- `/apps/api/src/routes/invoice.route.ts`: Hono route.
- `/apps/api/src/handlers/invoice.handlers.ts`: Credit deduction and record saving.
- `/apps/web/src/modules/invoice/InvoicePreview.tsx`: Full invoice layout and PDF generation.
- `/apps/web/src/app/(tools)/invoice-generator/page.tsx`: Next.js tool page.

### 🔧 Services & Freelance System
A full service request pipeline allowing prospective clients to submit project briefs and track them through admin approval.

**Client Flow** (`/services`):
- Browse available service types on the public services page.
- Submit a project request via `/services/request` multi-step form (no login required).
- Provides project type, description, budget range, timeline, and contact info.
- Request stored with `status: pending`.

**Admin Flow** (`/admin/service-requests`):
- View all incoming service requests with filters by status.
- Progress status through pipeline: `pending` → `approved` → `in_discussion` → `quoted` → `paid` → `in_progress` → `delivered` (or `rejected`).
- Add admin notes and rejection reasons.
- Send threaded messages to the client via `service_messages`.

**Integration Points**:
- `/apps/api/src/routes/services.route.ts`: Full CRUD + status management routes.
- `/apps/api/src/handlers/services.handlers.ts`: All business logic.
- `/packages/core/src/database/schema/service_requests.ts`: Main request schema.
- `/packages/core/src/database/schema/service_messages.ts`: Messaging thread schema.
- `/apps/web/src/app/services/`: Public services landing page.
- `/apps/web/src/app/services/request/`: Multi-step submission form.
- `/apps/web/src/app/admin/service-requests/`: Admin management dashboard.

---

### 📝 Blog/CMS System (Agent → Admin → Public)
A multi-role content management system for organic SEO growth:

**Agent Role**:
- Create, edit, and delete their own articles in `/dashboard/articles`.
- Submit articles for admin review (status: `draft` → `pending`).
- View rejection feedback and resubmit.

**Admin Role**:
- Review all pending articles in `/admin/articles`.
- Approve articles (status: `pending` → `approved`, becomes publicly visible).
- Reject articles with feedback (status: `pending` → `rejected`).

**Public Pages**:
- `/blog`: List all approved articles (SEO-optimized, server-rendered).
- `/blog/[slug]`: Individual article pages with dynamic metadata, view tracking, and internal tool links.

### 📄 PDF Compressor (100% Client-Side)
A credit-based PDF compression tool that reduces file size entirely in the browser — no server upload, zero external API cost.

**Technical Flow**:
1. **Credit Deduction**: Hono RPC call to `POST /api/pdf-compression/compress` deducts 1 credit before compression begins.
2. **PDF Rendering**: `pdfjs-dist` loads the PDF and renders each page to an HTML5 Canvas element.
3. **JPEG Re-encoding**: Each canvas frame is exported as JPEG at the chosen quality preset.
4. **PDF Assembly**: `pdf-lib` assembles the JPEG pages into a new compressed PDF.
5. **Download**: Resulting `Blob` offered as client-side download — file never leaves device.

**Quality Presets**:
| Preset | Canvas Scale | JPEG Quality | Use Case |
| :--- | :--- | :--- | :--- |
| Maximum Compression | 0.6× | 0.4 | Smallest file, email attachments |
| Balanced | 0.85× | 0.65 | General sharing |
| High Quality | 1.0× | 0.82 | Archiving, print-quality |

### 🖼️ Image Format Converter (100% Client-Side)
Credit-based image format conversion using native Canvas API — no libraries, no server upload.

**Supported Formats**:
| Format | Input | Output (Free) | Output (Pro) |
| :--- | :--- | :--- | :--- |
| PNG | ✅ | ✅ | ✅ |
| JPG/JPEG | ✅ | ✅ | ✅ |
| WEBP | ✅ | ❌ | ✅ |
| GIF | ✅ | ❌ | ❌ |
| BMP | ✅ | ❌ | ✅ |

### 🎨 Background Remover (AI-Powered Tool)
Credit-based background removal using remove.bg API.

**Technical Flow**:
1. User uploads image (up to 10MB).
2. Images >3.8MB are auto-compressed using `browser-image-compression`.
3. Credit deducted via Hono RPC.
4. Next.js API route calls remove.bg API with `REMOVE_BG_API_KEY`.
5. Transparent PNG streamed back to client.

### 🔒 Pro Gating System (Psychological UI)
Premium features locked behind Pro subscriptions using psychological UI patterns.

- **QR Code Colors**: Locked to black & white for Basic; full palette for Pro.
- **Image Crop Shapes**: Rect + Circle free; Triangle/Star/Heart/Diamond/Hexagon/Pentagon Pro-only.
- **Image Converter Output Formats**: PNG/JPG free; WEBP/BMP Pro-only.
- **Invoice Downloads**: 5/month free; 50/month Pro.
- All gated features: blurred preview + lock icon + expandable upsell panel with pricing.

### 🔐 Authentication & Email OTP
- **Better Auth Email OTP**: Secure sign-in and sign-up using 6-digit verification codes.
- **Verify Email Page**: Compact, minimalist OTP card (no full-screen wrapper — works cleanly inside auth layout).
- **Reset Password Page**: OTP code + new password fields in a single card with header divider.
- **OTP Input Component**: `w-10 h-11` compact boxes with auto-advance, paste, backspace navigation, and error state highlight.
- **Personalized Templates**: Custom HTML email templates in `packages/core/src/email/templates.ts`.

### ⭐ Review System (User Feedback + Moderation)
- Users submit 1-5 star reviews with text content.
- Admin moderation at `/admin/reviews` with **status filter dropdown** (all/pending/approved/rejected).
- Approved reviews shown publicly on homepage.

### 🔄 Type Generation Pipeline
End-to-end type safety from Hono routes to Next.js RPC calls.

**Build Process**:
1. Hono routes defined in `/apps/api/src/routes/` with Zod schemas.
2. Routes aggregated in `/apps/api/src/registry/index.ts` → exports `Router` type.
3. `bun run build:types` runs `/apps/api/builders/build-types.ts`.
4. Output: TypeScript declaration files → `/packages/core/types/src/registry/index.d.ts`.
5. Web app imports `import type { Router } from 'core/types'` for RPC client.

---

## 🚀 Commands & Development

### Common Commands
- `bun install`: Install all dependencies across the monorepo.
- `bun dev:web`: Run Next.js frontend in development mode (port 3000).
- `bun dev:api`: Run Hono API server in development mode (port 4000).
- `bun build:web`: Build Next.js for production.
- `bun build:api`: Build Hono API for production.

### Database Commands
- `bun db:generate`: Generate new Drizzle migration files from schema changes.
- `bun db:push`: Push schema changes directly to database (no migrations).
- `bun db:migrate`: Run pending migrations from `src/database/migrations/`.
- `bun db:studio`: Launch Drizzle Studio (visual database browser).

### Type Generation Commands
- `cd apps/api && bun run build:types`: Generate TypeScript declarations for Hono Router.
- Output location: `/packages/core/types/src/registry/index.d.ts`
- Required after: Adding/modifying any Hono routes or handlers.

### Environment Setup
A full list of secrets is required for local development and production deployment:

**Core Services**:
- `DATABASE_URL`: PostgreSQL connection string (Neon/Vercel Postgres).
- `BETTER_AUTH_SECRET`: Secret key for Better Auth session encryption.
- `BETTER_AUTH_URL`: Auth callback URL (e.g., `http://localhost:3000/api/auth`).

**OAuth Providers**:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials.

**Payment Integration**:
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`: PayPal API credentials.
- `PAYPAL_WEBHOOK_ID`: PayPal webhook verification ID.
- `PAYPAL_PRODUCT_ID`, `PAYPAL_PLAN_PRO`: PayPal subscription plan IDs.

**External APIs**:
- `REMOVE_BG_API_KEY`: API key for remove.bg background removal service.
- `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_EMAIL`, `GA4_PRIVATE_KEY`: Google Analytics 4 Data API credentials.

**URLs**:
- `CLIENT_URL`, `API_URL`, `FRONTEND_URL`: Environment-specific base URLs.

**Email Service**:
- `EMAIL_FROM_NOREPLY`: Sender address for OTP emails (e.g., `noreply@ghostcod.com`).
- `RESEND_API_KEY`: API key for the email delivery service.

---

## 🔧 Advanced Features

### Client-Side Image Compression
Implemented in Background Remover to bypass Vercel's 4.5MB body limit:
- **Library**: `browser-image-compression` (Web Worker-based).
- **Trigger**: Images > 3.8MB are auto-compressed.
- **Target**: Compressed to ~3.5MB while maintaining quality.

### Canvas-Based Shape Masking
Used in Image Crop tool for Pro shape rendering:
- **Technique**: HTML5 Canvas `globalCompositeOperation = 'destination-in'`.
- **Shapes**: 8 total (rect, circle, triangle, star, heart, diamond, hexagon, pentagon).
- **Implementation**: `/apps/web/src/lib/crop-utils.ts` → `applyShapeMask()`.

### Canvas-Based Format Conversion
Zero-dependency format switching using browser Canvas API:
- `createImageBitmap()` → `canvas.getContext('2d').drawImage()` → `canvas.toBlob(mimeType)`.
- JPG: Canvas pre-filled white to replace transparency.

### Google Analytics 4 Integration
Admin dashboard displays real-time GA4 metrics:
- **API**: Google Analytics Data API with service account authentication.
- **Metrics**: Active users, page views, sessions, conversions, top pages, traffic sources.
- **Location**: `/apps/api/src/handlers/analytics.handlers.ts`.

### Thumbnail Download Proxy
YouTube and TikTok thumbnail downloads are proxied through the Hono API to avoid CORS restrictions:
- `GET /api/thumbnail/download?url=...` fetches the image server-side and returns it as a blob.
- Allows direct client-side download without needing CORS headers from YouTube/TikTok CDNs.

---

## 📝 Maintenance Notes

### Adding a New Database Table
1. Create schema file in `/packages/core/src/database/schema/` (e.g., `my_table.schema.ts`).
2. Export the schema in `/packages/core/src/database/schema/index.ts`.
3. Run `bun db:generate` to create migration file.
4. Run `bun db:migrate` or `bun db:push` to apply changes.
5. Create corresponding Zod schemas in `/packages/core/src/zod/`.
6. Create query functions in `/packages/core/src/database/queries/`.

### Adding a New API Endpoint
1. **Define Route**: Create route definition in `/apps/api/src/routes/` with Zod OpenAPI schemas.
2. **Create Handler**: Implement business logic in `/apps/api/src/handlers/`.
3. **Register Route**: Connect in `/apps/api/src/registry/`.
4. **Aggregate**: Import and mount in `/apps/api/src/registry/index.ts`.
5. **Regenerate Types**: Run `bun run build:types` in `apps/api`.
6. **Frontend Usage**: Use type-safe RPC client via `getClient()`.

### Adding a New Tool (Free/Anonymous)
For tools like YouTube Thumbnail Downloader that don't require login:
1. Create the frontend component in `apps/web/src/components/`.
2. Create the tool page in `apps/web/src/app/(tools)/[tool-name]/page.tsx`.
3. Add Hono route + handler in `apps/api` (no `authMiddleware` for public routes).
4. If download tracking is needed, make `user_id` nullable in the schema.
5. Add tool to the homepage `tools` array and `tools-carousel.tsx`.

### Adding a New Pro-Gated Feature
1. **UI Component**: Add psychological lock UI with blurred preview, lock icons, and expandable upsell panel.
2. **Backend Check**: Use `requireCredits` or `subscriptionMiddleware` in Hono routes.
3. **Credit Tracking**: Record usage in dedicated table.
4. **Dashboard Integration**: Add activity card and usage counter to the dashboard page.

### Common Pitfalls
- **TypeScript Errors**: Always regenerate types after modifying Hono routes.
- **Credit Tracking**: Ensure all premium features deduct credits before performing operations.
- **Vercel Body Limit**: Keep request bodies under 4.5MB (use client-side compression if needed).
- **Authentication**: Use `authMiddleware` on all protected routes; check `c.get("user")` in handlers.
- **Nested Admin Routes**: May require `@ts-expect-error` comments due to complex Hono type inference.
- **Core Package Dist**: `packages/core` compiles to `dist/` which the API imports at runtime. After adding new exports, always run `bun run --filter core build` before restarting the API server.
- **Hydration Errors**: Ensure client-side hooks like `useSearchParams()` are wrapped in a `Suspense` boundary.
- **Auth Layout Conflict**: The `(auth)/layout.tsx` already centers content and renders the logo. Auth page components (verify-email, reset-password) should render as **plain cards** — NOT with their own `min-h-screen flex items-center justify-center` wrappers, which would conflict with the layout.
- **OTP Input Sizing**: Use `w-10 h-11` for compact OTP boxes — the `sm:` responsive variants were removed to prevent boxes from overflowing cards on smaller-than-expected viewports.

---

## 🎯 Project Status & Roadmap

### Current State (March 2026)
The platform is fully operational with the following features live in production:

**Implemented Features**:
- ✅ User authentication (email OTP + Google OAuth)
- ✅ Subscription management (PayPal integration)
- ✅ Credit-based tool access system
- ✅ **11 tools** (QR, Image Crop, Signature, Background Remover, PDF Compressor, Image Format Converter, Invoice Generator, YouTube Thumbnail Downloader, TikTok Thumbnail Downloader, Word Counter, Tasks)
- ✅ Pro gating with psychological conversion UI
- ✅ Blog/CMS system with agent-to-admin workflow
- ✅ Review moderation system with status filter (pending/approved/rejected)
- ✅ Admin dashboard with Google Analytics 4 integration
- ✅ Services/freelance request system with full status pipeline
- ✅ Service request messaging thread (admin ↔ client)
- ✅ End-to-end type safety (Hono RPC)
- ✅ Client-side image compression
- ✅ Client-side PDF compression (pdf-lib + pdfjs-dist, zero external API)
- ✅ Client-side image format conversion (Canvas API, zero external API)
- ✅ YouTube thumbnail downloader (anonymous, CORS-proxied, live download stats)
- ✅ TikTok thumbnail downloader (anonymous, CORS-proxied)
- ✅ Word counter with platform limit bars and keyword density
- ✅ Invoice generator with PDF download
- ✅ Responsive design across all tools
- ✅ Improved auth UI: compact OTP input, minimalist verify-email and reset-password cards
- ✅ Tool search bar (Ctrl+K shortcut) and tools carousel on homepage
- ✅ Corrected build pipeline for Vercel deployment

**Infrastructure**:
- Deployed on Vercel (web + api)
- PostgreSQL database (Neon)
- Custom domains configured (ghostcod.com, api.ghostcod.com)
- CI/CD pipeline with automatic type generation
- PayPal webhook integration for subscription sync

### Future Enhancement Ideas
- Real-time collaboration features
- File storage with CDN integration
- More image editing tools (filters, resize, watermark)
- Word document to PDF converter
- API rate limiting and abuse prevention
- User notification system
- Webhook support for integrations
- Mobile app (React Native)
- Advanced analytics dashboard
- Team/organization accounts
- White-label options for resellers

---

## 📚 Additional Resources

- [Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)
- [Environment Setup](VERCEL_ENV_SETUP.md)
- [PayPal Setup Guide](PAYPAL_SETUP.md)
- [Google Analytics Integration](GOOGLE_ANALYTICS_GUIDE.md)
- [Blog CMS Guide](BLOG_CMS_GUIDE.md)

---

**Last Updated**: March 11, 2026 — Added YouTube/TikTok thumbnail downloaders, Word Counter, Invoice Generator, Services/Freelance system, updated auth UI (compact OTP, minimalist verify-email & reset-password cards), tool search bar, tools carousel, review status filters, admin service-request management, and all new database tables.

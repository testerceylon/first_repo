# Blog/CMS Feature Guide

## 🎯 Overview

The Blog/CMS system is a multi-role content management platform designed for SEO-driven organic growth. It enables agents to write articles, admins to review and approve them, and publishes approved content to public SEO-optimized pages.

---

## 🏗️ Architecture

### Database Schema
- **Table**: `blog_posts`
- **Location**: `packages/core/src/database/schema/blog.schema.ts`
- **Key Fields**:
  - `status`: Controls article visibility (`draft`, `pending`, `approved`, `rejected`)
  - `slug`: Auto-generated URL-friendly identifier
  - `content`: Markdown-formatted article body
  - `metaTitle` / `metaDescription`: SEO metadata

### API Routes
- **Base Path**: `/api/blog`
- **Definition**: `apps/api/src/routes/blog.route.ts`
- **Handlers**: `apps/api/src/handlers/blog.handlers.ts`

#### Available Endpoints:
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Agent/Admin | Create new article |
| GET | `/` | Agent/Admin | List articles (filtered by role) |
| GET | `/:id` | Agent/Admin | Get article by ID |
| PATCH | `/:id` | Agent/Admin | Update article |
| DELETE | `/:id` | Agent/Admin | Delete article |
| POST | `/:id/submit` | Agent | Submit for review |
| POST | `/:id/approve` | Admin | Approve article |
| POST | `/:id/reject` | Admin | Reject with feedback |
| GET | `/public` | Public | List approved articles |
| GET | `/public/:slug` | Public | Get article by slug |

---

## 👥 User Roles & Permissions

### Agent
**Access**: `/dashboard/articles`

**Capabilities**:
- Create new articles (status: `draft`)
- Edit their own articles
- Delete their own articles
- Submit articles for review (status: `draft` → `pending`)
- View rejection feedback

**Restrictions**:
- Cannot see other agents' articles
- Cannot approve their own articles
- Cannot change status to `approved`

### Admin
**Access**: `/admin/articles`

**Capabilities**:
- View all articles regardless of author
- Approve pending articles (status: `pending` → `approved`)
- Reject articles with feedback (status: `pending` → `rejected`)
- Edit any article
- Delete any article

---

## 📝 Agent Workflow

### Creating an Article

1. Navigate to `/dashboard/articles`
2. Click "New Article"
3. Fill in required fields:
   - **Title**: Article headline (max 255 chars)
   - **Excerpt**: Short summary for SEO (max 500 chars)
   - **Content**: Markdown-formatted article body
4. Optional fields:
   - **Featured Image**: Cover image URL
   - **Tags**: Comma-separated keywords
   - **Meta Title**: Custom SEO title (defaults to title)
   - **Meta Description**: Custom SEO description (defaults to excerpt)
5. Click "Save as Draft"

### Submitting for Review

1. Go to your article in `/dashboard/articles`
2. Click "Submit for Review" button
3. Status changes to `pending`
4. Wait for admin approval

### Handling Rejection

If an article is rejected:
1. View rejection reason in the article card
2. Make necessary changes
3. Save the updated article
4. Re-submit for review

---

## 👨‍💼 Admin Workflow

### Reviewing Articles

1. Navigate to `/admin/articles`
2. Filter by status: `Pending`
3. Click "View Details" to read the full article

### Approving an Article

1. Click the green checkmark (✓) icon
2. Article status changes to `approved`
3. Article becomes publicly visible at `/blog/[slug]`

### Rejecting an Article

1. Click the red X icon
2. Enter a rejection reason (optional)
3. Agent will see this feedback

---

## 🌍 Public Pages

### Blog List (`/blog`)
- Shows all approved articles
- Server-side rendered (SSR) with 5-minute revalidation
- SEO metadata configured
- Responsive grid layout

### Individual Post (`/blog/[slug]`)
- Dynamic metadata based on article content
- Markdown rendering with styled components
- View counter (auto-incremented)
- Internal CTAs to tools (conversion optimization)
- Open Graph & Twitter Card support

---

## 🔍 SEO Best Practices

### Metadata
Each approved article generates:
- Unique title tag
- Meta description
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Structured data (Article schema) - *Coming soon*

### URL Structure
```
ghostcod.com/blog/how-to-create-digital-signature-abc123
```
- Clean, readable URLs
- Unique slug prevents collisions
- Indexed by search engines

### Internal Linking
Encourage writers to include:
- Links to `/qr` (QR generator tool)
- Links to `/signature` (Digital signatures)
- Links to other tools

This improves:
- Page authority
- Conversion rate
- Overall site SEO structure

---

## 🚀 Pro Tips for Growth

### Content Strategy
1. **Target Long-Tail Keywords**: 
   - "How to create a QR code for business"
   - "Best digital signature tools"
   
2. **Solve User Problems**:
   - Tutorials on using your tools
   - Productivity tips
   - Industry best practices

3. **Optimize for Voice Search**:
   - Answer questions directly
   - Use natural language

### Scaling Content
1. Hire freelance writers as "agents"
2. Create content briefs with keyword targets
3. Admin approves quality content
4. Publish consistently (2-3 articles/week)

### After 30-50 Articles
- Organic traffic starts to grow
- Domain authority increases
- Tools get discovered through blog posts

---

## 🛠️ Technical Notes

### Markdown Rendering
Uses `react-markdown` for content rendering with custom styled components.

### Reading Time Calculation
Auto-calculated at ~200 words per minute.

### Slug Generation
```typescript
title → lowercase → replace spaces/special chars with '-' → append unique ID
```

### View Tracking
Incremented atomically on each page view (stored as string in DB).

---

## 📈 Future Enhancements

- [ ] Category taxonomy
- [ ] Author profile pages
- [ ] Related posts section
- [ ] Article analytics dashboard
- [ ] Sitemap auto-generation
- [ ] RSS feed
- [ ] Structured data (Article schema)
- [ ] Rich text editor (instead of raw Markdown)
- [ ] Image upload integration
- [ ] Draft auto-save

---

## 🐛 Troubleshooting

### Articles not showing on `/blog`
- Check article status is `approved`
- Verify API URL is correct in env vars
- Clear Next.js cache: `bun dev:web` restart

### Slug collision
- Each slug has a unique 6-char ID appended
- System prevents duplicates automatically

### 403 Forbidden on approve/reject
- Verify user has `role: "admin"` in database
- Check session is valid

---

## 📚 Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)

# Agent Registration & Blog CMS Workflow

## Overview

The blog/CMS system allows agents to create content that goes through an admin approval process before being published. Here's how to set it up and use it.

---

## 1. How to Register an Agent

### Option 1: Direct Database Update (Development)

Since the signup form doesn't currently have a role selector, you'll need to manually set the role in the database after registration:

1. **Register a new user** at `http://localhost:3000/signup`
   - Enter email and password
   - Complete the registration

2. **Update the user role in the database**:

```sql
-- Connect to your PostgreSQL database and run:
UPDATE user SET role = 'agent' WHERE email = 'agent@example.com';
```

### Option 2: Add Role Selection to Signup Form (Recommended for Production)

Update the signup form to include a role selector:

**File: `apps/web/src/app/(auth)/signup/page.tsx`**

```tsx
"use client";

import { SignupForm } from "@/modules/auth/components/signup-form";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "agent" | "user" || "user";

  return <SignupForm type={type} />;
}
```

Then users can register as agents by visiting:
- Agent signup: `http://localhost:3000/signup?type=agent`
- Regular user: `http://localhost:3000/signup`

### Option 3: Create Admin Interface for Role Management

Add a user management page in the admin panel where admins can assign roles:

**File: `apps/web/src/app/admin/users/page.tsx`**

Create a UI to:
- List all users
- Change user roles (user → agent, agent → user, user → admin)
- Manage user permissions

---

## 2. Admin Dashboard - Articles Tab

✅ **The Articles tab is now available in the Admin Dashboard!**

### Accessing Admin Panel

1. **Set yourself as admin**:

```sql
UPDATE user SET role = 'admin' WHERE email = 'your-admin@example.com';
```

2. **Navigate to Admin Dashboard**:
   - Go to `http://localhost:3000/admin`
   - You'll see the navigation sidebar with:
     - Overview
     - Users
     - Sales
     - Reviews
     - **Articles** ← New tab for blog management

3. **Articles Management Page** (`/admin/articles`):
   - Filter articles by status: All, Pending, Approved, Rejected, Draft
   - View submitted articles with author information
   - **Approve** articles to publish them
   - **Reject** articles with feedback for the author

---

## 3. Agent Workflow

### For Agents (Content Writers)

**Access:** `http://localhost:3000/dashboard/articles`

After signing in as an agent, you'll see:
- A **"Blog Articles"** card in your main dashboard's Activity section
- A **"Write Article"** quick action button
- Both link directly to `/dashboard/articles` for easy access

#### Creating an Article

1. Click **"New Article"** button
2. Fill in the form:
   - **Title**: Article headline
   - **Excerpt**: Short preview (150-500 chars)
   - **Content**: Full article in Markdown format
   - **Featured Image URL**: Optional cover image
   - **Tags**: Comma-separated tags (e.g., "productivity, tools, tips")
   - **SEO Meta Title**: Custom title for search engines
   - **SEO Meta Description**: Description for search results

3. **Save as Draft** - Article is saved but not submitted for review
4. **Submit for Review** - Sends article to admin for approval

#### Managing Your Articles

- View all your articles with status badges:
  - 🟡 **Draft** - Not submitted yet
  - 🔵 **Pending** - Under admin review
  - ✅ **Approved** - Published live
  - ❌ **Rejected** - Needs revisions (see feedback)

- **Edit** draft or rejected articles
- **Delete** articles you no longer need
- **Re-submit** after addressing rejection feedback

---

## 4. Admin Workflow

### For Admins (Content Reviewers)

**Access:** `http://localhost:3000/admin/articles`

#### Reviewing Articles

1. **View Pending Articles**:
   - Filter by status: Pending
   - See article title, excerpt, author, and submission date

2. **View Article Details**:
   - Click the **View** (eye icon) button to see full article content
   - Review page shows:
     - Full article content in Markdown
     - Author information
     - SEO metadata (title, description)
     - Featured image
     - Reading time and views
     - Tags and slug
   - Navigate to: `/admin/articles/{article-id}`

3. **Review Process**:
   - From list view OR detail view:
     - **Approve**: Immediately publishes to `/blog`
     - **Reject**: Enter feedback reason for the agent
   - Check quality, accuracy, and relevance
   - Verify SEO optimization

4. **Approve Article** (from list or detail page):
   - Click **"Approve"** button
   - Article is immediately published at `/blog`
   - Sets `publishedAt` timestamp
   - Status changes to "Approved"

5. **Reject Article** (from list or detail page):
   - Click **"Reject"** button
   - Enter rejection reason/feedback
   - Agent receives feedback to make improvements
   - Agent can edit and re-submit

#### Article Management

- **View all articles** from all agents
- **View detailed article**: Click eye icon to see full content, metadata, and SEO details
- Filter by status to focus on specific workflows
- Track article performance (views, reading time)
- Moderate published content if needed

---

## 5. Public Blog

### Viewing Published Articles

**Public Access:** `http://localhost:3000/blog`

Features:
- SEO-optimized with dynamic metadata
- Open Graph and Twitter Card support
- Clean, readable URLs (`/blog/article-title-xyz123`)
- Responsive grid layout
- Reading time estimation
- Author attribution
- View counter
- Tag-based organization

### Individual Article Pages

**URL Format:** `http://localhost:3000/blog/[slug]`

Features:
- Full article content rendered from Markdown
- Related tools CTAs (links to QR, Signature tools)
- Social sharing metadata
- Automatic view tracking
- Author information
- Publication date
- Estimated reading time

---

## 6. API Endpoints

### Agent Endpoints (Requires Auth)

```bash
# Create article
POST /api/blog
Body: { title, content, excerpt, featuredImage?, tags?, metaTitle?, metaDescription? }

# List my articles
GET /api/blog
Query: ?status=draft|pending|approved|rejected

# Get single article
GET /api/blog/:id

# Update article
PATCH /api/blog/:id
Body: { title?, content?, excerpt?, ... }

# Delete article
DELETE /api/blog/:id

# Submit for review
POST /api/blog/:id/submit
```

### Admin Endpoints (Requires Admin Role)

```bash
# Approve article
POST /api/blog/:id/approve

# Reject article
POST /api/blog/:id/reject
Body: { reason: string }
```

### Public Endpoints (No Auth)

```bash
# Get published articles
GET /api/blog/public

# Get article by slug
GET /api/blog/public/:slug
```

---

## 7. Database Schema

### Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES user(id),
  status TEXT NOT NULL DEFAULT 'draft', -- draft | pending | approved | rejected
  
  -- Optional fields
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT,
  reading_time TEXT,
  views TEXT DEFAULT '0',
  
  -- Workflow fields
  rejection_reason TEXT,
  approved_at TIMESTAMP,
  approved_by TEXT REFERENCES user(id),
  published_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

---

## 8. Quick Start Checklist

### Setup (One-Time)

- [ ] Database migration completed (`bun db:push` in packages/core)
- [ ] Backend API running (`bun dev` in apps/api)
- [ ] Frontend running (`bun dev` in apps/web)

### Create Admin Account

- [ ] Register a user at `/signup`
- [ ] Update role to 'admin' in database
- [ ] Login and verify access to `/admin/articles`

### Create Agent Account

- [ ] Register a user at `/signup`
- [ ] Update role to 'agent' in database
- [ ] Login and navigate to `/dashboard/articles`
- [ ] Create a test article

### Test Workflow

- [ ] Agent: Create and submit an article
- [ ] Admin: Review at `/admin/articles`
- [ ] Admin: Approve or reject
- [ ] Public: Verify at `/blog`

---

## 9. Development Tips

### Testing Locally

```bash
# Terminal 1 - Core package
cd packages/core
bun run build

# Terminal 2 - API Server
cd apps/api
bun run dev
# Runs on http://localhost:4000

# Terminal 3 - Web App
cd apps/web
bun run dev
# Runs on http://localhost:3000
```

### Setting User Roles

```bash
# Connect to your database
psql -U your_username -d your_database

# Or use a GUI like TablePlus, DBeaver, pgAdmin

# Update user role
UPDATE user SET role = 'admin' WHERE email = 'admin@example.com';
UPDATE user SET role = 'agent' WHERE email = 'agent@example.com';
```

### Environment Variables

**apps/web/.env**:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
```

---

## 10. Troubleshooting

### "Unauthorized" Error

- Ensure you're logged in
- Check your user role in the database
- Clear cookies and re-login

### Articles Not Showing

- Check article status is "approved"
- Verify `publishedAt` is set (automatic on approval)
- Check API endpoint returns data

### Can't Access Admin Panel

- Verify role is set to 'admin' in database
- Check session is valid
- Try logging out and back in

---

## Support & Documentation

- **Full Documentation**: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Blog CMS Guide**: [BLOG_CMS_GUIDE.md](./BLOG_CMS_GUIDE.md)
- **API Documentation**: Available at `/api/reference` when API is running

---

**Happy Writing! 📝**

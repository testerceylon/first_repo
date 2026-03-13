# 🚀 Vercel Environment Variables Configuration

## ✅ Setup Complete Checklist

- [x] api.ghostcod.com subdomain configured
- [x] DNS CNAME record added
- [x] CORS updated to allow api.ghostcod.com
- [x] Cross-subdomain cookies enabled for .ghostcod.com
- [ ] Set environment variables in Vercel (see below)
- [ ] Redeploy both projects

---

## 📋 API Project Environment Variables

**Project**: `nextjs-multiworker-api`  
**Vercel Dashboard**: https://vercel.com/dashboard → nextjs-multiworker-api → Settings → Environment Variables

### Required Variables (Production)

```bash
# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secure-secret-min-32-characters-long
BETTER_AUTH_URL=https://api.ghostcod.com/api/auth

# Frontend URLs (for CORS)
FRONTEND_URL=https://www.ghostcod.com
CLIENT_URL=https://www.ghostcod.com

# Environment
VERCEL_ENV=production
NODE_ENV=production

# PayPal Configuration (if using subscriptions)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
PAYPAL_PLAN_PRO=your_production_plan_id
```

### How to Add in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your API project (`nextjs-multiworker-api`)
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add Variable**
   - Enter **Key** (e.g., `BETTER_AUTH_URL`)
   - Enter **Value** (e.g., `https://api.ghostcod.com/api/auth`)
   - Select **Production** environment
   - Click **Save**

---

## 📋 Web Project Environment Variables

**Project**: `nextjs-multiworker-web`  
**Vercel Dashboard**: https://vercel.com/dashboard → nextjs-multiworker-web → Settings → Environment Variables

### Required Variables (Production)

```bash
# Backend API URLs
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth

# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_ID=G-V6R6QT9PWX

# Environment
VERCEL_ENV=production
NODE_ENV=production
```

### How to Add in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your Web project (`nextjs-multiworker-web`)
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add Variable**
   - Enter **Key** (e.g., `NEXT_PUBLIC_BACKEND_URL`)
   - Enter **Value** (e.g., `https://api.ghostcod.com`)
   - Select **Production** environment
   - Click **Save**

---

## 🔄 After Setting Environment Variables

### Redeploy Both Projects

**Option 1: Auto Deploy (Recommended)**
```bash
git add .
git commit -m "feat: Configure api.ghostcod.com subdomain with proper CORS and cookies"
git push
```
This will trigger automatic deployments on Vercel.

**Option 2: Manual Deploy**
```bash
cd apps/api
vercel --prod

cd ../web
vercel --prod
```

---

## ✅ Verification Steps

### 1. Check API is responding
```bash
curl https://api.ghostcod.com/api/auth/get-session
```

Expected: JSON response (even if session is null)

### 2. Check CORS headers
```bash
curl -I -X OPTIONS \
  -H "Origin: https://www.ghostcod.com" \
  -H "Access-Control-Request-Method: GET" \
  https://api.ghostcod.com/api/auth/get-session
```

Expected headers:
```
access-control-allow-origin: https://www.ghostcod.com
access-control-allow-credentials: true
```

### 3. Test Sign In Flow

1. Go to: https://www.ghostcod.com
2. Click **Sign In**
3. Enter credentials
4. Check DevTools → Console (should be no CORS errors)
5. Check DevTools → Application → Cookies
   - Should see `session_token` cookie
   - Domain should be `.ghostcod.com`

### 4. Test Session Persistence

1. After signing in, refresh the page
2. You should remain signed in
3. Check Network tab → Look for `/api/auth/get-session` request
4. Should return your user data (not null)

---

## 🐛 Troubleshooting

### Issue: Still getting CORS errors

**Check:**
- Environment variables are saved in Vercel
- Both projects have been redeployed after setting variables
- Browser cache cleared (hard refresh: Ctrl+Shift+R)

**Fix:**
```bash
# Verify environment variables are set
vercel env ls --scope=production
```

### Issue: Session is null after sign in

**Check:**
- Cookie domain in DevTools → Application → Cookies
- Should be `.ghostcod.com` (not `www.ghostcod.com`)

**Fix:**
Ensure `BETTER_AUTH_URL=https://api.ghostcod.com/api/auth` is set in API project

### Issue: Cookie not being set

**Check:**
- `credentials: 'include'` in fetch requests
- `secure: true` for HTTPS
- `sameSite: 'none'` for cross-subdomain

**Fix:**
All of this is already configured in the code changes we made!

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│  www.ghostcod.com (Frontend)        │
│  Next.js App                        │
└──────────────┬──────────────────────┘
               │
               │ Fetch with credentials
               │
┌──────────────▼──────────────────────┐
│  api.ghostcod.com (Backend)         │
│  Hono API + Better Auth             │
└──────────────┬──────────────────────┘
               │
               │ Cookies shared via .ghostcod.com
               │
               └─► 🍪 session_token
                   Domain: .ghostcod.com
                   Secure: true
                   HttpOnly: true
                   SameSite: none
```

---

## 🎯 Summary

**What changed:**
1. ✅ API now accessible at `https://api.ghostcod.com`
2. ✅ CORS configured to allow `www.ghostcod.com` ↔ `api.ghostcod.com`
3. ✅ Cookies work across subdomains (`.ghostcod.com`)
4. ✅ Environment variables use new subdomain URLs

**What you need to do:**
1. Set environment variables in Vercel (both projects)
2. Redeploy both projects
3. Test the authentication flow

**Result:**
- ✅ No more 508 errors
- ✅ Sessions persist across page refreshes
- ✅ Authentication works properly
- ✅ Cookies work securely across subdomains

---

## 📱 Quick Copy-Paste for Vercel

### API Project Variables
```
BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
FRONTEND_URL=https://www.ghostcod.com
CLIENT_URL=https://www.ghostcod.com
VERCEL_ENV=production
NODE_ENV=production
```

### Web Project Variables
```
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
VERCEL_ENV=production
NODE_ENV=production
```

Don't forget your existing variables:
- `DATABASE_URL` (API project)
- `BETTER_AUTH_SECRET` (API project)
- PayPal variables (API project, if using)

---

Need help? Check the Vercel Function Logs:
- Vercel Dashboard → Project → Deployments → View Function Logs

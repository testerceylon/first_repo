# Vercel Deployment Configuration Guide

## Problem: 508 Error & Session Issues

You're encountering cross-origin authentication issues between:
- **Frontend**: www.ghostcod.com, nextjs-multiworker-web.vercel.app
- **Backend**: nextjs-multiworker-api.vercel.app

### Root Cause
Cross-domain cookies don't work by default due to browser security (CORS, SameSite policies).

## Solution

### Option 1: Same-Domain Deployment (RECOMMENDED)

Deploy both frontend and backend under the same domain using rewrites/proxying.

#### Setup for www.ghostcod.com

1. **Deploy API to subdomain**: `api.ghostcod.com`
2. **Update DNS**:
   ```
   www.ghostcod.com -> Vercel (Frontend)
   api.ghostcod.com -> Vercel (Backend API)
   ```

3. **Environment Variables**:

**Frontend (www.ghostcod.com)**:
```env
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
```

**Backend (api.ghostcod.com)**:
```env
BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
FRONTEND_URL=https://www.ghostcod.com
CLIENT_URL=https://www.ghostcod.com
```

4. **Update Better Auth Config** in `packages/core/src/auth/config.ts`:
```typescript
crossSubDomainCookies: isProduction
  ? {
      enabled: true,
      domain: ".ghostcod.com"  // Share cookies across *.ghostcod.com
    }
  : undefined,
```

### Option 2: Proxy Through Frontend (CURRENT SETUP)

Keep your current domains but proxy API requests through the frontend.

#### Configure Next.js Rewrites

Add to `apps/web/next.config.ts`:

```typescript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nextjs-multiworker-api.vercel.app/api/:path*',
      },
    ];
  },
};
```

#### Environment Variables

**Frontend (www.ghostcod.com)**:
```env
NEXT_PUBLIC_BACKEND_URL=https://www.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://www.ghostcod.com/api/auth
```

**Backend (nextjs-multiworker-api.vercel.app)**:
```env
BETTER_AUTH_URL=https://nextjs-multiworker-api.vercel.app/api/auth
FRONTEND_URL=https://www.ghostcod.com
CLIENT_URL=https://www.ghostcod.com
```

### Option 3: Third-Party Cookie Support (NOT RECOMMENDED)

Modern browsers are phasing out third-party cookies. This will break soon.

## Vercel Environment Variables Setup

### For API Project (nextjs-multiworker-api)

Go to: Vercel Dashboard → nextjs-multiworker-api → Settings → Environment Variables

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=min-32-character-secret
BETTER_AUTH_URL=https://nextjs-multiworker-api.vercel.app/api/auth
FRONTEND_URL=https://www.ghostcod.com
CLIENT_URL=https://www.ghostcod.com
VERCEL_ENV=production
NODE_ENV=production

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=live
PAYPAL_PLAN_PRO=...
```

### For Web Project (nextjs-multiworker-web)

Go to: Vercel Dashboard → nextjs-multiworker-web → Settings → Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
VERCEL_ENV=production
NODE_ENV=production
```

## Testing

After configuration:

1. **Clear browser cookies** completely
2. **Hard refresh** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Test signin flow**:
   ```bash
   # Should work without errors
   POST https://www.ghostcod.com/api/auth/sign-in
   GET  https://www.ghostcod.com/api/auth/get-session
   ```

4. **Check cookies in DevTools**:
   - Open DevTools → Application → Cookies
   - Should see `session_token` cookie set for `www.ghostcod.com`

## Common Issues

### Issue: Still getting 508/503 errors
**Solution**: Verify environment variables are set in Vercel dashboard, not just .env files

### Issue: Session null but signin succeeds
**Solution**: Check cookie domain configuration and CORS settings

### Issue: CORS errors in browser console
**Solution**: Verify frontend domain is in trustedOrigins and CORS allowedOrigins

### Issue: Cookies not being set
**Solution**: Ensure `credentials: true` in fetch requests and CORS allows credentials

## Production Checklist

- [ ] Custom domain (api.ghostcod.com) pointed to backend
- [ ] Environment variables set in Vercel dashboard (both projects)
- [ ] CORS configuration includes production domains
- [ ] Cookie domain set to `.ghostcod.com`
- [ ] BETTER_AUTH_URL matches actual backend URL
- [ ] Test signin/signout flow
- [ ] Test session persistence across page refreshes
- [ ] Monitor Vercel logs for errors

## Recommended Architecture

```
www.ghostcod.com (Frontend)
       ↓
  Same-origin request to /api/*
       ↓
  Next.js rewrite OR
       ↓
api.ghostcod.com (Backend)
  (Same root domain = cookies work!)
```

This is the most reliable approach for production.

# Vercel Fix Checklist - Fix 508 Errors

## Problem
- Frontend proxy getting 508 errors trying to reach backend
- Backend might be using old domain name in BETTER_AUTH_URL
- Frontend environment variables not set

## Solution: Update Both Projects

### 🔧 PROJECT 1: Backend (nextjs-multiworker-api)

Go to: https://vercel.com/dashboard → **nextjs-multiworker-api** → Settings → Environment Variables

**UPDATE THESE:**

```bash
BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
FRONTEND_URL=https://www.ghostcod.com  
CLIENT_URL=https://www.ghostcod.com
```

**Verify these exist:**
- DATABASE_URL (your PostgreSQL connection string)
- BETTER_AUTH_SECRET (min 32 chars)
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_MODE=live
- PAYPAL_PLAN_PRO

### 🌐 PROJECT 2: Frontend (nextjs-multiworker or nextjs-multiworker-web)

Go to: https://vercel.com/dashboard → **nextjs-multiworker** → Settings → Environment Variables

**ADD THESE:**

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
```

## After Setting Variables

1. **Save all environment variables**
2. **Vercel will show "Redeploy required"**
3. **Go to Deployments tab → Click "Redeploy" button**
4. **OR** trigger a new deployment by pushing a commit:
   ```bash
   git commit --allow-empty -m "trigger deploy"
   git push
   ```

## Verification Steps

### 1. Check Backend is Responding
Open in browser: https://api.ghostcod.com/api/auth/get-session

**Expected:** `{"user":null,"session":null}` (401 or 200 status)
**Not:** 404, 500, or timeout

### 2. Check Frontend Logs
Go to Vercel → nextjs-multiworker → Deployments → Latest → Runtime Logs

**Should NOT see:**
- `[Proxy] GET /api/auth/get-session` (means still using proxy)
- 508 errors
- 504 timeouts

**Should see:**
- Clean logs, no proxy messages
- Quick page loads

### 3. Test Sign In
1. Go to https://www.ghostcod.com/signin
2. Open DevTools → Network tab
3. Sign in with test credentials
4. Look for `/get-session` request
5. **Check:** Goes directly to `api.ghostcod.com/api/auth/get-session`
6. **Status:** Should be 200 OK
7. **Response time:** < 1 second

### 4. Check Cookies
DevTools → Application → Cookies → https://www.ghostcod.com

**Look for:**
- `better-auth.session_token`
- Domain: `.ghostcod.com` (note the leading dot)
- Secure: ✓
- HttpOnly: ✓
- SameSite: Lax

## If Still Getting Errors

### 508 Errors
- **Cause:** Backend not responding or wrong URL
- **Fix:** 
  - Check backend deployment logs for errors
  - Verify DATABASE_URL is correct
  - Check if backend is running at all

### 504 Timeout
- **Cause:** Middleware taking too long (waiting for backend)
- **Fix:**
  - Ensure backend BETTER_AUTH_URL is correct
  - Check database connection is fast
  - Look for slow queries in backend logs

### CORS Errors
- **Cause:** Backend not allowing www.ghostcod.com
- **Fix:**
  - Check `apps/api/src/lib/setup-api.ts` includes www.ghostcod.com
  - Redeploy backend after fixing

### Cookies Not Saving
- **Cause:** Domain mismatch or Better Auth config wrong
- **Fix:**
  - Check `packages/core/src/auth/config.ts`
  - Verify `crossSubDomainCookies: { domain: '.ghostcod.com' }`
  - Verify `trustedOrigins` includes api.ghostcod.com

## Quick Test Commands

```bash
# Test backend health
curl https://api.ghostcod.com/api/auth/get-session

# Should return:
# {"user":null,"session":null}

# Test CORS
curl -H "Origin: https://www.ghostcod.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.ghostcod.com/api/auth/get-session

# Should include:
# Access-Control-Allow-Origin: https://www.ghostcod.com
# Access-Control-Allow-Credentials: true
```

## Current Status

- [x] Code pushed to GitHub (commit: "Direct API calls")
- [ ] Backend environment variables updated in Vercel
- [ ] Frontend environment variables updated in Vercel
- [ ] Both projects redeployed
- [ ] Tested production sign in flow
- [ ] No more proxy logs appearing
- [ ] No more 508/504 errors

## After Everything Works

**Optional cleanup:**
- Can delete proxy route: `apps/web/src/app/api/[[...path]]/route.ts`
- Update documentation to reflect new architecture
- Remove old Vercel URLs from environment variables

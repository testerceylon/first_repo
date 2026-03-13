# 🚨 QUICK FIX: 508 Error on Vercel Deployment

## Immediate Steps (5 minutes)

### 1. Add Environment Variables in Vercel Dashboard

#### For API Project: `nextjs-multiworker-api`

Go to: https://vercel.com/dashboard → nextjs-multiworker-api → Settings → Environment Variables

Add these:
```
BETTER_AUTH_URL = https://nextjs-multiworker-api.vercel.app/api/auth
FRONTEND_URL = https://www.ghostcod.com
CLIENT_URL = https://www.ghostcod.com
```

*Note: Keep your existing DATABASE_URL, BETTER_AUTH_SECRET, etc.*

#### For Web Project: `nextjs-multiworker-web`

Go to: https://vercel.com/dashboard → nextjs-multiworker-web → Settings → Environment Variables

Add these:
```
NEXT_PUBLIC_BACKEND_URL = https://nextjs-multiworker-api.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL = https://nextjs-multiworker-api.vercel.app/api/auth
```

### 2. Redeploy Both Projects

Option A - Auto Deploy (if connected to Git):
- Push changes to trigger automatic deployment
- Or use the "Redeploy" button in Vercel Dashboard

Option B - Manual Deploy:
```bash
cd apps/api
vercel --prod

cd ../web
vercel --prod
```

### 3. Test

Open: https://www.ghostcod.com

Try to sign in. Check browser DevTools → Console for errors.

## Still Not Working?

### Check Cookies

1. Open DevTools → Application → Cookies
2. Look for `session_token` cookie
3. Check the **Domain** field:
   - ❌ If it shows `.vercel.app` → Wrong domain
   - ✅ Should show `.ghostcod.com` (for subdomain setup)

### The Real Solution: Use Subdomain

Your current setup has a fundamental limitation:
- Frontend: `www.ghostcod.com`
- Backend: `nextjs-multiworker-api.vercel.app`

**Problem**: Browsers block cookies between different domains (ghostcod.com ≠ vercel.app)

**Solution**: Point backend to a subdomain:

1. **Update your DNS**:
   ```
   api.ghostcod.com → CNAME → cname.vercel-dns.com
   ```

2. **Add domain in Vercel**:
   - Go to API project → Settings → Domains
   - Add `api.ghostcod.com`

3. **Update environment variables**:

   **API Project**:
   ```
   BETTER_AUTH_URL = https://api.ghostcod.com/api/auth
   FRONTEND_URL = https://www.ghostcod.com
   ```

   **Web Project**:
   ```
   NEXT_PUBLIC_BACKEND_URL = https://api.ghostcod.com
   NEXT_PUBLIC_BETTER_AUTH_URL = https://api.ghostcod.com/api/auth
   ```

4. **Update auth config** in `packages/core/src/auth/config.ts`:
   ```typescript
   crossSubDomainCookies: isProduction ? {
     enabled: true,
     domain: ".ghostcod.com"  // ← Change this
   } : undefined,
   ```

5. **Redeploy both projects**

Now cookies will work because both domains are `*.ghostcod.com`!

## Quick Test Commands

```bash
# Test API health
curl https://nextjs-multiworker-api.vercel.app/api/auth/api/auth/get-session

# Test with session (after signing in on website)
curl -H "Cookie: session_token=YOUR_TOKEN" \
     https://nextjs-multiworker-api.vercel.app/api/auth/get-session

# Check CORS headers
curl -I -X OPTIONS \
     -H "Origin: https://www.ghostcod.com" \
     -H "Access-Control-Request-Method: GET" \
     https://nextjs-multiworker-api.vercel.app/api/auth/get-session
```

## What Was Fixed

✅ Updated CORS to allow www.ghostcod.com  
✅ Added trustedOrigins configuration  
✅ Set up proper credentials handling  
✅ Created environment variable templates  

## What Still Needs Fixing

⚠️ Subdomain setup (api.ghostcod.com)  
⚠️ Cookie domain configuration  

## Need Help?

See full guide: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

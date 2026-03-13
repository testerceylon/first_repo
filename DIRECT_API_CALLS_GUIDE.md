# Direct API Calls Configuration

## What Changed

I've updated your frontend to make **direct calls** to `api.ghostcod.com` instead of proxying through Next.js.

### Files Modified:

1. **apps/web/src/lib/auth-client.ts**
   - Now uses `NEXT_PUBLIC_BETTER_AUTH_URL` directly
   - Removes `window.location.origin` logic that caused proxy calls

2. **apps/web/src/lib/rpc/client/index.ts**
   - Changed default from `/api` to `http://localhost:4000`
   - Ensures RPC client calls backend directly

## Vercel Environment Variables

Set these in your **web project** in Vercel dashboard:

```bash
NEXT_PUBLIC_BACKEND_URL=https://api.ghostcod.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://api.ghostcod.com/api/auth
```

### Steps:
1. Go to https://vercel.com/dashboard
2. Select your **nextjs-multiworker** project (frontend)
3. Go to **Settings → Environment Variables**
4. Add/update the two variables above
5. Set them for **Production**, **Preview**, and **Development**
6. Click **Save**

## What About the Proxy Route?

The proxy route at `apps/web/src/app/api/[[...path]]/route.ts` is still there but will NOT be used after this change because:

- Auth client now calls backend directly
- RPC client now calls backend directly
- Middleware uses `NEXT_PUBLIC_BETTER_AUTH_URL`

### Should You Delete It?

**Option 1: Keep it (Recommended for now)**
- Provides backward compatibility
- No harm if it's not being called
- You can monitor Vercel logs to confirm it's not being used

**Option 2: Delete it**
- Cleaner codebase
- Only do this after confirming no proxy logs appear

## Testing After Deployment

1. **Push changes:**
   ```bash
   git add .
   git commit -m "feat: Direct API calls to api.ghostcod.com"
   git push
   ```

2. **Wait for Vercel deployment** (both projects will auto-deploy)

3. **Test in production:**
   - Open https://www.ghostcod.com
   - Open DevTools → Network tab
   - Sign in
   - Look for `/get-session` request
   - **Expected:** Request goes to `https://api.ghostcod.com/api/auth/get-session`
   - **NOT:** `https://www.ghostcod.com/api/auth/get-session`

4. **Check cookies:**
   - DevTools → Application → Cookies
   - Look for `better-auth.session_token`
   - Domain should be `.ghostcod.com`

## Vercel Runtime Logs

**Before (with proxy):**
```
[Proxy] GET /api/auth/get-session -> https://api.ghostcod.com/api/auth/get-session
```

**After (direct calls):**
```
(no proxy logs should appear)
```

## Troubleshooting

### Still seeing proxy logs?

1. Check if env vars are set in Vercel dashboard
2. Redeploy after setting env vars (they don't apply automatically)
3. Hard refresh browser (Ctrl+Shift+R) to clear cache

### CORS errors?

- Verify `apps/api/src/lib/setup-api.ts` includes `https://www.ghostcod.com` and `https://api.ghostcod.com`
- Verify `packages/core/src/auth/config.ts` has `trustedOrigins` with api.ghostcod.com
- Check API deployment logs for CORS errors

### Session still null?

- Verify cookie domain is `.ghostcod.com` in auth config
- Check Network tab to see if cookies are being sent with requests
- Look for `crossSubDomainCookies` setting in auth config

## Benefits of Direct Calls

✅ **Faster:** No extra hop through Next.js server
✅ **Simpler:** Direct browser → API communication
✅ **Clearer logs:** See actual API requests in network tab
✅ **Better debugging:** Can inspect requests/responses directly
✅ **Works with CORS:** Properly configured cross-origin cookies

## Next Steps

1. Set environment variables in Vercel dashboard
2. Push this commit to trigger deployment
3. Test in production
4. Monitor logs to confirm no proxy calls
5. (Optional) Delete proxy route after confirming everything works

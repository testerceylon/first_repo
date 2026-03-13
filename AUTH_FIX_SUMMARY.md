# Authentication Fix Summary

## Issues Fixed

### 1. **Redundant Console Errors**
- **Problem**: "User already exists" error was being logged twice - once globally and once in the form
- **Fix**: Modified [auth-client.ts](apps/web/src/lib/auth-client.ts) to filter out "already exists" errors from global console logging since they're handled by form toasts

### 2. **Auth Endpoints Returning 404**
- **Problem**: `http://localhost:4000/api/auth/get-session` was returning 404 errors
- **Root Cause**: BetterAuth routes were not properly mounted in the Hono app
- **Fix**: 
  - Created [dev.ts](apps/api/dev.ts) - proper development server that starts Bun.serve on port 4000
  - Updated [package.json](apps/api/package.json) dev script to use `dev.ts` instead of `src/app.ts`
  - Fixed auth route registration in [setup-api.ts](apps/api/src/lib/setup-api.ts) - changed from `api.on(["POST", "GET"], "/auth/*", ...)` to `api.all("/auth/**", ...)` for proper wildcard routing

### 3. **Improved User Experience**
- **Signup Form**: Added friendly error message when email already exists with a "Sign In" action button
- **Signin Form**: Added helpful error handling for invalid credentials with a "Sign Up" action button

## Verification

Both servers are now running correctly:
- ✅ API Server: `http://localhost:4000` 
- ✅ Auth Endpoints: `http://localhost:4000/api/auth/*`
- ✅ Web App: `http://localhost:3000`

## Testing

```bash
# Test auth endpoint (should return null when not logged in)
curl http://localhost:4000/api/auth/get-session

# Test API base endpoint
curl http://localhost:4000/api
```

## Important Files Changed

1. `/apps/api/dev.ts` - Created
2. `/apps/api/package.json` - Updated dev script
3. `/apps/api/src/lib/setup-api.ts` - Fixed auth route mounting
4. `/apps/web/src/lib/auth-client.ts` - Filtered redundant errors; **CORS fix** (see below)
5. `/apps/web/src/modules/auth/components/signup-form.tsx` - Better error handling
6. `/apps/web/src/modules/auth/components/signin-form.tsx` - Better error handling

---

## Production CORS Fix (2025)

### Problem
`Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request`

**Root Cause:** `NEXT_PUBLIC_BETTER_AUTH_URL` in Vercel was set to `https://inicioofficial.com/api/auth` (no-www). The site canonical URL is `https://www.inicioofficial.com`. The browser's `authClient` sent preflight OPTIONS to the no-www URL → Vercel issued a 301 redirect to www → browsers cannot follow redirects on CORS preflights → blocked.

### Fixes Applied

**1. `apps/web/src/lib/auth-client.ts`** — `authClient.baseURL` is now derived from `window.location.origin` in the browser:
```ts
function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000/api/auth";
}
```
This permanently fixes the CORS issue regardless of what `NEXT_PUBLIC_BETTER_AUTH_URL` is set to in Vercel — requests are always same-origin.

**2. `apps/api/src/lib/setup-api.ts`** — CORS `origin` function:
- Changed fallback for unknown origins from `"*"` (invalid with `credentials: true`) to `null` (proper rejection)
- All `*.vercel.app` preview URLs now allowed in ANY environment (not just non-production)
- Used `Set` for O(1) origin lookup

### Required Vercel Env Vars

**Web project (`nextjs-multiworker-web`):**
| Variable | Value |
|---|---|
| `BACKEND_URL` | `https://nextjs-multiworker-api.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://nextjs-multiworker-api.vercel.app` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://www.inicioofficial.com/api/auth` ← must use www (canonical) |
| `NEXT_PUBLIC_API_URL` | `https://nextjs-multiworker-api.vercel.app` |

**API project (`nextjs-multiworker-api`):**
| Variable | Value |
|---|---|
| `BETTER_AUTH_URL` | `https://www.inicioofficial.com/api/auth` ← must use www (canonical) |
| `FRONTEND_URL` | `https://www.inicioofficial.com` |
| `CLIENT_URL` | `https://www.inicioofficial.com` |

> **Note:** `NEXT_PUBLIC_BETTER_AUTH_URL` on the web project no longer matters for browser CORS (the code ignores it for browser requests), but keep it set correctly as it's used for SSR fallback.

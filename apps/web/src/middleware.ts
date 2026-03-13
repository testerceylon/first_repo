import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "core/auth/config";
import { NextResponse, type NextRequest } from "next/server";

// Extend Session to include the `role` field added by the admin plugin
type SessionWithRole = Session & {
  user: Session["user"] & { 
    role?: string | null;
    emailVerified?: boolean;
  };
};

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified",
  "/verify-email"
];

const protectedRoutes = ["/admin", "/dashboard"];

export default async function authMiddleware(request: NextRequest) {
  
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    const cookies = request.headers.get("cookie") || "";

    // Short-circuit: no cookies → no session possible.
    // Let auth routes through and redirect protected routes immediately.
    if (!cookies) {
      if (isProtectedPath) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
      return NextResponse.next({ headers: requestHeaders });
    }

    // Use the backend URL directly for server-to-server session fetch.
    // Do NOT use NEXT_PUBLIC_BETTER_AUTH_URL here — that points to :3000 (this app)
    // which would create an infinite loopback. The backend URL is always internal.
    // BACKEND_URL is a private env var (runtime-evaluated on Vercel edge, not baked at build).
    const apiBase =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:4000";
    const baseURL = `${apiBase}/api/auth`;

    // Fetch session
    const { data: session, error } = await betterFetch<SessionWithRole>(
      "/get-session",
      {
        baseURL,
        headers: {
          cookie: cookies,
          // Disable compression: Vercel/Hono sends Brotli by default but
          // Node.js fetch cannot decompress it, causing BrotliDecompressionError
          "accept-encoding": "identity"
        }
      }
    );

    if (error) {
      console.error("[Middleware] Session fetch error:", error);
    }

    // Check if user is authenticated but email is not verified
    // Redirect to verify-email unless they are already there or signing out
    if (session && session.user.emailVerified === false) {
      if (pathname !== "/verify-email" && !pathname.startsWith("/api/auth/sign-out")) {
        const verifyUrl = new URL("/verify-email", request.url);
        if (session.user.email) {
          verifyUrl.searchParams.set("email", session.user.email);
        }
        return NextResponse.redirect(verifyUrl);
      }
      // If already on verify-email page, allow through
      return NextResponse.next({ headers: requestHeaders });
    }

    // If Auth route and Already authenticated,
    // Redirect back to appropiate path
    if (authRoutes.includes(pathname) && session) {

      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Both "agent" and "user" roles go to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If protected route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If authenticated, and trying to access '/admin'
    if (session && pathname.startsWith("/admin")) {

      if (session.user.role === "admin") {
        return NextResponse.next();
      }

      // Non-admin users (any role or no role) → redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    // "/(api|trpc)(.*)"
  ]
};

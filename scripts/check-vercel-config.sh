#!/bin/bash

# Vercel Production Deployment Quick Fix Script
# Run this after setting up environment variables in Vercel

echo "🔧 Vercel Deployment Configuration Check"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Display required environment variables
echo "📋 Required Environment Variables for Vercel"
echo "=============================================="
echo ""
echo "🔹 API Project (nextjs-multiworker-api):"
echo "-------------------------------------------"
echo "  DATABASE_URL=postgresql://..."
echo "  BETTER_AUTH_SECRET=your-secret-min-32-chars"
echo "  BETTER_AUTH_URL=https://nextjs-multiworker-api.vercel.app/api/auth"
echo "  FRONTEND_URL=https://www.ghostcod.com"
echo "  CLIENT_URL=https://www.ghostcod.com"
echo "  VERCEL_ENV=production"
echo "  NODE_ENV=production"
echo ""
echo "🔹 Web Project (nextjs-multiworker-web):"
echo "-------------------------------------------"
echo "  NEXT_PUBLIC_BACKEND_URL=https://nextjs-multiworker-api.vercel.app"
echo "  NEXT_PUBLIC_BETTER_AUTH_URL=https://nextjs-multiworker-api.vercel.app/api/auth"
echo "  VERCEL_ENV=production"
echo "  NODE_ENV=production"
echo ""

# Check local environment files
echo "🔍 Checking local environment files..."
echo ""

if [ -f "apps/api/.env" ]; then
    echo "✅ Found apps/api/.env"
else
    echo "⚠️  Missing apps/api/.env (OK for Vercel, but needed for local testing)"
fi

if [ -f "apps/web/.env" ]; then
    echo "✅ Found apps/web/.env"
else
    echo "⚠️  Missing apps/web/.env (OK for Vercel, but needed for local testing)"
fi

echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Go to Vercel Dashboard → Your API Project → Settings → Environment Variables"
echo "   Add all API environment variables listed above"
echo ""
echo "2. Go to Vercel Dashboard → Your Web Project → Settings → Environment Variables"
echo "   Add all Web environment variables listed above"
echo ""
echo "3. Redeploy both projects:"
echo "   - API: vercel --prod (or trigger via git push)"
echo "   - Web: vercel --prod (or trigger via git push)"
echo ""
echo "4. Test the deployment:"
echo "   curl https://nextjs-multiworker-api.vercel.app/api/auth/get-session"
echo ""
echo "5. If still having issues, check:"
echo "   - Browser DevTools → Network → Check request/response headers"
echo "   - Browser DevTools → Application → Cookies"
echo "   - Vercel Dashboard → Function Logs"
echo ""
echo "🚀 For best results, use a subdomain approach:"
echo "   Frontend: www.ghostcod.com"
echo "   Backend:  api.ghostcod.com"
echo ""
echo "   This allows cookies to work across *.ghostcod.com domain"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo ""
    echo "Run these commands to deploy:"
    echo "  cd apps/api && vercel --prod"
    echo "  cd apps/web && vercel --prod"
else
    echo "⚠️  Vercel CLI not installed"
    echo "   Install: npm i -g vercel"
fi

echo ""
echo "📖 For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""

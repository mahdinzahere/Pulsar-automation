#!/bin/bash

# Pulsar Automation - Vercel Deployment Script
echo "🚀 Pulsar Automation - Vercel Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "apps/web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure found"

# Create Vercel configuration if it doesn't exist
if [ ! -f "vercel.json" ]; then
    echo "📝 Creating vercel.json..."
    cat > vercel.json << 'EOF'
{
  "buildCommand": "cd apps/web && npm install && npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "cd apps/web && npm install",
  "devCommand": "cd apps/web && npm run dev",
  "regions": ["iad1"],
  "functions": {
    "apps/web/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
    echo "✅ vercel.json created"
fi

echo ""
echo "🎯 Next Steps for Vercel Deployment:"
echo "1. Go to https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project'"
echo "4. Import: https://github.com/mahdinzahere/Pulsar-automation"
echo "5. Set Root Directory: apps/web"
echo "6. Add environment variables from VERCEL_DEPLOYMENT.md"
echo "7. Connect domain: pulsarinstitute.com"
echo ""
echo "📋 See VERCEL_DEPLOYMENT.md for complete instructions"
echo "🌐 Your app will be live at: https://pulsarinstitute.com"
echo ""
echo "✅ Vercel is much easier than Render!"

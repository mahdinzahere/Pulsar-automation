#!/bin/bash

# Pulsar Automation - Quick Deploy Script
echo "🚀 Pulsar Automation Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "apps/web/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure found"

# Create deployment files if they don't exist
if [ ! -f "render.yaml" ]; then
    echo "📝 Creating render.yaml..."
    cat > render.yaml << 'EOF'
services:
  - type: web
    name: pulsar-automation
    env: node
    plan: free
    rootDir: apps/web
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
      - key: NEXT_PUBLIC_BASE_URL
        sync: false
EOF
    echo "✅ render.yaml created"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://render.com"
echo "2. Sign up with GitHub"
echo "3. Connect repository: https://github.com/mahdinzahere/Pulsar-automation"
echo "4. Use the configuration from DEPLOYMENT.md"
echo "5. Add environment variables from DEPLOYMENT.md"
echo "6. Connect domain: pulsarinstitute.com"
echo ""
echo "📋 See DEPLOYMENT.md for complete instructions"
echo "🌐 Your app will be live at: https://pulsarinstitute.com"

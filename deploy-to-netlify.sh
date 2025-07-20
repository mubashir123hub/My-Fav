#!/bin/bash

# VideoNexus - Netlify Deployment Script
echo "🚀 Building VideoNexus for Netlify deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build the project
echo "📦 Building the project..."
npm run build

# Organize dist folder for simple deployment
echo "📋 Organizing dist folder for simple deployment..."

# Move public contents to root of dist
if [ -d "dist/public" ]; then
    mv dist/public/* dist/ 2>/dev/null || true
    rmdir dist/public 2>/dev/null || true
fi

# Copy essential files
cp index.html dist/ 2>/dev/null || true
cp favicon.svg dist/ 2>/dev/null || true  
cp netlify.toml dist/ 2>/dev/null || true

# Create deployment guide
cat > dist/README_DEPLOY.md << 'EOF'
# 🚀 VideoNexus - Simple Deployment

✅ This folder is ready for Netlify deployment!

## Deploy Instructions:
1. Go to netlify.com
2. Drag this 'dist' folder to Netlify  
3. Your VideoNexus app goes live!

No additional setup needed - everything is included!
EOF

echo "✅ Build complete! Your VideoNexus app is ready for Netlify."
echo ""
echo "📁 Deploy folder: ./dist"
echo ""
echo "Next steps:"
echo "1. Go to https://netlify.com"
echo "2. Drag and drop the 'dist' folder"
echo "3. Or connect your GitHub repository"
echo ""
echo "🎯 Your enhanced YouTube-like platform will be live!"
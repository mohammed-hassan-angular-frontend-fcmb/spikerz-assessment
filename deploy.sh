#!/bin/bash

# Spikerz Dashboard Netlify Deployment Script
echo "🚀 Starting Spikerz Dashboard deployment to Netlify..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless

# Check if tests passed
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment aborted."
    exit 1
fi

# Build the application
echo "🏗️  Building application for production..."
npm run build:prod

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output is in: dist/spikerz-dashboard/browser"
echo ""
echo "🌐 Ready for Netlify deployment with netlify.toml configuration!"
echo ""
echo "🎯 RECOMMENDED: Git Integration (uses netlify.toml)"
echo "1. Push your code to GitHub/GitLab/Bitbucket"
echo "2. Go to https://netlify.com and click 'New site from Git'"
echo "3. Connect your repository - Netlify will automatically detect netlify.toml"
echo "4. Deploy! (No manual configuration needed)"
echo ""
echo "📤 Alternative: Drag & Drop"
echo "1. Go to https://netlify.com"
echo "2. Drag and drop the 'dist/spikerz-dashboard/browser' folder"
echo "3. Note: Manual upload won't use netlify.toml redirects"
echo ""
echo "💻 Alternative: Netlify CLI"
echo "  npm install -g netlify-cli"
echo "  netlify deploy --prod --dir=dist/spikerz-dashboard/browser"

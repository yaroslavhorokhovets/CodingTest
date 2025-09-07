#!/bin/bash

# Webinar Wrapper System Deployment Script

set -e

echo "🚀 Starting deployment of Webinar Wrapper System..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎉 Deployment ready!"
    echo ""
    echo "Next steps:"
    echo "1. Set up your environment variables in .env.local"
    echo "2. Configure Firebase project and add credentials"
    echo "3. Set up Zoom SDK credentials"
    echo "4. Run 'npm start' to start the production server"
    echo ""
    echo "📚 Don't forget to check the README.md for detailed setup instructions!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
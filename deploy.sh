#!/bin/bash

# Wedding Website GitHub Pages Deployment Script

echo "🚀 Starting deployment to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "📝 Next steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Click on 'Settings'"
    echo "3. Scroll down to 'Pages' section"
    echo "4. Select 'Deploy from a branch'"
    echo "5. Choose 'gh-pages' branch and '/ (root)' folder"
    echo "6. Click 'Save'"
    echo ""
    echo "Your website will be available in a few minutes at:"
    echo "https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 
# Wedding Website GitHub Pages Deployment Script

Write-Host "🚀 Starting deployment to GitHub Pages..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Git repository not initialized. Please run 'git init' first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if gh-pages is installed
try {
    $null = npm list gh-pages 2>$null
} catch {
    Write-Host "📦 Installing gh-pages..." -ForegroundColor Yellow
    npm install --save-dev gh-pages
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Deploy to GitHub Pages
Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository"
    Write-Host "2. Click on 'Settings'"
    Write-Host "3. Scroll down to 'Pages' section"
    Write-Host "4. Select 'Deploy from a branch'"
    Write-Host "5. Choose 'gh-pages' branch and '/ (root)' folder"
    Write-Host "6. Click 'Save'"
    Write-Host ""
    Write-Host "Your website will be available in a few minutes at:" -ForegroundColor Cyan
    Write-Host "https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit" 
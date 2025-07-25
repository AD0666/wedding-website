@echo off
echo 🚀 Starting deployment to GitHub Pages...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: Git repository not initialized. Please run 'git init' first.
    pause
    exit /b 1
)

REM Check if gh-pages is installed
npm list gh-pages >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing gh-pages...
    npm install --save-dev gh-pages
)

REM Build the project
echo 🔨 Building the project...
npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

REM Deploy to GitHub Pages
echo 🌐 Deploying to GitHub Pages...
npm run deploy

if errorlevel 1 (
    echo ❌ Deployment failed. Please check the error messages above.
    pause
    exit /b 1
) else (
    echo ✅ Deployment successful!
    echo.
    echo 📝 Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Click on 'Settings'
    echo 3. Scroll down to 'Pages' section
    echo 4. Select 'Deploy from a branch'
    echo 5. Choose 'gh-pages' branch and '/ (root)' folder
    echo 6. Click 'Save'
    echo.
    echo Your website will be available in a few minutes at:
    echo https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]
)

pause 
@echo off
echo 🚀 Simple Windows Build Script
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this from the project root.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo 🔨 Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo 📱 Packaging for Windows...
call npm run package:win
if %errorlevel% neq 0 (
    echo ❌ Windows packaging failed
    pause
    exit /b 1
)

echo 💾 Creating portable ZIP...
call npm run create:win
if %errorlevel% neq 0 (
    echo ❌ ZIP creation failed
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo 📁 Check the dist/ folder for your Windows app
echo.
pause

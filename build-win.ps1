# PowerShell Windows Build Script
# Run this script as Administrator if you encounter permission issues

Write-Host "🚀 Building User Management App for Windows..." -ForegroundColor Green
Write-Host "📅 Date: $(Get-Date)" -ForegroundColor Cyan
Write-Host "💻 Platform: Windows 11" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "📥 Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
Write-Host "🔍 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    Write-Host "🔧 Please reinstall Node.js" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean previous builds
Write-Host ""
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "📁 Removing dist directory..." -ForegroundColor Cyan
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ dist directory removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No dist directory found" -ForegroundColor Cyan
}

if (Test-Path "build") {
    Write-Host "📁 Removing build directory..." -ForegroundColor Cyan
    Remove-Item -Path "build" -Recurse -Force
    Write-Host "✅ build directory removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No build directory found" -ForegroundColor Cyan
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "🔄 Running: npm install" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "🔧 Try running: npm cache clean --force" -ForegroundColor Yellow
    Write-Host "🔧 Then run: npm install" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Build CSS
Write-Host ""
Write-Host "🎨 Building CSS..." -ForegroundColor Yellow
Write-Host "🔄 Running: npm run build:css" -ForegroundColor Cyan
npm run build:css
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build CSS" -ForegroundColor Red
    Write-Host "🔧 Check if Tailwind CSS is properly configured" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ CSS built successfully" -ForegroundColor Green

# Build JavaScript
Write-Host ""
Write-Host "🔨 Building JavaScript..." -ForegroundColor Yellow
Write-Host "🔄 Running: npm run build:js" -ForegroundColor Cyan
npm run build:js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build JavaScript" -ForegroundColor Red
    Write-Host "🔧 Check if Webpack is properly configured" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ JavaScript built successfully" -ForegroundColor Green

# Verify build outputs
Write-Host ""
Write-Host "🔍 Verifying build outputs..." -ForegroundColor Yellow
if (-not (Test-Path "src\styles\output.css")) {
    Write-Host "❌ CSS output file not found: src\styles\output.css" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
if (-not (Test-Path "src\js\bundle.js")) {
    Write-Host "❌ JavaScript bundle not found: src\js\bundle.js" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Build outputs verified" -ForegroundColor Green

# Package for Windows
Write-Host ""
Write-Host "📱 Packaging for Windows..." -ForegroundColor Yellow
Write-Host "🔄 Running: electron-packager" -ForegroundColor Cyan
npx electron-packager . "User Management App" `
  --platform=win32 `
  --arch=x64 `
  --out=dist `
  --overwrite `
  --icon=assets/icon.png `
  --app-copyright="User Management App" `
  --app-version=1.0.0 `
  --build-version=1.0.0 `
  --verbose

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to package for Windows" -ForegroundColor Red
    Write-Host "🔧 Check if electron-packager is installed: npm install -g electron-packager" -ForegroundColor Yellow
    Write-Host "🔧 Or try: npx electron-packager --version" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify the packaged app
Write-Host ""
Write-Host "🔍 Verifying packaged app..." -ForegroundColor Yellow
if (-not (Test-Path "dist\User Management App-win32-x64\User Management App.exe")) {
    Write-Host "❌ Windows executable not found" -ForegroundColor Red
    Write-Host "📁 Checking dist directory contents:" -ForegroundColor Yellow
    if (Test-Path "dist") {
        Get-ChildItem -Path "dist" -Recurse | Select-Object FullName, Length
    }
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Windows executable found" -ForegroundColor Green

# Create portable zip
Write-Host ""
Write-Host "💾 Creating portable zip..." -ForegroundColor Yellow
Set-Location "dist"
Write-Host "🔄 Creating ZIP archive..." -ForegroundColor Cyan
Compress-Archive -Path "User Management App-win32-x64" -DestinationPath "User Management App-1.0.0-win.zip" -Force

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create ZIP file" -ForegroundColor Red
    Write-Host "🔧 Try running PowerShell as Administrator" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify ZIP file
if (-not (Test-Path "User Management App-1.0.0-win.zip")) {
    Write-Host "❌ ZIP file not created" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🎉 Windows build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Portable app bundle: dist\User Management App-win32-x64\" -ForegroundColor Cyan
Write-Host "📦 ZIP file: dist\User Management App-1.0.0-win.zip" -ForegroundColor Cyan
Write-Host "📊 ZIP file size:" -ForegroundColor Cyan
$zipFile = Get-ChildItem "User Management App-1.0.0-win.zip"
Write-Host "   $($zipFile.Name) - $([math]::Round($zipFile.Length/1MB, 2)) MB" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 To run the portable app:" -ForegroundColor Yellow
Write-Host "   1. Extract the ZIP file" -ForegroundColor White
Write-Host "   2. Navigate to User Management App-win32-x64 folder" -ForegroundColor White
Write-Host "   3. Double-click User Management App.exe" -ForegroundColor White
Write-Host ""
Write-Host "📋 To distribute:" -ForegroundColor Yellow
Write-Host "   - Send the ZIP file for portable use" -ForegroundColor White
Write-Host "   - Users can extract and run without installation" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Troubleshooting:" -ForegroundColor Yellow
Write-Host "   - If the app doesn't start, check Windows Event Viewer" -ForegroundColor White
Write-Host "   - Ensure Visual C++ Redistributable is installed" -ForegroundColor White
Write-Host "   - Try running as Administrator if needed" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

@echo off
setlocal enabledelayedexpansion

echo 🚀 Building User Management App for Windows...
echo 📅 Date: %date% %time%
echo 💻 Platform: Windows 11
echo.

REM Check if Node.js is installed
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo 📥 Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found: 
node --version

REM Check if npm is available
echo 🔍 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    echo 🔧 Please reinstall Node.js
    pause
    exit /b 1
)
echo ✅ npm found:
npm --version

REM Clean previous builds
echo.
echo 🧹 Cleaning previous builds...
if exist dist (
    echo 📁 Removing dist directory...
    rmdir /s /q dist
    echo ✅ dist directory removed
) else (
    echo ℹ️ No dist directory found
)

if exist build (
    echo 📁 Removing build directory...
    rmdir /s /q build
    echo ✅ build directory removed
) else (
    echo ℹ️ No build directory found
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
echo 🔄 Running: npm install
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo 🔧 Try running: npm cache clean --force
    echo 🔧 Then run: npm install
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Build CSS
echo.
echo 🎨 Building CSS...
echo 🔄 Running: npm run build:css
npm run build:css
if %errorlevel% neq 0 (
    echo ❌ Failed to build CSS
    echo 🔧 Check if Tailwind CSS is properly configured
    pause
    exit /b 1
)
echo ✅ CSS built successfully

REM Build JavaScript
echo.
echo 🔨 Building JavaScript...
echo 🔄 Running: npm run build:js
npm run build:js
if %errorlevel% neq 0 (
    echo ❌ Failed to build JavaScript
    echo 🔧 Check if Webpack is properly configured
    pause
    exit /b 1
)
echo ✅ JavaScript built successfully

REM Verify build outputs
echo.
echo 🔍 Verifying build outputs...
if not exist "src\styles\output.css" (
    echo ❌ CSS output file not found: src\styles\output.css
    pause
    exit /b 1
)
if not exist "src\js\bundle.js" (
    echo ❌ JavaScript bundle not found: src\js\bundle.js
    pause
    exit /b 1
)
echo ✅ Build outputs verified

REM Package for Windows
echo.
echo 📱 Packaging for Windows...
echo 🔄 Running: electron-packager
npx electron-packager . "User Management App" ^
  --platform=win32 ^
  --arch=x64 ^
  --out=dist ^
  --overwrite ^
  --icon=assets/icon.png ^
  --app-copyright="User Management App" ^
  --app-version=1.0.0 ^
  --build-version=1.0.0 ^
  --verbose

if %errorlevel% neq 0 (
    echo ❌ Failed to package for Windows
    echo 🔧 Check if electron-packager is installed: npm install -g electron-packager
    echo 🔧 Or try: npx electron-packager --version
    pause
    exit /b 1
)

REM Verify the packaged app
echo.
echo 🔍 Verifying packaged app...
if not exist "dist\User Management App-win32-x64\User Management App.exe" (
    echo ❌ Windows executable not found
    echo 📁 Checking dist directory contents:
    if exist dist (
        dir dist /s
    )
    pause
    exit /b 1
)
echo ✅ Windows executable found

REM Create portable zip
echo.
echo 💾 Creating portable zip...
cd dist
echo 🔄 Creating ZIP archive...
powershell -Command "Compress-Archive -Path 'User Management App-win32-x64' -DestinationPath 'User Management App-1.0.0-win.zip' -Force"

if %errorlevel% neq 0 (
    echo ❌ Failed to create ZIP file
    echo 🔧 Try running PowerShell as Administrator
    pause
    exit /b 1
)

REM Verify ZIP file
if not exist "User Management App-1.0.0-win.zip" (
    echo ❌ ZIP file not created
    pause
    exit /b 1
)

echo.
echo 🎉 Windows build completed successfully!
echo.
echo 📁 Portable app bundle: dist\User Management App-win32-x64\
echo 📦 ZIP file: dist\User Management App-1.0.0-win.zip
echo 📊 ZIP file size: 
powershell -Command "Get-ChildItem 'User Management App-1.0.0-win.zip' | Select-Object Name, @{Name='Size(MB)';Expression={[math]::Round($_.Length/1MB,2)}}"
echo.
echo 🎯 To run the portable app:
echo   1. Extract the ZIP file
echo   2. Navigate to User Management App-win32-x64 folder
echo   3. Double-click User Management App.exe
echo.
echo 📋 To distribute:
echo    - Send the ZIP file for portable use
echo    - Users can extract and run without installation
echo.
echo 🔍 Troubleshooting:
echo    - If the app doesn't start, check Windows Event Viewer
echo    - Ensure Visual C++ Redistributable is installed
echo    - Try running as Administrator if needed
echo.
pause


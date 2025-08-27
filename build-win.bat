@echo off
echo 🚀 Building User Management App for Windows...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build

REM Install dependencies if needed
echo 📦 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Package for Windows
echo 📱 Packaging for Windows...
npx electron-packager . "User Management App" ^
  --platform=win32 ^
  --arch=x64 ^
  --out=dist ^
  --overwrite ^
  --icon=assets/icon.png ^
  --app-copyright="User Management App" ^
  --app-version=1.0.0 ^
  --build-version=1.0.0

REM Create portable zip
echo 💾 Creating portable zip...
cd dist
powershell -Command "Compress-Archive -Path 'User Management App-win32-x64' -DestinationPath 'User Management App-1.0.0-win.zip' -Force"

echo ✅ Windows build completed!
echo 📁 Portable app bundle: dist\User Management App-win32-x64\
echo 📦 ZIP file: dist\User Management App-1.0.0-win.zip
echo.
echo 🎯 To run the portable app:
echo   1. Extract the ZIP file
echo   2. Navigate to User Management App-win32-x64 folder
echo   3. Double-click User Management App.exe
echo.
echo 📋 To distribute:
echo    - Send the ZIP file for portable use
echo    - Users can extract and run without installation
pause


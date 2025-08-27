#!/bin/bash

echo "🚀 Building User Management App..."

# Detect platform
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="mac"
    echo "🍎 Detected macOS"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PLATFORM="win"
    echo "🪟 Detected Windows"
else
    echo "❌ Unsupported platform: $OSTYPE"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf build/

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Package based on platform
if [[ "$PLATFORM" == "mac" ]]; then
    echo "📱 Packaging for macOS..."
    npx electron-packager . "User Management App" \
      --platform=darwin \
      --arch=arm64 \
      --out=dist \
      --overwrite \
      --icon=assets/icon.png \
      --app-copyright="User Management App" \
      --app-version=1.0.0 \
      --build-version=1.0.0
    
    # Create DMG
    echo "💾 Creating DMG..."
    cd dist
    hdiutil create -volname "User Management App" \
      -srcfolder "User Management App-darwin-arm64" \
      -ov -format UDZO "User Management App-1.0.0.dmg"
    
    echo "✅ macOS build completed!"
    echo "📁 Portable app bundle: dist/User Management App-darwin-arm64/"
    echo "💿 DMG file: dist/User Management App-1.0.0.dmg"
    
elif [[ "$PLATFORM" == "win" ]]; then
    echo "📱 Packaging for Windows..."
    npx electron-packager . "User Management App" \
      --platform=win32 \
      --arch=x64 \
      --out=dist \
      --overwrite \
      --icon=assets/icon.png \
      --app-copyright="User Management App" \
      --app-version=1.0.0 \
      --build-version=1.0.0
    
    # Create portable zip
    echo "💾 Creating portable zip..."
    cd dist
    powershell -Command "Compress-Archive -Path 'User Management App-win32-x64' -DestinationPath 'User Management App-1.0.0-win.zip' -Force"
    
    echo "✅ Windows build completed!"
    echo "📁 Portable app bundle: dist\User Management App-win32-x64\"
    echo "📦 ZIP file: dist\User Management App-1.0.0-win.zip"
fi

echo ""
echo "🎯 To run the portable app:"
if [[ "$PLATFORM" == "mac" ]]; then
    echo "   cd 'dist/User Management App-darwin-arm64/'"
    echo "   open 'User Management App.app'"
elif [[ "$PLATFORM" == "win" ]]; then
    echo "   1. Extract the ZIP file"
    echo "   2. Navigate to User Management App-win32-x64 folder"
    echo "   3. Double-click User Management App.exe"
fi

echo ""
echo "📋 To distribute:"
if [[ "$PLATFORM" == "mac" ]]; then
    echo "   - Send the DMG file for easy installation"
    echo "   - Or zip the app bundle for portable use"
elif [[ "$PLATFORM" == "win" ]]; then
    echo "   - Send the ZIP file for portable use"
    echo "   - Users can extract and run without installation"
fi

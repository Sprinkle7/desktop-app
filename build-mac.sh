#!/bin/bash

echo "🚀 Building User Management App for macOS..."

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

# Package for macOS
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
echo ""
echo "🎯 To run the portable app:"
echo "   cd 'dist/User Management App-darwin-arm64/'"
echo "   open 'User Management App.app'"
echo ""
echo "📋 To distribute:"
echo "   - Send the DMG file for easy installation"
echo "   - Or zip the app bundle for portable use"

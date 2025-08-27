#!/bin/bash

echo "🧪 Testing Portable User Management App..."

# Check if the portable app exists
if [ ! -d "dist/User Management App-darwin-arm64" ]; then
    echo "❌ Portable app not found. Please run ./build-mac.sh first."
    exit 1
fi

echo "✅ Portable app found!"
echo "📱 App location: dist/User Management App-darwin-arm64/User Management App.app"
echo "💾 App size: $(du -sh 'dist/User Management App-darwin-arm64' | cut -f1)"
echo ""

echo "🎯 To run the portable app:"
echo "   1. Navigate to the app folder:"
echo "      cd 'dist/User Management App-darwin-arm64/'"
echo ""
echo "   2. Open the app:"
echo "      open 'User Management App.app'"
echo ""
echo "   3. Or double-click the .app file in Finder"
echo ""

echo "📋 Distribution files created:"
echo "   🍎 Portable App Bundle: dist/User Management App-darwin-arm64/"
echo "   💿 DMG Installer: dist/User Management App-1.0.0.dmg"
echo ""

echo "🚀 Ready for distribution!"
echo "   - Send the DMG file for easy installation"
echo "   - Or zip the app bundle for portable use"
echo "   - Users can run without installation!"


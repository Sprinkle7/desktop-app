# 🚀 Build Instructions for Portable User Management App

This guide will help you create portable versions of the User Management App for both macOS and Windows that can run without installation.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🍎 Building for macOS

### Option 1: Using the Build Script (Recommended)
```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Run the macOS build script
./build-mac.sh
```

### Option 2: Manual Build
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Package for macOS
npx electron-packager . "User Management App" \
  --platform=darwin \
  --arch=arm64 \
  --out=dist \
  --overwrite \
  --icon=assets/icon.png

# Create DMG
cd dist
hdiutil create -volname "User Management App" \
  -srcfolder "User Management App-darwin-arm64" \
  -ov -format UDZO "User Management App-1.0.0.dmg"
```

## 🪟 Building for Windows

### Option 1: Using the Build Script (Recommended)
```bash
# Make sure you're in the project directory
cd /path/to/your/project

# Run the Windows build script
./build-win.bat
```

### Option 2: Manual Build
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Package for Windows
npx electron-packager . "User Management App" \
  --platform=win32 \
  --arch=x64 \
  --out=dist \
  --overwrite \
  --icon=assets/icon.png

# Create portable zip
cd dist
powershell -Command "Compress-Archive -Path 'User Management App-win32-x64' -DestinationPath 'User Management App-1.0.0-win.zip' -Force"
```

## 🌍 Universal Build (Auto-Detects Platform)

```bash
# Run the universal build script
./build.sh
```

This script will automatically detect your platform and build accordingly.

## 📁 Output Files

### macOS Build
- **Portable App Bundle**: `dist/User Management App-darwin-arm64/`
- **DMG Installer**: `dist/User Management App-1.0.0.dmg`

### Windows Build
- **Portable App Bundle**: `dist/User Management App-win32-x64/`
- **Portable ZIP**: `dist/User Management App-1.0.0-win.zip`

## 🎯 Running the Portable App

### macOS
```bash
# Navigate to the app bundle
cd "dist/User Management App-darwin-arm64/"

# Open the app
open "User Management App.app"
```

### Windows
1. Extract the ZIP file
2. Navigate to `User Management App-win32-x64` folder
3. Double-click `User Management App.exe`

## 📦 Distribution

### For End Users
- **macOS**: Send the `.dmg` file for easy installation
- **Windows**: Send the `.zip` file for portable use

### Portable Use
- **macOS**: Zip the app bundle folder
- **Windows**: The ZIP file is already portable

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x build.sh build-mac.sh
   ```

2. **Build Fails**
   ```bash
   # Clean and rebuild
   rm -rf dist/ build/ node_modules/
   npm install
   npm run build
   ```

3. **Icon Not Found**
   - Ensure `assets/icon.png` exists
   - Or remove the `--icon` parameter

### Platform-Specific Issues

#### macOS
- **ARM64 vs Intel**: The build script targets ARM64 (Apple Silicon). For Intel Macs, change `--arch=arm64` to `--arch=x64`
- **DMG Creation**: Requires `hdiutil` (built into macOS)

#### Windows
- **PowerShell**: The build script requires PowerShell for ZIP creation
- **Architecture**: Targets x64. For 32-bit Windows, change `--arch=x64` to `--arch=ia32`

## 📊 Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "package:mac": "npm run build && electron-packager . \"User Management App\" --platform=darwin --arch=arm64 --out=dist --overwrite",
    "package:win": "npm run build && electron-packager . \"User Management App\" --platform=win32 --arch=x64 --out=dist --overwrite",
    "package:all": "npm run build && electron-packager . \"User Management App\" --platform=darwin,win32 --arch=arm64,x64 --out=dist --overwrite"
  }
}
```

### Electron Packager Options
- `--platform`: Target platform (darwin, win32, linux)
- `--arch`: Target architecture (arm64, x64, ia32)
- `--out`: Output directory
- `--overwrite`: Overwrite existing builds
- `--icon`: Application icon
- `--app-copyright`: Copyright information
- `--app-version`: Application version

## 🎉 Success!

After building, you'll have:
- ✅ **Portable app bundles** that run without installation
- ✅ **Professional installers** (DMG for macOS)
- ✅ **Easy distribution** via ZIP/DMG files
- ✅ **Cross-platform compatibility**

Your User Management App is now ready for distribution! 🚀


# 🪟 Windows Build Troubleshooting Guide

If your Windows build is failing or not creating the portable app, follow this troubleshooting guide.

## 🚨 **Common Issues & Solutions**

### **Issue 1: Script Runs But No Output**
**Symptoms**: Script runs and ends immediately, no error messages
**Solutions**:
1. **Run as Administrator**: Right-click on the batch file → "Run as administrator"
2. **Check PowerShell Execution Policy**:
   ```powershell
   Get-ExecutionPolicy
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. **Use PowerShell Script**: Try `build-win.ps1` instead of `build-win.bat`

### **Issue 2: Node.js/npm Not Found**
**Symptoms**: "Node.js is not installed" or "npm is not available"
**Solutions**:
1. **Install Node.js**: Download from https://nodejs.org/ (LTS version)
2. **Add to PATH**: Ensure Node.js is in your system PATH
3. **Restart Command Prompt**: Close and reopen after installation
4. **Verify Installation**:
   ```cmd
   node --version
   npm --version
   ```

### **Issue 3: Build Process Fails**
**Symptoms**: CSS or JavaScript build fails
**Solutions**:
1. **Clear npm Cache**:
   ```cmd
   npm cache clean --force
   ```
2. **Delete node_modules**:
   ```cmd
   rmdir /s node_modules
   npm install
   ```
3. **Check Dependencies**: Ensure all packages are compatible

### **Issue 4: electron-packager Fails**
**Symptoms**: "Failed to package for Windows" error
**Solutions**:
1. **Install electron-packager globally**:
   ```cmd
   npm install -g electron-packager
   ```
2. **Check Version Compatibility**:
   ```cmd
   npx electron-packager --version
   ```
3. **Update electron-packager**:
   ```cmd
   npm update -g electron-packager
   ```

### **Issue 5: ZIP Creation Fails**
**Symptoms**: App packages but ZIP file not created
**Solutions**:
1. **Run as Administrator**: PowerShell needs admin rights for ZIP creation
2. **Check Disk Space**: Ensure you have enough free space
3. **Use Alternative ZIP Tool**: Install 7-Zip and use it instead

## 🛠️ **Alternative Build Methods**

### **Method 1: Use npm Scripts Directly**
```cmd
npm install
npm run build
npm run package:win
npm run create:win
```

### **Method 2: Manual electron-packager**
```cmd
npx electron-packager . "User Management App" --platform=win32 --arch=x64 --out=dist --overwrite
```

### **Method 3: Use PowerShell Script**
```powershell
# Right-click build-win.ps1 → "Run with PowerShell"
# Or run in PowerShell:
.\build-win.ps1
```

## 🔍 **Debugging Steps**

### **Step 1: Check Prerequisites**
```cmd
node --version
npm --version
npx electron-packager --version
```

### **Step 2: Verify Project Structure**
```
your-project/
├── package.json          ✅ Must exist
├── main.js              ✅ Must exist
├── src/
│   ├── index.html       ✅ Must exist
│   ├── styles/          ✅ Must exist
│   └── js/              ✅ Must exist
└── assets/
    └── icon.png         ✅ Must exist
```

### **Step 3: Check Build Outputs**
After running `npm run build`, verify these files exist:
- `src/styles/output.css`
- `src/js/bundle.js`

### **Step 4: Monitor Build Process**
Use the verbose flag to see detailed output:
```cmd
npx electron-packager . "User Management App" --platform=win32 --arch=x64 --out=dist --overwrite --verbose
```

## 📋 **Required Files for Windows Build**

### **Core Files**
- ✅ `main.js` - Electron main process
- ✅ `package.json` - Project configuration
- ✅ `src/index.html` - Main HTML file
- ✅ `src/js/bundle.js` - JavaScript bundle
- ✅ `src/styles/output.css` - CSS styles

### **Assets**
- ✅ `assets/icon.png` - App icon (optional but recommended)
- ✅ `public/sql-wasm.wasm` - SQL.js WASM file

## 🚀 **Quick Fix Commands**

### **Reset Everything and Rebuild**
```cmd
rmdir /s node_modules
rmdir /s dist
del package-lock.json
npm cache clean --force
npm install
npm run build
npm run package:win
```

### **Check for Common Issues**
```cmd
npm audit
npm outdated
npm ls electron
npm ls electron-packager
```

## 🎯 **Expected Output Structure**

After successful build, you should have:
```
dist/
├── User Management App-win32-x64/
│   ├── User Management App.exe    ✅ Main executable
│   ├── resources/                 ✅ App resources
│   └── ...                       ✅ Other files
└── User Management App-1.0.0-win.zip  ✅ Portable ZIP
```

## 🔧 **Advanced Troubleshooting**

### **Check Windows Event Viewer**
1. Press `Win + R` → `eventvwr.msc`
2. Check "Windows Logs" → "Application"
3. Look for errors related to your app

### **Install Visual C++ Redistributable**
Download and install from Microsoft:
- Visual C++ Redistributable for Visual Studio 2015-2022

### **Check Antivirus Software**
Some antivirus software may block the build process:
- Temporarily disable real-time protection
- Add build directory to exclusions

### **Use Windows Subsystem for Linux (WSL)**
If all else fails, try building in WSL:
```bash
# Install WSL and Node.js
sudo apt update
sudo apt install nodejs npm
npm install
npm run build
npm run package:win
```

## 📞 **Still Having Issues?**

If none of the above solutions work:

1. **Check Error Messages**: Look for specific error codes or messages
2. **Verify Node.js Version**: Use Node.js 18.x or 20.x LTS
3. **Check Windows Version**: Ensure you're on Windows 10/11
4. **Try Different Terminal**: Use Command Prompt, PowerShell, or Windows Terminal
5. **Check File Permissions**: Ensure you have write access to the project directory

## 🎉 **Success Indicators**

Your build is successful when you see:
- ✅ "Windows build completed successfully!"
- ✅ `dist/` folder created
- ✅ `User Management App.exe` exists
- ✅ ZIP file created with proper size (usually 100-200 MB)

## 📚 **Additional Resources**

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-packager Documentation](https://github.com/electron/electron-packager)
- [Node.js Installation Guide](https://nodejs.org/en/download/)
- [Windows PowerShell Guide](https://docs.microsoft.com/en-us/powershell/)

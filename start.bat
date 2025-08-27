@echo off
echo Starting User Management Application...

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the application
echo Building application...
npm run build

REM Start the application
echo Starting application...
npm start

pause

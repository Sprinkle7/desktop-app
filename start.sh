#!/bin/bash

echo "Starting User Management Application in development mode..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building application..."
npm run build

# Start the application
echo "Starting application..."
npm start

#!/bin/bash

echo "🐳 Building Windows Version using Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Windows Docker image
echo "🔨 Building Docker image..."
docker build -f Dockerfile.windows -t user-management-windows .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    
    # Create a container and copy the build output
    echo "📦 Extracting Windows build..."
    docker run --rm -v "$(pwd)/dist-windows:/dist" user-management-windows
    
    # Check if the build was successful
    if [ -f "dist-windows/User Management App-1.0.0-win.zip" ]; then
        echo ""
        echo "🎉 Windows build completed successfully!"
        echo "📁 Windows ZIP file: dist-windows/User Management App-1.0.0-win.zip"
        echo "📊 File size: $(du -h 'dist-windows/User Management App-1.0.0-win.zip' | cut -f1)"
        echo ""
        echo "🚀 Ready for Windows distribution!"
    else
        echo "❌ Windows build failed. Check Docker logs above."
        exit 1
    fi
else
    echo "❌ Docker build failed. Check the error messages above."
    exit 1
fi


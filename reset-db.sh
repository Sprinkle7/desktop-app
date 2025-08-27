#!/bin/bash

echo "🧹 Database Reset Script"
echo "This will clear all test data while preserving admin login credentials."
echo ""

read -p "Are you sure you want to reset the database? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Resetting database..."
    npm run reset-db
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Database reset completed successfully!"
        echo "🎯 You can now start fresh with a clean database."
        echo "🔐 Login with: admin / admin123"
    else
        echo ""
        echo "❌ Database reset failed. Check the error messages above."
    fi
else
    echo "❌ Database reset cancelled."
fi


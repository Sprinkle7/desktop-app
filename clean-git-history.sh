#!/bin/bash

echo "🧹 Cleaning Git History - Removing Large Files..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from your project directory."
    exit 1
fi

# Create a backup branch
echo "📦 Creating backup branch..."
git checkout -b backup-before-cleanup

# Go back to main
git checkout main

# Remove large files from all commits
echo "🗑️ Removing large files from git history..."
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch -r dist/ users.db photos/ *.dmg *.exe *.zip 2>/dev/null || true' \
    --prune-empty --tag-name-filter cat -- --all

# Clean up the backup
echo "🧽 Cleaning up..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Git history cleaned successfully!"
echo "📝 Large files have been removed from all commits."
echo ""
echo "🚀 Now you can push to GitHub:"
echo "   git push origin main --force"
echo ""
echo "⚠️  Note: This rewrites history. If others are working on this repo,"
echo "   they'll need to re-clone or reset their local copies."

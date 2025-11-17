#!/bin/bash

# Script to create a new Expo/React Native project based on Plantly setup
# Usage: ./create-new-project.sh <new-project-name> <new-project-path>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./create-new-project.sh <project-name> <project-path>"
    echo "Example: ./create-new-project.sh myapp ../myapp"
    exit 1
fi

PROJECT_NAME=$1
PROJECT_PATH=$2
CURRENT_DIR=$(pwd)

echo "🚀 Creating new project '$PROJECT_NAME' at '$PROJECT_PATH'..."

# Create project directory
mkdir -p "$PROJECT_PATH"
cd "$PROJECT_PATH"

# Initialize new Expo project
npx create-expo-app@latest "$PROJECT_NAME" --template blank-typescript

cd "$PROJECT_NAME"

# Copy essential configuration files
echo "📋 Copying configuration files..."

# Copy package.json dependencies (we'll merge them)
cp "$CURRENT_DIR/package.json" ./package.json.template

# Copy tsconfig.json
cp "$CURRENT_DIR/tsconfig.json" ./tsconfig.json

# Copy eslint.config.js
cp "$CURRENT_DIR/eslint.config.js" ./eslint.config.js

# Copy .gitignore
cp "$CURRENT_DIR/.gitignore" ./.gitignore

# Copy app.json template (will need manual editing)
cp "$CURRENT_DIR/app.json" ./app.json.template

# Copy index.ts
cp "$CURRENT_DIR/index.ts" ./index.ts

# Update package.json with new project name
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.name = '$PROJECT_NAME';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Project created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit app.json and update:"
echo "   - name, slug, scheme"
echo "   - bundleIdentifier (iOS)"
echo "   - package (Android)"
echo "2. Update index.ts if needed"
echo "3. Remove app.json.template and package.json.template after reviewing"
echo "4. Initialize git: git init"
echo ""
echo "🎉 Your new project is ready at: $PROJECT_PATH/$PROJECT_NAME"


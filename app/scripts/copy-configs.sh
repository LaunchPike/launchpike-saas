#!/bin/bash
# Script to copy Tailwind and PostCSS configs and install dependencies

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$PROJECT_ROOT/.wasp/out/web-app"

if [ -d "$TARGET_DIR" ]; then
  echo "Copying Tailwind and PostCSS configs..."
  cp "$PROJECT_ROOT/postcss.config.cjs" "$TARGET_DIR/" 2>/dev/null && echo "✓ Copied postcss.config.cjs"
  cp "$PROJECT_ROOT/tailwind.config.cjs" "$TARGET_DIR/" 2>/dev/null && echo "✓ Copied tailwind.config.cjs"
  
  echo "Installing Tailwind CSS dependencies..."
  cd "$TARGET_DIR" && npm install tailwindcss@^3.2.7 autoprefixer postcss --save-dev --silent 2>/dev/null
  
  echo "✅ Tailwind CSS setup complete!"
else
  echo "Warning: $TARGET_DIR does not exist yet. Run 'wasp start' first."
fi


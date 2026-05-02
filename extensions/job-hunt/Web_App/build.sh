#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Running TypeScript compilation..."
npx vue-tsc -b

echo "Building with Vite..."
npx vite build

echo "Build complete!"

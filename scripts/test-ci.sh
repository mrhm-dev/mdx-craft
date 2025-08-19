#!/bin/bash

# Exit on any error
set -e

echo "🧪 Running tests in CI mode..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run linting
echo "🔍 Running linting..."
pnpm lint

# Run type checking
echo "🔧 Running type checking..."
pnpm check-types

# Run tests with coverage
echo "🧪 Running tests with coverage..."
pnpm test:coverage

# Build all packages
echo "🏗️  Building packages..."
pnpm build

echo "✅ All CI checks passed!"
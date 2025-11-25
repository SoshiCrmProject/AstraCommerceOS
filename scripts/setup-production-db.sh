#!/bin/bash
# Production database setup script for Vercel deployment

set -e

echo "🔧 Setting up production database..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Push schema to database (creates tables if they don't exist)
# Using db push instead of migrate for initial setup
echo "📊 Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "✅ Database setup complete!"

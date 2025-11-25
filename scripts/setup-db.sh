#!/bin/bash
# Database setup script for AstraCommerce OS

set -e

echo "🚀 Setting up AstraCommerce OS database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file"
    exit 1
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed database (optional)
if [ "$1" = "--seed" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update your .env file with credentials"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3000"

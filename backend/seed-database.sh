#!/bin/bash

echo "🚀 Connectr Database Seeding Script"
echo "=================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one with your DATABASE_URL"
    exit 1
fi

echo "📋 This script will:"
echo "   1. Clear all existing data from the database"
echo "   2. Create realistic sample data including:"
echo "      - 70+ users with different roles"
echo "      - 12 networks across various categories"
echo "      - 80+ posts with realistic content"
echo "      - 200+ comments and reactions"
echo "      - User connections and network memberships"
echo "      - All with realistic timestamps"
echo ""

read -p "⚠️  This will DELETE ALL existing data. Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Seeding cancelled"
    exit 1
fi

echo ""
echo "🌱 Starting database seeding..."
echo ""

# Run the seeding script
npm run db:seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Seeding completed successfully!"
    echo ""
    echo "🔑 Default login credentials:"
    echo "   Email: alex.johnson@email.com"
    echo "   Password: password123"
    echo ""
    echo "🎉 Your platform is now ready with realistic data!"
    echo "   You can now start the backend server and test the frontend."
else
    echo ""
    echo "❌ Seeding failed. Please check the error messages above."
    exit 1
fi

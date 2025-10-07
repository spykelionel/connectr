@echo off
echo 🚀 Connectr Database Seeding Script
echo ==================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found. Please create one with your DATABASE_URL
    pause
    exit /b 1
)

echo 📋 This script will:
echo    1. Clear all existing data from the database
echo    2. Create realistic sample data including:
echo       - 70+ users with different roles
echo       - 12 networks across various categories
echo       - 80+ posts with realistic content
echo       - 200+ comments and reactions
echo       - User connections and network memberships
echo       - All with realistic timestamps
echo.

set /p confirm="⚠️  This will DELETE ALL existing data. Continue? (y/N): "

if /i not "%confirm%"=="y" (
    echo ❌ Seeding cancelled
    pause
    exit /b 1
)

echo.
echo 🌱 Starting database seeding...
echo.

REM Run the seeding script
npm run db:seed

if %errorlevel% equ 0 (
    echo.
    echo ✅ Seeding completed successfully!
    echo.
    echo 🔑 Default login credentials:
    echo    Email: alex.johnson@email.com
    echo    Password: password123
    echo.
    echo 🎉 Your platform is now ready with realistic data!
    echo    You can now start the backend server and test the frontend.
) else (
    echo.
    echo ❌ Seeding failed. Please check the error messages above.
)

pause

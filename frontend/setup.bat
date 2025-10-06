@echo off
echo ========================================
echo SocialSphere Frontend Setup Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing core dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install core dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing additional required dependencies...
npm install @radix-ui/react-slot @radix-ui/react-avatar tailwindcss-animate
if %errorlevel% neq 0 (
    echo ERROR: Failed to install additional dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Verifying installation...
npm list @radix-ui/react-slot @radix-ui/react-avatar tailwindcss-animate
if %errorlevel% neq 0 (
    echo WARNING: Some dependencies may not be properly installed
)

echo.
echo [4/4] Running build test...
npm run build
if %errorlevel% neq 0 (
    echo WARNING: Build failed - there may be remaining issues
) else (
    echo SUCCESS: Build completed successfully!
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now run the development server with:
echo   npm run dev
echo.
echo Or start the production build with:
echo   npm run preview
echo.
pause


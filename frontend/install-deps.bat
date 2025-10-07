@echo off
echo Installing dependencies for SocialSphere frontend...
cd /d "%~dp0"
echo Installing core dependencies...
npm install
echo.
echo Installing additional dependencies...
npm install @radix-ui/react-slot @radix-ui/react-avatar tailwindcss-animate
echo.
echo Dependencies installed successfully!
echo You can now run: npm run dev
pause

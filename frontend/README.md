# 🎪 CircusPrime Frontend

A vibrant, energetic, and playful social networking application built with React, TypeScript, and Tailwind CSS. Every interaction feels like part of an amazing circus performance!

## Features

- 🎭 **Circus-Themed Design**: Bold colors, playful animations, and engaging interactions
- 🔐 **Authentication**: Login and registration with form validation
- 👥 **Social Features**: Posts, comments, connections, and networks
- 📱 **Responsive Design**: Mobile-first design with smooth animations
- 🎨 **Modern UI**: Built with shadcn/ui components and Framer Motion

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with circus theme
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   # or run the batch file on Windows
   install-deps.bat
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── features/           # Redux slices and state management
├── pages/              # Page components
├── services/           # API services and RTK Query
├── store/              # Redux store configuration
└── lib/                # Utility functions
```

## Quick testing

🔑 Default login credentials:
Email: <alex.johnson@email.com>
Password: password123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Setup

Make sure you have:

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

## Circus Theme

The application features a custom circus theme with:

- Bold color palette with vibrant gradients
- Playful animations and transitions
- Glassmorphism effects
- Custom Tailwind utilities

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test your changes thoroughly

## License

MIT License - see LICENSE file for details

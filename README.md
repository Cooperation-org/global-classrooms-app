# Global Classrooms - Online Learning Platform

A modern, scalable online learning platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Authentication System**: Complete auth flow with context management
- **Component Library**: Reusable UI components with consistent design
- **Type Safety**: Full TypeScript coverage for better development experience
- **Performance Optimized**: Built with Next.js App Router and optimized for speed

## 📁 Project Structure

```
global-classrooms-app/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components (Button, Input, etc.)
│   │   ├── layout/               # Layout components (Header, Footer)
│   │   ├── forms/                # Form components
│   │   ├── cards/                # Card components
│   │   └── sections/             # Page sections (Hero, Features, etc.)
│   ├── context/                  # React Context providers
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API services and external integrations
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions and helpers
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/                          # Shared libraries and utilities
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Fetch API with custom service layer
- **Code Quality**: ESLint, TypeScript strict mode
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm 8.19.3 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd global-classrooms-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🎨 Design System

The project uses a consistent design system with:

- **Color Palette**: Semantic colors (primary, secondary, accent, etc.)
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable UI components with variants and sizes

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### TypeScript

The project uses strict TypeScript configuration with:
- Strict mode enabled
- Path mapping for clean imports
- Custom type definitions for better DX

### Tailwind CSS

Configured with:
- Custom color palette
- Responsive breakpoints
- Custom utilities and components

## 📚 Component Guidelines

### Creating New Components

1. **Location**: Place components in appropriate directories under `app/components/`
2. **Naming**: Use PascalCase for component names
3. **Props**: Define TypeScript interfaces for all props
4. **Styling**: Use Tailwind CSS classes with consistent patterns
5. **Accessibility**: Include proper ARIA labels and semantic HTML

### Component Structure

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Define props here
}

const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  return (
    // JSX here
  );
};

export default Component;
```

## 🔐 Authentication

The app includes a complete authentication system:

- **Context Provider**: `AuthContext` manages user state
- **Custom Hooks**: `useAuth` for easy access to auth functions
- **Local Storage**: Persistent user sessions
- **Type Safety**: Full TypeScript support for auth types

## 🌐 API Integration

- **Service Layer**: Centralized API calls in `app/services/`
- **Type Safety**: API responses are fully typed
- **Error Handling**: Consistent error handling across all requests
- **Environment Config**: Configurable API endpoints

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Breakpoints**: Tailwind CSS responsive utilities
- **Flexible Layouts**: CSS Grid and Flexbox for layouts
- **Touch-Friendly**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## 🧪 Testing

To add testing to the project:

1. Install testing dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

2. Create test files alongside components
3. Run tests with `npm test`

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

# SWE-bench++ Research Mockup

A React application showcasing the SWE-bench++ research interface with interactive charts, tabs, and progressive disclosure components.

## Features

- **Interactive Charts**: Bar charts using Recharts library showing model performance data
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Component Library**: Custom shadcn/ui components for consistent styling
- **Progressive Disclosure**: Accordion components for organized content presentation
- **State Management**: React hooks for managing interactive state
- **Animations**: Framer Motion for smooth transitions

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **Recharts** - Chart library
- **Framer Motion** - Animation library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   └── utils.js      # Utility functions
├── App.jsx           # Main app component
├── SWEbenchResearchPage.jsx  # Main research page component
├── main.jsx          # React entry point
└── index.css         # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Components Used

- **Card** - Content containers
- **Button** - Interactive buttons
- **Tabs** - Tab navigation
- **Accordion** - Collapsible content sections
- **Select** - Dropdown selections
- **Input** - Text input fields
- **Badge** - Status indicators
- **Switch** - Toggle switches

The application is now ready to run on localhost! 🚀

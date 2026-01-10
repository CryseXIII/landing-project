# Landing Project - React Landing Page

A modern React 18 landing page built with Vite.

## Tech Stack
- **React 18** (LTS) - UI library
- **Vite 7** - Fast build tool and dev server
- **Node.js 24.12.0** (LTS) - Runtime environment

## Getting Started

### Prerequisites
- Node.js 24.12.0 or later (installed globally)
- npm 11.6.2 or later

### Installation
This project uses npm for dependency management (virtual environment via `node_modules/`).

```powershell
cd landing-project
npm install
```

### Development
Start the Vite dev server:

```powershell
npm run dev
```

The app will be available at http://localhost:5173/

### Build for Production
```powershell
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build
```powershell
npm run preview
```

## Project Structure
```
landing-project/
├── src/              # React components and app code
│   ├── App.jsx       # Main app component
│   ├── main.jsx      # Entry point
│   └── ...
├── public/           # Static assets
├── index.html        # HTML entry point
├── package.json      # Dependencies and scripts
├── vite.config.js    # Vite configuration
└── node_modules/     # Virtual environment (dependencies)
```

## Code Style
- Use **tab indentation** for all files (as per repo conventions)
- Follow existing React patterns and component structure

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Notes
- This project was scaffolded with `npm create vite@latest`
- All dependencies are installed locally in `node_modules/` (the Node.js virtual environment)
- The dev server supports hot module replacement (HMR) for instant updates

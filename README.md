# Landing Project

A modern full-stack React application with Express backend, featuring JWT authentication, comprehensive logging, and environment-specific configurations.

## Features

- ⚛️ **React 19** with Vite for lightning-fast development
- 🚀 **Express.js** backend with RESTful API
- 🔐 **JWT Authentication** with httpOnly cookies
- 📊 **Comprehensive Logging** with icons, colors, and timestamps
- 🌍 **Multi-Environment Support** (Windows/Mac/Linux)
- 📱 **Responsive Design** (Mobile/Tablet/Desktop)
- 🎨 **Dark Theme** with CSS variables
- 🔄 **React Router** for client-side routing

## Tech Stack

### Frontend
- React 19.2.0
- React Router DOM
- Vite 7.3.1
- CSS Variables for theming

### Backend
- Node.js 24.12.0 LTS
- Express.js
- jsonwebtoken (JWT auth)
- cookie-parser
- cors
- dotenv

## Project Structure

```
landing-project/
├── src/                      # Frontend React code
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route-level page components
│   ├── services/             # API service layer
│   ├── styles/               # Global styles and theme
│   └── utils/                # Client-side utilities (logger)
├── server/                   # Backend Node.js/Express code
│   ├── config/               # Environment loader and configuration
│   ├── middleware/           # Auth, validation, error handling
│   ├── models/               # Request/response type definitions
│   ├── routes/               # API route definitions
│   └── utils/                # Server-side utilities (logger)
├── public/                   # Static assets
├── .env.development          # Windows development config
├── .env.testing              # Mac testing config
├── .env.production           # Linux production config
└── .env.example              # Environment template
```

## Environment Management

The application automatically detects the operating system and loads the appropriate environment configuration:

- **Windows** → `.env.development` (Development)
- **Mac** → `.env.testing` (Testing)
- **Linux** → `.env.production` (Production)

### Environment Variables

Each `.env` file must define:

```env
NODE_ENV=development|testing|production
OS_ENV=windows|mac|linux
PORT=5000|5001|8080
VITE_API_BASE_URL=http://localhost:5000
VITE_CLIENT_PORT=5173|5174|8080
LOG_LEVEL_SERVER=debug|info|warn|error
VITE_LOG_LEVEL_CLIENT=debug|info|warn|error
ENABLE_SOURCE_MAPS=true|false
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
DEV_USER_USERNAME=developer
DEV_USER_PASSWORD=dev123
```

### Environment-Specific Settings

| Setting | Development | Testing | Production |
|---------|-------------|---------|------------|
| Log Level | `debug` | `debug` | `error` |
| Source Maps | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| Debug Features | ✅ Enabled | ✅ Enabled | ❌ Disabled |
| Port (Server) | 5000 | 5001 | 8080 |
| Port (Client) | 5173 | 5174 | 8080 |

## Logging System

The application includes a comprehensive logging infrastructure with:

- 🐛 **Log Levels**: debug, info, success, warn, error, fatal
- ⏰ **Timestamps**: Precise timestamps for every log entry
- 🎨 **Colors**: ANSI colors (server) and CSS styling (client)
- 🔍 **Source Tracking**: Every log indicates its origin
- 📊 **Specialized Methods**: HTTP, API, Auth, Component logging
- 📁 **File-Based Logging**: Persistent logs with automatic rotation and cleanup
- 📜 **Live Log Viewer**: Real-time log viewing with auto-refresh

### Log Levels

| Level | Icon | Use Case |
|-------|------|----------|
| `debug` | 🐛 | Detailed debugging information |
| `info` | ℹ️ | General informational messages |
| `success` | ✅ | Successful operations |
| `warn` | ⚠️ | Warning messages |
| `error` | ❌ | Error conditions |
| `fatal` | 💀 | Critical failures |

### File-Based Logging

All logs are automatically saved to files for persistent debugging and analysis:

- **Server Logs**: `logs/server/server-YYYY-MM-DD.log`
- **Client Logs**: `logs/client/client-YYYY-MM-DD.log`

#### Automatic Log Management

- **Max File Size**: 100 MB per file
- **Auto-Rotation**: Files are automatically renamed when reaching 100 MB
- **Auto-Cleanup**: Files older than 30 days are automatically deleted
- **Max Files**: Maximum 10 log files retained (oldest deleted first)
- **Encoding**: UTF-8 (supports all characters including emojis)

#### Log Viewer

Access the live log viewer at `/log-viewer`:

- View all server and client log files
- See file size and last modification time
- Auto-refresh with configurable intervals (1s/2s/5s/10s)
- Auto-scroll to bottom for latest entries
- Dark theme with syntax highlighting

### Usage Examples

**Client-side (Browser Console):**

### Server-Side Logging

```javascript
import { logger } from './utils/logger.js';

// Basic logging
logger.debug('SourceName', 'Debug message', { data: 'optional' });
logger.info('SourceName', 'Info message');
logger.success('SourceName', 'Success message');
logger.warn('SourceName', 'Warning message');
logger.error('SourceName', 'Error message', { error: err });
logger.fatal('SourceName', 'Fatal error');

// Specialized logging
logger.http('GET', '/api/endpoint', 200, 45); // method, path, status, duration
logger.api('GET', '/api/endpoint', 200, 45);
logger.auth('Login', 'User logged in', { username: 'developer' });
```

### Client-Side Logging

```javascript
import { logger } from '../utils/logger.js';

// Basic logging
logger.debug('ComponentName', 'Debug message');
logger.info('ComponentName', 'Info message');
logger.success('ComponentName', 'Success message');
logger.warn('ComponentName', 'Warning message');
logger.error('ComponentName', 'Error message');

// Specialized logging
logger.api('GET', '/api/endpoint', 200, 45);
logger.auth('Login', 'User logged in');
logger.component('Button', 'Button clicked');
logger.route('/hello', 'Route changed');
logger.performance('API Call', 123); // operation, duration
```

### Log Level Control

Log levels are controlled by environment variables:
- Server: `LOG_LEVEL_SERVER` in `.env` files
- Client: `VITE_LOG_LEVEL_CLIENT` in `.env` files

## Getting Started

### Prerequisites

- Node.js 24.12.0 LTS or higher
- npm 11.7.0 or higher
- Git 2.52.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CryseXIII/landing-project.git
cd landing-project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.development
# Edit .env.development with your settings
```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Frontend only (Vite dev server)
npm run dev

# Backend only (Express server)
npm run dev:server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## API Endpoints

### Authentication

#### POST /auth/login
Login with username and password.

**Request:**
```json
{
	"username": "developer",
	"password": "dev123"
}
```

**Response:**
```json
{
	"message": "Login successful",
	"user": {
		"username": "developer",
		"permissions": ["api.increment", "api.read", "api.write"]
	}
}
```

#### POST /auth/logout
Logout and clear authentication token.

**Response:**
```json
{
	"message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user information (requires authentication).

**Response:**
```json
{
	"user": {
		"username": "developer",
		"permissions": ["api.increment", "api.read", "api.write"]
	}
}
```

### API

#### POST /api/increment
Increment a number (requires authentication and `api.increment` permission).

**Request:**
```json
{
	"number": 5
}
```

**Response:**
```json
{
	"result": 6,
	"timestamp": "2026-01-10T14:30:00.000Z"
}
```

#### GET /api/test
Test endpoint (no authentication required).

**Response:**
```json
{
	"message": "API is working!"
}
```

## Code Style

### Indentation
All files use **TAB indentation** (`\t`), not spaces.

### Responsive Design
All components and pages are responsive with breakpoints:
- Mobile: `< 480px`
- Tablet: `480px - 768px`
- Desktop: `> 768px`

### Dark Theme
The application uses a dark theme by default with CSS variables defined in `src/styles/theme.css`.

## Git Workflow

### Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance tasks
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**
```bash
feat(button): add navigation button component
fix(routing): correct HelloWorld route path
chore: initial project setup
docs(readme): add logging documentation
```

### Manual Approval

All commits, deletes, and reverts require manual approval:
1. Stage changes: `git add <files>`
2. Review changes: `git status` and `git diff --staged`
3. Commit with approved message: `git commit -m "feat: description"`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Make your changes following the code style guidelines
4. Commit using conventional commits: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feat/new-feature`
6. Open a Pull Request

## License

MIT

## Author

**CryseXIII**
- Email: viktorpagels@aol.com
- GitHub: [@CryseXIII](https://github.com/CryseXIII)

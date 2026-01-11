## Copilot / AI Agent Instructions

Purpose: help an AI coding agent get immediately productive in this repository by listing high-value discovery steps, the architectural signals to read, and exact patterns to follow when editing code or creating PRs.

1) Project structure and virtual environments
- All projects are contained in `C:\Users\Vikto\Desktop\VSCode\` (each project has its own subdirectory).
- **Always work within virtual environments**: For Node.js projects, the `node_modules/` folder is the virtual environment (installed via `npm install`). For Python projects, use `venv/` or `.venv/` (created via `python -m venv venv`).
- Before running any project commands, ensure dependencies are installed: run `npm install` for Node.js or `pip install -r requirements.txt` for Python.
- Example: `landing-project/` is a React app using Vite. To work on it: `cd landing-project`, ensure `node_modules/` exists (run `npm install` if not), then `npm run dev`.
- **PATH management**: When installing CLI tools (Node.js, Python, Git, etc.) via winget, refresh PATH immediately after installation: `winget install <package>; $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`. This ensures newly installed tools are immediately recognized. Do NOT use PATH refresh for regular commands.

2) Git workflow and version control
- **Each project is its own git repository**: Initialize with `git init` in the project root (e.g., `landing-project/.git`).
- **Git user configuration** (per-project): 
  - `git config user.name "CryseXIII"`
  - `git config user.email "viktorpagels@aol.com"`
- **GitHub CLI Integration**: Always ask user if remote repository should be created when initializing a new project locally.
  - Install if needed: `winget install --id GitHub.cli --silent --accept-package-agreements --accept-source-agreements`
  - Authenticate: `gh auth login`
  - Create repo: `gh repo create <project-name> --public --source=. --remote=origin`
- **Semantic Versioning (X.Y.Z)**:
  - X = Major versions (breaking changes, new features)
  - Y = Minor versions (fixes on major versions, backwards-compatible features)
  - Z = Patch versions (incremental updates, bug fixes)
  - Reset Y and Z to 0 on major release (e.g., 1.5.3 → 2.0.0)
  - Version tracked in `package.json` and git tags
- **Branching Strategy**:
  - `main` branch: Major releases only (X.0.0)
  - `release/X.Y` branches: For minor version development and patches
  - `feature/*` branches: For new features (merge to release branch or main)
  - `fix/*` branches: For bug fixes (merge to appropriate release branch)
  - `hotfix/*` branches: For critical production fixes (merge to main and backport)
- **Version Increment Rules**:
  - Major (X): Breaking changes, major new features → commit to `main`
  - Minor (Y): New features, improvements → commit to `release/X.Y` branch
  - Patch (Z): Bug fixes, small updates → commit to `release/X.Y` branch
- **Conventional Commits**: Use semantic commit messages following the format `<type>(<scope>): <description>`.
  - Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`
  - Examples: `feat(button): add navigation button component`, `fix(routing): correct HelloWorld route path`, `chore: initial project setup`
- **Commit workflow**: 
  - Make logical, atomic commits after each meaningful change
  - Stage with `git add .` or specific files
  - Increment version in `package.json` based on change type
  - Commit with descriptive message: `git commit -m "type(scope): description"`
  - Tag major/minor releases: `git tag -a v1.2.0 -m "Release version 1.2.0"`
  - Push to remote: `git push origin <branch> --tags`
- **Sync checking**: Before committing, check if local and remote are in sync:
  - Fetch updates: `git fetch origin`
  - Compare: `git status` shows "Your branch is up to date" or "ahead/behind"
  - Inform user which version is more recent (local or remote)
  - Pull if remote is ahead: `git pull origin <branch>`
  - Push if local is ahead: `git push origin <branch>`

2) React projects (current: landing-project)
- `landing-project/` uses **Vite** with **React 19** (latest stable).
- Dependencies managed via `package.json`. Always run `npm install` after cloning or when package.json changes.
- Dev server: `npm run dev` (runs on http://localhost:5173/ by default).
- Build for production: `npm run build` (output in `dist/`).
- Project structure: `src/` contains components, `public/` for static assets, `index.html` is the entry point.

3) First, detect project type and entrypoints
- Look for package manifests and entry files: `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`.
- Look for runtime entrypoints: `src/`, `cmd/`, `main.go`, `app.py`, `index.js`, `server.js`, `bin/`, `Dockerfile`, `docker-compose.yml`.

4) Architecture signals to read (prioritize these files/dirs)
- `src/`, `lib/`, `pkg/` or `cmd/` — contains primary application and packages.
- `services/` or `packages/` — mono-repo module boundaries.
- `tests/` or `__tests__/` — shows test style and test runner.
- `.github/workflows/` — CI steps (build/test/deploy) and exact commands used in CI.
- `infra/`, `deploy/`, `terraform/` — deployment topology and external integrations.

5) Quick practical discovery commands (run before making edits)
- Search manifests: `Get-ChildItem -Recurse -Include package.json,pyproject.toml,go.mod,Cargo.toml`.
- Find entrypoints: `Get-ChildItem -Recurse -Include main.*,app.*,index.* | Select-String "main|if __name__"`.
- Find env/config patterns: `Get-ChildItem -Recurse -Include .env*,config.*,settings.*`.

6) Build & test heuristics (only run the command that matches detected manifest)
- npm/yarn: if `package.json` present, prefer `npm ci && npm test` or `npm run build` as referenced in `scripts`.
- Python: if `pyproject.toml` or `requirements.txt` found, prefer `python -m pytest` (look for `tox.ini`/`pytest.ini` for flags).
- Go: `go test ./...` for module-based projects.
- Rust: `cargo test`.
Always read CI workflow in `.github/workflows/` to confirm exact commands before running locally.

7) Conventions & patterns to follow in this repo
- Project boundaries: treat folders under `services/`, `packages/`, or `cmd/` as separate deployable units.
- Configuration: prefer reading `config/`, `.env.example`, or `settings/*.yaml` rather than guessing env names.
- Logging & errors: follow existing logger usage (search for `logger`, `log.` or `console.`) and keep messages consistent.
- **Indentation policy**: generate all new or modified files using TAB characters for indentation (\t). Do not use space-based indentation when creating or formatting files.
- **Responsive design**: All components and pages must be flexible and responsive (mobile/tablet/desktop breakpoints). Use CSS media queries, flexbox, and grid.
- **Dark theme**: Always start with a dark theme that is easy on the eyes. Use CSS variables for theming.
- **CSS variables**: Define theme colors, spacing, and breakpoints in `:root` for consistency and easy theme switching.
- **Text alignment & readability**: 
  - Main content text should be left-aligned for better readability
  - Only center-align page titles/headings where it makes sense
  - Avoid center-aligning body text, descriptions, or long-form content
- **User-friendly components**: 
  - Components must NOT hinder user interaction
  - Auto-scroll features should be opt-in (default: disabled)
  - Auto-refresh features should be configurable
  - Users must maintain control over their viewing experience
  - Example: LogViewer should NOT automatically scroll to bottom on every new log entry (prevents reading)
- **API documentation**: Every API endpoint must have inline documentation explaining purpose, parameters, usage locations, example URLs, and where params go (path/query/body/header).
- **Request/Response models**: Map all API requests and responses to typed models for validation and consistency.
- **Authentication**: All server operations requiring authorization must validate access tokens. Support cancellable requests.
- **Token management**: Use JWT (jsonwebtoken) with secure httpOnly cookies. For development without DB, use static user credentials.
- **Folder structure**: Maintain clear separation of concerns:
  - `client/` or `src/` — Frontend React code (components, pages, styles, api clients)
  - `server/` — Backend Node.js/Express code (routes, controllers, middleware, models)
  - `src/components/` — Reusable UI components
  - `src/pages/` — Route-level page components
  - `src/styles/` — Global styles and theme variables
  - `src/services/` — API service layer (fetch wrappers)
  - `src/utils/` — Client-side utilities (logger, helpers)
  - `server/routes/` — API route definitions
  - `server/controllers/` — Business logic handlers
  - `server/middleware/` — Auth, validation, error handling
  - `server/models/` — Request/response type definitions
  - `server/config/` — Environment loader and configuration
  - `server/utils/` — Server-side utilities (logger, helpers)
- **Environment Management**:
  - Use separate `.env` files for each environment: `.env.development` (Windows), `.env.testing` (Mac), `.env.production` (Linux)
  - Auto-detect environment based on OS and NODE_ENV using `server/config/env-loader.js`
  - All env files must define: log levels (client/server), ports, API URLs, JWT config, debug features
  - Production: no logs (error only), no debug panel, no source maps
  - Development/Testing: full debug logs, debug panel enabled, source maps enabled
- **Logging**:
  - Always use the logger utility (never console.log directly)
  - Server: `import { logger } from './utils/logger.js'`
  - Client: `import { logger } from '../utils/logger.js'`
  - Log levels: debug, info, success, warn, error, fatal
  - Every log includes: timestamp, level with icon, color, source, message, optional data
  - Log level controlled by env: `LOG_LEVEL_SERVER`, `VITE_LOG_LEVEL_CLIENT`
  - Source must indicate where log originates: `'AuthController'`, `'API'`, `'Button'`, etc.
  - Use specialized methods: `logger.api()`, `logger.auth()`, `logger.http()`, `logger.component()`
  - Example: `logger.success('AuthController', 'User logged in', { username: 'developer' })`
- **Git Workflow**:
  - All commits, deletes, and reverts must be staged for manual approval
  - Never automatically commit changes without explicit user confirmation
  - Use `git add <files>` to stage, but do not auto-commit

8) Integration points to check before changes
- External services: search for `AWS`, `SQS`, `kafka`, `redis`, `postgres`, `mongodb`, or `http.Client` usage to find external dependencies.
- Secrets: check `.env`, `.env.example`, `secrets/`, and `vault` patterns—do not add secrets to the repo.

9) PR / edit policies for AI agents
- If `.github/copilot-instructions.md` exists, merge carefully: preserve existing TODOs and signatures.
- Keep changes small and focused per PR. If uncertain about testing or deployment impact, add a short note in the PR template explaining the gap and how to verify.

10) When uncertain — exact, minimal questions to ask the repo owner
- "Which command should I run to build and run tests locally? (CI references if present)"
- "Is this repo mono-repo or single service? Which folders are production services?"

11) How to update this file
- Keep it short. Add only discoverable, actionable items (files, exact commands, and patterns). Avoid general advice.

## Current projects
- **landing-project**: React 18 + Vite landing page. Run `npm run dev` from the project folder to start dev server on http://localhost:5173/.

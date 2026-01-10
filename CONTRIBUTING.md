# Contributing to Landing Project

Thank you for your interest in contributing! This document outlines the development workflow, branching strategy, and conventions for this project.

## Git Workflow

### Initial Setup

When creating a new project locally, always consider creating a remote repository:

1. Install GitHub CLI if needed:
```powershell
winget install --id GitHub.cli --silent --accept-package-agreements --accept-source-agreements
```

2. Authenticate with GitHub:
```powershell
gh auth login
```

3. Create remote repository:
```powershell
gh repo create <project-name> --public --source=. --remote=origin --description "Project description"
```

### Branching Strategy

- **`main` branch**: Major releases only (X.0.0)
- **`release/X.Y` branches**: For minor version development and patches
- **`feature/*` branches**: For new features (merge to release branch or main)
- **`fix/*` branches**: For bug fixes (merge to appropriate release branch)
- **`hotfix/*` branches**: For critical production fixes (merge to main and backport)

### Semantic Versioning (X.Y.Z)

- **X (Major)**: Breaking changes, major new features
- **Y (Minor)**: New features, improvements, fixes on major versions (backwards-compatible)
- **Z (Patch)**: Bug fixes, small updates, incremental changes

**Version Reset Rules:**
- On major release: Reset Y and Z to 0 (e.g., 1.5.3 → 2.0.0)
- On minor release: Reset Z to 0 (e.g., 1.5.3 → 1.6.0)

### Conventional Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature (increments Y or X)
- `fix`: Bug fix (increments Z)
- `chore`: Maintenance tasks (increments Z)
- `docs`: Documentation changes (increments Z)
- `style`: Code style changes (increments Z)
- `refactor`: Code refactoring (increments Z)
- `test`: Adding or updating tests (increments Z)
- `perf`: Performance improvements (increments Y or Z)
- `ci`: CI/CD changes (increments Z)
- `build`: Build system changes (increments Z)

**Examples:**
```bash
feat(auth): add login component with JWT authentication
fix(api): correct increment endpoint validation
chore(deps): update React to 19.2.0
docs(readme): add environment management section
```

### Commit Workflow

1. **Check sync status** before making changes:
```bash
git fetch origin
git status
```
   - If remote is ahead: `git pull origin <branch>`
   - If local is ahead: You're ready to commit

2. **Make logical, atomic commits** after each meaningful change

3. **Update version in package.json** based on change type:
   - Breaking change or major feature → Increment X
   - New feature or improvement → Increment Y
   - Bug fix or small update → Increment Z

4. **Stage changes**:
```bash
git add <files>
# or
git add .
```

5. **Review changes** before committing:
```bash
git status
git diff --staged
```

6. **Commit with descriptive message**:
```bash
git commit -m "type(scope): description"
```

7. **Tag releases** (for major/minor versions):
```bash
git tag -a v1.2.0 -m "Release version 1.2.0"
```

8. **Push to remote**:
```bash
git push origin <branch> --tags
```

9. **Verify sync**:
   - The tool will inform you if local/remote are in sync
   - If local is ahead: Changes are pushed
   - If remote is ahead: Pull before continuing

### Manual Approval

All commits, deletes, and reverts require manual approval. Never automatically commit changes without explicit user confirmation.

## Code Style

### Indentation
All files use **TAB indentation** (`\t`), not spaces.

### Naming Conventions
- Components: PascalCase (`LoginForm.jsx`)
- Utilities: camelCase (`logger.js`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- CSS classes: kebab-case (`login-container`)

### File Organization
- One component per file
- Import statements at the top
- Group imports: React → Third-party → Local
- Export default at the bottom

## Logging

### Always Use the Logger

Never use `console.log` directly. Use the logger utility:

**Server-side:**
```javascript
import { logger } from './utils/logger.js';

logger.debug('SourceName', 'Debug message', { data: 'optional' });
logger.info('SourceName', 'Info message');
logger.success('SourceName', 'Success message');
logger.warn('SourceName', 'Warning message');
logger.error('SourceName', 'Error message', { error: err });
logger.fatal('SourceName', 'Fatal error');

// Specialized logging
logger.http('GET', '/api/endpoint', 200, 45);
logger.api('GET', '/api/endpoint', 200, 45);
logger.auth('Login', 'User logged in', { username: 'user' });
```

**Client-side:**
```javascript
import { logger } from '../utils/logger.js';

logger.component('ComponentName', 'Action performed');
logger.route('/path', 'Route changed');
logger.api('GET', '/api/endpoint', 200, 45);
logger.auth('Login', 'User logged in');
logger.performance('Operation', 123);
```

### Log Levels

Controlled by environment variables:
- `LOG_LEVEL_SERVER`: Server-side log level
- `VITE_LOG_LEVEL_CLIENT`: Client-side log level

**Levels:** `debug`, `info`, `success`, `warn`, `error`, `fatal`

## Testing

Before submitting a PR:

1. **Test locally**: Run `npm run dev:all` and test all features
2. **Check for errors**: Look for console errors and lint warnings
3. **Test authentication**: Verify login/logout works correctly
4. **Test API endpoints**: Verify all API calls work as expected
5. **Test responsive design**: Check mobile, tablet, and desktop layouts

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make your changes following the conventions above
3. Update version in `package.json`
4. Update documentation (README.md, comments)
5. Test thoroughly
6. Commit with conventional commit message
7. Push to your fork: `git push origin feat/feature-name`
8. Open a Pull Request with:
   - Clear title following conventional commits
   - Description of changes
   - Screenshots (for UI changes)
   - Version number updated

## Environment Management

The project uses environment-specific configurations:

- `.env.development` - Windows development (LOG_LEVEL=debug)
- `.env.testing` - Mac testing (LOG_LEVEL=debug)
- `.env.production` - Linux production (LOG_LEVEL=error)

Environment is auto-detected based on OS platform. Never commit `.env` files with secrets.

## Questions?

If you have questions or need clarification, please:
1. Check the README.md first
2. Review existing code for patterns
3. Open an issue for discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

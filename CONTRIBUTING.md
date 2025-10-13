# Contributing to Questro

First off, thank you for considering contributing to Questro! It's people like you that make Questro such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, React version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`:

   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Make your changes** following our coding standards

4. **Add tests** if applicable:

   ```bash
   npm run test
   ```

5. **Ensure the code builds without errors**:

   ```bash
   npm run build
   ```

6. **Run linting**:

   ```bash
   npm run lint
   ```

7. **Commit your changes** using conventional commits:

   ```bash
   git commit -m "feat: add awesome feature"
   ```

8. **Push to your fork**:

   ```bash
   git push origin feature/my-new-feature
   ```

9. **Open a Pull Request** with a clear description of your changes

## Development Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setting Up the Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/questro.git
cd questro

# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the project
npm run build

# Run tests (when available)
npm run test
```

### Project Structure

```
questro/
├── src/
│   ├── core/           # Core utilities (types, event emitter, storage)
│   ├── points/         # Points system module
│   ├── badges/         # Badges system module
│   ├── quests/         # Quests system module (planned)
│   └── leaderboard/    # Leaderboard system module (planned)
├── examples/           # Usage examples
└── dist/               # Built files (generated)
```

### Coding Standards

- **TypeScript**: Use strict mode, avoid `any` types
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Formatting**: Use Prettier (runs automatically on save)
- **Linting**: Fix all ESLint warnings/errors before committing
- **Comments**: Keep code self-documenting, avoid obvious comments
- **Bundle Size**: Be mindful of dependencies (goal: <15KB gzipped)

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process or tooling changes

Examples:

```bash
feat: add leaderboard system
fix: resolve points persistence issue
docs: update README with new examples
refactor: simplify badge unlock logic
```

### Adding a New Module

When adding a new gamification module (e.g., Quests, Leaderboard):

1. **Create module directory**:

   ```
   src/your-module/
   ├── types.ts        # TypeScript types and interfaces
   ├── service.ts      # Business logic implementation
   ├── context.tsx     # React context provider
   ├── use-*.ts        # Custom React hooks
   ├── components.tsx  # React components
   └── index.ts        # Public exports
   ```

2. **Follow existing patterns**:
   - Use the same architecture as Points/Badges modules
   - Implement event emitter for state changes
   - Support pluggable storage adapters
   - Export through module index

3. **Update main exports**:
   - Add to `src/index.ts`
   - Add to `package.json` exports field
   - Update `tsup.config.ts` entry points

4. **Add examples**:
   - Create example in `examples/` directory
   - Update README with usage instructions

5. **Update documentation**:
   - Add API documentation to README
   - Update feature list
   - Add migration guide if needed

### Testing Guidelines

When tests are added to the project:

- Write unit tests for services and utilities
- Write integration tests for React components
- Test edge cases and error handling
- Aim for >80% code coverage
- Use descriptive test names

### Performance Considerations

- Avoid unnecessary re-renders (use `useMemo`, `useCallback`)
- Keep bundle size minimal (check with `npm run build`)
- Lazy load heavy features when possible
- Profile performance for large datasets

### Documentation

When adding new features:

- Update README.md with usage examples
- Add JSDoc comments for public APIs (concise, not verbose)
- Include TypeScript types for better DX
- Add examples in `examples/` directory

## Financial Contributions

We also welcome financial contributions. If you find this project useful, consider [sponsoring the project](https://github.com/sponsors/marquespq).

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing to Questro, you agree that your contributions will be licensed under its MIT License.

---

Thank you for contributing! 🎉

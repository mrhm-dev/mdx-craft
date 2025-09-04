# Contributing to MDX Craft

First off, thank you for considering contributing to MDX Craft! It's people like you that make MDX Craft such a great tool.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/yourusername/mdx-craft.git
   cd mdx-craft
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project

```bash
# Start all development servers
pnpm dev

# Run specific app
pnpm dev --filter=playground
pnpm dev --filter=docs

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm check-types

# Linting
pnpm lint

# Format code
pnpm format
```

### Project Structure

```
mdx-craft/
├── apps/
│   ├── docs/          # Documentation site
│   └── playground/    # Interactive playground
├── packages/
│   ├── mdx-craft/     # Main npm package
│   ├── eslint-config/ # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
```

## Making Changes

1. Make your changes in your feature branch
2. Write/update tests as needed
3. Update documentation if required
4. Ensure all tests pass and linting succeeds
5. Add a changeset for your changes:
   ```bash
   pnpm changeset
   ```

## Changeset Guidelines

We use [changesets](https://github.com/changesets/changesets) for version management. When you make a change:

1. Run `pnpm changeset`
2. Select the packages that have changed
3. Select the semver bump type:
   - `patch` for bug fixes
   - `minor` for new features
   - `major` for breaking changes
4. Write a concise description of the change

## Pull Request Process

1. Ensure your branch is up to date with main:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a pull request with a clear title and description
4. Fill out the pull request template
5. Wait for review and address any feedback

## Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

Examples:

```
feat: add MDX live preview component
fix: resolve editor sync issues
docs: update installation guide
```

## Code Style

- We use Prettier for code formatting
- ESLint for linting
- TypeScript for type safety

Run `pnpm format` and `pnpm lint` before committing.

## Testing

We use Jest and Testing Library for our testing setup.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests for specific package
pnpm test --filter=mdx-craft
```

### Writing Tests

- Write unit tests for individual components
- Write integration tests for component interactions
- Test edge cases and error scenarios
- Maintain test coverage above 80%
- Use descriptive test names and organize tests logically

### Test Guidelines

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions and data flow
- **Accessibility Tests**: Ensure components are accessible
- **Performance Tests**: Test with large content and rapid changes

### Test Structure

```
packages/mdx-craft/src/
├── components/
│   ├── __tests__/
│   │   ├── MDXPreview.test.tsx
│   │   └── MDXEditor.test.tsx
│   ├── MDXPreview.tsx
│   └── MDXEditor.tsx
└── __tests__/
    ├── integration.test.tsx
    └── index.test.ts
```

## Documentation

- Update JSDoc comments for public APIs
- Update README if adding new features
- Add examples in the documentation site

## Questions?

Feel free to open an issue or start a discussion if you have questions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

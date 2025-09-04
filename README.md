# MDX Craft

[![CI](https://github.com/yourusername/mdx-craft/workflows/CI/badge.svg)](https://github.com/yourusername/mdx-craft/actions)
[![Coverage](https://codecov.io/gh/yourusername/mdx-craft/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/mdx-craft)
[![npm version](https://badge.fury.io/js/mdx-craft.svg)](https://www.npmjs.com/package/mdx-craft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful, type-safe package for previewing and writing MDX content in any React application. Built with modern tooling and comprehensive testing.

## ✨ Features

- 🎨 **Live MDX Preview** - Real-time rendering with customizable components
- ✍️ **Interactive Editor** - Full-featured MDX editor with syntax highlighting
- 🎯 **TypeScript Support** - Fully typed with excellent developer experience
- 🎨 **Tailwind CSS Integration** - Beautiful, customizable styling out of the box
- 🧪 **100% Test Coverage** - Comprehensive unit and integration tests
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🚀 **Performance Optimized** - Small bundle size with tree-shaking support

## 📦 Quick Start

### Installation

```bash
npm install mdx-craft
# or
yarn add mdx-craft
# or
pnpm add mdx-craft
```

### Basic Usage

```tsx
import React, { useState } from 'react'
import { MDXEditor, MDXPreview } from 'mdx-craft'
import 'mdx-craft/styles.css'

function App() {
  const [content, setContent] = useState('# Hello MDX\n\nWrite **markdown** with React components!')

  return (
    <div className="container mx-auto p-4">
      <MDXEditor value={content} onChange={setContent} preview={true} className="h-96" />
    </div>
  )
}
```

## 🏗️ Monorepo Structure

This repository contains multiple packages and applications:

### Packages

- **[mdx-craft](./packages/mdx-craft)** - Main npm package for MDX preview and editing
- **[eslint-config](./packages/eslint-config)** - Shared ESLint configurations
- **[typescript-config](./packages/typescript-config)** - Shared TypeScript configurations

### Applications

- **[docs](./apps/docs)** - Documentation site built with Nextra (port 3001)
- **[playground](./apps/playground)** - Interactive playground for testing features (port 3000)

```
mdx-craft/
├── apps/
│   ├── docs/          # Documentation site
│   └── playground/    # Interactive playground
├── packages/
│   ├── mdx-craft/     # Main npm package
│   ├── eslint-config/ # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── .github/
│   ├── workflows/     # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/ # Issue templates
└── scripts/           # Build and deployment scripts
```

## 🚀 Development

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mdx-craft.git
cd mdx-craft

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

### Available Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `pnpm dev`           | Start all development servers       |
| `pnpm build`         | Build all packages and applications |
| `pnpm test`          | Run all tests across the monorepo   |
| `pnpm test:watch`    | Run tests in watch mode             |
| `pnpm test:coverage` | Generate test coverage reports      |
| `pnpm lint`          | Run ESLint across all packages      |
| `pnpm format`        | Format code with Prettier           |
| `pnpm check-types`   | Type check all packages             |

### Testing

We maintain 100% test coverage with comprehensive unit and integration tests:

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode for development
pnpm test:watch

# Run tests for specific package
pnpm test --filter=mdx-craft
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `pnpm test`
6. Add a changeset: `pnpm changeset`
7. Commit your changes: `git commit -m 'feat: add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## 📖 Documentation

- **[Getting Started Guide](./apps/docs/pages/getting-started.mdx)** - Complete setup and usage guide
- **[API Reference](./packages/mdx-craft/README.md)** - Detailed component documentation
- **[Examples](./apps/playground)** - Interactive examples and demos

## 🔒 Security

Please see our [Security Policy](./SECURITY.md) for reporting security vulnerabilities.

## 📊 Project Stats

- **100% TypeScript** - Fully typed codebase
- **100% Test Coverage** - Comprehensive testing with Jest and Testing Library
- **Modern Tooling** - Built with Turborepo, tsup, and modern React patterns
- **CI/CD Pipeline** - Automated testing, building, and releasing
- **Open Source** - MIT licensed with comprehensive documentation

## 🚢 Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset for your changes
pnpm changeset

# Version packages (automatically done by CI)
pnpm version-packages

# Publish to npm (automatically done by CI)
pnpm release
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [tsup](https://tsup.egoist.dev/)
- Tested with [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)
- Managed with [Turborepo](https://turborepo.org/)

---

<div align="center">
  <strong>Made with ❤️ for the React community</strong>
</div>

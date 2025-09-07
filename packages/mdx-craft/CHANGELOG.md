# mdx-craft

## 2.0.0

### Major Changes

- e40aeef: ## 🚀 BREAKING: Shiki is now an optional peer dependency

  This major update transforms MDX Craft into a lighter, more flexible package by making syntax highlighting optional.

  ### 💥 Breaking Changes
  - **Shiki moved to optional peer dependency**: Users must now install `shiki` separately to enable syntax highlighting
  - **Reduced default language set**: Changed from 25+ languages to 9 essential languages (JavaScript, TypeScript, JSX, TSX, JSON, CSS, HTML, Bash)

  ### 🎯 New Features
  - **Massive bundle size reduction**: 50%+ smaller package when syntax highlighting isn't needed
  - **Progressive enhancement**: Beautiful code blocks work with or without Shiki installed
  - **Dynamic language configuration**: Configure languages through `shikiConfig` in provider
  - **Graceful fallback**: Plain text rendering with full formatting when Shiki is unavailable
  - **Per-configuration caching**: Multiple highlighter instances for different configurations

  ### 🔧 Configuration Changes

  Added `shikiConfig` prop to `MDXViewerProvider`:

  ```tsx
  <MDXViewerProvider
    shikiConfig={{
      languages: ['python', 'rust', 'go', 'sql'],
      themes: ['github-light', 'github-dark']
    }}
  >
  ```

  ### 📦 Installation Options

  **Minimal bundle** (no syntax highlighting):

  ```bash
  npm install mdx-craft
  ```

  **Full experience** (with syntax highlighting):

  ```bash
  npm install mdx-craft shiki
  ```

  ### 🛠️ Migration Guide

  **For users who want syntax highlighting:**
  1. Install shiki: `npm install shiki`
  2. No code changes needed - everything works as before

  **For users who don't need syntax highlighting:**
  1. No changes needed - get automatic bundle size reduction

  ### ✨ Improvements
  - **Enhanced plugin system**: Removed 7 unused rehype/remark plugins
  - **Better error handling**: Improved fallback mechanisms
  - **Updated documentation**: Comprehensive README updates for both installation methods
  - **Type safety improvements**: Better TypeScript support for optional features

  ### 🔄 Technical Details
  - Context-aware highlighting system reads configuration from provider
  - Config-based highlighter caching for optimal performance
  - Dynamic import system with availability detection
  - Unified fallback HTML generation for both Code and CodeBlock components

  This update maintains full backward compatibility for existing users while providing significant bundle size benefits for new installations.

## 1.0.0

### Major Changes

- 289e07f: Initial release of mdx-craft - A package for previewing and writing MDX code in React applications.

  Features:
  - MDXViewer component for rendering MDX content
  - Hook-based architecture with compilation caching
  - Built-in syntax highlighting and component registry
  - Error handling with browser freeze prevention
  - TypeScript support

import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'
import rehypeShiki from '@shikijs/rehype'
import rehypeKatex from 'rehype-katex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { PluggableList } from 'unified'
import type { Options as AutolinkOptions } from 'rehype-autolink-headings'

export type ShikiOptions = {
  themes?:
    | {
        light?: string
        dark?: string
      }
    | string
  langs?: string[]
}

export type RehypePluginConfig = {
  /** Enable heading slugs */
  slugs?: boolean
  /** Enable HTML sanitization */
  sanitize?: boolean
  /** Enable syntax highlighting with Shiki */
  shiki?: boolean | ShikiOptions
  /** Enable Math rendering with KaTeX */
  math?: boolean
  /** Enable autolink headings */
  autolinkHeadings?: boolean | AutolinkOptions
}

/**
 * Default autolink headings configuration
 */
const defaultAutolinkConfig: AutolinkOptions = {
  behavior: 'append',
  properties: {
    className: ['anchor'],
    ariaLabel: 'Link to this section',
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['anchor-icon'],
    },
    children: [
      {
        type: 'text',
        value: '#',
      },
    ],
  },
}

/**
 * Default Shiki configuration
 */
const defaultShikiConfig: ShikiOptions = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  langs: [
    'javascript',
    'typescript',
    'jsx',
    'tsx',
    'python',
    'rust',
    'go',
    'java',
    'c',
    'cpp',
    'csharp',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'sql',
    'html',
    'css',
    'json',
    'yaml',
    'markdown',
    'bash',
    'shell',
  ],
}

/**
 * Get configured rehype plugins based on options
 */
export const getRehypePlugins = (config: RehypePluginConfig = {}): PluggableList => {
  const plugins: PluggableList = []

  // Add IDs to headings (must come before autolink headings)
  if (config.slugs !== false) {
    plugins.push(rehypeSlug)
  }

  // Add links to headings (must come after slugs)
  if (config.autolinkHeadings !== false) {
    const autolinkOptions =
      typeof config.autolinkHeadings === 'object' ? config.autolinkHeadings : defaultAutolinkConfig
    plugins.push([rehypeAutolinkHeadings, autolinkOptions])
  }

  // Syntax highlighting with Shiki
  if (config.shiki !== false) {
    const shikiOptions =
      typeof config.shiki === 'object'
        ? { ...defaultShikiConfig, ...config.shiki }
        : defaultShikiConfig
    plugins.push([rehypeShiki, shikiOptions])
  }

  // Math rendering with KaTeX
  if (config.math !== false) {
    plugins.push([
      rehypeKatex,
      {
        strict: false,
        throwOnError: false,
        trust: true,
      },
    ])
  }

  // HTML sanitization (should come last if enabled)
  if (config.sanitize) {
    plugins.push([
      rehypeSanitize,
      {
        // Allow common HTML elements and custom MDX components
        tagNames: [
          'div',
          'span',
          'p',
          'br',
          'strong',
          'em',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td',
          'blockquote',
          'pre',
          'code',
          'a',
          'img',
          // Custom MDX components
          'Card',
          'Tabs',
          'Accordion',
          'CodeBlock',
        ],
        attributes: {
          '*': ['className', 'id', 'style', 'title', 'role', 'aria*', 'data*'],
          a: ['href', 'target', 'rel'],
          img: ['src', 'alt', 'width', 'height'],
        },
      },
    ])
  }

  return plugins
}

/**
 * Default rehype plugins configuration - minimal setup
 */
export const getDefaultRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    slugs: true,
    autolinkHeadings: true,
    shiki: true,
    math: true,
    sanitize: false, // Disable sanitization to allow custom components
  })
}

/**
 * Safe rehype plugins configuration with sanitization
 */
export const getSafeRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    slugs: true,
    autolinkHeadings: true,
    shiki: true,
    math: true,
    sanitize: true,
  })
}

/**
 * Sync-safe rehype plugins configuration (no async plugins)
 */
export const getSyncRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    slugs: true,
    autolinkHeadings: true,
    shiki: false, // Shiki is async, disable for sync mode
    math: true,
    sanitize: false,
  })
}

/**
 * Minimal rehype plugins configuration
 */
export const getMinimalRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    slugs: false,
    autolinkHeadings: false,
    shiki: false,
    math: false,
    sanitize: false,
  })
}

// Export individual plugins for custom configurations
export { rehypeSlug, rehypeSanitize, rehypeShiki, rehypeKatex, rehypeAutolinkHeadings }

// Export types
export type { AutolinkOptions }

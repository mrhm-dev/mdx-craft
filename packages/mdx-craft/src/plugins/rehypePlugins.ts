import rehypeShiki from '@shikijs/rehype'
import type { Options as AutolinkOptions } from 'rehype-autolink-headings'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import type { PluggableList } from 'unified'

// Define types locally since they may not be exported
export type ShikiOptions = {
  themes?:
    | {
        light?: string
        dark?: string
      }
    | string
  langs?: string[]
  defaultColor?: boolean | 'light' | 'dark'
}

export type MermaidOptions = {
  strategy?: 'img-svg' | 'img-png' | 'pre-mermaid'
  mermaidConfig?: {
    theme?: string
    themeVariables?: Record<string, string>
  }
}

export type RehypePluginConfig = {
  /** Enable syntax highlighting with Shiki (recommended) */
  shiki?: boolean | ShikiOptions
  /** Enable fallback syntax highlighting with rehype-highlight */
  highlight?: boolean
  /** Enable enhanced syntax highlighting with Prism+ */
  prismPlus?: boolean
  /** Enable Math rendering with KaTeX */
  math?: boolean
  /** Enable Mermaid diagram rendering */
  mermaid?: boolean | MermaidOptions
  /** Enable raw HTML processing */
  raw?: boolean
  /** Enable HTML sanitization */
  sanitize?: boolean
  /** Enable heading slugs */
  slugs?: boolean
  /** Enable autolink headings */
  autolinkHeadings?: boolean | AutolinkOptions
}

/**
 * Default Shiki configuration with popular themes and languages
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
    'scala',
    'sql',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'json',
    'yaml',
    'toml',
    'xml',
    'markdown',
    'bash',
    'shell',
    'dockerfile',
    'graphql',
    'vue',
    'svelte',
    'astro',
    'solidity',
    'dart',
    'elixir',
    'haskell',
    'lua',
    'r',
    'matlab',
    'latex',
  ],
  defaultColor: false,
}

/**
 * Default autolink headings configuration
 */
const defaultAutolinkConfig: AutolinkOptions = {
  behavior: 'append',
  properties: {
    className: [
      'mdx-heading-anchor',
      'ml-2',
      'text-zinc-400',
      'dark:text-zinc-500',
      'hover:text-emerald-600',
      'dark:hover:text-emerald-400',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-150',
      'no-underline',
      'focus:opacity-100',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-emerald-500',
      'focus:ring-offset-2',
      'rounded',
    ],
    ariaLabel: 'Link to this section',
  },
  content: {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['mdx-heading-anchor-icon', 'text-xs', 'font-mono', 'select-none'],
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
 * Default Mermaid configuration
 */
const defaultMermaidConfig: MermaidOptions = {
  strategy: 'img-svg',
  mermaidConfig: {
    theme: 'default',
    themeVariables: {
      primaryColor: '#10b981',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#059669',
      lineColor: '#71717a',
      sectionBkgColor: '#f3f4f6',
      altSectionBkgColor: '#e5e7eb',
      gridColor: '#d1d5db',
      background: '#ffffff',
      mainBkg: '#ffffff',
      secondBkg: '#f9fafb',
      tertiaryColor: '#f3f4f6',
    },
  },
}

/**
 * Get configured rehype plugins based on options
 */
export const getRehypePlugins = (config: RehypePluginConfig = {}): PluggableList => {
  const plugins: PluggableList = []

  // Raw HTML processing (should come first if enabled)
  if (config.raw !== false) {
    plugins.push(rehypeRaw)
  }

  // Add IDs to headings
  if (config.slugs !== false) {
    plugins.push(rehypeSlug)
  }

  // Add links to headings
  if (config.autolinkHeadings !== false) {
    const autolinkOptions =
      typeof config.autolinkHeadings === 'object' ? config.autolinkHeadings : defaultAutolinkConfig
    plugins.push([rehypeAutolinkHeadings, autolinkOptions])
  }

  // Syntax highlighting with Shiki (preferred)
  if (config.shiki !== false) {
    const shikiOptions =
      typeof config.shiki === 'object'
        ? { ...defaultShikiConfig, ...config.shiki }
        : defaultShikiConfig
    plugins.push([rehypeShiki, shikiOptions])
  }
  // Fallback to rehype-highlight if Shiki is disabled
  else if (config.highlight) {
    plugins.push([
      rehypeHighlight,
      {
        detect: true,
        ignoreMissing: true,
        subset: [
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
          'scala',
          'sql',
          'html',
          'css',
          'scss',
          'json',
          'yaml',
          'toml',
          'markdown',
          'bash',
          'shell',
          'dockerfile',
          'graphql',
        ],
      },
    ])
  }

  // Enhanced syntax highlighting with Prism+
  if (config.prismPlus) {
    plugins.push([
      rehypePrismPlus,
      {
        showLineNumbers: true,
        ignoreMissing: true,
      },
    ])
  }

  // Mermaid diagram rendering
  if (config.mermaid !== false) {
    const mermaidOptions =
      typeof config.mermaid === 'object'
        ? { ...defaultMermaidConfig, ...config.mermaid }
        : defaultMermaidConfig
    plugins.push([rehypeMermaid, mermaidOptions])
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
        // Allow common HTML elements and attributes
        tagNames: [
          'div',
          'span',
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'sub',
          'sup',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'dl',
          'dt',
          'dd',
          'table',
          'thead',
          'tbody',
          'tfoot',
          'tr',
          'th',
          'td',
          'blockquote',
          'pre',
          'code',
          'a',
          'img',
          'video',
          'audio',
          'source',
          'details',
          'summary',
          'figure',
          'figcaption',
          'svg',
          'path',
          'g',
          'circle',
          'rect',
          'line',
          'polygon',
          'polyline',
          'text',
          'tspan',
          'defs',
          'clipPath',
          'mask',
        ],
        attributes: {
          '*': ['className', 'id', 'style', 'title', 'role', 'aria*', 'data*'],
          a: ['href', 'target', 'rel'],
          img: ['src', 'alt', 'width', 'height', 'loading'],
          video: ['src', 'controls', 'width', 'height', 'poster'],
          audio: ['src', 'controls'],
          source: ['src', 'type'],
          svg: ['viewBox', 'xmlns', 'width', 'height', 'fill', 'stroke'],
        },
      },
    ])
  }

  return plugins
}

/**
 * Default rehype plugins configuration for most use cases
 */
export const getDefaultRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: true,
    math: true,
    mermaid: true,
    slugs: true,
    autolinkHeadings: true,
    raw: false,
    sanitize: false,
  })
}

/**
 * Sync-safe rehype plugins configuration (no async plugins)
 */
export const getSyncRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: false, // Shiki is async, use highlight instead
    highlight: true,
    math: true,
    mermaid: false, // Mermaid is async
    slugs: true,
    autolinkHeadings: true,
    raw: false,
    sanitize: false,
  })
}

/**
 * Minimal rehype plugins configuration
 */
export const getMinimalRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: true,
    slugs: true,
    math: false,
    mermaid: false,
    autolinkHeadings: false,
  })
}

/**
 * Safe rehype plugins configuration with sanitization
 */
export const getSafeRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: true,
    math: true,
    mermaid: true,
    slugs: true,
    autolinkHeadings: true,
    raw: true,
    sanitize: true,
  })
}

/**
 * Blog-optimized rehype plugins configuration
 */
export const getBlogRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: {
      ...defaultShikiConfig,
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
    },
    math: true,
    mermaid: true,
    slugs: true,
    autolinkHeadings: {
      ...defaultAutolinkConfig,
      behavior: 'prepend',
      properties: {
        ...defaultAutolinkConfig.properties,
        className: [
          'mdx-heading-anchor',
          'mr-2',
          'text-slate-400',
          'hover:text-emerald-600',
          'opacity-0',
          'group-hover:opacity-100',
          'transition-opacity',
          'no-underline',
        ],
      },
    },
  })
}

/**
 * Documentation-optimized rehype plugins configuration
 */
export const getDocsRehypePlugins = (): PluggableList => {
  return getRehypePlugins({
    shiki: {
      ...defaultShikiConfig,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    math: true,
    mermaid: {
      ...defaultMermaidConfig,
      mermaidConfig: {
        ...defaultMermaidConfig.mermaidConfig,
        theme: 'base',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#2563eb',
          lineColor: '#71717a',
          sectionBkgColor: '#f8fafc',
          altSectionBkgColor: '#f1f5f9',
          gridColor: '#e2e8f0',
          background: '#ffffff',
        },
      },
    },
    slugs: true,
    autolinkHeadings: true,
    prismPlus: false,
  })
}

// Export individual plugins for custom configurations
export {
  rehypeAutolinkHeadings,
  rehypeHighlight,
  rehypeKatex,
  rehypeMermaid,
  rehypePrismPlus,
  rehypeRaw,
  rehypeSanitize,
  rehypeShiki,
  rehypeSlug,
}

// Export plugin types
export type { AutolinkOptions }

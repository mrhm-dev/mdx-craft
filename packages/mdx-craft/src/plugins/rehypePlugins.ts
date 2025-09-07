import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import type { PluggableList, Plugin } from 'unified'
import type { Root, Element as HastElement } from 'hast'

export type RehypePluginConfig = {
  /** Enable heading slugs */
  slugs?: boolean
  /** Enable HTML sanitization */
  sanitize?: boolean
  /** Enable syntax highlighting with Shiki - Note: Shiki is handled by the Code component */
  shiki?: boolean
  /** Enable Math rendering with KaTeX */
  math?: boolean
}

/**
 * Custom rehype plugin to ensure language classes are preserved on code blocks
 */
const rehypePreserveLanguageClass: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const visit = (node: Root | HastElement) => {
      // Process pre > code blocks
      if (node.type === 'element' && node.tagName === 'pre') {
        const codeChild = node.children?.find(
          (child): child is HastElement => child.type === 'element' && child.tagName === 'code'
        )

        if (codeChild && codeChild.properties?.className) {
          // Ensure the language class is on the code element
          const classes = Array.isArray(codeChild.properties.className)
            ? codeChild.properties.className
            : [codeChild.properties.className]

          const langClass = classes.find(
            (cls: unknown) => typeof cls === 'string' && cls.startsWith('language-')
          )

          if (langClass) {
            // Also add it to the pre element for easier access
            node.properties = node.properties || {}
            const preClasses = Array.isArray(node.properties.className)
              ? node.properties.className
              : node.properties.className
                ? [node.properties.className]
                : []

            if (!preClasses.includes(langClass)) {
              preClasses.push(langClass)
            }
            node.properties.className = preClasses.filter(
              (cls): cls is string => typeof cls === 'string'
            )
          }
        }
      }

      // Recursively visit children
      if ('children' in node && node.children) {
        node.children.forEach((child) => {
          if (child.type === 'element') {
            visit(child)
          }
        })
      }
    }

    visit(tree)
  }
}

// Shiki configuration moved to shiki-highlighter.ts for direct integration with Code component

/**
 * Get configured rehype plugins based on options
 */
export const getRehypePlugins = (config: RehypePluginConfig = {}): PluggableList => {
  const plugins: PluggableList = []

  // Add IDs to headings (must come before autolink headings)
  if (config.slugs !== false) {
    plugins.push(rehypeSlug)
  }

  // Always preserve language classes on code blocks
  plugins.push(rehypePreserveLanguageClass)

  // Syntax highlighting with Shiki - handled by custom Code component
  // Shiki is integrated directly in the Code component for better control

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
    shiki: false, // Disabled - handling in Code component
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
    shiki: false,
    math: false,
    sanitize: false,
  })
}

// Export individual plugins for custom configurations
export { rehypeSlug, rehypeSanitize, rehypeKatex }

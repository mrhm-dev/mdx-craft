import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import remarkWikiLink from 'remark-wiki-link'
import remarkDirective from 'remark-directive'
import remarkFlexibleMarkers from 'remark-flexible-markers'
import remarkGemoji from 'remark-gemoji'
import { visit } from 'unist-util-visit'
import type { PluggableList } from 'unified'
import type { Root, Node, Heading, Text } from 'mdast'
import type { VFile } from 'vfile'
import type { HeadingMetadata } from '../types/registry.js'

// Additional types for AST nodes
interface DirectiveNode extends Node {
  type: 'textDirective' | 'leafDirective' | 'containerDirective'
  name: string
  attributes?: Record<string, string>
  data?: Node['data'] & {
    hast?: {
      tagName?: string
      properties?: Record<string, unknown>
    }
  }
}

interface ExtendedVFile extends VFile {
  data: VFile['data'] & {
    readingTime?: {
      words: number
      minutes: number
      text: string
    }
  }
}

interface ExtendedHeading extends Heading {
  data?: Heading['data'] & {
    hProperties?: {
      id?: string
    }
  }
}

export type RemarkPluginConfig = {
  /** Enable GitHub Flavored Markdown (tables, strikethrough, etc.) */
  gfm?: boolean
  /** Enable math notation support */
  math?: boolean
  /** Enable line breaks without requiring two spaces */
  breaks?: boolean
  /** Enable frontmatter parsing (YAML, TOML) */
  frontmatter?: boolean | string[]
  /** Enable wiki-style links [[page]] */
  wikiLinks?:
    | boolean
    | {
        pageResolver?: (name: string) => string[]
        hrefTemplate?: (permalink: string) => string
        markdownFolder?: string
      }
  /** Enable directives (:::note, :::warning, etc.) */
  directives?: boolean
  /** Enable flexible markers for highlights, insertions, etc. */
  flexibleMarkers?: boolean
  /** Enable emoji shortcodes :smile: */
  gemoji?: boolean
  /** Add reading time estimation */
  readingTime?: boolean
  /** Extract headings for table of contents */
  extractHeadings?: boolean
}

/**
 * Custom remark plugin to extract headings for TOC
 */
export const remarkExtractHeadings = (headings: HeadingMetadata[]) => {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      const text = node.children
        .filter((child): child is Text => child.type === 'text')
        .map((child) => child.value)
        .join('')

      // Generate ID from text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      headings.push({
        id,
        text,
        level: node.depth,
      })

      // Add ID to the node for linking - type-safe approach
      const extendedNode = node as ExtendedHeading
      if (!extendedNode.data) {
        extendedNode.data = {}
      }
      if (!extendedNode.data.hProperties) {
        extendedNode.data.hProperties = {}
      }
      extendedNode.data.hProperties.id = id
    })
  }
}

/**
 * Custom remark plugin to add reading time
 */
export const remarkAddReadingTime = () => {
  return (tree: Root, file: VFile) => {
    const text = String(file.value || '')
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)

    if (!file.data) {
      file.data = {}
    }

    // Safely extend the data object
    const extendedFile = file as ExtendedVFile
    if (!extendedFile.data) {
      extendedFile.data = {}
    }
    extendedFile.data.readingTime = {
      words,
      minutes,
      text: `${minutes} min read`,
    }
  }
}

/**
 * Custom remark plugin to handle custom directives
 */
export const remarkCustomDirectives = () => {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const directiveNode = node as DirectiveNode
        const data = directiveNode.data || (directiveNode.data = {})
        const hast = data.hast || (data.hast = {})

        // Convert directive name to className
        hast.tagName = directiveNode.type === 'textDirective' ? 'span' : 'div'
        hast.properties = {
          className: [`mdx-directive`, `mdx-directive-${directiveNode.name}`],
          ...directiveNode.attributes,
        }
      }
    })
  }
}

/**
 * Get configured remark plugins based on options
 */
export const getRemarkPlugins = (
  config: RemarkPluginConfig = {},
  extractHeadings?: HeadingMetadata[]
): PluggableList => {
  const plugins: PluggableList = []

  // Frontmatter support (should come early)
  if (config.frontmatter !== false) {
    if (Array.isArray(config.frontmatter)) {
      plugins.push([remarkFrontmatter, config.frontmatter])
    } else {
      plugins.push([remarkFrontmatter, ['yaml', 'toml']])
    }
  }

  // GitHub Flavored Markdown
  if (config.gfm !== false) {
    plugins.push([
      remarkGfm,
      {
        singleTilde: false, // Require ~~ for strikethrough
        tableCellPadding: true,
        tablePipeAlign: true,
      },
    ])
  }

  // Math notation support
  if (config.math !== false) {
    plugins.push(remarkMath)
  }

  // Line breaks without double spaces
  if (config.breaks) {
    plugins.push(remarkBreaks)
  }

  // Wiki-style links
  if (config.wikiLinks) {
    const wikiConfig = typeof config.wikiLinks === 'object' ? config.wikiLinks : {}
    plugins.push([
      remarkWikiLink,
      {
        pageResolver:
          wikiConfig.pageResolver || ((name: string) => [name.replace(/ /g, '').toLowerCase()]),
        hrefTemplate: wikiConfig.hrefTemplate || ((permalink: string) => `#${permalink}`),
        markdownFolder: wikiConfig.markdownFolder || '',
        ...wikiConfig,
      },
    ])
  }

  // Directives support
  if (config.directives !== false) {
    plugins.push(remarkDirective)
    plugins.push(remarkCustomDirectives)
  }

  // Flexible markers for highlights, insertions, etc.
  if (config.flexibleMarkers) {
    plugins.push([
      remarkFlexibleMarkers,
      {
        emphasis: {
          marker: '==',
          tagName: 'mark',
          className: 'mdx-highlight',
        },
      },
    ])
  }

  // Emoji shortcodes
  if (config.gemoji) {
    plugins.push(remarkGemoji)
  }

  // Reading time estimation
  if (config.readingTime) {
    plugins.push(remarkAddReadingTime)
  }

  // Extract headings for TOC
  if (config.extractHeadings !== false && extractHeadings) {
    plugins.push([remarkExtractHeadings, extractHeadings])
  }

  return plugins
}

/**
 * Default remark plugins configuration for most use cases
 */
export const getDefaultRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: true,
      frontmatter: true,
      directives: true,
      gemoji: true,
      readingTime: true,
      extractHeadings: true,
    },
    extractHeadings
  )
}

/**
 * Minimal remark plugins configuration
 */
export const getMinimalRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: false,
      frontmatter: false,
      directives: false,
      extractHeadings: true,
    },
    extractHeadings
  )
}

/**
 * Blog-optimized remark plugins configuration
 */
export const getBlogRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: true,
      breaks: true,
      frontmatter: true,
      gemoji: true,
      readingTime: true,
      extractHeadings: true,
    },
    extractHeadings
  )
}

/**
 * Documentation-optimized remark plugins configuration
 */
export const getDocsRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: true,
      frontmatter: true,
      wikiLinks: {
        hrefTemplate: (permalink: string) => `/docs/${permalink}`,
      },
      directives: true,
      flexibleMarkers: true,
      extractHeadings: true,
    },
    extractHeadings
  )
}

/**
 * Safe remark plugins configuration with minimal external features
 */
export const getSafeRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: true,
      frontmatter: false,
      wikiLinks: false,
      directives: false,
      flexibleMarkers: false,
      gemoji: false,
      readingTime: false,
      extractHeadings: true,
    },
    extractHeadings
  )
}

/**
 * Academic/Research-optimized remark plugins configuration
 */
export const getAcademicRemarkPlugins = (extractHeadings?: HeadingMetadata[]): PluggableList => {
  return getRemarkPlugins(
    {
      gfm: true,
      math: true,
      frontmatter: true,
      directives: true,
      flexibleMarkers: true,
      readingTime: true,
      extractHeadings: true,
    },
    extractHeadings
  )
}

// Export individual plugins for custom configurations
export {
  remarkGfm,
  remarkMath,
  remarkBreaks,
  remarkFrontmatter,
  remarkWikiLink,
  remarkDirective,
  remarkFlexibleMarkers,
  remarkGemoji,
}

// Export utility functions
export { visit }

// Note: Custom plugins are already exported individually above

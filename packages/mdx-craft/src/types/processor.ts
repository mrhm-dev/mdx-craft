import { type PluggableList } from 'unified'
import { type ReactElement } from 'react'
import { type ComponentRegistry, type HeadingMetadata } from './theme.js'
import { evaluate } from '@mdx-js/mdx'

/**
 * Compiler Options
 * @source - The source code to compile
 * @components - The components to use for the compiler
 * @remarkPlugins - The remark plugins to use for the compiler
 * @rehypePlugins - The rehype plugins to use for the compiler
 * @generateTOC - Whether to generate a table of contents
 * @development - Whether to use the development environment
 */
export type CompilerOptions = {
  source: string
  components: ComponentRegistry
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  generateTOC?: boolean
  development?: boolean
}

/**
 * Compilation Result
 * @content - The compiled content
 * @metadata - The metadata of the compilation
 * @error - The error of the compilation
 */
export type CompilationResult = {
  content: ReactElement | null
  metadata: {
    headings: HeadingMetadata[]
    duration: number
    cacheHit: boolean
    componentCount: number
  }
  error?: Error
}

/**
 * Cache Entry
 * @content - The compiled content
 * @metadata - The metadata of the compilation
 */
export type CacheEntry = {
  /**
   * Intentional any type to allow for any type of content to be cached
   */

  content: MDXModule | null
  metadata: {
    headings: HeadingMetadata[]
    timestamp: number
  }
}

/**
 * Processor Configuration
 * @cachedEnabled - Whether to enable caching
 * @cacheMaxSize - The maximum size of the cache in MB
 * @cacheTTL - The time to live for the cache in milliseconds
 */
export type ProcessorConfig = {
  cacheEnabled?: boolean
  cacheMaxSize: number // in MB
  cacheTTL: number // in milliseconds
}

/**
 * Heading Node
 * This is a type for the heading node of the compiled content. This will be used to generate the table of contents.
 *
 * @type - The type of the node
 * @depth - The depth of the heading
 * @children - The children of the heading
 * @data - The data of the heading
 */
export type HeadingNode = {
  type: 'heading'
  depth: number
  children: {
    type: 'text'
    value: string
  }[]
  data?: {
    id?: string
    hProperties?: {
      id?: string
    }
  }
}

export type MDXModule = Awaited<ReturnType<typeof evaluate>>

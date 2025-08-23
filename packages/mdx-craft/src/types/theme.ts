export type Theme = {
  colors: {
    primary: string
  }
}

/**
 * Table of Contents Configuration
 */
export type TOCConfig = {
  /**
   * Enable mobile optimizations
   * @default true
   */
  mobile?: boolean

  /**
   * Desktop position
   * @default 'right'
   */
  position?: 'left' | 'right'

  /**
   * Enable sticky positioning
   * @default true
   */
  sticky?: boolean

  /**
   * Enable mobile collapsible behavior
   * @default true
   */
  collapsible?: boolean

  /**
   * Minimum heading level to include
   * @default 2
   */
  minLevel?: number

  /**
   * Maximum heading level to include
   * @default 3
   */
  maxLevel?: number

  /**
   * Mobile breakpoint for responsive behavior
   * @default 'lg'
   */
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Sticky offset from top when scrolling
   * @default "4rem"
   */
  stickyOffset?: string
}

/**
 * MDX Component Type for TypeScript
 * Intentionally using any to allow for any component to be passed in
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MDXComponent = React.ComponentType<any>

/**
 * Component Registry
 * This is a record of components that can be used in the MDX content
 */
export type ComponentRegistry = Record<string, MDXComponent>

/**
 * Compilation metadata
 */
export type CompilationMetadata = {
  /** Compilation duration in milliseconds */
  duration: number
  /** Number of components used */
  componentCount: number
  /** Whether result was from cache */
  cacheHit: boolean
  /** Generated headings for TOC */
  headings: HeadingMetadata[]
  /** Source code length */
  sourceLength: number
  /** Plugin execution times */
  pluginTimes?: Record<string, number>
}

/**
 * Heading metadata for TOC generation
 */
export type HeadingMetadata = {
  /** Unique identifier for the heading */
  id: string
  /** Heading text content */
  text: string
  /** Heading level (1-6) */
  level: number
  /** Optional anchor slug */
  slug?: string
}

/**
 * TOC item structure
 */
export type TOCItem = {
  /** Unique identifier */
  id: string
  /** Display text */
  text: string
  /** Heading level */
  level: number
  /** Nested children */
  children?: TOCItem[]
}

/**
 * Cache configuration
 */
export type CacheConfig = {
  /** Enable caching */
  enabled?: boolean
  /** Maximum cache size in entries */
  maxSize?: number
  /** Time to live in milliseconds */
  ttl?: number
}

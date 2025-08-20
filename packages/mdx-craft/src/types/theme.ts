export type Theme = {
  /**
   * Typography configuration using Tailwind Typography plugin
   */
  typography: {
    /** Base Typography classes - e.g., "prose prose-gray dark:prose-invert" */
    base: string
    /** Typography size modifier - e.g., "prose-lg", "prose-base", "prose-sm" */
    size: string
    /** Maximum width constraint - e.g., "max-w-none", "max-w-4xl" */
    maxWidth: string
  }

  /**
   * Color configuration with Tailwind utility classes
   */
  colors: {
    /** Primary accent color - e.g., "text-emerald-600 dark:text-emerald-400" */
    primary: string
    /** Secondary accent color - e.g., "text-slate-600 dark:text-slate-400" */
    secondary: string
    /** Background color - e.g., "bg-white dark:bg-slate-900" */
    background: string
    /** Foreground/text color - e.g., "text-slate-900 dark:text-white" */
    foreground: string
    /** Muted/subtle text color - e.g., "text-slate-500 dark:text-slate-400" */
    muted: string
    /** Border color - e.g., "border-slate-200 dark:border-slate-700" */
    border: string
    /** Error/danger color - e.g., "text-red-600 dark:text-red-400" */
    error: string
    /** Warning color - e.g., "text-amber-600 dark:text-amber-400" */
    warning: string
    /** Success color - e.g., "text-green-600 dark:text-green-400" */
    success: string
    /** Info color - e.g., "text-blue-600 dark:text-blue-400" */
    info: string
  }

  /**
   * Component-specific styling with Tailwind classes
   */
  components: {
    /** Card component styling */
    card: string
    /** Code block container styling */
    codeBlock: string
    /** Accordion component styling */
    accordion: string
    /** Tabs component styling */
    tabs: string

    /** Callout component variants */
    callout: {
      /** Base callout styling */
      base: string
      /** Info callout styling */
      info: string
      /** Warning callout styling */
      warning: string
      /** Tip callout styling */
      tip: string
      /** Note callout styling */
      note: string
      /** Important callout styling */
      important: string
      /** Caution callout styling */
      caution: string
    }

    /** Table of Contents styling */
    toc: {
      /** Desktop TOC container */
      container: string
      /** Mobile TOC container */
      mobile: string
      /** Mobile toggle button */
      button: string
      /** TOC list styling */
      list: string
      /** TOC item styling */
      item: string
      /** Active TOC item styling */
      activeItem: string
      /** TOC heading styling */
      heading: string
    }
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
 * Partial theme type for overrides
 */
export type PartialTheme = {
  typography?: Partial<Theme['typography']>
  colors?: Partial<Theme['colors']>
  components?: {
    card?: string
    codeBlock?: string
    accordion?: string
    tabs?: string
    callout?: Partial<Theme['components']['callout']>
    toc?: Partial<Theme['components']['toc']>
  }
}

// Create theme function type
export type CreateTheme = (config?: PartialTheme) => Theme

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
 * TOC context value
 */
// export type TOCContextValue = {
//   /** Hierarchical TOC items */
//   items: TOCItem[]
//   /** Currently active heading ID */
//   activeId: string | null
//   /** Function to scroll to a heading */
//   scrollToHeading: (id: string) => void
//   /** Flat list of all TOC items */
//   flatItems: TOCItem[]
// }

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

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

import type { Theme } from '../types/theme.js'

/**
 * Default theme for the MDX Craft
 */
export const defaultTheme: Theme = {
  typography: {
    base: 'prose prose-gray dark:prose-invert',
    size: 'prose-base sm:prose-lg',
    maxWidth: 'max-w-none',
  },
  colors: {
    primary: 'text-emerald-600 dark:text-emerald-400',
    secondary: 'text-slate-600 dark:text-slate-400',
    background: 'bg-white dark:bg-zinc-900',
    foreground: 'text-zinc-900 dark:text-zinc-50',
    muted: 'text-zinc-500 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400',
  },
  components: {
    // Interactive card with hover effects
    card: 'not-prose bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50 transition-all duration-200 cursor-pointer group',

    // Code block with syntax highlighting container
    codeBlock:
      'not-prose bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden',

    // Collapsible accordion sections
    accordion: 'not-prose border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden',

    // Tabbed interface styling
    tabs: 'not-prose',

    callout: {
      // Base callout with proper spacing and borders
      base: 'not-prose border rounded-lg p-4 my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',

      // Info callout - blue theme
      info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50 [&_[data-callout-icon]]:text-blue-600 dark:[&_[data-callout-icon]]:text-blue-400',

      // Warning callout - amber theme
      warning:
        'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 [&_[data-callout-icon]]:text-amber-600 dark:[&_[data-callout-icon]]:text-amber-400',

      // Tip callout - emerald theme
      tip: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50 [&_[data-callout-icon]]:text-emerald-600 dark:[&_[data-callout-icon]]:text-emerald-400',

      // Note callout - gray theme
      note: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 [&_[data-callout-icon]]:text-slate-600 dark:[&_[data-callout-icon]]:text-slate-400',

      // Important callout - purple theme
      important:
        'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50 [&_[data-callout-icon]]:text-purple-600 dark:[&_[data-callout-icon]]:text-purple-400',

      // Caution callout - red theme
      caution:
        'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 [&_[data-callout-icon]]:text-red-600 dark:[&_[data-callout-icon]]:text-red-400',
    },

    toc: {
      // Desktop TOC container with sticky positioning
      container: 'hidden lg:block w-64 shrink-0',

      // Mobile TOC container
      mobile: 'lg:hidden',

      // Mobile toggle button
      button:
        'fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200',

      // TOC list styling
      list: 'space-y-1',

      // TOC item styling
      item: 'block py-2 px-3 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-150',

      // Active TOC item styling
      activeItem:
        'block py-2 px-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-l-2 border-emerald-600 dark:border-emerald-400 font-medium',

      // TOC heading styling
      heading: 'font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3',
    },
  },
}

/**
 * Utility classes for common patterns
 */
export const utilityClasses = {
  // Common transition patterns
  transitions: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },

  // Focus ring patterns for accessibility
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',

  // Interactive states
  interactive: {
    clickable: 'cursor-pointer select-none',
    hoverable: 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
    pressed: 'active:scale-[0.98] active:transition-transform active:duration-75',
  },

  // Typography enhancements
  typography: {
    // Custom heading styles that work with prose
    heading: 'scroll-mt-20', // Offset for sticky headers
    code: 'font-mono text-sm', // Inline code styling
    kbd: 'px-1.5 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded',
  },

  // Layout helpers
  layout: {
    container: 'mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-8 sm:py-12 lg:py-16',
    grid: 'grid gap-6 sm:gap-8 lg:gap-12',
  },

  // Mobile-specific classes
  mobile: {
    hidden: 'lg:hidden',
    shown: 'hidden lg:block',
    touchTarget: 'min-h-[44px] min-w-[44px]', // iOS touch target guidelines
  },
}

/**
 * Breakpoint-specific utility classes
 */
export const breakpoints = {
  mobile: 'lg:hidden', // Hide on desktop (show on mobile)
  desktop: 'hidden lg:block', // Hide on mobile (show on desktop)
  tablet: 'hidden md:block lg:hidden', // Tablet-specific
  small: 'sm:block', // Small screens and up
  medium: 'md:block', // Medium screens and up
  large: 'lg:block', // Large screens and up
} as const

/**
 * Component size variants
 */
export const sizeVariants = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-2',
  md: 'text-base px-4 py-3',
  lg: 'text-lg px-6 py-4',
  xl: 'text-xl px-8 py-5',
} as const

/**
 * Color palette for components
 */
export const colorPalette = {
  // Neutral grays
  neutral: {
    50: 'slate-50',
    100: 'slate-100',
    200: 'slate-200',
    300: 'slate-300',
    400: 'slate-400',
    500: 'slate-500',
    600: 'slate-600',
    700: 'slate-700',
    800: 'slate-800',
    900: 'slate-900',
    950: 'slate-950',
  },

  // Primary emerald
  primary: {
    50: 'emerald-50',
    100: 'emerald-100',
    200: 'emerald-200',
    300: 'emerald-300',
    400: 'emerald-400',
    500: 'emerald-500',
    600: 'emerald-600',
    700: 'emerald-700',
    800: 'emerald-800',
    900: 'emerald-900',
    950: 'emerald-950',
  },

  // Semantic colors
  semantic: {
    info: {
      light: 'blue-500',
      dark: 'blue-400',
      bg: 'blue-50',
      bgDark: 'blue-950/50',
      border: 'blue-200',
      borderDark: 'blue-800',
    },
    success: {
      light: 'green-500',
      dark: 'green-400',
      bg: 'green-50',
      bgDark: 'green-950/50',
      border: 'green-200',
      borderDark: 'green-800',
    },
    warning: {
      light: 'amber-500',
      dark: 'amber-400',
      bg: 'amber-50',
      bgDark: 'amber-950/50',
      border: 'amber-200',
      borderDark: 'amber-800',
    },
    error: {
      light: 'red-500',
      dark: 'red-400',
      bg: 'red-50',
      bgDark: 'red-950/50',
      border: 'red-200',
      borderDark: 'red-800',
    },
  },
} as const

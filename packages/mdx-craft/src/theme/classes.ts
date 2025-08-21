export const responsive = {
  desktopOnly: 'hidden lg:block',
  mobileOnly: 'lg:hidden',
  tabletOnly: 'hidden md:block lg:hidden',

  padding: {
    xs: 'p-3 sm:p-4',
    sm: 'p-4 sm:p-6',
    md: 'p-6 lg:p-8',
    lg: 'p-8 xl:p-12',
    xl: 'p-12 xl:p-16',
  },

  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-base lg:text-lg',
    lg: 'text-lg xl:text-xl',
    xl: 'text-xl 2xl:text-2xl',
    '2xl': 'text-2xl 2xl:text-3xl',
  },

  space: {
    xs: 'space-y-3 sm:space-y-4',
    sm: 'space-y-4 sm:space-y-6',
    md: 'space-y-6 lg:space-y-8',
    lg: 'space-y-8 xl:space-y-12',
    xl: 'space-y-12 xl:space-y-16',
  },

  gap: {
    xs: 'gap-3 sm:gap-4',
    sm: 'gap-4 sm:gap-6',
    md: 'gap-6 lg:gap-8',
    lg: 'gap-8 xl:gap-10',
    xl: 'gap-10 xl:gap-12',
  },
}

export const animations = {
  /**
   * Enhanced smooth transitions with better easing
   */
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    spring: 'transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
    bouncy: 'transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
  },

  /**
   * Enhanced transform utilities
   */
  transform: {
    scale: 'transform hover:scale-105 active:scale-95 transition-transform duration-200',
    scaleSubtle: 'transform hover:scale-102 active:scale-98 transition-transform duration-150',
    slide: 'transform translate-x-0 hover:translate-x-1 transition-transform duration-200',
    slideUp: 'transform translate-y-0 hover:-translate-y-1 transition-transform duration-200',
    rotate: 'transform rotate-0 hover:rotate-3 transition-transform duration-200',
  },

  /**
   * Loading and state animations
   */
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
    fade: 'animate-[fadeIn_0.3s_ease-out]',
    slideIn: 'animate-[slideIn_0.3s_ease-out]',
  },

  /**
   * Hover and focus animations
   */
  hover: {
    lift: 'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200',
    glow: 'hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300',
    fadeIn: 'opacity-0 hover:opacity-100 transition-opacity duration-200',
    slideIn:
      'transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200',
  },
}

export const accessibility = {
  /**
   * Focus ring for interactive elements
   */
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',

  /**
   * Screen reader only content
   */
  srOnly: 'sr-only',

  /**
   * Skip link styling
   */
  skipLink:
    'absolute -top-40 left-6 z-50 bg-emerald-600 px-4 py-2 text-white rounded-md focus:top-6',

  /**
   * High contrast mode support
   */
  highContrast: 'contrast-more:border-black contrast-more:dark:border-white',
}

/**
 * Layout utilities
 */
export const layout = {
  /**
   * Container layouts
   */
  container: {
    sm: 'max-w-2xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-4 sm:px-6',
    lg: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  },

  /**
   * Grid layouts
   */
  grid: {
    auto: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
    sidebar: 'grid grid-cols-1 lg:grid-cols-4 gap-8',
    toc: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
  },

  /**
   * Flexbox utilities
   */
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    column: 'flex flex-col',
    wrap: 'flex flex-wrap',
  },
}

/**
 * Typography utilities
 */
export const typography = {
  /**
   * Enhanced heading styles following Mintlify patterns
   */
  heading: {
    h1: 'scroll-mt-20 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl leading-tight',
    h2: 'scroll-mt-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl leading-tight',
    h3: 'scroll-mt-20 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl leading-tight',
    h4: 'scroll-mt-20 text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl leading-snug',
    h5: 'scroll-mt-20 text-base font-medium tracking-tight text-gray-900 dark:text-gray-100 sm:text-lg leading-snug',
    h6: 'scroll-mt-20 text-sm font-medium tracking-tight text-gray-900 dark:text-gray-100 sm:text-base leading-snug',
  },

  /**
   * Enhanced text styles with better contrast
   */
  text: {
    body: 'text-base leading-7 text-gray-700 dark:text-gray-300',
    bodyLarge: 'text-lg leading-8 text-gray-700 dark:text-gray-300',
    small: 'text-sm leading-6 text-gray-600 dark:text-gray-400',
    caption: 'text-xs leading-5 text-gray-500 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-400',
    code: 'font-mono text-sm font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700',
    kbd: 'inline-flex items-center px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
  },

  /**
   * Enhanced link styles matching Mintlify
   */
  link: {
    default:
      'text-emerald-600 dark:text-emerald-400 font-medium no-underline hover:underline underline-offset-2 decoration-2 decoration-emerald-300 dark:decoration-emerald-600 transition-colors duration-150',
    subtle:
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 no-underline hover:underline underline-offset-2 transition-colors duration-150',
    muted:
      'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 no-underline hover:underline underline-offset-2 transition-colors duration-150',
  },

  /**
   * List styling enhancements
   */
  list: {
    ordered:
      'list-decimal list-outside space-y-2 pl-6 text-base leading-7 text-gray-700 dark:text-gray-300',
    unordered:
      'list-disc list-outside space-y-2 pl-6 text-base leading-7 text-gray-700 dark:text-gray-300',
    nested: 'mt-2 space-y-1',
  },

  /**
   * Quote and blockquote styling
   */
  quote: {
    blockquote:
      'border-l-4 border-gray-300 dark:border-gray-600 pl-6 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 py-4 my-6 rounded-r-lg',
    cite: 'text-sm text-gray-500 dark:text-gray-400 not-italic font-medium',
  },
}

/**
 * Component state utilities
 */
export const states = {
  /**
   * Interactive states
   */
  interactive: {
    default: 'cursor-pointer select-none',
    clickable: 'cursor-pointer select-none',
    hoverable: 'hover:bg-gray-50 dark:hover:bg-gray-800/40',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
    active: 'active:bg-gray-100 dark:active:bg-gray-700/50',
    focus: 'focus:bg-gray-50 dark:focus:bg-gray-800/50',
    pressed: 'active:scale-[0.98] active:transition-transform active:duration-75',
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-75 cursor-wait pointer-events-none animate-pulse',
  },

  /**
   * Loading states
   */
  loading: {
    default: 'opacity-50 pointer-events-none',
    skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700',
  },

  /**
   * Validation states
   */
  validation: {
    error: 'border-red-300 dark:border-red-700 text-red-600 dark:text-red-400',
    success: 'border-green-300 dark:border-green-700 text-green-600 dark:text-green-400',
    warning: 'border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400',
  },
}

/**
 * Enhanced utility classes for common patterns
 */
export const utilities = {
  /**
   * Enhanced focus ring with better contrast
   */
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-opacity-75',

  /**
   * Enhanced layout system
   */
  layout: {
    container: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
    section: 'py-12 sm:py-16 lg:py-20',
    grid: 'grid gap-6 sm:gap-8 lg:gap-10',
    stack: 'space-y-6 sm:space-y-8 lg:space-y-10',

    // Content width constraints
    content: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
    },
  },

  /**
   * Enhanced mobile responsive patterns
   */
  mobile: {
    hidden: 'lg:hidden',
    shown: 'hidden lg:block',
    touchTarget: 'min-h-[44px] min-w-[44px]',
    safeArea: 'pb-safe-bottom pl-safe-left pr-safe-right pt-safe-top',

    // Mobile-specific spacing
    spacing: {
      padding: 'px-4 sm:px-6',
      margin: 'mx-4 sm:mx-6',
      gap: 'gap-4 sm:gap-6',
    },
  },

  /**
   * Shadow system matching Mintlify's depth
   */
  shadows: {
    sm: 'shadow-sm',
    base: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    card: 'shadow-sm hover:shadow-lg transition-shadow duration-300',
    dropdown: 'shadow-lg border border-gray-200 dark:border-gray-700',
  },

  /**
   * Border radius system
   */
  radius: {
    sm: 'rounded-md',
    base: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
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
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    300: 'gray-300',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    800: 'gray-800',
    900: 'gray-900',
    950: 'gray-950',
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

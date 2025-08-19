export const responsive = {
  desktopOnly: 'hidden lg:block',
  mobileOnly: 'lg:hidden',
  tabletOnly: 'hidden md:block lg:hidden',

  padding: {
    sm: 'p-4 sm:p-6',
    md: 'p-6 lg:p-8',
    lg: 'p-8 xl:p-12',
  },

  text: {
    sm: 'text-sm sm:text-base',
    md: 'text-base lg:text-lg',
    lg: 'text-lg xl:text-xl',
    xl: 'text-xl 2xl:text-2xl',
  },

  space: {
    sm: 'space-y-4 sm:space-y-6',
    md: 'space-y-6 lg:space-y-8',
    lg: 'space-y-8 xl:space-y-12',
  },
}

export const animations = {
  /**
   * Smooth transitions
   */
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },

  /**
   * Transform utilities
   */
  transform: {
    scale: 'transform hover:scale-105 active:scale-95',
    slide: 'transform translate-x-0 hover:translate-x-1',
  },

  /**
   * Loading animations
   */
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  },
}

export const accessibility = {
  /**
   * Focus ring for interactive elements
   */
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',

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
   * Heading styles that work with prose
   */
  heading: {
    h1: 'scroll-mt-20 text-3xl font-bold tracking-tight sm:text-4xl',
    h2: 'scroll-mt-20 text-2xl font-bold tracking-tight sm:text-3xl',
    h3: 'scroll-mt-20 text-xl font-bold tracking-tight sm:text-2xl',
    h4: 'scroll-mt-20 text-lg font-semibold tracking-tight sm:text-xl',
    h5: 'scroll-mt-20 text-base font-semibold tracking-tight sm:text-lg',
    h6: 'scroll-mt-20 text-sm font-semibold tracking-tight sm:text-base',
  },

  /**
   * Text styles
   */
  text: {
    body: 'text-base leading-7 text-slate-700 dark:text-slate-300',
    small: 'text-sm leading-6 text-slate-600 dark:text-slate-400',
    caption: 'text-xs leading-5 text-slate-500 dark:text-slate-500',
    code: 'font-mono text-sm font-medium',
  },

  /**
   * Link styles
   */
  link: {
    default:
      'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-4 hover:decoration-emerald-500 dark:hover:decoration-emerald-400',
    subtle:
      'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 no-underline hover:underline',
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
    hover: 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
    active: 'active:bg-slate-100 dark:active:bg-slate-700/50',
    focus: 'focus:bg-slate-50 dark:focus:bg-slate-800/50',
    disabled: 'opacity-50 cursor-not-allowed',
  },

  /**
   * Loading states
   */
  loading: {
    default: 'opacity-50 pointer-events-none',
    skeleton: 'animate-pulse bg-slate-200 dark:bg-slate-700',
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

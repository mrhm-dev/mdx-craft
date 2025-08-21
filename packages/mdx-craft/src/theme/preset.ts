import type { Theme } from '../types/theme.js'

/**
 * Mintlify-inspired theme for MDX Craft
 * Based on Mintlify's design system with proper typography, colors, and spacing
 */
export const defaultTheme: Theme = {
  typography: {
    base: 'prose prose-gray dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-medium prose-h4:text-lg prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-sm prose-h6:font-medium prose-p:text-base prose-p:leading-7 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-base prose-li:leading-7 prose-strong:font-semibold prose-code:text-sm prose-code:font-mono prose-code:font-medium prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400',
    size: 'prose-base md:prose-lg',
    maxWidth: 'max-w-none',
  },
  colors: {
    primary: 'text-emerald-600 dark:text-emerald-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    background: 'bg-white dark:bg-gray-900',
    foreground: 'text-gray-900 dark:text-gray-100',
    muted: 'text-gray-500 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-blue-600 dark:text-blue-400',
  },
  components: {
    // Interactive card with enhanced Mintlify-style hover effects and spacing
    card: 'not-prose bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg hover:shadow-gray-200/60 dark:hover:shadow-gray-900/40 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 ease-out cursor-pointer group',

    // Code block with improved contrast and rounded corners
    codeBlock:
      'not-prose bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm',

    // Accordion with clean borders and hover states
    accordion:
      'not-prose border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200',

    // Tabbed interface with subtle styling
    tabs: 'not-prose bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',

    callout: {
      // Enhanced base callout with better spacing and typography
      base: 'not-prose border rounded-xl p-5 my-6 shadow-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:text-sm [&>p]:leading-6 [&>ul]:text-sm [&>ul]:leading-6 [&>ol]:text-sm [&>ol]:leading-6',

      // Info callout with better visual hierarchy
      info: 'border-blue-200 bg-blue-50/80 dark:border-blue-800/60 dark:bg-blue-950/30 [&_[data-callout-icon]]:text-blue-600 dark:[&_[data-callout-icon]]:text-blue-400 [&>p]:text-blue-900 dark:[&>p]:text-blue-100',

      // Warning callout with amber accents
      warning:
        'border-amber-200 bg-amber-50/80 dark:border-amber-800/60 dark:bg-amber-950/30 [&_[data-callout-icon]]:text-amber-600 dark:[&_[data-callout-icon]]:text-amber-400 [&>p]:text-amber-900 dark:[&>p]:text-amber-100',

      // Tip callout with emerald theme matching primary color
      tip: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-800/60 dark:bg-emerald-950/30 [&_[data-callout-icon]]:text-emerald-600 dark:[&_[data-callout-icon]]:text-emerald-400 [&>p]:text-emerald-900 dark:[&>p]:text-emerald-100',

      // Note callout with neutral gray theme
      note: 'border-gray-200 bg-gray-50/80 dark:border-gray-600/60 dark:bg-gray-800/30 [&_[data-callout-icon]]:text-gray-600 dark:[&_[data-callout-icon]]:text-gray-400 [&>p]:text-gray-900 dark:[&>p]:text-gray-100',

      // Important callout with purple theme
      important:
        'border-purple-200 bg-purple-50/80 dark:border-purple-800/60 dark:bg-purple-950/30 [&_[data-callout-icon]]:text-purple-600 dark:[&_[data-callout-icon]]:text-purple-400 [&>p]:text-purple-900 dark:[&>p]:text-purple-100',

      // Caution callout with red theme
      caution:
        'border-red-200 bg-red-50/80 dark:border-red-800/60 dark:bg-red-950/30 [&_[data-callout-icon]]:text-red-600 dark:[&_[data-callout-icon]]:text-red-400 [&>p]:text-red-900 dark:[&>p]:text-red-100',
    },

    toc: {
      // Desktop TOC with sticky positioning and proper spacing
      container:
        'hidden lg:block w-64 shrink-0 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto',

      // Mobile TOC with full-width design
      mobile: 'lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',

      // Enhanced mobile toggle button with better positioning
      button:
        'fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95',

      // TOC list with improved spacing
      list: 'space-y-0.5 text-sm',

      // TOC item with better hover states and typography
      item: 'block py-2.5 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-150 font-medium',

      // Active TOC item with enhanced visual feedback
      activeItem:
        'block py-2.5 px-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-l-3 border-emerald-500 dark:border-emerald-400 font-semibold rounded-lg',

      // TOC heading with proper typography hierarchy
      heading: 'font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4 px-3',
    },
  },
}

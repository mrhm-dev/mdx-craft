import { defaultTheme } from './preset.js'
import { CreateTheme, PartialTheme, Theme } from '../types/theme.js'

/**
 * Deep merge utility for combining theme objects
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns The merged object
 *
 * @example
 * const target = {
 *   colors: {
 *     primary: 'red',
 *     secondary: 'green',
 *   },
 * }
 *
 * const source = {
 *   colors: {
 *     primary: 'blue',
 *   },
 *   typography: {
 *     base: 'prose prose-gray dark:prose-invert',
 *   },
 * }
 *
 * const merged = deepMerge(target, source);
 *
 * console.log(merged);
 * // {
 * //   colors: {
 * //     primary: 'blue',
 * //     secondary: 'green',
 * //   },
 * //   typography: {
 * //     base: 'prose prose-gray dark:prose-invert',
 * //   },
 * // }
 */
export function deepMerge<T extends object, S extends Partial<T>>(target: T, source: S): T {
  const result = { ...target }

  ;(Object.keys(source) as Array<keyof T>).forEach((key) => {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursively merge objects
      result[key] = deepMerge(targetValue, sourceValue as Partial<typeof targetValue>)
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[typeof key]
    }
  })

  return result
}

/**
 * Creates a theme by merging the default theme with the provided overrides
 * @param overrides - The theme overrides to apply
 * @returns The merged theme
 *
 * @example
 * const theme = createTheme({
 *   colors: {
 *     primary: 'red',
 *   },
 * })
 *
 */
export const createTheme: CreateTheme = (overrides: PartialTheme = {}) => {
  return deepMerge(defaultTheme, overrides as Partial<Theme>)
}

/**
 * Utility function to merge Tailwind CSS classes
 * @param classes - The classes to merge
 * @returns The merged class string
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Utility function to get theme classes
 * @param theme - The theme to get classes from
 * @returns The theme classes
 */
export const getThemeClasses = (theme: Theme) => ({
  colors: (color: keyof Theme['colors']): string => {
    return theme.colors[color]
  },

  typography: () => {
    return cn(theme.typography.base, theme.typography.size, theme.typography.maxWidth)
  },

  components: (componentType: keyof Theme['components']): string => {
    if (componentType === 'callout') {
      return theme.components.callout.base
    }
    if (componentType === 'toc') {
      return theme.components.toc.container
    }
    return theme.components[componentType] || ''
  },

  callout: (variant: keyof Theme['components']['callout']): string => {
    if (variant === 'base') {
      return theme.components.callout.base
    }
    return cn(theme.components.callout.base, theme.components.callout[variant])
  },

  toc: (element: keyof Theme['components']['toc']): string => {
    return theme.components.toc[element]
  },
})

/**
 * Utility function to create component classes
 * @param theme - The theme to create classes from
 * @returns The component classes
 */
export const createComponentClasses = (theme: Theme) => {
  const themeClasses = getThemeClasses(theme)

  return {
    /**
     * Build complete class string for MDX content wrapper
     */
    buildContentClasses: (className?: string): string => {
      return cn(themeClasses.typography(), className)
    },

    /**
     * Build complete class string for components
     */
    buildComponentClasses: (
      componentType: keyof Theme['components'],
      additionalClasses?: string
    ): string => {
      return cn(themeClasses.components(componentType), additionalClasses)
    },

    /**
     * Build complete class string for callouts
     */
    buildCalloutClasses: (
      variant: keyof Theme['components']['callout'],
      additionalClasses?: string
    ): string => {
      return cn(themeClasses.callout(variant), additionalClasses)
    },

    /**
     * Build complete class string for TOC elements
     */
    buildTOCClasses: (
      element: keyof Theme['components']['toc'],
      isActive = false,
      additionalClasses?: string
    ): string => {
      if (element === 'item' && isActive) {
        return cn(themeClasses.toc('activeItem'), additionalClasses)
      }
      return cn(themeClasses.toc(element), additionalClasses)
    },
  }
}

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
 * Utility function to merge Tailwind CSS classes
 * @param classes - The classes to merge
 * @returns The merged class string
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

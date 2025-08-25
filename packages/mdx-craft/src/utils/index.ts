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

/**
 * Get the styles for the code block
 * @param isTerminal - Whether the code block is a terminal code block
 * @returns The styles for the code block
 */
export const getCodeBlockStyles = (isTerminal: boolean) => `
  .shiki-code-block pre {
    background: transparent !important;
    padding: 1rem !important;
    margin: 0 !important;
    overflow-x: auto;
    font-family: 'Fira Code', 'JetBrains Mono', 'Monaco', 'Consolas', monospace;
    letter-spacing: -0.02em;
  }
  .shiki-code-block code {
    background: transparent !important;
    display: block;
    font-family: inherit;
    line-height: 0.5;
  }
  .shiki-code-block .line {
    display: block;
    padding: 0.125rem 1rem;
    min-height: 1.2em;
    line-height: 1.2;
  }
  .shiki-code-block .line:empty::before {
    content: '\\200B';
  }
  .shiki-code-block .line[data-line] {
    position: relative;
    padding-left: 3.5rem;
  }
  .shiki-code-block .line[data-line]::before {
    content: attr(data-line);
    position: absolute;
    left: 0;
    width: 2rem;
    color: rgb(113 113 122 / 0.5);
    text-align: right;
    font-size: 0.75rem;
    user-select: none;
    padding-right: 0.5rem;
    line-height: inherit;
  }
  .shiki-code-block .highlighted-line {
    background-color: rgb(59 130 246 / 0.1);
    border-left: 3px solid rgb(59 130 246);
    margin-left: -3px;
    padding-left: calc(4rem - 3px);
  }
  ${
    isTerminal
      ? `
    .shiki-code-block pre {
      background: rgb(9 9 11) !important;
      color: rgb(161 161 170) !important;
    }
    .shiki-code-block .line::before {
      content: '$ ';
      color: rgb(74 222 128);
      font-weight: bold;
      padding-right: 0.5rem;
    }
    .shiki-code-block .line[data-line]::before {
      content: '$ ' attr(data-line);
    }
  `
      : ''
  }
`

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'

// Dynamic imports - shiki types are imported conditionally
type Highlighter = any
type BundledLanguage = string
type BundledTheme = string

// Minimal default languages to reduce bundle size
export const DEFAULT_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'json',
  'bash',
  'css',
  'html',
]

// Legacy export for backward compatibility
export const SUPPORTED_LANGUAGES = DEFAULT_LANGUAGES

export const SUPPORTED_THEMES: BundledTheme[] = ['github-light', 'github-dark']

export const DEFAULT_THEME = {
  light: 'github-light' as BundledTheme,
  dark: 'github-dark' as BundledTheme,
} as const

/**
 * Check if shiki is available as a peer dependency
 */
export const checkShikiAvailability = async (): Promise<boolean> => {
  try {
    await import('shiki')
    return true
  } catch {
    console.info('MDX Craft: Shiki not installed - using plain text rendering for code blocks')
    return false
  }
}

export type ShikiConfig = {
  languages?: BundledLanguage[]
  themes?: BundledTheme[]
  lightTheme?: BundledTheme
  darkTheme?: BundledTheme
}

export type HighlightOptions = {
  language: string
  theme?: BundledTheme
  showLineNumbers?: boolean
  highlightLines?: string
  startingLineNumber?: number
  wordWrap?: boolean
}

export type HighlightResult = {
  html: string
  language: string
  theme: string
  languageSupported: boolean
}

class ShikiHighlighter {
  private highlighter: Highlighter | null = null
  private config: Required<ShikiConfig>
  private cache: Map<string, HighlightResult> = new Map()
  private maxCacheSize: number = 100
  private shikiModule: any = null
  private available: boolean = false

  constructor(config: ShikiConfig = {}) {
    this.config = {
      languages: config.languages || DEFAULT_LANGUAGES,
      themes: config.themes || SUPPORTED_THEMES,
      lightTheme: config.lightTheme || DEFAULT_THEME.light,
      darkTheme: config.darkTheme || DEFAULT_THEME.dark,
    }
  }

  // Initialize highlighter with dynamic import
  async initialize() {
    if (this.highlighter) {
      return
    }

    try {
      // Dynamic import of shiki
      this.shikiModule = await import('shiki')
      this.highlighter = await this.shikiModule.createHighlighter({
        themes: this.config.themes,
        langs: this.config.languages,
      })
      this.available = true
    } catch {
      console.info('MDX Craft: Shiki not available, falling back to plain text rendering')
      this.available = false
      this.shikiModule = null
      this.highlighter = null
    }
  }

  // Check if shiki is available and initialized
  isAvailable(): boolean {
    return this.available && this.highlighter !== null
  }

  // Create plain text fallback when shiki is not available
  private createPlainTextFallback(code: string, options: HighlightOptions): HighlightResult {
    const escapedCode = this.escapeHtml(code)

    if (options.showLineNumbers) {
      // Generate HTML with line numbers for CodeBlock component
      const lines = escapedCode.split('\n')
      const lineElements = lines
        .map((line, index) => {
          const lineNumber = (options.startingLineNumber || 1) + index
          return `<div class="line" data-line="${lineNumber}">
          <span class="line-number">${lineNumber}</span>
          <span class="line-content">${line || ' '}</span>
        </div>`
        })
        .join('')

      return {
        html: `<div class="plain-code-block">${lineElements}</div>`,
        language: options.language,
        theme: 'plain',
        languageSupported: false,
      }
    } else {
      // Simple format for Code component
      return {
        html: `<pre class="plain-code"><code>${escapedCode}</code></pre>`,
        language: options.language,
        theme: 'plain',
        languageSupported: false,
      }
    }
  }

  // Highlight code with syntax highlighting
  async highlight(code: string, options: HighlightOptions): Promise<HighlightResult> {
    if (!this.highlighter) {
      await this.initialize()
    }

    // If shiki is not available, return plain text fallback
    if (!this.isAvailable()) {
      return this.createPlainTextFallback(code, options)
    }

    const cacheKey = this.createCacheKey(code, options)

    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    try {
      const theme = this.resolveTheme(options.theme)
      const language = this.resolveLanguage(options.language)
      const languageSupported = this.highlighter
        .getLoadedLanguages()
        .includes(language as BundledLanguage)

      // highlight code
      const html = this.highlighter.codeToHtml(code, {
        lang: languageSupported ? language : 'text',
        theme,
        transformers: [
          // Line number transformer
          ...(options.showLineNumbers
            ? [this.createLineNumbersTransformer(options.startingLineNumber)]
            : []),
          // Line highlighting transformer
          ...(options.highlightLines
            ? [this.createLineHighlightTransformer(options.highlightLines)]
            : []),
          // Word wrap transformer
          ...(options.wordWrap ? [this.createWordWrapTransformer()] : []),
        ],
      })

      const result: HighlightResult = {
        html,
        language: languageSupported ? language : 'text',
        theme,
        languageSupported,
      }

      this.cache.set(cacheKey, result)

      return result
    } catch (error) {
      console.warn('Failed to highlight code:', error)

      // Fallback to plain text
      const result: HighlightResult = {
        html: `<pre><code>${code}</code></pre>`,
        language: 'text',
        theme: 'text',
        languageSupported: true,
      }

      return result
    }
  }

  private resolveTheme(themeOverride?: BundledTheme) {
    if (themeOverride) {
      return themeOverride
    }

    // Auto-detect dark mode
    if (typeof window !== 'undefined') {
      // Check for Tailwind v4 dark mode (class on html element)
      const htmlElement = document.documentElement
      const isDarkMode = htmlElement.classList.contains('dark')
      return isDarkMode ? this.config.darkTheme : this.config.lightTheme
    }

    // Default to light theme
    return this.config.lightTheme
  }

  private resolveLanguage(language: string) {
    const aliases: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      rs: 'rust',
      rb: 'ruby',
      sh: 'bash',
      yml: 'yaml',
      dockerfile: 'dockerfile',
      md: 'markdown',
      mdx: 'markdown',
    }

    return aliases[language.toLowerCase()] || language
  }

  private createCacheKey(code: string, options: HighlightOptions) {
    return `${options.language}_${options.theme || 'auto'}_${options.showLineNumbers || false}_${options.highlightLines || ''}_${options.startingLineNumber || 1}`
  }

  private hashCode(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash
  }

  private cacheResult(key: string, result: HighlightResult) {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, result)
  }

  private createLineNumbersTransformer(startingLineNumber = 1) {
    return {
      name: 'line-numbers',
      line(node: any, lineNumber: number) {
        // Add data-line attribute to each line
        node.properties = node.properties || {}
        node.properties['data-line'] = String(startingLineNumber + lineNumber - 1)
        node.properties.className = (node.properties.className || []).concat('line')
      },
    }
  }

  private createLineHighlightTransformer(highlightLines: string) {
    const lineNumbers = this.parseHighlightLines(highlightLines)

    return {
      name: 'line-highlight',
      code(node: any) {
        const lines = node.children || []
        lines.forEach((line: any, index: number) => {
          const lineNumber = index + 1
          if (lineNumbers.includes(lineNumber)) {
            line.properties = line.properties || {}
            line.properties.className = (line.properties.className || []).concat([
              'highlighted-line',
            ])
          }
        })
      },
    }
  }

  private createWordWrapTransformer() {
    return {
      name: 'word-wrap',
      pre(node: any) {
        node.properties = node.properties || {}
        node.properties.style =
          (node.properties.style || '') + '; white-space: pre-wrap; word-break: break-word;'
      },
    }
  }

  private parseHighlightLines(highlightLines: string): number[] {
    const lines: number[] = []

    highlightLines.split(',').forEach((part) => {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10))
        if (start && end) {
          for (let i = start; i <= end; i++) {
            if (!isNaN(i)) {
              lines.push(i)
            }
          }
        }
      } else {
        const lineNumber = parseInt(trimmed, 10)
        if (!isNaN(lineNumber)) {
          lines.push(lineNumber)
        }
      }
    })

    return lines
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }

    return text.replace(/[&<>"']/g, (m) => map[m as keyof typeof map] || m)
  }

  getSupportedLanguages(): string[] {
    return this.highlighter?.getLoadedLanguages() || []
  }

  getSupportedThemes(): string[] {
    return this.highlighter?.getLoadedThemes() || []
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    }
  }
}

// Global highlighter cache - key by config to support different configurations
const highlighterCache = new Map<string, ShikiHighlighter>()

const createConfigKey = (config?: ShikiConfig): string => {
  if (!config) return 'default'
  return JSON.stringify({
    languages: config.languages || DEFAULT_LANGUAGES,
    themes: config.themes || SUPPORTED_THEMES,
    lightTheme: config.lightTheme || DEFAULT_THEME.light,
    darkTheme: config.darkTheme || DEFAULT_THEME.dark,
  })
}

export const getShikiHighlighter = (config?: ShikiConfig): ShikiHighlighter => {
  const configKey = createConfigKey(config)

  let highlighter = highlighterCache.get(configKey)
  if (!highlighter) {
    highlighter = new ShikiHighlighter(config)
    highlighterCache.set(configKey, highlighter)
  }

  return highlighter
}

export const highlightCode = async (
  code: string,
  options: HighlightOptions
): Promise<HighlightResult> => {
  const highlighter = getShikiHighlighter()
  return highlighter.highlight(code, options)
}

export const useShiki = () => {
  const highlighter = getShikiHighlighter()

  return useMemo(
    () => ({
      highlight: (code: string, options: HighlightOptions) => highlighter.highlight(code, options),
      getSupportedLanguages: () => highlighter.getSupportedLanguages(),
      getSupportedThemes: () => highlighter.getSupportedThemes(),
      clearCache: () => highlighter.clearCache(),
      getCacheStats: () => highlighter.getCacheStats(),
    }),
    [highlighter]
  )
}

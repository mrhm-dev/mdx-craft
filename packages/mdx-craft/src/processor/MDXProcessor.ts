import { getDefaultRemarkPlugins } from '../plugins/remarkPlugins.js'
import { MDXCache } from './cache.js'
import type {
  CompilationResult,
  CompilerOptions,
  MDXModule,
  ProcessorConfig,
} from '../types/processor.js'
import { evaluate, evaluateSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import * as devRuntime from 'react/jsx-dev-runtime'
import { getDefaultRehypePlugins, getSyncRehypePlugins } from '../plugins/rehypePlugins.js'
import React from 'react'
import type { PluggableList } from 'unified'
import { preprocessMDXSource } from './preprocessor.js'

// Type for the compilation context
export interface CompilationContext {
  startTime: number
  cacheKey: string
  componentKeys: string[]
  evaluateOptions: {
    development: boolean
    remarkPlugins: PluggableList
    rehypePlugins: PluggableList
    useMDXComponents: () => Record<string, never>
  } & (typeof runtime | typeof devRuntime)
}

export class MDXProcessor {
  private cache: MDXCache
  private config: ProcessorConfig

  constructor(config?: Partial<ProcessorConfig>) {
    this.config = {
      cacheEnabled: config?.cacheEnabled ?? true,
      cacheMaxSize: config?.cacheMaxSize ?? 10, // 10MB
      cacheTTL: config?.cacheTTL ?? 300000, // 5 minutes
    }

    this.cache = new MDXCache(this.config.cacheMaxSize, this.config.cacheTTL)
  }

  async compile(options: CompilerOptions): Promise<CompilationResult> {
    // Preprocess source to escape special characters before MDX parsing
    const preprocessedSource = preprocessMDXSource(options.source)
    const preprocessedOptions = { ...options, source: preprocessedSource }

    const { context, cachedResult } = this.prepareCompilation(preprocessedOptions, false)
    if (cachedResult) return cachedResult
    if (!context) throw new Error('Failed to prepare compilation context')

    try {
      const compiled = await evaluate(preprocessedSource, context.evaluateOptions)
      return this.processCompiledResult(compiled, context, options)
    } catch (error) {
      return this.createErrorResult(error, context, options)
    }
  }

  compileSync(options: CompilerOptions): CompilationResult {
    // Preprocess source to escape special characters before MDX parsing
    const preprocessedSource = preprocessMDXSource(options.source)
    const preprocessedOptions = { ...options, source: preprocessedSource }

    const { context, cachedResult } = this.prepareCompilation(preprocessedOptions, true)
    if (cachedResult) return cachedResult
    if (!context) throw new Error('Failed to prepare compilation context')

    try {
      const compiled = evaluateSync(preprocessedSource, context.evaluateOptions)
      return this.processCompiledResult(compiled, context, options)
    } catch (error) {
      return this.createErrorResult(error, context, options)
    }
  }

  private prepareCompilation(
    options: CompilerOptions,
    isSync: boolean
  ): {
    context: CompilationContext | null
    cachedResult: CompilationResult | null
  } {
    const startTime = performance.now()

    // Generate cache key
    const componentKeys = options.components ? Object.keys(options.components).sort() : []
    const pluginFingerPrint = {
      remark: options.remarkPlugins?.length ?? 0,
      rehype: options.rehypePlugins?.length ?? 0,
    }
    const cacheKey = MDXCache.generateKey(
      options.source,
      componentKeys,
      JSON.stringify(pluginFingerPrint)
    )

    // Check cache
    if (this.config.cacheEnabled) {
      const cachedEntry = this.cache.get(cacheKey)
      if (cachedEntry) {
        this.cache.recordHit()
        const duration = performance.now() - startTime

        return {
          context: null,
          cachedResult: {
            content: cachedEntry.content
              ? this.renderMDX(cachedEntry.content, options.components)
              : null,
            metadata: {
              duration,
              cacheHit: true,
              componentCount: componentKeys.length,
            },
          },
        }
      }
      this.cache.recordMiss()
    }

    // Prepare compilation context
    const remarkPlugins = [...getDefaultRemarkPlugins(), ...(options.remarkPlugins ?? [])]
    const rehypePlugins = [
      ...(isSync ? getSyncRehypePlugins() : getDefaultRehypePlugins()),
      ...(options.rehypePlugins ?? []),
    ]
    const isDev = options.development ?? process.env.NODE_ENV === 'development'

    // Log compilation info (disabled for production)
    // console.log('Compiling MDX with enhanced configuration:', {
    //   development: isDev,
    //   remarkPlugins: remarkPlugins.length,
    //   rehypePlugins: rehypePlugins.length,
    //   components: componentKeys.length,
    // })

    const evaluateOptions = {
      ...(isDev ? devRuntime : runtime),
      development: isDev,
      remarkPlugins,
      rehypePlugins,
      useMDXComponents: () => ({}), // Disable default MDX components
    }

    return {
      context: {
        startTime,
        cacheKey,
        componentKeys,
        evaluateOptions,
      },
      cachedResult: null,
    }
  }

  private processCompiledResult(
    compiled: MDXModule,
    context: CompilationContext,
    options: CompilerOptions
  ): CompilationResult {
    // Cache the result
    if (this.config.cacheEnabled) {
      this.cache.set(context.cacheKey, {
        content: compiled,
        metadata: {
          timestamp: Date.now(),
        },
      })
    }

    const duration = performance.now() - context.startTime

    return {
      content: this.renderMDX(compiled, options.components),
      metadata: {
        duration,
        cacheHit: false,
        componentCount: context.componentKeys.length,
      },
    }
  }

  private createErrorResult(
    error: unknown,
    context: CompilationContext,
    _options: CompilerOptions
  ): CompilationResult {
    const duration = performance.now() - context.startTime

    return {
      content: null,
      metadata: {
        duration,
        cacheHit: false,
        componentCount: context.componentKeys.length,
      },
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }

  private renderMDX(
    compiled: MDXModule,
    components: CompilerOptions['components']
  ): React.ReactElement {
    const MDXContent = compiled.default

    try {
      return React.createElement(MDXContent, {
        components: components ?? {},
        className: 'mdx-content',
      })
    } catch (error) {
      console.error('MDX Rendering Error:', error)

      if (process.env.NODE_ENV !== 'production') {
        return React.createElement(
          'div',
          {
            className:
              'p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200',
          },
          [
            React.createElement(
              'h3',
              {
                key: 'title',
                className: 'text-lg font-semibold mb-2',
              },
              'MDX Rendering Error'
            ),
            React.createElement(
              'pre',
              {
                key: 'error',
                className: 'text-sm font-mono whitespace-pre-wrap overflow-auto',
              },
              error instanceof Error ? error.message : String(error)
            ),
          ]
        )
      }

      throw error
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats() {
    return this.cache.getStats()
  }

  async precompile(sources: { key: string; options: CompilerOptions }[]) {
    const promises = sources.map(({ options }) => this.compile(options))
    await Promise.all(promises)
  }
}

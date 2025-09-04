import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { PluggableList } from 'unified'
import { MDXProcessor } from '../processor/MDXProcessor.js'
import { useMDXViewer } from './useMDXViewer.js'
import type { ComponentRegistry, CompilationResult } from '../types/index.js'
import type { MDXViewerStateRef } from '../types/viewer.js'

export type UseMDXCompilationOptions = {
  source: string
  components: ComponentRegistry
  remarkPlugins?: PluggableList[]
  rehypePlugins?: PluggableList[]
  onCompile?: (metadata: CompilationResult['metadata']) => void
  onError?: (error: Error) => void
  useCache?: boolean
}

export type UseMDXCompilationReturn = {
  isLoading: boolean
  content: ReactElement | null
  error: Error | null
  isReady: boolean
}

/**
 * Hook to handle MDX compilation with caching and change detection
 *
 * @param options Configuration options for MDX compilation
 * @returns Object containing compilation state and results
 *
 * @example
 * ```tsx
 * const compilation = useMDXCompilation({
 *   source: mdxContent,
 *   components: mergedComponents,
 *   remarkPlugins: [remarkGfm],
 *   rehypePlugins: [rehypeSlug],
 *   onCompile: (metadata) => console.log('Compiled:', metadata),
 *   onError: (error) => console.error('Error:', error),
 *   useCache: true
 * })
 *
 * if (compilation.isLoading) {
 *   return <Loading />
 * }
 *
 * if (compilation.error) {
 *   return <Error error={compilation.error} />
 * }
 *
 * return <div>{compilation.content}</div>
 * ```
 */
export const useMDXCompilation = (options: UseMDXCompilationOptions): UseMDXCompilationReturn => {
  const {
    source,
    components,
    remarkPlugins = [],
    rehypePlugins = [],
    onCompile,
    onError,
    useCache = true,
  } = options

  const globalContext = useMDXViewer()

  // States
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<ReactElement | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const compileRef = useRef<MDXViewerStateRef | null>(null)

  // Initialize Processor
  const processor = useMemo(
    () =>
      new MDXProcessor({
        cacheEnabled: useCache,
        cacheMaxSize: globalContext.cache.maxSize,
        cacheTTL: globalContext.cache.ttl,
      }),
    [useCache, globalContext.cache]
  )

  // Merge plugins with global context and flatten
  const mergedRemarkPlugins = useMemo(() => {
    return [...globalContext.remarkPlugins, ...remarkPlugins].flat()
  }, [globalContext.remarkPlugins, remarkPlugins])

  const mergedRehypePlugins = useMemo(() => {
    return [...globalContext.rehypePlugins, ...rehypePlugins].flat()
  }, [globalContext.rehypePlugins, rehypePlugins])

  // Create stable callbacks
  const stableOnCompile = useCallback(
    (metadata: CompilationResult['metadata']) => {
      onCompile?.(metadata)
    },
    [onCompile]
  )

  const stableOnError = useCallback(
    (err: Error) => {
      onError?.(err)
    },
    [onError]
  )

  // Main compilation effect
  useEffect(() => {
    let cancelled = false

    // Create current state for comparison
    const currentState: MDXViewerStateRef = {
      source,
      components: JSON.stringify(components),
      remarkPlugins: mergedRemarkPlugins.length,
      rehypePlugins: mergedRehypePlugins.length,
    }

    // Check if state has changed
    let hasChanged = true
    if (compileRef.current) {
      hasChanged =
        compileRef.current.source !== currentState.source ||
        compileRef.current.components !== currentState.components ||
        compileRef.current.remarkPlugins !== currentState.remarkPlugins ||
        compileRef.current.rehypePlugins !== currentState.rehypePlugins
    }

    // Only recompile if the state has changed
    if (!hasChanged) return

    const compile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await processor.compile({
          source,
          components,
          remarkPlugins: mergedRemarkPlugins,
          rehypePlugins: mergedRehypePlugins,
          development: process.env.NODE_ENV === 'development',
        })

        if (cancelled) return

        if (result.error) {
          setError(result.error)
          stableOnError(result.error)
          // IMPORTANT: Still update the ref to prevent infinite recompilation on errors
          compileRef.current = currentState
        } else {
          setContent(result.content)
          stableOnCompile(result.metadata)
          // Update ref with current state after successful compilation
          compileRef.current = currentState
        }
      } catch (err) {
        if (cancelled) return
        const compilationError = err instanceof Error ? err : new Error(String(err))
        setError(compilationError)
        stableOnError(compilationError)
        // IMPORTANT: Still update the ref to prevent infinite recompilation on errors
        compileRef.current = currentState
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    compile()

    return () => {
      cancelled = true
    }
  }, [
    source,
    components,
    mergedRemarkPlugins,
    mergedRehypePlugins,
    processor,
    stableOnCompile,
    stableOnError,
  ])

  return {
    isLoading,
    content,
    error,
    isReady: !isLoading && !error && content !== null,
  }
}

import { MDXProvider } from '@mdx-js/react'
import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pluggable } from 'unified'
import { HTMLComponents } from './components/viewer/html/index.js'
import { useMDXViewer } from './hooks/useMDXViewer.js'
import { getGlobalRegistry } from './processor/ComponentRegistry.js'
import { MDXProcessor } from './processor/MDXProcessor.js'
import { CompilationResult } from './types/processor.js'
import { MDXViewerProps, MDXViewerStateRef } from './types/viewer.js'
import {
  Card,
  CodeBlock,
  CodeBlockGroup,
  Expandable,
  Accordion,
  AccordionGroup,
  Note,
  Warning,
  Info,
  Tip,
  Check,
  Danger,
  Frame,
  Steps,
  Step,
  Tabs,
  Tab,
  Stack,
  VStack,
  HStack,
} from './components/viewer/core/index.js'

const DefaultLoader: FC = () => {
  return (
    <div className="flex items-center justify-center p-8 text-zinc-500 dark:text-zinc-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-emerald-600 rounded-full mx-auto mb-4 animate-spin" />
        <div className="text-sm">Loading Content...</div>
      </div>
    </div>
  )
}

const DefaultErrorComponent: FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
      <h3 className="text-lg font-semibold mb-2">MDX Compilation Error</h3>
      <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">{error.message}</pre>
    </div>
  )
}

export const MDXViewer: FC<MDXViewerProps> = ({
  source,
  components: instanceComponents,
  remarkPlugins: instanceRemarkPlugins = [],
  rehypePlugins: instanceRehypePlugins = [],
  onCompile,
  onError,
  loadingComponent: LoadingComponent = DefaultLoader,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  style,
  useCache = true,
}) => {
  // Context
  const globalContext = useMDXViewer()

  // States
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledContent, setCompiledContent] = useState<ReactElement | null>(null)
  const [compilationError, setCompilationError] = useState<Error | null>(null)

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

  // Get registry and register builtin components
  const registry = useMemo(() => {
    const reg = getGlobalRegistry()

    if (!reg.has('Card')) {
      // Core components
      reg.registerBatch({
        Card,
        CodeBlock,
        CodeBlockGroup,
        Expandable,
        Accordion,
        AccordionGroup,
        Note,
        Warning,
        Info,
        Tip,
        Check,
        Danger,
        Frame,
        Steps,
        Step,
        Tabs,
        Tab,
        Stack,
        VStack,
        HStack,
      })
    }

    return reg
  }, [])

  const mergedComponents = useMemo(() => {
    return {
      ...HTMLComponents,
      ...globalContext.components,
      ...registry.getAll(),
      ...instanceComponents,
    }
  }, [globalContext.components, instanceComponents, registry])

  const mergedRemarkPlugins = useMemo(() => {
    return [...globalContext.remarkPlugins, ...instanceRemarkPlugins] as Pluggable[]
  }, [globalContext.remarkPlugins, instanceRemarkPlugins])

  const mergedRehypePlugins = useMemo(() => {
    return [...globalContext.rehypePlugins, ...instanceRehypePlugins] as Pluggable[]
  }, [globalContext.rehypePlugins, instanceRehypePlugins])

  // Create stale reference for callbacks
  const stableOnCompile = useCallback(
    (metadata: CompilationResult['metadata']) => {
      onCompile?.(metadata)
    },
    [onCompile]
  )

  const stableOnError = useCallback(
    (error: Error) => {
      onError?.(error)
    },
    [onError]
  )

  /**
   * Returns the current state and whether it has changed compared to the previous ref.
   * Used to determine if recompilation is needed.
   */
  const detectChanges = useCallback(
    (prev: MDXViewerStateRef | null) => {
      const currentState: MDXViewerStateRef = {
        source,
        components: JSON.stringify(mergedComponents),
        remarkPlugins: mergedRemarkPlugins.length,
        rehypePlugins: mergedRehypePlugins.length,
      }

      let hasChanged = true
      if (prev) {
        hasChanged =
          prev.source !== currentState.source ||
          prev.components !== currentState.components ||
          prev.remarkPlugins !== currentState.remarkPlugins ||
          prev.rehypePlugins !== currentState.rehypePlugins
      }

      return { state: currentState, hasChanged }
    },
    [source, mergedComponents, mergedRemarkPlugins, mergedRehypePlugins]
  )

  useEffect(() => {
    let cancelled = false
    const { hasChanged } = detectChanges(compileRef.current)

    // Only recompile if the state has changed
    if (!hasChanged) return

    const compile = async () => {
      setIsCompiling(true)
      setCompilationError(null)

      try {
        const result = await processor.compile({
          source,
          components: mergedComponents,
          remarkPlugins: mergedRemarkPlugins,
          rehypePlugins: mergedRehypePlugins,
          development: process.env.NODE_ENV === 'development',
        })

        if (cancelled) return

        if (result.error) {
          setCompilationError(result.error)
          stableOnError(result.error)
        } else {
          setCompiledContent(result.content)
          stableOnCompile(result.metadata)
        }
      } catch (error) {
        if (cancelled) return
        const err = error instanceof Error ? error : new Error(String(error))
        setCompilationError(err)
        stableOnError(err)
      } finally {
        if (!cancelled) {
          setIsCompiling(false)
        }
      }
    }

    compile()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source])

  if (isCompiling) {
    return <LoadingComponent />
  }

  if (compilationError) {
    return <ErrorComponent error={compilationError} />
  }

  return (
    <div className="mdx-viewer font-sans" style={style}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MDXProvider components={mergedComponents as any}>
        <article className="mdx-article">{compiledContent}</article>
      </MDXProvider>
    </div>
  )
}

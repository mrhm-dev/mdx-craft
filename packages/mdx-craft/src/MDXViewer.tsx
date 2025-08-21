import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from './theme/utils.js'
import { animations } from './theme/classes.js'
import { MDXViewerProps, MDXViewerStateRef } from './types/viewer.js'
import { useMDXViewer } from './hooks/useMDXViewer.js'
import { HeadingMetadata, TOCItem } from './types/theme.js'
import { MDXProcessor } from './processor/MDXProcessor.js'
import { getGlobalRegistry } from './processor/ComponentRegistry.js'
import { MDXProvider } from '@mdx-js/react'
import * as CoreComponents from './components/viewer/core/index.js'
import { Pluggable } from 'unified'
import { CompilationResult } from './types/processor.js'
import { TOC } from './components/viewer/navigation/TOC.js'
import { HTMLComponents } from './components/viewer/html/index.js'

const DefaultLoader: FC = () => {
  return (
    <div className="flex items-center justify-center p-8 text-slate-500 dark:text-slate-400">
      <div className="text-center">
        <div
          className={cn(
            'w-8 h-8 border-2 border-slate-300 border-t-emerald-600 rounded-full mx-auto mb-4',
            animations.loading.spin
          )}
        />
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
  theme: instanceTheme,
  remarkPlugins: instanceRemarkPlugins = [],
  rehypePlugins: instanceRehypePlugins = [],
  generateTOC = true,
  showTOC = true,
  tocConfig = {},
  onCompile,
  onError,
  loadingComponent: LoadingComponent = DefaultLoader,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  className,
  style,
  useCache = true,
}) => {
  // Context
  const globalContext = useMDXViewer()

  // States
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledContent, setCompiledContent] = useState<ReactElement | null>(null)
  const [compilationError, setCompilationError] = useState<Error | null>(null)
  const [headings, setHeadings] = useState<HeadingMetadata[]>([])

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
        Accordion: CoreComponents.Accordion,
        Card: CoreComponents.Card,
        Tabs: CoreComponents.Tabs,
        CodeBlock: CoreComponents.CodeBlock,

        // TODO: Add more built in components here
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
        generateTOC: !!generateTOC,
        components: JSON.stringify(mergedComponents),
        remarkPlugins: mergedRemarkPlugins.length,
        rehypePlugins: mergedRehypePlugins.length,
      }

      let hasChanged = true
      if (prev) {
        hasChanged =
          prev.source !== currentState.source ||
          prev.generateTOC !== currentState.generateTOC ||
          prev.components !== currentState.components ||
          prev.remarkPlugins !== currentState.remarkPlugins ||
          prev.rehypePlugins !== currentState.rehypePlugins
      }

      return { state: currentState, hasChanged }
    },
    [source, generateTOC, mergedComponents, mergedRemarkPlugins, mergedRehypePlugins]
  )

  useEffect(() => {
    let cancelled = false
    const { hasChanged } = detectChanges(compileRef.current)

    // Only recompile if the state has changed
    if (!hasChanged) return

    // Update theme
    if (instanceTheme) {
      globalContext.updateTheme(instanceTheme)
    }

    const compile = async () => {
      setIsCompiling(true)
      setCompilationError(null)

      try {
        const result = await processor.compile({
          source,
          components: mergedComponents,
          remarkPlugins: mergedRemarkPlugins,
          rehypePlugins: mergedRehypePlugins,
          generateTOC,
          development: process.env.NODE_ENV === 'development',
        })

        if (cancelled) return

        if (result.error) {
          setCompilationError(result.error)
          stableOnError(result.error)
        } else {
          setCompiledContent(result.content)
          setHeadings(result.metadata.headings)
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

  const tocItems: TOCItem[] = useMemo(() => {
    return headings.map((heading) => ({
      id: heading.id,
      text: heading.text,
      level: heading.level,
    }))
  }, [headings])

  const typographyClasses = globalContext.getTypographyClasses(className)

  if (isCompiling) {
    return <LoadingComponent />
  }

  if (compilationError) {
    return <ErrorComponent error={compilationError} />
  }

  const displayTOC = showTOC && tocItems.length > 0
  const tocPosition = tocConfig.position || 'right'

  console.log('UseEffect')

  return (
    <div
      className={cn(
        'mdx-viewer',
        displayTOC && 'flex',
        displayTOC && tocPosition === 'left' ? 'flex-row-reverse' : 'flex-row',
        showTOC && 'gap-8'
      )}
      style={style}
    >
      {/* Main Content */}
      <div className={cn('mdx-viewer__content font-sans flex-grow min-w-0', typographyClasses)}>
        <MDXProvider components={mergedComponents}>
          <article className="mdx-article">{compiledContent}</article>
        </MDXProvider>
      </div>

      {/* Table of Contents */}
      {displayTOC && (
        <TOC
          items={tocItems}
          sticky={tocConfig.sticky || false}
          stickyOffset={tocConfig.stickyOffset || '4rem'}
          showNested={true}
          highlightActive={true}
          minLevel={tocConfig.minLevel || 1}
          maxLevel={tocConfig.maxLevel || 3}
          mobile={tocConfig.mobile || true}
        />
      )}
    </div>
  )
}

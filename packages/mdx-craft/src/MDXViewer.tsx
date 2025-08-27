/**
 * MDX Viewer Component - Enhanced with Hook-Based Architecture
 *
 * This component has been refactored to use a clean hook-based architecture
 * that provides better performance, maintainability, and extensibility.
 *
 * Key Features:
 * - **Component Registry with className overrides**: Automatic registration
 *   of core components with support for className customization per component
 * - **Compilation Hook**: Separated MDX compilation logic with proper
 *   change detection and caching
 * - **Virtualization Ready**: Includes reusable virtualization hook for
 *   future performance optimization
 * - **Clean JSX**: Minimal component logic with clear separation of concerns
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MDXViewer source={mdxContent} />
 *
 * // With className overrides
 * <MDXViewer
 *   source={mdxContent}
 *   classNameOverrides={{
 *     Card: 'custom-card-styles border-2',
 *     CodeBlock: 'bg-gray-900 text-white'
 *   }}
 * />
 *
 * // With custom components and plugins
 * <MDXViewer
 *   source={mdxContent}
 *   components={{ CustomComponent: MyComponent }}
 *   remarkPlugins={[remarkGfm]}
 *   rehypePlugins={[rehypeSlug]}
 * />
 * ```
 */

import { MDXProvider } from '@mdx-js/react'
import { FC } from 'react'
import { useComponentRegistry, useMDXCompilation } from './hooks/index.js'
import { MDXViewerProps } from './types/viewer.js'

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

/**
 * Enhanced MDXViewer component with hook-based architecture
 *
 * Renders MDX content with support for component registration, className overrides,
 * and performance optimizations through proper change detection and caching.
 */
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
  classNameOverrides,
}) => {
  // Use component registry hook with className overrides
  const { components } = useComponentRegistry({
    instanceComponents,
    classNameOverrides,
  })

  // Use compilation hook for clean logic separation
  const compilation = useMDXCompilation({
    source,
    components,
    remarkPlugins: instanceRemarkPlugins,
    rehypePlugins: instanceRehypePlugins,
    onCompile,
    onError,
    useCache,
  })

  // Clean JSX with minimal logic
  if (compilation.isLoading) {
    return <LoadingComponent />
  }

  if (compilation.error) {
    return <ErrorComponent error={compilation.error} />
  }

  return (
    <div className="mdx-viewer font-sans" style={style}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MDXProvider components={components as any}>
        <article className="mdx-article">{compilation.content}</article>
      </MDXProvider>
    </div>
  )
}

import type { PluggableList } from 'unified'
import type { ComponentRegistry } from './index.js'
import type { ComponentType, CSSProperties } from 'react'
import { CompilationResult } from './processor.js'

export type MDXViewerStateRef = {
  source: string
  components: string
  remarkPlugins: number
  rehypePlugins: number
}

export type MDXViewerProps = {
  source: string
  components?: ComponentRegistry
  remarkPlugins?: PluggableList[]
  rehypePlugins?: PluggableList[]
  onCompile?: (metadata: CompilationResult['metadata']) => void
  onError?: (error: Error) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadingComponent?: ComponentType<any>
  errorComponent?: ComponentType<{ error: Error }>
  className?: string
  style?: CSSProperties
  useCache?: boolean
}

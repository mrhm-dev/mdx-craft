import type { PluggableList } from 'unified'
import type { ComponentRegistry, PartialTheme, TOCConfig } from './theme.js'
import type { ComponentType, CSSProperties } from 'react'
import { CompilationResult } from './processor.js'

export type MDXViewerStateRef = {
  source: string
  generateTOC: boolean
  components: string
  remarkPlugins: number
  rehypePlugins: number
}

export type MDXViewerProps = {
  source: string
  components?: ComponentRegistry
  theme?: PartialTheme
  remarkPlugins?: PluggableList[]
  rehypePlugins?: PluggableList[]
  generateTOC?: boolean
  showTOC?: boolean
  tocConfig?: TOCConfig
  onCompile?: (metadata: CompilationResult['metadata']) => void
  onError?: (error: Error) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadingComponent?: ComponentType<any>
  errorComponent?: ComponentType<{ error: Error }>
  className?: string
  style?: CSSProperties
  useCache?: boolean
}

import React from 'react'
import { type PluggableList } from 'unified'
import type {
  CacheConfig,
  CompilationMetadata,
  ComponentRegistry,
  MDXComponent,
  Theme,
  TOCItem,
} from './theme.js'

export type MDXViewerProviderProps = {
  children: React.ReactNode
  components?: ComponentRegistry
  theme?: Partial<Theme>
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  cache?: CacheConfig
}

export type MDXViewerContextValue = {
  theme: Theme
  components: ComponentRegistry
  registerComponent: (name: string, component: MDXComponent) => void
  unregisterComponent: (name: string) => void
  cache: Required<CacheConfig>
  remarkPlugins: PluggableList
  rehypePlugins: PluggableList
  metadata?: CompilationMetadata
}

export type TOCContextValue = {
  items: TOCItem[]
  activeId: string | null
  scrollToHeading: (id: string) => void
  flatItems: TOCItem[]
  isVisible: boolean
  toggleVisibility: () => void
}

export type ThemeContextValue = {
  theme: Theme
  resetTheme: () => void
}

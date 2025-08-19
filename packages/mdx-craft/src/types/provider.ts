import React from 'react'
import { type PluggableList } from 'unified'
import type {
  CacheConfig,
  CompilationMetadata,
  ComponentRegistry,
  MDXComponent,
  PartialTheme,
  Theme,
  TOCItem,
} from './theme.js'

export type MDXViewerProviderProps = {
  children: React.ReactNode
  components?: ComponentRegistry
  theme?: PartialTheme
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  cache?: CacheConfig
}

export type MDXViewerContextValue = {
  theme: Theme
  components: ComponentRegistry
  registerComponent: (name: string, component: MDXComponent) => void
  unregisterComponent: (name: string) => void
  getComponentClasses: (
    variant: keyof Theme['components']['callout'],
    additionalClasses?: string
  ) => string
  getTypographyClasses: (additionalClasses?: string) => string
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
  updateTheme: (updates: PartialTheme) => void
  resetTheme: () => void
}

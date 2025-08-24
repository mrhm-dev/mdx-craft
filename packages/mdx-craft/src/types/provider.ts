import React from 'react'
import { type PluggableList } from 'unified'
import type { CacheConfig, CompilationMetadata, ComponentRegistry, MDXComponent } from './index.js'

export type MDXViewerProviderProps = {
  children: React.ReactNode
  components?: ComponentRegistry
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  cache?: CacheConfig
}

export type MDXViewerContextValue = {
  components: ComponentRegistry
  registerComponent: (name: string, component: MDXComponent) => void
  unregisterComponent: (name: string) => void
  cache: Required<CacheConfig>
  remarkPlugins: PluggableList
  rehypePlugins: PluggableList
  metadata?: CompilationMetadata
}

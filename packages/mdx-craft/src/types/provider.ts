import React from 'react'
import { type PluggableList } from 'unified'
import type { CacheConfig, CompilationMetadata, ComponentRegistry, MDXComponent } from './index.js'

export type ShikiConfig = {
  /** Languages to load (defaults to minimal set: js, ts, jsx, tsx, json, bash) */
  languages?: string[]
  /** Themes to use (defaults to github-light, github-dark) */
  themes?: string[]
  /** Auto-load languages when detected in code blocks */
  autoLoad?: boolean
}

export type MDXViewerProviderProps = {
  children: React.ReactNode
  components?: ComponentRegistry
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  cache?: CacheConfig
  shikiConfig?: ShikiConfig
}

export type MDXViewerContextValue = {
  components: ComponentRegistry
  registerComponent: (name: string, component: MDXComponent) => void
  unregisterComponent: (name: string) => void
  cache: Required<CacheConfig>
  remarkPlugins: PluggableList
  rehypePlugins: PluggableList
  shikiConfig?: ShikiConfig
  metadata?: CompilationMetadata
}

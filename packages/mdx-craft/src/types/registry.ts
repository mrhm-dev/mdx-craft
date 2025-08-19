/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, LazyExoticComponent } from 'react'

export type ComponentEntry = {
  name: string

  // Intentionally using any to allow for dynamic components
  component: ComponentType<any> | LazyExoticComponent<ComponentType<any>>
  loader?: () => Promise<any>
  category?: 'core' | 'callout' | 'navigation' | 'data' | 'media' | 'custom'
  override?: boolean
  description?: string
  examples?: string
}

export type ComponentLoaderResult = {
  default?: ComponentType<any>
  [key: string]: ComponentType<any> | undefined
}

export type RegistryConfig = {
  lazyLoad?: boolean
  allowOverrides?: boolean
  preload?: string[]
}

export type RegisterComponentOptions = {
  override?: boolean
  category?: ComponentEntry['category']
  description?: string
}

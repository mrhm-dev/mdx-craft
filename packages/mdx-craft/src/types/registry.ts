/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * MDX Component Type for TypeScript
 * Intentionally using any to allow for any component to be passed in
 */
export type MDXComponent = React.ComponentType<any>

/**
 * Component Registry
 * This is a record of components that can be used in the MDX content
 */
export type ComponentRegistry = Record<string, MDXComponent>

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

/**
 * Heading metadata for TOC generation
 */
export type HeadingMetadata = {
  /** Unique identifier for the heading */
  id: string
  /** Heading text content */
  text: string
  /** Heading level (1-6) */
  level: number
  /** Optional anchor slug */
  slug?: string
}

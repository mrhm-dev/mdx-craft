/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react'
import type { ComponentEntry, RegisterComponentOptions, RegistryConfig } from '../types/registry.js'

export class ComponentRegistry {
  private components: Map<string, ComponentEntry>
  private config: RegistryConfig
  private loadedComponents: Map<string, ComponentType<any>>

  constructor(config?: RegistryConfig) {
    this.components = new Map()
    this.loadedComponents = new Map()
    this.config = {
      lazyLoad: config?.lazyLoad ?? false,
      allowOverrides: config?.allowOverrides ?? true,
      preload: config?.preload ?? [],
    }

    // Initialize with core components
    this.initializeCoreComponents()

    // Preload components if specified
    if (this.config.preload && this.config.preload.length > 0) {
      this.preloadComponents(this.config.preload)
    }
  }

  register(
    name: string,
    component: ComponentType<any> | (() => Promise<ComponentType<any>>),
    options?: RegisterComponentOptions
  ): void {
    // Check if component is already registered
    if (this.components.has(name) && !options?.override && !this.config.allowOverrides) {
      console.warn(
        `Component ${name} is already registered. Use override: true to force registration.`
      )
      return
    }

    // Create a component entry
    // const isDirectComponent =
    //   typeof component === 'function' &&
    //   (component.prototype.isReactComponent ||
    //     component.toString().includes('createElement') ||
    //     component.name)

    const entry: ComponentEntry = {
      name,
      // For now we'll handle only direct components
      component: component as ComponentType<any>,
      loader: undefined, // Disabled lazy loading for now
      category: options?.category ?? 'custom',
      override: options?.override ?? false,
      description: options?.description,
    }

    this.components.set(name, entry)

    // Clear loaded component cache if overriding
    if (this.loadedComponents.has(name)) {
      this.loadedComponents.delete(name)
    }
  }

  registerBatch(
    components: Record<string, ComponentType<any> | (() => Promise<ComponentType<any>>)>,
    options?: RegisterComponentOptions
  ): void {
    Object.entries(components).forEach(([name, component]) => {
      this.register(name, component, options)
    })
  }

  unregister(name: string): void {
    this.components.delete(name)
    this.loadedComponents.delete(name)
  }

  get(name: string): ComponentType<any> | null {
    const entry = this.components.get(name)
    if (!entry) {
      console.warn(`Component ${name} not found in the registry.`)
      return null
    }
    return entry.component
  }

  getAll(): Record<string, ComponentType<any>> {
    const all: Record<string, ComponentType<any>> = {}
    this.components.forEach((_, name) => {
      const component = this.get(name)
      if (component) {
        all[name] = component
      }
    })
    return all
  }

  getByCategory(category: ComponentEntry['category']): Record<string, ComponentType<any>> {
    const filtered: Record<string, ComponentType<any>> = {}

    this.components.forEach((entry) => {
      if (entry.category === category) {
        const component = this.get(entry.name)
        if (component) {
          filtered[entry.name] = component
        }
      }
    })

    return filtered
  }

  has(name: string): boolean {
    return this.components.has(name)
  }

  list(): string[] {
    return Array.from(this.components.keys())
  }

  clear(): void {
    this.components.clear()
    this.loadedComponents.clear()
  }

  async preloadComponents(names: string[]): Promise<void> {
    const promises = names.map(async (name) => {
      const entry = this.components.get(name)
      if (entry?.loader) {
        try {
          const module = await entry.loader()
          const component = module.default || module[name]
          if (component) {
            this.loadedComponents.set(name, component)
          }
        } catch (error) {
          console.error(`Failed to load component ${name}:`, error)
        }
      } else {
        console.warn(`Component ${name} has no loader function.`)
      }
    })

    await Promise.all(promises)
  }

  private initializeCoreComponents(): void {}

  getStats() {
    const categories: Record<string, number> = {}

    this.components.forEach((entry) => {
      if (entry.category) {
        categories[entry.category] = (categories[entry.category] || 0) + 1
      }
    })

    return {
      total: this.components.size,
      categories,
      loaded: this.loadedComponents.size,
    }
  }
}

let globalRegistry: ComponentRegistry | null = null

export const getGlobalRegistry = (config?: RegistryConfig): ComponentRegistry => {
  if (!globalRegistry) {
    globalRegistry = new ComponentRegistry(config)
  }

  return globalRegistry
}

export const registerComponents = (
  components: Record<string, ComponentType<any> | (() => Promise<ComponentType<any>>)>,
  options?: RegisterComponentOptions
) => {
  const registry = getGlobalRegistry()
  registry.registerBatch(components, options)
}

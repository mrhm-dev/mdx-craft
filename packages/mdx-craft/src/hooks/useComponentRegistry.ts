/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import React from 'react'
import { HTMLComponents } from '../components/viewer/html/index.js'
import { getGlobalRegistry } from '../processor/ComponentRegistry.js'
import { useMDXViewer } from './useMDXViewer.js'
import { cn } from '../utils/index.js'
import type { ComponentRegistry } from '../types/index.js'
import type { ComponentClassNameOverrides } from '../types/viewer.js'
import {
  Card,
  CodeBlock,
  CodeBlockGroup,
  Expandable,
  Accordion,
  AccordionGroup,
  Note,
  Warning,
  Info,
  Tip,
  Check,
  Danger,
  Frame,
  Steps,
  Step,
  Tabs,
  Tab,
  Stack,
  VStack,
  HStack,
  Space,
  FolderStructure,
  Folder,
  File,
} from '../components/viewer/core/index.js'

const CORE_COMPONENTS = {
  Card,
  CodeBlock,
  CodeBlockGroup,
  Expandable,
  Accordion,
  AccordionGroup,
  Note,
  Warning,
  Info,
  Tip,
  Check,
  Danger,
  Frame,
  Steps,
  Step,
  Tabs,
  Tab,
  Stack,
  VStack,
  HStack,
  Space,
  FolderStructure,
  Folder,
  File,
}

export type UseComponentRegistryOptions = {
  instanceComponents?: ComponentRegistry
  classNameOverrides?: ComponentClassNameOverrides
}

export type UseComponentRegistryReturn = {
  components: ComponentRegistry
  registry: ReturnType<typeof getGlobalRegistry>
}

/**
 * Hook to manage component registration with className overrides
 *
 * @param options Configuration options for component registry
 * @returns Object containing merged components and registry instance
 *
 * @example
 * ```tsx
 * const { components } = useComponentRegistry({
 *   instanceComponents: { CustomCard: MyCard },
 *   classNameOverrides: {
 *     Card: 'my-custom-card-styles',
 *     CodeBlock: 'bg-gray-900 text-white'
 *   }
 * })
 * ```
 */
export const useComponentRegistry = (
  options: UseComponentRegistryOptions = {}
): UseComponentRegistryReturn => {
  const { instanceComponents = {}, classNameOverrides = {} } = options

  const globalContext = useMDXViewer()

  // Get registry and register builtin components
  const registry = useMemo(() => {
    const reg = getGlobalRegistry()

    if (!reg.has('Card')) {
      // Register core components
      reg.registerBatch(CORE_COMPONENTS, { category: 'core' })
    }

    return reg
  }, [])

  // Create components with className overrides applied
  const mergedComponents = useMemo(() => {
    const baseComponents = {
      ...HTMLComponents,
      ...globalContext.components,
      ...registry.getAll(),
      ...instanceComponents,
    }

    // Apply className overrides if provided
    if (Object.keys(classNameOverrides).length === 0) {
      return baseComponents
    }

    const componentsWithOverrides: ComponentRegistry = {}

    Object.entries(baseComponents).forEach(([name, Component]) => {
      const overrideClassName = classNameOverrides[name]

      if (overrideClassName && Component) {
        // Create wrapped component with className override
        const WrappedComponent = React.forwardRef<any, any>((props, ref) => {
          const { className: propClassName, ...restProps } = props

          // Use cn() to intelligently merge classNames
          // Order matters: override classes come first, then user prop classes can override them
          const finalClassName = cn(overrideClassName, propClassName)

          return React.createElement(Component as any, {
            ...restProps,
            className: finalClassName,
            ref,
          })
        })

        // Preserve component name for debugging
        WrappedComponent.displayName = `${name}WithOverride`
        componentsWithOverrides[name] = WrappedComponent
      } else {
        componentsWithOverrides[name] = Component
      }
    })

    return componentsWithOverrides
  }, [globalContext.components, registry, instanceComponents, classNameOverrides])

  return {
    components: mergedComponents,
    registry,
  }
}

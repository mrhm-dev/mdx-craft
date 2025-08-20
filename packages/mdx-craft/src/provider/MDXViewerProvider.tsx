import { FC, useCallback, useMemo, useState } from 'react'
import { MDXViewerContextValue, MDXViewerProviderProps } from '../types/provider.js'
import { createComponentClasses, createTheme, deepMerge } from '../theme/utils.js'
import {
  CacheConfig,
  ComponentRegistry,
  MDXComponent,
  PartialTheme,
  Theme,
} from '../types/theme.js'
import { MDXViewerContext } from './context.js'

export const MDXViewerProvider: FC<MDXViewerProviderProps> = ({
  children,
  components: initialComponents = {},
  theme: themeOverrides = {},
  remarkPlugins = [],
  rehypePlugins = [],
  cache = { enabled: true, maxSize: 10, ttl: 300000 },
}) => {
  // Generate the default theme with overrides
  // const theme = useMemo(() => createTheme(themeOverrides), [themeOverrides])
  const [theme, setTheme] = useState<Theme>(createTheme(themeOverrides))
  const [components, setComponents] = useState<ComponentRegistry>(initialComponents)

  const cacheConfig = useMemo<Required<CacheConfig>>(
    () => ({
      enabled: cache.enabled ?? true,
      maxSize: cache.maxSize ?? 10,
      ttl: cache.ttl ?? 300000,
    }),
    [cache]
  )

  const registerComponent = useCallback((name: string, component: MDXComponent) => {
    setComponents((prev) => ({ ...prev, [name]: component }))
  }, [])

  const unregisterComponent = useCallback((name: string) => {
    setComponents((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...rest } = prev
      return rest
    })
  }, [])

  const componentClassBuilder = useMemo(() => createComponentClasses(theme), [theme])

  const getComponentClasses = useCallback(
    (componentType: keyof Theme['components'], additionalClasses?: string) =>
      componentClassBuilder.buildComponentClasses(componentType, additionalClasses),
    [componentClassBuilder]
  )

  const getCalloutClasses = useCallback(
    (variant: keyof Theme['components']['callout'], additionalClasses?: string) =>
      componentClassBuilder.buildCalloutClasses(variant, additionalClasses),
    [componentClassBuilder]
  )

  const getTypographyClasses = useCallback(
    (additionalClasses?: string) => componentClassBuilder.buildContentClasses(additionalClasses),
    [componentClassBuilder]
  )

  const updateTheme = useCallback((newTheme: PartialTheme) => {
    setTheme((prev) => deepMerge(prev, newTheme as Theme))
  }, [])

  const contextValue: MDXViewerContextValue = useMemo(
    () => ({
      theme,
      components,
      registerComponent,
      unregisterComponent,
      getComponentClasses,
      getCalloutClasses,
      getTypographyClasses,
      cache: cacheConfig,
      remarkPlugins,
      rehypePlugins,
      updateTheme,
    }),
    [
      theme,
      components,
      registerComponent,
      unregisterComponent,
      getComponentClasses,
      getCalloutClasses,
      getTypographyClasses,
      cacheConfig,
      remarkPlugins,
      rehypePlugins,
      updateTheme,
    ]
  )

  return <MDXViewerContext.Provider value={contextValue}>{children}</MDXViewerContext.Provider>
}

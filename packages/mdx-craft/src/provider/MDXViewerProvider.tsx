import { FC, useCallback, useMemo, useState } from 'react'
import { MDXViewerContextValue, MDXViewerProviderProps } from '../types/provider.js'
import { CacheConfig, ComponentRegistry, MDXComponent, Theme } from '../types/theme.js'
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
  const [theme] = useState<Theme>(themeOverrides as Theme)
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

  const contextValue: MDXViewerContextValue = useMemo(
    () => ({
      theme,
      components,
      registerComponent,
      unregisterComponent,
      cache: cacheConfig,
      remarkPlugins,
      rehypePlugins,
    }),
    [
      theme,
      components,
      registerComponent,
      unregisterComponent,
      cacheConfig,
      remarkPlugins,
      rehypePlugins,
    ]
  )

  return <MDXViewerContext.Provider value={contextValue}>{children}</MDXViewerContext.Provider>
}

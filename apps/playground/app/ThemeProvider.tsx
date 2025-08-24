'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from 'next-themes'
import type { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  attribute?: NextThemeProviderProps['attribute']
  defaultTheme?: NextThemeProviderProps['defaultTheme']
  enableSystem?: NextThemeProviderProps['enableSystem']
}

export const ThemeProvider = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemesProvider>
  )
}

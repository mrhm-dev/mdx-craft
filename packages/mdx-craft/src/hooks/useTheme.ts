import type { Theme } from '../types/theme.js'
import { useMDXViewer } from './useMDXViewer.js'

export const useTheme = (): Theme => {
  const { theme } = useMDXViewer()

  if (!theme) {
    throw new Error('useTheme must be used within a MDXViewerProvider')
  }

  return theme
}

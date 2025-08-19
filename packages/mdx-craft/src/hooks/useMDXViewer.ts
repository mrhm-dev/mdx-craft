import { useContext } from 'react'
import type { MDXViewerContextValue } from '../types/provider.js'
import { MDXViewerContext } from '../provider/context.js'

export const useMDXViewer = (): MDXViewerContextValue => {
  const context = useContext(MDXViewerContext)

  if (!context) {
    throw new Error('useMDXViewer must be used within a MDXViewerProvider')
  }

  return context
}

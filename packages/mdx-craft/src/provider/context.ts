'use client'

import { createContext } from 'react'
import type { MDXViewerContextValue } from '../types/provider.js'

export const MDXViewerContext = createContext<MDXViewerContextValue | null>(null)
MDXViewerContext.displayName = 'MDXViewerContext'

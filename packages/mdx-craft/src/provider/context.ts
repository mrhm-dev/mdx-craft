'use client'

import { createContext } from 'react'
import type { MDXViewerContextValue, TOCContextValue } from '../types/provider.js'

export const MDXViewerContext = createContext<MDXViewerContextValue | null>(null)
MDXViewerContext.displayName = 'MDXViewerContext'

export const TOCContext = createContext<TOCContextValue | null>(null)
TOCContext.displayName = 'TOCContext'

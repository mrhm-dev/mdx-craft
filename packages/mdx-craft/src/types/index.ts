import React from 'react'

export * from './processor.js'
export * from './provider.js'
export * from './registry.js'
export * from './theme.js'
export * from './viewer.js'

export interface MDXPreviewProps {
  content: string
  components?: Record<string, React.ComponentType<unknown>>
  className?: string
}

export interface MDXEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  preview?: boolean
}

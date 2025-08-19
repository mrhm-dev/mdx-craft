import React from 'react'

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

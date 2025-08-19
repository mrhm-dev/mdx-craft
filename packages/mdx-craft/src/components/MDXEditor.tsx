import React from 'react'
import { MDXEditorProps } from '../types'
import { MDXPreview } from './MDXPreview'

export const MDXEditor: React.FC<MDXEditorProps> = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Write your MDX content here...', 
  preview = false 
}) => {
  return (
    <div className={`mdx-editor-container flex gap-4 ${className}`}>
      <div className="mdx-editor flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      </div>
      {preview && (
        <div className="mdx-preview-pane flex-1">
          <MDXPreview content={value} />
        </div>
      )}
    </div>
  )
}
import React from 'react'
import { MDXPreviewProps } from '../types'

export const MDXPreview: React.FC<MDXPreviewProps> = ({ 
  content, 
  components: _components = {}, 
  className = '' 
}) => {
  return (
    <div className={`mdx-preview ${className}`}>
      <div className="prose prose-slate max-w-none">
        {content}
      </div>
    </div>
  )
}
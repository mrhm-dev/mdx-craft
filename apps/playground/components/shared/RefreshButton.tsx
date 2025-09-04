'use client'

import { PlayIcon, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { useEditorStore } from '@/store/editorStore'

export const RefreshButton = () => {
  const { refreshPreview, isCompiling, hasChanges } = useEditorStore()

  return (
    <Button
      variant="ghost"
      onClick={refreshPreview}
      disabled={isCompiling}
      className={`gap-2 transition-all duration-300 ${hasChanges ? 'bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 animate-pulse' : ''}`}
    >
      {isCompiling ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <PlayIcon className="h-4 w-4" />
      )}
      <span>{isCompiling ? 'Compiling...' : 'Playground'}</span>
    </Button>
  )
}

'use client'

import { useEditorStore } from '@/store/editorStore'
import { Check, Copy, FileText, Hash, RotateCcw, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export const EditorContainer: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const {
    content,
    selectedExample,
    wordCount,
    charCount,
    hasChanges,
    scrollSyncEnabled,
    setContent,
    copyContent,
    resetContent,
    setEditorScrollPosition,
  } = useEditorStore()

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (scrollSyncEnabled) {
        const target = e.target as HTMLTextAreaElement
        setEditorScrollPosition(target.scrollTop, target.scrollLeft)
      }
    },
    [scrollSyncEnabled, setEditorScrollPosition]
  )

  const handleCopy = async () => {
    await copyContent()
    // Could add a toast notification here
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 h-12 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {selectedExample ? selectedExample.title : 'MDX Editor'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="hidden lg:flex items-center gap-1">
            <Type className="h-3 w-3" />
            <span>{wordCount} words</span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <Hash className="h-3 w-3" />
            <span>{charCount} chars</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              copied
                ? 'text-green-600 dark:text-green-400 bg-green-500/10'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="sr-only">Copy</span>
          </Button>
          {hasChanges && (
            <Button variant="ghost" size="icon" onClick={resetContent}>
              <RotateCcw className="h-3 w-3" />
              <span className="sr-only">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onScroll={handleScroll}
          placeholder="Start typing your MDX content here..."
          className="w-full h-full p-4 bg-background font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Menu, Github, Lightbulb } from 'lucide-react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { mdxExamples } from '@/data/examples'
import { useEditorStore } from '@/store/editorStore'
import { ToggleMode } from '../shared/ToggleMode'
import Link from 'next/link'
import { DOCS_URL, GITHUB_URL } from './config'
import { cn } from '@/lib/utils'

export const ExampleSheet = () => {
  const [open, setOpen] = useState(false)
  const { selectedExample, loadExample, refreshPreview } = useEditorStore()

  const handleLoadExample = async (example: (typeof mdxExamples)[0]) => {
    loadExample(example)
    setOpen(false) // Close the sheet
    await refreshPreview() // Auto-refresh preview
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Open examples">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 lg:w-96 p-4">
        <SheetHeader className="pb-4 lg:pb-0 -mx-2">
          <SheetTitle>MDX Examples</SheetTitle>
        </SheetHeader>

        {/* Mobile Navigation - Only visible on mobile */}
        <div className="lg:hidden mb-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <Link href={DOCS_URL} target="_blank">
              <Button variant="ghost" size="sm" className="h-8">
                Docs
              </Button>
            </Link>
            <Link href={GITHUB_URL} target="_blank">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <ToggleMode />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 items-center lg:hidden">
            <Lightbulb className="size-4" />
            <p className="text-sm text-muted-foreground">Examples</p>
          </div>

          <div className="space-y-0.5">
            {mdxExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleLoadExample(example)}
                className={cn(
                  'w-full text-left px-2 py-3 rounded-lg transition-all border',
                  selectedExample?.id === example.id
                    ? 'bg-zinc-900 text-white border-zinc-700'
                    : 'border-transparent hover:bg-muted/50'
                )}
              >
                <div>
                  <h3 className="font-medium text-sm mb-1">{example.title}</h3>
                  <p
                    className={`text-xs ${
                      selectedExample?.id === example.id ? 'text-zinc-300' : 'text-muted-foreground'
                    }`}
                  >
                    {example.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

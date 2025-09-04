import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mdxExamples } from '@/data/examples'

export type Example = {
  id: string
  title: string
  description: string
  content: string
}

type EditorState = {
  // Content
  content: string
  compiledContent: string
  lastCompiledContent: string

  // Selected example
  selectedExample: Example | null

  // Stats
  wordCount: number
  charCount: number

  // Preview settings
  viewport: 'desktop' | 'tablet' | 'mobile'
  zoomLevel: number
  isFullscreen: boolean

  // Loading state
  isCompiling: boolean

  // Change detection
  hasChanges: boolean

  // Actions
  setContent: (content: string) => void
  loadExample: (example: Example) => void
  refreshPreview: () => void
  copyContent: () => Promise<void>
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void
  setZoomLevel: (zoom: number) => void
  toggleFullscreen: () => void
  resetContent: () => void
  clearContent: () => void
}

const calculateStats = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const chars = text.length
  return { wordCount: words, charCount: chars }
}

const firstExample = mdxExamples[0]!
const firstExampleStats = calculateStats(firstExample.content)

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial state with first example
      content: firstExample.content,
      compiledContent: firstExample.content,
      lastCompiledContent: firstExample.content,
      selectedExample: firstExample,
      wordCount: firstExampleStats.wordCount,
      charCount: firstExampleStats.charCount,
      viewport: 'desktop',
      zoomLevel: 100,
      isFullscreen: false,
      isCompiling: false,
      hasChanges: false,

      // Actions
      setContent: (content: string) => {
        const stats = calculateStats(content)
        const { lastCompiledContent } = get()
        set({
          content,
          hasChanges: content !== lastCompiledContent,
          ...stats,
        })
      },

      loadExample: (example: Example) => {
        const stats = calculateStats(example.content)
        set({
          content: example.content,
          selectedExample: example,
          hasChanges: true,
          ...stats,
        })
      },

      refreshPreview: async () => {
        const { content } = get()
        set({ isCompiling: true })

        // Simulate compilation delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 300))

        set({
          compiledContent: content,
          lastCompiledContent: content,
          hasChanges: false,
          isCompiling: false,
        })
      },

      copyContent: async () => {
        const { content } = get()
        try {
          await navigator.clipboard.writeText(content)
        } catch (error) {
          console.error('Failed to copy content:', error)
        }
      },

      setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => {
        set({ viewport })
      },

      setZoomLevel: (zoomLevel: number) => {
        set({ zoomLevel })
      },

      toggleFullscreen: () => {
        set((state) => ({ isFullscreen: !state.isFullscreen }))
      },

      resetContent: () => {
        set((state) => ({
          content: state.selectedExample?.content || state.content || '',
          hasChanges: false,
        }))
      },

      clearContent: () => {
        set({
          content: '',
          compiledContent: '',
          lastCompiledContent: '',
          selectedExample: null,
          wordCount: 0,
          charCount: 0,
          hasChanges: false,
        })
      },
    }),
    {
      name: 'mdx-editor-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        content: state.content,
        viewport: state.viewport,
        zoomLevel: state.zoomLevel,
        selectedExample: state.selectedExample,
        compiledContent: state.compiledContent,
        lastCompiledContent: state.lastCompiledContent,
      }),
    }
  )
)

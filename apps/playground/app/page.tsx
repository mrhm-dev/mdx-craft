'use client'

import { useState } from 'react'
import { EditorContainer } from '@/components/layout/EditorContainer'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { PreviewContainer } from '@/components/layout/PreviewContainer'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { Code2, Eye } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export default function Home() {
  const [mobileActiveTab, setMobileActiveTab] = useState<'editor' | 'preview'>('editor')
  const { hasChanges, refreshPreview } = useEditorStore()

  const handleMobileTabSwitch = async (tab: 'editor' | 'preview') => {
    if (tab === 'preview' && hasChanges) {
      await refreshPreview()
    }
    setMobileActiveTab(tab)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Fixed Header */}
      <header className="h-16 bg-background/10 border-b border-border sticky top-0 left-0 right-0 z-10">
        <Header />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Layout - Tabbed Interface */}
        <div className="block lg:hidden h-full">
          {/* Mobile Tab Switcher */}
          <div className="flex border-b border-border bg-muted/20">
            <Button
              variant={mobileActiveTab === 'editor' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleMobileTabSwitch('editor')}
              className="flex-1 rounded-none gap-2 h-10"
            >
              <Code2 className="h-4 w-4" />
              Editor
            </Button>
            <Button
              variant={mobileActiveTab === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleMobileTabSwitch('preview')}
              className="flex-1 rounded-none gap-2 h-10"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>

          {/* Mobile Content */}
          <div className="h-[calc(100%-40px)]">
            {mobileActiveTab === 'editor' ? <EditorContainer /> : <PreviewContainer />}
          </div>
        </div>

        {/* Desktop Layout - Resizable Panels */}
        <div className="hidden lg:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={25}>
              <EditorContainer />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={25}>
              <PreviewContainer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="h-12 bg-background/10 border-t border-border sticky bottom-0 left-0 right-0 z-10">
        <Footer />
      </footer>
    </div>
  )
}

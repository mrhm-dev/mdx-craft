'use client'

import { useEditorStore } from '@/store/editorStore'
import { Button } from '@/components/ui/button'
import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dynamic from 'next/dynamic'

const MDXViewer = dynamic(() => import('@sl/mdx-craft').then((mod) => mod.MDXViewer), {
  ssr: false,
})

export const PreviewContainer: React.FC = () => {
  const {
    compiledContent,
    viewport,
    zoomLevel,
    isFullscreen,
    setViewport,
    setZoomLevel,
    toggleFullscreen,
  } = useEditorStore()

  const zoomLevels = [50, 75, 100, 125, 150]

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel)
    if (currentIndex < zoomLevels.length - 1) {
      setZoomLevel(zoomLevels[currentIndex + 1]!)
    }
  }

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoomLevel)
    if (currentIndex > 0) {
      setZoomLevel(zoomLevels[currentIndex - 1]!)
    }
  }

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      default:
        return 'w-full'
    }
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-background flex flex-col'
    : 'w-full h-full flex flex-col'

  return (
    <div className={containerClasses}>
      {/* Preview Header */}
      <div className="hidden lg:flex items-center justify-between px-4 h-12 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          {/* Viewport Controls */}
          <div className="flex items-center gap-1 p-1 bg-background rounded-md">
            <Button
              variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('desktop')}
              className="h-7 w-7 p-0"
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('tablet')}
              className="h-7 w-7 p-0"
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('mobile')}
              className="h-7 w-7 p-0"
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="h-7 w-7 p-0"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>

            <Select
              value={zoomLevel.toString()}
              onValueChange={(value) => setZoomLevel(Number(value))}
            >
              <SelectTrigger size="sm" className="h-7 w-20 text-xs bg-background!">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {zoomLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    {level}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="h-7 w-7 p-0"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="h-7 w-7 p-0"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-background p-4 lg:p-8">
        <div className={`${getViewportStyles()} mx-auto`}>
          {/* Device Frame for mobile/tablet */}
          {viewport !== 'desktop' && (
            <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
              <div className="px-3 py-1.5 bg-muted/50 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    {viewport === 'mobile' ? '375 × 667' : '768 × 1024'}
                  </span>
                </div>
              </div>
              <div
                className="p-4 bg-background prose prose-sm prose-neutral dark:prose-invert max-w-none"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
              >
                {compiledContent ? (
                  <MDXViewer source={compiledContent} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground not-prose">
                    <p className="text-lg">No preview available</p>
                    <p className="text-xs mt-2">Click refresh to compile MDX</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop View */}
          {viewport === 'desktop' && (
            <div
              className="bg-background prose prose-sm prose-neutral dark:prose-invert max-w-none"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
            >
              {compiledContent ? (
                <MDXViewer source={compiledContent} />
              ) : (
                <div className="text-center py-8 text-muted-foreground not-prose">
                  <p className="text-lg">No preview available</p>
                  <p className="text-xs mt-2">Click refresh to compile MDX</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

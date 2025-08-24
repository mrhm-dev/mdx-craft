'use client'

import { MDXViewer, TOC } from 'mdx-craft'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { comprehensiveSource } from '../content'

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="min-h-screen dark:bg-zinc-950">
      <header className="px-4 h-16 bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="container mx-auto flex justify-between items-center h-full">
          <Link href="/" className="text-zinc-900 dark:text-zinc-100">
            <span className="text-xl font-semibold font-sans">Playground</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <div className="flex justify-center w-full min-h-screen">
        <div className="flex w-full max-w-screen-2xl">
          {/* Main content - shrinks as needed */}
          <main className="flex-1 px-4 py-8 min-w-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-4 mb-2">
                <h1 className="text-3xl font-semibold font-sans">
                  MDX Craft: The Modern React MDX Rendering Solution
                </h1>
              </div>
              <div className="overflow-x-hidden">
                <MDXViewer source={comprehensiveSource} />
              </div>
            </div>
          </main>

          {/* TOC sidebar - fixed width, hides on small screens */}
          <aside className="hidden md:block w-64 flex-shrink-0 pr-8 py-8">
            <div className="sticky top-20">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                On this page
              </div>
              <TOC
                minLevel={2}
                maxLevel={3}
                scrollOffset={90}
                showLoading
                className="max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = (resolvedTheme || theme) === 'dark'

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      {isDark ? (
        // Moon icon for dark mode
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      )}
    </button>
  )
}

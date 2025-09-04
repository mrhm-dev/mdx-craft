'use client'

import Link from 'next/link'
import { ExampleSheet } from './ExampleSheet'
import { ToggleMode } from '../shared/ToggleMode'
import { RefreshButton } from '../shared/RefreshButton'
import { Button } from '../ui/button'
import { Github } from 'lucide-react'
import { DOCS_URL, GITHUB_URL } from './config'

export const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 h-full">
      {/* Logo and Branding */}
      <div className="flex items-center gap-2 flex-1">
        <ExampleSheet />
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent select-none">
            MDX Craft
          </h1>
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 justify-center">
        <RefreshButton />
      </div>

      {/* Navigation */}
      <div className="items-center gap-2 hidden lg:flex flex-1 justify-end">
        <Link href={DOCS_URL} target="_blank">
          <Button variant="ghost">Docs</Button>
        </Link>
        <Link href={GITHUB_URL} target="_blank">
          <Button variant="ghost" size="icon">
            <Github />
          </Button>
        </Link>
        <ToggleMode />
      </div>
    </div>
  )
}

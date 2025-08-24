'use client'

import { useState } from 'react'
import type { FC, SVGProps, ComponentType } from 'react'
import { CheckIcon } from '../icons/CheckIcon.js'
import { cn } from '../../utils/index.js'

type CopyButtonProps = {
  value: string | (() => string) | Promise<string>
  standbyIcon: ComponentType<SVGProps<SVGSVGElement>>
  className?: string
}

export const CopyButton: FC<CopyButtonProps> = ({
  value,
  standbyIcon: StandbyIcon,
  className = '',
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const text = await (typeof value === 'function' ? value() : value)
      if (!text) return

      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1200)
    } catch {
      // Optionally handle error
      console.error('Failed to copy code')
    }
  }

  return (
    <button
      type="button"
      aria-label={isCopied ? 'Copied!' : 'Copy'}
      className={cn(
        className,
        'p-1.5 rounded-md transition-all duration-200',
        isCopied
          ? 'text-green-600 dark:text-green-400 bg-green-500/10'
          : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
      )}
      onClick={handleCopy}
    >
      {isCopied ? <CheckIcon className="w-4 h-4" /> : <StandbyIcon className="w-4 h-4" />}
    </button>
  )
}

import { FC } from 'react'
import { cn } from '../../utils/index.js'

export const LanguageBadge: FC<{ language: string; variant?: 'default' | 'terminal' }> = ({
  language,
  variant = 'default',
}) => {
  const isTerminal = variant === 'terminal' || language === 'bash' || language === 'shell'

  return (
    <span
      className={cn(
        'px-2.5 py-1 text-xs font-semibold rounded-md capitalize select-none',
        'transition-all duration-200',
        isTerminal
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
          : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30'
      )}
    >
      {language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
    </span>
  )
}

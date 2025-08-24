import { FC, HTMLAttributes } from 'react'
import { cn } from '../../../utils/index.js'

type HorizontalRuleProps = HTMLAttributes<HTMLHRElement>

export const HorizontalRule: FC<HorizontalRuleProps> = ({ className, ...props }) => {
  return (
    <hr
      {...props}
      className={cn(
        'my-8 border-0 h-px',
        'bg-gradient-to-r from-transparent via-zinc-300 to-transparent',
        'dark:via-zinc-600',
        className
      )}
    />
  )
}

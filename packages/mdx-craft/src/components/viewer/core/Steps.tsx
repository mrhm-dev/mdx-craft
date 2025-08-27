'use client'

import React, { useState, useRef, useEffect, FC } from 'react'
import { cn } from '../../../utils/index.js'
import { ChevronIcon } from '../../icons/ChevronIcon.js'

/**
 * Props for the Step component
 * @interface StepProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The title/heading text displayed for this step */
  title: string
  /** The content to display within the step */
  children?: React.ReactNode
  /** Additional CSS classes to apply to the step container */
  className?: string
  /** The step number (automatically provided by Steps component) */
  stepNumber?: number
  /** Whether this is the last step (automatically provided by Steps component) */
  isLast?: boolean
}

/**
 * Step component for displaying a single step in a list
 * @param {StepProps} props - The props for the Step component
 * @returns {JSX.Element} The rendered Step component
 * @example
 * ```tsx
 * <Step title="Step 1">
 *   <p>This is the content for step 1</p>
 * </Step>
 * ```
 */
export const Step: FC<StepProps> = ({
  title,
  children,
  className,
  stepNumber = 1,
  isLast = false,
  ...props
}) => {
  return (
    <div className={cn('relative', !isLast && 'pb-10', className)} {...props}>
      <div className="flex">
        {/* Left side with number and line */}
        <div className="flex flex-col items-center mr-4 md:mr-6 lg:mr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900/80">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {stepNumber}
            </span>
          </div>
        </div>

        {/* Right side with content */}
        <div className="flex-1 -mt-0.5">
          <h4 className="mb-2 font-semibold text-base text-foreground">{title}</h4>
          {children && (
            <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
          )}
        </div>
      </div>

      {/* Extended line for spacing between steps */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-zinc-100 dark:bg-zinc-900/70 -translate-x-1/2" />
      )}
    </div>
  )
}

/**
 * Props for the Steps container component
 * @interface StepsProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The Step components to render within this container */
  children: React.ReactNode
  /** Additional CSS classes to apply to the steps container */
  className?: string
  /** Whether the steps list can be collapsed when content exceeds maxHeight */
  collapsible?: boolean
  /** Whether the steps should start in a collapsed state */
  defaultCollapsed?: boolean
  /** The maximum height (in pixels) before showing expand/collapse controls */
  maxHeight?: number
}

/**
 * Steps component for displaying a list of steps
 * @param {StepsProps} props - The props for the Steps component
 * @returns {JSX.Element} The rendered Steps component
 * @example
 * ```tsx
 * <Steps>
 *   <Step title="Step 1">
 *     <p>This is the content for step 1</p>
 *   </Step>
 *   <Step title="Step 2">
 *     <p>This is the content for step 2</p>
 *   </Step>
 * </Steps>
 * ```
 */
export function Steps({
  children,
  className,
  collapsible = true,
  defaultCollapsed = true,
  maxHeight = 400,
  ...props
}: StepsProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [shouldShowToggle, setShouldShowToggle] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && collapsible) {
      const height = contentRef.current.scrollHeight
      setShouldShowToggle(height > maxHeight)
    }
  }, [children, maxHeight, collapsible])

  const childrenArray = React.Children.toArray(children)
  const stepsToShow = isCollapsed && shouldShowToggle ? childrenArray.slice(0, 3) : childrenArray

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={contentRef}
        className={cn(
          'relative transition-all duration-300 ease-in-out',
          isCollapsed && shouldShowToggle && 'overflow-hidden'
        )}
        style={{
          maxHeight: isCollapsed && shouldShowToggle ? '400px' : undefined,
        }}
      >
        {React.Children.map(stepsToShow, (child, index) => {
          if (React.isValidElement(child)) {
            const actualIndex = index
            const isLastVisible = index === stepsToShow.length - 1
            const isActuallyLast = actualIndex === childrenArray.length - 1

            return React.cloneElement(child as React.ReactElement<StepProps>, {
              stepNumber: actualIndex + 1,
              isLast: isActuallyLast || (isCollapsed && isLastVisible),
              className: cn(child.props.className),
            })
          }
          return child
        })}

        {/* Fade overlay when collapsed */}
        {isCollapsed && shouldShowToggle && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      {/* Toggle button */}
      {shouldShowToggle && collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
          )}
        >
          {isCollapsed ? (
            <>
              <ChevronIcon className="h-4 w-4 animate-in fade-in-0 duration-300" />
              Show {childrenArray.length - 3} more steps
            </>
          ) : (
            <>
              <ChevronIcon className="h-4 w-4 rotate-180 animate-in fade-in-0 duration-300" />
              Show less
            </>
          )}
        </button>
      )}
    </div>
  )
}

'use client'

import React, { FC, useState } from 'react'
import { cn } from '../../../utils/index.js'
import { FolderIcon } from '../../icons/FolderIcon.js'
import { FileIcon } from '../../icons/FileIcon.js'
import { ImageIcon } from '../../icons/ImageIcon.js'
import { ChevronIcon } from '../../icons/ChevronIcon.js'

/**
 * Props for the File component
 * @interface FileProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface FileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The name of the file */
  name: string
  /** Whether this is an image file */
  image?: boolean
  /** Additional CSS classes to apply to the file item */
  className?: string
  /** The depth level (automatically provided by Folder component) */
  depth?: number
  /** Whether this is the last item in the current level (automatically provided by Folder component) */
  isLast?: boolean
}

/**
 * Props for the Folder component
 * @interface FolderProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface FolderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The name of the folder */
  name: string
  /** The files and subfolders within this folder */
  children?: React.ReactNode
  /** Additional CSS classes to apply to the folder item */
  className?: string
  /** The depth level (automatically provided by parent Folder component) */
  depth?: number
  /** Whether this is the last item in the current level */
  isLast?: boolean
  /** Whether this is the root level folder */
  isRoot?: boolean
  /** Whether the folder starts in a collapsed state */
  defaultCollapsed?: boolean
}

/**
 * File component for displaying a file in the folder structure
 * @param {FileProps} props - The props for the File component
 * @returns {JSX.Element} The rendered File component
 * @example
 * ```tsx
 * <File name="package.json" />
 * <File name="logo.png" image />
 * ```
 */
export const File: FC<FileProps> = ({
  name,
  image = false,
  className,
  depth = 0,
  isLast, // Destructure to exclude from DOM props
  ...props
}) => {
  const Icon = image ? ImageIcon : FileIcon

  return (
    <div
      className={cn('flex items-center gap-2 py-1', className)}
      style={{ paddingLeft: `${depth * 1.5}rem` }}
      {...props}
    >
      <Icon className={cn('h-4 w-4 shrink-0', image ? 'text-purple-500' : 'text-blue-500')} />
      <span className="text-sm text-foreground font-mono">{name}</span>
    </div>
  )
}

/**
 * Folder component for displaying a folder in the folder structure
 * @param {FolderProps} props - The props for the Folder component
 * @returns {JSX.Element} The rendered Folder component
 * @example
 * ```tsx
 * <Folder name="src">
 *   <File name="index.ts" />
 *   <Folder name="components">
 *     <File name="Button.tsx" />
 *   </Folder>
 * </Folder>
 * 
 * // Collapsed by default
 * <Folder name="node_modules" defaultCollapsed>
 *   <File name="package1" />
 *   <File name="package2" />
 * </Folder>
 * ```
 */
export const Folder: FC<FolderProps> = ({
  name,
  children,
  className,
  depth = 0,
  isLast = false,
  isRoot = false,
  defaultCollapsed = false,
  ...props
}) => {
  const hasChildren = React.Children.count(children) > 0
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const toggleCollapsed = () => {
    if (hasChildren) {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        className={cn(
          'flex items-center gap-2 py-1',
          isRoot && 'font-semibold',
          hasChildren && 'cursor-pointer hover:bg-muted/50 rounded-sm transition-colors'
        )}
        style={{ paddingLeft: isRoot ? '0' : `${depth * 1.5}rem` }}
        onClick={toggleCollapsed}
      >
        {/* Chevron icon for collapsible folders */}
        {hasChildren && (
          <ChevronIcon
            className={cn(
              'h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200',
              !isCollapsed && 'rotate-90'
            )}
          />
        )}
        {/* Spacer for folders without children to align with expandable folders */}
        {!hasChildren && <div className="w-3" />}
        
        <FolderIcon className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="text-sm text-foreground font-mono">{name}</span>
      </div>

      {hasChildren && !isCollapsed && (
        <div className="relative">
          {/* Vertical line for folder structure */}
          {!isLast && depth > 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${(depth - 1) * 1.5 + 0.5}rem` }}
            />
          )}

          {/* Children */}
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              const childrenArray = React.Children.toArray(children)
              const isLastChild = index === childrenArray.length - 1

              // Clone the child with depth information
              return React.cloneElement(child as React.ReactElement<FolderProps | FileProps>, {
                depth: depth + 1,
                isLast: isLastChild,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                className: cn((child.props as any).className),
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Props for the FolderStructure container component
 * @interface FolderStructureProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface FolderStructureProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The Folder and File components to render within this container */
  children: React.ReactNode
  /** Additional CSS classes to apply to the folder structure container */
  className?: string
}

/**
 * FolderStructure component for displaying a folder tree structure
 * @param {FolderStructureProps} props - The props for the FolderStructure component
 * @returns {JSX.Element} The rendered FolderStructure component
 * @example
 * ```tsx
 * <FolderStructure>
 *   <Folder name="project-root">
 *     <File name="package.json" />
 *     <File name="README.md" />
 *     <Folder name="src">
 *       <File name="index.ts" />
 *       <Folder name="components">
 *         <File name="Button.tsx" />
 *         <File name="Card.tsx" />
 *       </Folder>
 *     </Folder>
 *     <Folder name="public">
 *       <File name="logo.png" image />
 *     </Folder>
 *   </Folder>
 * </FolderStructure>
 * ```
 */
export function FolderStructure({
  children,
  className,
  ...props
}: FolderStructureProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 my-4 overflow-x-auto',
        className
      )}
      {...props}
    >
      <div className="font-mono text-sm">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Mark the root level folders
            return React.cloneElement(child as React.ReactElement<FolderProps>, {
              depth: 0,
              isRoot: true,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              className: cn((child.props as any).className),
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

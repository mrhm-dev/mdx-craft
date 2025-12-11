'use client'

import React, { FC, useState, createContext, useContext, useMemo, useCallback } from 'react'
import { cn } from '../../../utils/index.js'
import { FolderIcon } from '../../icons/FolderIcon.js'
import { FileIcon } from '../../icons/FileIcon.js'
import { ImageIcon } from '../../icons/ImageIcon.js'
import { ChevronIcon } from '../../icons/ChevronIcon.js'

/**
 * Context for managing folder collapsed states
 */
type FolderStateContextType = {
  collapsedState: Record<string, boolean>
  toggleFolder: (path: string) => void
}

const FolderStateContext = createContext<FolderStateContextType | null>(null)

/**
 * Hook to use folder state context
 */
const useFolderState = () => {
  const context = useContext(FolderStateContext)
  if (!context) {
    throw new Error('useFolderState must be used within FolderStructure')
  }
  return context
}

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
  /** The path for tracking folder state (automatically provided) */
  _folderPath?: string
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
  isLast: _isLast,
  ...props
}) => {
  const Icon = image ? ImageIcon : FileIcon

  return (
    <div
      className={cn(
        'relative flex items-center py-0.5 hover:bg-muted/30 rounded transition-colors',
        className
      )}
      style={{ paddingLeft: `${depth * 1.25}rem` }}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className={cn('h-4 w-4 shrink-0', image ? 'text-purple-500' : 'text-blue-500')} />
        <span className="text-sm text-foreground font-mono truncate">{name}</span>
      </div>
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
  isLast: _isLast = false,
  isRoot = false,
  defaultCollapsed = false,
  _folderPath = '',
  ...props
}) => {
  const hasChildren = React.Children.count(children) > 0
  const { collapsedState, toggleFolder } = useFolderState()
  const [isHovered, setIsHovered] = useState(false)

  // Generate unique path for this folder
  const folderPath = _folderPath ? `${_folderPath}/${name}` : name

  // Get collapsed state from context, fallback to defaultCollapsed
  const isCollapsed = collapsedState[folderPath] ?? defaultCollapsed

  const handleToggle = useCallback(() => {
    if (hasChildren) {
      toggleFolder(folderPath)
    }
  }, [hasChildren, folderPath, toggleFolder])

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        className={cn(
          'relative flex items-center justify-between py-0.5 rounded transition-colors group',
          isRoot && 'font-semibold',
          hasChildren && 'cursor-pointer hover:bg-muted/30'
        )}
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FolderIcon className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="text-sm text-foreground font-mono truncate">{name}</span>
        </div>

        {/* Chevron on the right - show on hover or when expanded */}
        {hasChildren && (isHovered || !isCollapsed) && (
          <ChevronIcon
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all duration-200 mr-2',
              isCollapsed ? '-rotate-90' : 'rotate-0'
            )}
          />
        )}
      </div>

      {hasChildren && !isCollapsed && (
        <div className="relative">
          {/* Vertical line connecting children - positioned at folder icon */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border/30"
            style={{
              left: `${depth * 1.25 + 0.5}rem`,
            }}
          />

          {/* Children */}
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              const childrenArray = React.Children.toArray(children)
              const isLastChild = index === childrenArray.length - 1

              // Preserve all original props and pass folder path for context
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const childProps = child.props as any
              return React.cloneElement(child as React.ReactElement<FolderProps | FileProps>, {
                key: childProps.name || index,
                depth: depth + 1,
                isLast: isLastChild,
                className: cn(childProps.className),
                _folderPath: folderPath,
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
export function FolderStructure({ children, className, ...props }: FolderStructureProps) {
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({})

  const toggleFolder = useCallback((path: string) => {
    setCollapsedState((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }, [])

  const contextValue = useMemo(
    () => ({
      collapsedState,
      toggleFolder,
    }),
    [collapsedState, toggleFolder]
  )

  return (
    <FolderStateContext.Provider value={contextValue}>
      <div
        className={cn(
          'rounded-lg border border-border bg-card p-4 my-4 overflow-x-auto',
          className
        )}
        {...props}
      >
        <div className="font-mono text-sm">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              // Mark the root level folders and add key for React identity
              return React.cloneElement(child as React.ReactElement<FolderProps>, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                key: (child.props as any).name || index,
                depth: 0,
                isRoot: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                className: cn((child.props as any).className),
                _folderPath: '',
              })
            }
            return child
          })}
        </div>
      </div>
    </FolderStateContext.Provider>
  )
}

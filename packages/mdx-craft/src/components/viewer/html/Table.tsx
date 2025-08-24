'use client'

import { FC, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'

type TableProps = {
  children: ReactNode
  className?: string
}

type TableSectionProps = {
  children: ReactNode
  className?: string
}

type TableRowProps = {
  children: ReactNode
  className?: string
}

type TableCellProps = {
  children: ReactNode
  className?: string
}

/**
 * Professional Table component for MDX Viewer
 */
export const Table: FC<TableProps> = ({ children, className }) => {
  return (
    <div className="my-6 overflow-x-auto">
      <table
        className={cn(
          'w-full min-w-full border-collapse',
          'bg-white dark:bg-slate-800',
          'border border-slate-200 dark:border-slate-700',
          'rounded-lg overflow-hidden',
          'shadow-sm',
          className
        )}
      >
        {children}
      </table>
    </div>
  )
}

/**
 * Professional Table Header component for MDX Viewer
 */
export const TableHead: FC<TableSectionProps> = ({ children, className }) => {
  return <thead className={cn('bg-slate-50 dark:bg-slate-800/50', className)}>{children}</thead>
}

/**
 * Professional Table Body component for MDX Viewer
 */
export const TableBody: FC<TableSectionProps> = ({ children, className }) => {
  return (
    <tbody className={cn('divide-y divide-slate-200 dark:divide-slate-700', className)}>
      {children}
    </tbody>
  )
}

/**
 * Professional Table Row component for MDX Viewer
 */
export const TableRow: FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={cn(
        'hover:bg-slate-50 dark:hover:bg-slate-800/50',
        'transition-colors duration-150',
        className
      )}
    >
      {children}
    </tr>
  )
}

/**
 * Professional Table Header Cell component for MDX Viewer
 */
export const TableHeaderCell: FC<TableCellProps> = ({ children, className }) => {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left',
        'text-sm font-semibold',
        'text-slate-900 dark:text-slate-100',
        'border-b border-slate-200 dark:border-slate-700',
        className
      )}
    >
      {children}
    </th>
  )
}

/**
 * Professional Table Data Cell component for MDX Viewer
 */
export const TableDataCell: FC<TableCellProps> = ({ children, className }) => {
  return (
    <td
      className={cn(
        'px-4 py-3',
        'text-sm text-slate-700 dark:text-slate-300',
        'border-b border-slate-200 dark:border-slate-700 last:border-b-0',
        className
      )}
    >
      {children}
    </td>
  )
}

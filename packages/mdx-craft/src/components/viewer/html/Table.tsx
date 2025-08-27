import { FC, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/index.js'

type TableProps = HTMLAttributes<HTMLTableElement> & {
  children?: ReactNode
}

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement> & {
  children?: ReactNode
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  children?: ReactNode
}

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  children?: ReactNode
}

// Slim, modern, open table with zinc, only bottom borders, all columns separated, slightly more vertical padding
export const Table: FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="my-8 overflow-x-auto">
      <table
        {...props}
        className={cn(
          'w-full min-w-0 border-0 text-base',
          'bg-transparent',
          'align-middle',
          className
        )}
      >
        {children}
      </table>
    </div>
  )
}

export const TableHead: FC<TableSectionProps> = ({ children, className, ...props }) => {
  return (
    <thead {...props} className={cn('bg-transparent', className)}>
      {children}
    </thead>
  )
}

export const TableBody: FC<TableSectionProps> = ({ children, className, ...props }) => {
  return (
    <tbody {...props} className={cn('', className)}>
      {children}
    </tbody>
  )
}

export const TableRow: FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr
      {...props}
      className={cn(
        'even:bg-muted/15', // Alternative row background
        'hover:bg-muted/25',
        'transition-colors duration-100',
        className
      )}
    >
      {children}
    </tr>
  )
}

export const TableHeaderCell: FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <th
      {...props}
      className={cn(
        'px-3 py-2.5 text-left font-semibold tracking-tight',
        'text-foreground',
        'bg-muted/10', // Subtle header background
        'border-b border-border',
        'border-r border-border/50 last:border-r-0', // Thin vertical borders
        'break-words',
        className
      )}
      scope="col"
    >
      {children}
    </th>
  )
}

export const TableDataCell: FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td
      {...props}
      className={cn(
        'px-3 py-2.5',
        'text-muted-foreground',
        'bg-transparent',
        'border-b border-border/30', // Subtle horizontal border
        'border-r border-border/30 last:border-r-0', // Thin vertical borders
        'align-middle',
        'break-words',
        className
      )}
    >
      {children}
    </td>
  )
}

export const TableFooter: FC<TableSectionProps> = ({ children, className, ...props }) => {
  return (
    <tfoot {...props} className={cn('bg-transparent', className)}>
      {children}
    </tfoot>
  )
}

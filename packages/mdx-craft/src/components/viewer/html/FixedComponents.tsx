'use client'

import { FC, ReactNode, HTMLAttributes, AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { cn } from '../../../theme/utils.js'

// Fixed type definitions that extend proper HTML attributes
type ListProps = HTMLAttributes<HTMLUListElement | HTMLOListElement> & {
  children?: ReactNode
}

type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  children?: ReactNode
}

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

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode
}

type ImageProps = ImgHTMLAttributes<HTMLImageElement>

type HorizontalRuleProps = HTMLAttributes<HTMLHRElement>

// Lists
export const UnorderedList: FC<ListProps> = ({ children, className, ...props }) => {
  return (
    <ul
      {...props}
      className={cn(
        'list-disc list-outside ml-6 mb-6 space-y-2',
        'text-slate-700 dark:text-slate-300',
        '[&>li]:pl-1',
        className
      )}
    >
      {children}
    </ul>
  )
}

export const OrderedList: FC<ListProps> = ({ children, className, ...props }) => {
  return (
    <ol
      {...props}
      className={cn(
        'list-decimal list-outside ml-6 mb-6 space-y-2',
        'text-slate-700 dark:text-slate-300',
        '[&>li]:pl-1',
        className
      )}
    >
      {children}
    </ol>
  )
}

export const ListItem: FC<ListItemProps> = ({ children, className, ...props }) => {
  return (
    <li
      {...props}
      className={cn(
        'text-base md:text-lg leading-7',
        'marker:text-slate-500 dark:marker:text-slate-400',
        '[&>ul]:mt-2 [&>ul]:mb-0',
        '[&>ol]:mt-2 [&>ol]:mb-0',
        className
      )}
    >
      {children}
    </li>
  )
}

// Table components
export const Table: FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="my-6 overflow-x-auto">
      <table
        {...props}
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

export const TableHead: FC<TableSectionProps> = ({ children, className, ...props }) => {
  return (
    <thead {...props} className={cn('bg-slate-50 dark:bg-slate-800/50', className)}>
      {children}
    </thead>
  )
}

export const TableBody: FC<TableSectionProps> = ({ children, className, ...props }) => {
  return (
    <tbody {...props} className={cn('divide-y divide-slate-200 dark:divide-slate-700', className)}>
      {children}
    </tbody>
  )
}

export const TableRow: FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr
      {...props}
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

export const TableHeaderCell: FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <th
      {...props}
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

export const TableDataCell: FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td
      {...props}
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

// Link and Image components
export const Link: FC<LinkProps> = ({
  children,
  href,
  title,
  target,
  rel,
  className,
  ...props
}) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('//')

  return (
    <a
      {...props}
      href={href}
      title={title}
      target={target || (isExternal ? '_blank' : undefined)}
      rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
      className={cn(
        'text-blue-600 dark:text-blue-400',
        'hover:text-blue-800 dark:hover:text-blue-300',
        'underline underline-offset-2',
        'decoration-blue-600/30 dark:decoration-blue-400/30',
        'hover:decoration-blue-600 dark:hover:decoration-blue-400',
        'transition-colors duration-150',
        'font-medium',
        className
      )}
    >
      {children}
      {isExternal && (
        <svg
          className="inline-block w-3 h-3 ml-1 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}

export const Image: FC<ImageProps> = ({ src, alt, title, width, height, className, ...props }) => {
  return (
    <figure className="my-6">
      <img
        {...props}
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        className={cn(
          'max-w-full h-auto',
          'rounded-lg shadow-sm',
          'border border-slate-200 dark:border-slate-700',
          className
        )}
        loading="lazy"
      />
      {alt && (
        <figcaption
          className={cn('mt-2 text-sm text-center', 'text-slate-600 dark:text-slate-400', 'italic')}
        >
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

export const HorizontalRule: FC<HorizontalRuleProps> = ({ className, ...props }) => {
  return (
    <hr
      {...props}
      className={cn(
        'my-8 border-0 h-px',
        'bg-gradient-to-r from-transparent via-slate-300 to-transparent',
        'dark:via-slate-600',
        className
      )}
    />
  )
}

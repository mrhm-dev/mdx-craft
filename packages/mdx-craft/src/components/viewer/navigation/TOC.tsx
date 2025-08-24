import { FC } from 'react'
import type { TOCConfig, TOCItem } from '../../../types/toc.js'

export type TOCProps = {
  items: TOCItem[]
  className?: string
  sticky?: boolean
  stickyOffset?: string
  showNested?: boolean
  highlightActive?: boolean
  minLevel?: number
  maxLevel?: number
  mobile?: boolean
  tocConfig?: TOCConfig
}

export const TOC: FC<TOCProps> = ({
  items = [],
  className = '',
  showNested = true,
  minLevel = 1,
  maxLevel = 6,
}) => {
  if (!items || items.length === 0) {
    return null
  }

  const filteredItems = items.filter((item) => item.level >= minLevel && item.level <= maxLevel)

  const renderItem = (item: TOCItem) => {
    const indent = showNested ? (item.level - minLevel) * 16 : 0

    return (
      <li key={item.id} style={{ marginLeft: `${indent}px` }}>
        <a
          href={`#${item.id}`}
          className="block py-1 px-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {item.text}
        </a>
      </li>
    )
  }

  return (
    <nav className={`toc ${className}`}>
      <ul className="space-y-1">{filteredItems.map(renderItem)}</ul>
    </nav>
  )
}

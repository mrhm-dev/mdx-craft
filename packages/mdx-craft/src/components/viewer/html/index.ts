import { H1, H2, H3, H4, H5, H6 } from './Heading.js'
import { Paragraph } from './Paragraph.js'
import { Strong, Emphasis, InlineCode, Delete, Mark } from './TextFormatting.js'
import { Blockquote } from './Blockquote.js'
import {
  UnorderedList,
  OrderedList,
  ListItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableDataCell,
  Link,
  Image,
  HorizontalRule,
} from './FixedComponents.js'

export const HTMLComponents = {
  // Headings
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,

  // Text content
  p: Paragraph,

  // Text formatting
  strong: Strong,
  b: Strong, // Alias for strong
  em: Emphasis,
  i: Emphasis, // Alias for emphasis
  code: InlineCode,
  del: Delete,
  mark: Mark,

  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,

  // Blockquote
  blockquote: Blockquote,

  // Table
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeaderCell,
  td: TableDataCell,

  // Links and media
  a: Link,
  img: Image,
  hr: HorizontalRule,
}

// Export individual components for custom usage
export * from './Heading.js'
export * from './Paragraph.js'
export * from './TextFormatting.js'
export * from './Blockquote.js'
export * from './FixedComponents.js'

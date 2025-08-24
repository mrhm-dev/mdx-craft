import { H1, H2, H3, H4, H5, H6 } from './Heading.js'
import {
  Paragraph,
  Strong,
  Emphasis,
  Delete,
  Mark,
  Superscript,
  Subscript,
  Blockquote,
} from './Paragraph.js'
import { Code, InlineCode } from './Code.js'
import { Image } from './Image.js'
import { HorizontalRule } from './HorizontalLine.js'
import { UnorderedList, OrderedList, ListItem } from './Lists.js'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableDataCell,
  TableFooter,
} from './Table.js'
import { Link } from './Link.js'

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
  sup: Superscript,
  sub: Subscript,

  // Code blocks
  pre: Code,

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
  tfoot: TableFooter,

  // Links and media
  a: Link,
  img: Image,
  hr: HorizontalRule,
}

// Export individual components for custom usage
export * from './Heading.js'
export * from './Paragraph.js'
export * from './Code.js'
export * from './Image.js'
export * from './Lists.js'
export * from './Table.js'
export * from './Link.js'
export * from './HorizontalLine.js'

export type TOCItem = {
  id: string
  text: string
  level: number
}

export type UseTOCOptions = {
  /** Minimum heading level to include (default: 1) */
  minLevel?: number
  /** Maximum heading level to include (default: 6) */
  maxLevel?: number
  /** CSS selector for heading elements (default: 'h1, h2, h3, h4, h5, h6') */
  selector?: string
  /** Scroll offset when navigating to headings (default: 80) */
  scrollOffset?: number
  /** Root element to search within (default: document) */
  root?: Element | Document
}

export type UseTOCReturn = {
  /** Array of TOC items extracted from DOM */
  items: TOCItem[]
  /** ID of currently active heading */
  activeId: string | null
  /** Function to scroll to a heading by ID */
  scrollTo: (id: string) => void
  /** Whether the hook is currently extracting TOC data */
  isLoading: boolean
}

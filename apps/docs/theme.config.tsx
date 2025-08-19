import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>MDX Craft</span>,
  project: {
    link: 'https://github.com/yourusername/mdx-craft',
  },
  docsRepositoryBase: 'https://github.com/yourusername/mdx-craft/tree/main/apps/docs',
  footer: {
    content: <span>MDX Craft Documentation</span>,
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="MDX Craft" />
      <meta property="og:description" content="A package for preview and write MDX codes in any React application" />
    </>
  ),
}

export default config
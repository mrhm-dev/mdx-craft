'use client'

import { useState } from 'react'
import { MDXEditor } from 'mdx-craft'
import 'mdx-craft/styles.css'
import styles from './page.module.css'

export default function PlaygroundPage() {
  const [content, setContent] = useState(`# Welcome to MDX Craft Playground

This is an interactive playground where you can experiment with MDX content.

## Features

- **Live Preview**: See your MDX rendered in real-time
- **Syntax Highlighting**: Code blocks with proper highlighting
- **React Components**: Use React components within your MDX

## Example Code

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('MDX Craft'))
\`\`\`

## Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

## Table Example

| Feature | Status |
|---------|--------|
| MDX Support | ✅ |
| Live Preview | ✅ |
| Custom Components | ✅ |

Try editing this content to see the live preview update!
`)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>MDX Craft Playground</h1>
        <p>Experiment with MDX content in real-time</p>
      </header>
      
      <main className={styles.main}>
        <MDXEditor
          value={content}
          onChange={setContent}
          preview={true}
          className="h-[600px] w-full"
        />
      </main>
      
      <footer className={styles.footer}>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <a
          href="https://github.com/yourusername/mdx-craft"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}
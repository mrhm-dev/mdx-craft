'use client'

import { MDXViewer } from 'mdx-craft'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const comprehensiveSource = `
Welcome to the **official documentation** showcase for MDX Viewer v2.0. This page demonstrates the full range of supported HTML and Markdown elements, as well as all built-in components, styled with Tailwind CSS and designed for accessibility and responsive layouts - ${"`console.log('Hello, world!')`"}.

~~This line has been deleted.~~ example<sup>2</sup> and <sub>2</sub>

> This is Just a Blockquote Test

---

## Code Examples Pre

\`\`\`javascript
const a = 1;
const b = 2;
const c = a >= b;
console.log(c);
\`\`\`

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

class UserService {
  private users: Map<string, User> = new Map();
  
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { id, ...userData };
    this.users.set(id, user);
    return user;
  }
  
  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}

const userService = new UserService();

const user = await userService.createUser({
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin'
});

console.log(user);

\`\`\`


## Component Library Overview

MDX Viewer v2.0 provides a *comprehensive* set of built-in components with the following features:

[External Link](https://www.google.com)

[Internal Link](./docs/quickstart).


Here you can learn more about [optimized fonts](https://nextjs.org/docs/app/getting-started/fonts) in next.js.

Image: ![Sony ZV-1](./images/sony-zv1.jpg)

Canon ![Canon Lens](./images/canoon-ef-50mm-f18-stm-camera.jpeg)

## Lists

Let's see the example of both ordered and unordered lists.

### Unordered List

- **Tailwind CSS Integration**: Utility-first, maintainable styling.
- **Mobile-First Design**: Responsive layouts for all screen sizes.
- **Accessibility**: ARIA labels and keyboard navigation.
- **Dark Mode Support**: Seamless theme switching.
- **Performance**: Optimized rendering and caching.

### Ordered List

1. Ordered list item one
2. Ordered list item two
    1. Nested ordered item
    2. Another nested item
3. Ordered list item three
    1. Nested ordered item
    2. Another nested item
        1. Nested ordered item
        2. Another nested item

## Advanced Features

### Mathematical Expressions

MDX Viewer supports LaTeX math expressions via KaTeX:

Inline math: $E = mc^2$ and $\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$


### Tables

| Feature             | Status   | Performance | Notes                        |
|---------------------|----------|-------------|------------------------------|
| Syntax Highlighting | Ready    | Excellent   | 20+ languages supported      |
| Math Rendering      | Ready    | Good        | KaTeX integration            |
| Table of Contents   | Ready    | Excellent   | Auto-generated, smooth scroll|
| Dark Mode           | Ready    | Excellent   | CSS variable based           |
| Mobile Support      | Ready    | Excellent   | Responsive design            |
| Plugin System       | Ready    | Good        | Remark/Rehype compatible     |

---


*This documentation demonstrates the capabilities and flexibility of MDX Viewer v2.0 with Tailwind CSS integration. All components are designed for mobile-first responsive layouts, accessibility, and high performance.*
`

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="min-h-screen dark:bg-zinc-950">
      <header className="px-4 h-16 bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="container mx-auto flex justify-between items-center h-full">
          <Link href="/" className="text-zinc-900 dark:text-zinc-100">
            <span className="text-xl font-semibold font-sans">Playground</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="container max-w-5xl mx-auto px-4 py-8 overflow-x-hidden">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold font-sans">
            MDX Viewer v2.0 – Tailwind CSS Documentation Showcase
          </h1>
          <MDXViewer source={comprehensiveSource} showTOC={false} />
        </div>
      </main>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = (resolvedTheme || theme) === 'dark'

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      {isDark ? (
        // Moon icon for dark mode
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      )}
    </button>
  )
}

# 🛠️ MDX Craft

<p align="center">
  <img src="https://img.shields.io/npm/v/mdx-craft" alt="npm version" />
  <img src="https://img.shields.io/npm/l/mdx-craft" alt="license" />
  <img src="https://img.shields.io/npm/dt/mdx-craft" alt="downloads" />
</p>

<p align="center">
  <strong>🎮 <a href="https://mdx-craft-playground.vercel.app/" target="_blank">Try the Live Demo</a></strong> • Experience MDX Craft in action!
</p>

## 🌟 Introduction

**MDX Craft** is an open-source MDX utility for creating rich, interactive markdown experiences in any React application. It bridges the gap between basic markdown processors and complex solutions, providing a comprehensive toolkit for building engaging content experiences.

### 🤔 Why MDX Craft?

MDX Craft empowers developers to create documentation that users actually want to read. Whether you're building API documentation, technical blogs, or knowledge bases, you get professional results without complexity.

**🔄 Progressive enhancement** is at the core. Start with basic markdown and add interactive components as needed. Your content remains portable and version-controlled.

### 🌐 Open Source First

MDX Craft is an **MIT-licensed** open-source project that democratizes access to professional documentation tools. We believe great documentation experiences shouldn't be locked behind paywalls or proprietary platforms.

👨‍💻 Built by developers, for developers. No vendor lock-in, no licensing fees, just powerful tools at your fingertips.

### 🧩 The Challenge MDX Craft Solves

Modern developers need more than basic markdown rendering. Current solutions fall short:

- **🎨 Tailwind Typography**: Limited to prose classes, lacks interactive components
- **🔧 Custom Solutions**: Time-consuming to build and maintain
- **💰 Proprietary Platforms**: Expensive with vendor lock-in

MDX Craft provides the missing piece: an open-source solution with enterprise features.

## ✨ Core Features

- **🧰 Rich Component Library**: 10+ professionally designed components including code blocks, tabs, accordions, callouts, and more
- **🌈 Optional Syntax Highlighting**: Beautiful code highlighting with Shiki (optional peer dependency for smaller bundles)
- **📦 Lightweight by Default**: Core package is 50%+ smaller when syntax highlighting isn't needed
- **🔄 Interactive Elements**: Create engaging documentation with interactive components like tabs, accordions, and expandable sections
- **🎨 Tailwind Integration**: Seamless integration with Tailwind CSS for consistent styling
- **🛠️ Customizable**: Easily override components and styles to match your brand
- **🔌 Framework Agnostic**: Works with any React-based framework including Next.js, Remix, and more
- **📝 TypeScript Support**: Full TypeScript support for a better developer experience
- **🎯 Progressive Enhancement**: Works beautifully with or without optional features

> 💡 **Explore all features interactively** in our [**live playground**](https://mdx-craft-playground.vercel.app/) - no installation required!

## 🚀 Getting Started

### 📥 Installation

#### Basic Installation (No Syntax Highlighting)

For the lightest bundle - perfect if you don't need code syntax highlighting:

```bash
npm install mdx-craft
# or
yarn add mdx-craft
# or
pnpm add mdx-craft
```

#### Full Installation (With Syntax Highlighting)

To enable beautiful syntax highlighting for code blocks:

```bash
npm install mdx-craft shiki
# or
yarn add mdx-craft shiki
# or
pnpm add mdx-craft shiki
```

### 🛠️ Basic Setup

Wrap your application with the `MDXViewerProvider` component:

```tsx
import { MDXViewerProvider } from 'mdx-craft'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MDXViewerProvider>{children}</MDXViewerProvider>
}
```

### 🎨 Tailwind CSS Integration

MDX Craft works seamlessly with Tailwind CSS. Add the following to your global CSS file:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@source '../node_modules/mdx-craft';
```

### 📝 Basic Usage

```tsx
import { MDXViewer } from 'mdx-craft'

export default function MDXPage() {
  const mdxContent = `# Hello World

This is **MDX** content with a code example:

\`\`\`js
console.log('Hello from MDX Craft!');
\`\`\`
`

  return (
    <div className="container mx-auto py-8">
      <MDXViewer source={mdxContent} />
    </div>
  )
}
```

## 🌈 Syntax Highlighting

MDX Craft uses **Shiki** as an optional peer dependency for beautiful syntax highlighting. By default, it supports JavaScript, TypeScript, JSX, TSX, JSON, CSS, HTML, and Bash.

### Default Languages (No Configuration Needed)

```tsx
import { MDXViewer } from 'mdx-craft'

const codeExample = `
\`\`\`javascript
const greeting = 'Hello, World!'
console.log(greeting)
\`\`\`

\`\`\`css  
.button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  padding: 12px 24px;
}
\`\`\`
`

function SyntaxHighlightingExample() {
  return <MDXViewer source={codeExample} />
}
```

### Custom Languages Configuration

Need more languages? Configure them through the provider:

```tsx
import { MDXViewerProvider } from 'mdx-craft'

function App() {
  return (
    <MDXViewerProvider
      shikiConfig={{
        languages: ['python', 'rust', 'go', 'sql', 'yaml'],
        themes: ['github-light', 'github-dark'],
      }}
    >
      <YourApp />
    </MDXViewerProvider>
  )
}
```

### Without Syntax Highlighting

If you don't install Shiki, code blocks will render as beautifully formatted plain text with:

- ✅ Proper formatting and indentation
- ✅ Copy to clipboard functionality
- ✅ Line numbers (for CodeBlock component)
- ✅ Language badges
- ❌ No syntax highlighting colors

This keeps your bundle size minimal while maintaining full functionality.

## 🎯 Component Examples

### 📄 Basic Markdown

MDX Craft supports all standard markdown syntax including headings, lists, links, images, and more.

```tsx
import { MDXViewer } from 'mdx-craft'

function BasicExample() {
  const mdxContent = `
# Heading 1
## Heading 2
### Heading 3

This is **bold text**, and this is *italic text*.

> This is a blockquote

- List item 1
- List item 2
- List item 3

1. Ordered item 1
2. Ordered item 2
3. Ordered item 3
`

  return <MDXViewer source={mdxContent} />
}
```

### 🚀 Advanced Markdown

MDX Craft also supports advanced markdown features like tables, task lists, and footnotes.

```tsx
import { MDXViewer } from 'mdx-craft'

function AdvancedExample() {
  const mdxContent = `
# Advanced Markdown

## Tables

| Name | Description | Price |
| ---- | ----------- | ----- |
| Item 1 | Description 1 | $10 |
| Item 2 | Description 2 | $20 |
| Item 3 | Description 3 | $30 |

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Footnotes

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.
`

  return <MDXViewer source={mdxContent} />
}
```

### 💻 Code Blocks

MDX Craft provides beautiful syntax highlighting for code blocks with support for numerous programming languages.

```tsx
import { MDXViewer } from 'mdx-craft'

function CodeBlockExample() {
  const mdxContent = `
# Code Block Example

Here's a code block with syntax highlighting:

\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Print the first 10 Fibonacci numbers
for number in fibonacci(10):
    print(number)
\`\`\`

You can also add a title to your code block:

\`\`\`js:app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`
`

  return <MDXViewer source={mdxContent} />
}
```

### 📦 Code Block Groups

Group related code blocks together for better organization.

```tsx
import { MDXViewer } from 'mdx-craft'

function CodeBlockGroupExample() {
  const mdxContent = `
# Code Block Group

<CodeBlockGroup>

\`\`\`js:frontend.js
// Frontend code
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

\`\`\`js:backend.js
// Backend code
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});
\`\`\`

</CodeBlockGroup>
`

  return <MDXViewer source={mdxContent} />
}
```

### 🎨 UI Components

MDX Craft includes a variety of UI components to enhance your documentation.

```tsx
import { MDXViewer } from 'mdx-craft'

function ComponentsExample() {
  const mdxContent = `
# UI Components

## Accordion

<Accordion title="Click to expand">
  This content is hidden until the accordion is clicked.
  
  You can include **markdown** inside the accordion.
</Accordion>

## Card

<Card title="Card Title">
  This is a card component with a title.
  
  Cards are useful for grouping related content.
</Card>

## Callouts

<Info>
  This is an informational callout.
</Info>

<Tip>
  This is a tip callout with helpful advice.
</Tip>

<Danger>
  This is a danger callout for critical warnings.
</Danger>

<Check>
  This is a success callout for completed tasks.
</Check>
`

  return <MDXViewer source={mdxContent} />
}
```

### 🧭 Navigation Components

MDX Craft provides navigation components like tabs, steps, and expandable sections.

```tsx
import { MDXViewer } from 'mdx-craft'

function NavigationExample() {
  const mdxContent = `
# Navigation Components

## Tabs

<Tabs>
  <Tab title="First Tab">
    Content for the first tab.

    You can include **markdown** here.
  </Tab>
  <Tab title="Second Tab">
    Content for the second tab.

    \`\`\`js
    // You can include code blocks
    const greeting = 'Hello';
    \`\`\`
  </Tab>
  <Tab title="Third Tab">
    Content for the third tab.
  </Tab>
</Tabs>

## Steps

<Steps>
  <Step title="First Step">
    Instructions for the first step.
  </Step>
  <Step title="Second Step">
    Instructions for the second step.
  </Step>
  <Step title="Final Step">
    Instructions for the final step.
  </Step>
</Steps>

## Expandable

<Expandable title="Click to show more">
  This content can be expanded or collapsed.

  It's useful for hiding lengthy content that not all users may need to see.
</Expandable>
`

  return <MDXViewer source={mdxContent} />
}
```

### 🖼️ Frames

MDX Craft includes frame components to simulate different environments.

```tsx
import { MDXViewer } from 'mdx-craft'

function FramesExample() {
  const mdxContent = `
# Frames

<Frame 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  ratio="16:9"
  title="YouTube Video Example"
/>

<Frame 
  src="https://codepen.io/pen/abcdef"
  ratio="4:3"
  title="CodePen Demo"
/>

<Frame 
  embed='<iframe src="https://codesandbox.io/embed/example" width="100%" height="400"></iframe>'
  title="CodeSandbox Embed"
/>
`

  return <MDXViewer source={mdxContent} />
}
```

## 📚 API Reference

### 🔧 MDXViewer

The main component for rendering MDX content.

```tsx
import { MDXViewer } from 'mdx-craft'
;<MDXViewer
  source="# Hello World" // MDX content as a string
  components={{}} // Optional custom components
  rehypePlugins={[]} // Optional rehype plugins
  remarkPlugins={[]} // Optional remark plugins
/>
```

### 🎛️ MDXViewerProvider

Provider component that sets up the MDX rendering context.

```tsx
import { MDXViewerProvider } from 'mdx-craft'
;<MDXViewerProvider
  components={{}} // Optional global custom components
  rehypePlugins={[]} // Optional global rehype plugins
  remarkPlugins={[]} // Optional global remark plugins
  shikiConfig={{}} // Optional syntax highlighting configuration
>
  {children}
</MDXViewerProvider>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'feat(scope):Add some amazing feature'`)
4. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

> **[📚 <u>Read the full contribution guidelines</u>](https://github.com/raselinfo/mdx-craft/blob/main/CONTRIBUTING.md)** for more detailed information on our development process, project structure, testing guidelines, and more.

## 📄 License

MIT © [MDX Craft Contributors](https://github.com/mrhm-dev/mdx-craft/graphs/contributors)

**Free to use in personal and commercial projects.**

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star on GitHub](https://github.com/mrhm-dev/mdx-craft) • [🚀 Try the Playground](https://mdx-craft-playground.vercel.app/) • [📖 Read the Docs](https://github.com/mrhm-dev/mdx-craft)

</div>

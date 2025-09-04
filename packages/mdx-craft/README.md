# mdx-craft

A package for preview and write MDX codes in any React application.

## Installation

```bash
npm install mdx-craft
```

## Usage

```tsx
import { MDXViewer } from 'mdx-craft'

function App() {
  const mdxContent = `# Hello World\n\nThis is **MDX** content.`

  return <MDXViewer source={mdxContent} />
}
```

## License

MIT

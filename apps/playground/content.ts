export const comprehensiveSource = `
Welcome! You are experiencing the version of MDX Craft that is currently under development. This is the documentation for the next version of MDX Craft.

## Introduction to MDX-Craft: The Modern React MDX Rendering Solution

**MDX-Craft** is a powerful, feature-rich MDX rendering library built for modern React applications. Designed with performance, accessibility, and developer experience in mind, it provides a seamless way to render MDX content with advanced features like automatic table of contents generation, syntax highlighting, and responsive design patterns.

![Modern Code Editor](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop)

In this comprehensive guide, we'll explore the architecture, implementation details, and practical usage of MDX-Craft's core components: the **MDXViewer** and the revolutionary **TOC (Table of Contents)** component that adapts to your content in real-time.

---

## Core Architecture Overview

MDX-Craft follows a modular architecture pattern that separates concerns between content processing, rendering, and navigation. The library consists of three main layers:

1. **Processing Layer**: Handles MDX compilation with \`remark\` and \`rehype\` plugins
2. **Rendering Layer**: React components for displaying processed content  
3. **Navigation Layer**: Smart TOC generation with intersection observer

> **Design Philosophy**: "Content should be king, but navigation should be queen. Together, they rule the user experience." - MDX-Craft Team

### Key Technical Features

The library leverages several cutting-edge web technologies to deliver exceptional performance:

- **React 18+** with concurrent features and automatic batching
- **Tailwind CSS v4** for utility-first styling with CSS custom properties
- **Intersection Observer API** for performant scroll tracking
- **Web Workers** *(coming soon)* for off-thread MDX compilation
- **Cache-first architecture** with intelligent invalidation strategies

---

## The MDXViewer Component

The \`MDXViewer\` is the heart of MDX-Craft, providing a zero-configuration rendering solution that works out of the box while remaining highly customizable for advanced use cases.

### Basic Implementation

\`\`\`typescript
import { MDXViewer } from 'mdx-craft'

export function DocumentationPage({ content }: { content: string }) {
  return (
    <MDXViewer 
      source={content}
      components={customComponents}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeHighlight, rehypeSlug]}
    />
  )
}
\`\`\`

### Advanced Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`source\` | \`string\` | Required | The MDX content to render |
| \`components\` | \`ComponentRegistry\` | \`{}\` | Custom component mappings |
| \`remarkPlugins\` | \`PluggableList\` | \`[]\` | Remark transformation plugins |
| \`rehypePlugins\` | \`PluggableList\` | \`[]\` | Rehype transformation plugins |
| \`onCompile\` | \`(metadata) => void\` | \`undefined\` | Compilation completion callback |
| \`useCache\` | \`boolean\` | \`true\` | Enable compilation caching |

The component automatically handles:
- **Error boundaries** for graceful failure recovery
- **Loading states** with customizable skeleton screens
- **Theme integration** with automatic dark mode support
- **Performance optimization** through React.memo and useMemo

---

## Revolutionary TOC Component

The Table of Contents component represents a breakthrough in navigation design, offering **real-time tracking**, **smooth scrolling**, and **intelligent hierarchy detection**.

### How We Built It

The TOC component utilizes a novel approach combining DOM extraction with Intersection Observer:

\`\`\`typescript
export const useTOC = (options: UseTOCOptions = {}): UseTOCReturn => {
  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  
  // Extract headings from DOM
  const extractTOCItems = useCallback(() => {
    const headings = root.querySelectorAll(selector)
    return Array.from(headings).map(heading => ({
      id: heading.id || generateId(heading.textContent),
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1))
    }))
  }, [root, selector])
  
  // Track active section with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => updateActiveSection(entries),
      { rootMargin: '-20% 0px -70% 0px' }
    )
    // ... observer logic
  }, [items])
}
\`\`\`

### Implementation Benefits

The TOC component offers several advantages over traditional implementations:

- ✅ **Zero-configuration setup** - Works automatically with any MDX content
- ✅ **Real-time synchronization** - Updates as content changes dynamically
- ✅ **Smooth scroll navigation** - Hardware-accelerated scrolling with easing
- ✅ **Accessibility-first** - Full keyboard navigation and ARIA support
- ✅ **Responsive design** - Adapts to mobile, tablet, and desktop layouts

### Performance Metrics

Our benchmarks show impressive performance gains compared to traditional TOC implementations:

| Metric | MDX-Craft TOC | Traditional TOC | Improvement |
|--------|---------------|-----------------|-------------|
| Initial Render | 12ms | 45ms | **73% faster** |
| Scroll Update | 2ms | 8ms | **75% faster** |
| Memory Usage | 2.1MB | 3.8MB | **45% less** |
| CPU Usage (idle) | 0.1% | 0.8% | **87% less** |

---

## Real-World Usage Examples

### Documentation Sites

Perfect for technical documentation with deep nesting and complex navigation requirements:

\`\`\`jsx
function DocsLayout({ children }) {
  return (
    <div className="flex gap-8">
      <main className="flex-1 max-w-4xl">
        <MDXViewer source={children} />
      </main>
      <aside className="w-64 sticky top-20">
        <TOC minLevel={2} maxLevel={4} />
      </aside>
    </div>
  )
}
\`\`\`

### Blog Posts

Enhance long-form content with contextual navigation:

\`\`\`jsx
function BlogPost({ content, metadata }) {
  const { items, activeId, scrollTo } = useTOC({
    minLevel: 2,
    maxLevel: 3,
    scrollOffset: 100
  })
  
  return (
    <article>
      <header>
        <h1>{metadata.title}</h1>
        <time>{metadata.date}</time>
      </header>
      <MDXViewer source={content} />
      {items.length > 3 && <FloatingTOC items={items} />}
    </article>
  )
}
\`\`\`

---

## Advanced Features and Customization

### Custom Component Registration

MDX-Craft allows you to register custom components globally or per-instance:

\`\`\`typescript
// Global registration
import { getGlobalRegistry } from 'mdx-craft'

const registry = getGlobalRegistry()
registry.register('CustomAlert', AlertComponent)
registry.register('CodeSandbox', CodeSandboxEmbed)

// Per-instance registration
<MDXViewer 
  source={content}
  components={{
    Alert: CustomAlert,
    Graph: D3GraphComponent,
    Video: VideoPlayer
  }}
/>
\`\`\`

### Plugin Ecosystem

The library supports the entire **unified** ecosystem of plugins:

**Recommended Remark Plugins:**
- \`remark-gfm\` - GitHub Flavored Markdown support
- \`remark-math\` - Mathematical notation with LaTeX
- \`remark-directive\` - Custom directive support  
- \`remark-emoji\` - Emoji shortcode conversion

**Essential Rehype Plugins:**
- \`rehype-highlight\` - Syntax highlighting with Prism/Shiki
- \`rehype-slug\` - Automatic heading ID generation
- \`rehype-autolink-headings\` - Heading anchor links
- \`rehype-katex\` - Math rendering with KaTeX

---

## Performance Optimization Strategies

### 1. Intelligent Caching System

MDX-Craft implements a multi-layer caching strategy:

\`\`\`typescript
const processor = new MDXProcessor({
  cacheEnabled: true,
  cacheMaxSize: 10, // MB
  cacheTTL: 300000, // 5 minutes
})
\`\`\`

### 2. Lazy Loading Components

Components are loaded on-demand to reduce initial bundle size:

\`\`\`jsx
const LazyChart = lazy(() => import('./components/Chart'))

<MDXViewer 
  components={{
    Chart: LazyChart
  }}
/>
\`\`\`

### 3. Virtual Scrolling for Long TOCs

For documents with hundreds of headings, virtual scrolling maintains performance:

\`\`\`jsx
<TOC 
  virtualScroll={true}
  itemHeight={32}
  visibleItems={10}
/>
\`\`\`

---

## Accessibility and Internationalization

### WCAG 2.1 AAA Compliance

MDX-Craft meets the highest accessibility standards:

- **Semantic HTML** structure with proper heading hierarchy
- **ARIA labels** and live regions for screen readers
- **Keyboard navigation** with focus management
- **Color contrast** ratios exceeding 7:1 for all text
- **Reduced motion** support for users with vestibular disorders

### Multi-language Support

\`\`\`jsx
<MDXViewerProvider locale="ja">
  <MDXViewer 
    source={content}
    messages={{
      loading: "読み込み中...",
      error: "エラーが発生しました"
    }}
  />
</MDXViewerProvider>
\`\`\`

---

## Migration Guide

### From MDX v1 to MDX-Craft

Migrating from vanilla MDX v1 is straightforward:

**Before:**
\`\`\`jsx
import MDX from '@mdx-js/runtime'
<MDX>{content}</MDX>
\`\`\`

**After:**
\`\`\`jsx
import { MDXViewer } from 'mdx-craft'
<MDXViewer source={content} />
\`\`\`

### From Next.js MDX

For Next.js applications, MDX-Craft offers enhanced features:

1. Install the package: \`npm install mdx-craft\`
2. Replace \`next-mdx-remote\` with MDX-Craft
3. Enjoy automatic TOC generation and better performance

---

## Benchmarks and Comparisons

### Performance Comparison

| Library | Bundle Size | First Paint | Time to Interactive | Lighthouse Score |
|---------|------------|-------------|-------------------|------------------|
| **MDX-Craft** | 42KB | 0.8s | 1.2s | 98 |
| next-mdx-remote | 68KB | 1.2s | 2.1s | 85 |
| @mdx-js/react | 55KB | 1.0s | 1.8s | 88 |
| react-markdown | 38KB | 0.9s | 1.5s | 90 |

### Feature Matrix

| Feature | MDX-Craft | Competition |
|---------|-----------|-------------|
| Automatic TOC | ✅ | ❌ |
| Real-time TOC tracking | ✅ | ❌ |
| Built-in caching | ✅ | ⚠️ Partial |
| TypeScript support | ✅ | ✅ |
| Plugin ecosystem | ✅ | ✅ |
| Custom components | ✅ | ✅ |
| Error boundaries | ✅ | ❌ |
| Loading states | ✅ | ❌ |

---

## Future Roadmap

### Q1 2025: Performance Focus
- [ ] Web Worker compilation for large documents
- [ ] WASM-powered markdown parser
- [ ] Streaming SSR support

### Q2 2025: Developer Experience
- [ ] Visual MDX editor component
- [ ] Chrome DevTools extension
- [ ] VS Code integration

### Q3 2025: Enterprise Features
- [ ] Collaborative editing support
- [ ] Version control integration
- [ ] Analytics dashboard

---

## Conclusion

MDX-Craft represents the next evolution in MDX rendering, combining **performance**, **accessibility**, and **developer experience** into a single, cohesive package. Whether you're building documentation sites, blogs, or complex content-driven applications, MDX-Craft provides the tools you need to deliver exceptional user experiences.

### Getting Started

\`\`\`bash
# Install MDX-Craft
npm install mdx-craft

# Install peer dependencies
npm install react react-dom

# Start building!
\`\`\`

For more information, visit our [GitHub repository](https://github.com/your-org/mdx-craft) or check out our [live examples](https://mdx-craft.dev/examples).

---

*Built with ❤️ by the MDX-Craft team. Licensed under MIT.*
`

'use client'

import { MDXViewer } from 'mdx-craft'
import 'mdx-craft/styles.css'
import styles from './page.module.css'

const comprehensiveSource = `
# MDX Viewer v2.0 – Tailwind CSS Documentation Showcase

Welcome to the official documentation showcase for MDX Viewer v2.0. This page demonstrates the full range of supported HTML and Markdown elements, as well as all built-in components, styled with Tailwind CSS and designed for accessibility and responsive layouts.

## Component Library Overview

MDX Viewer v2.0 provides a comprehensive set of built-in components with the following features:

- **Tailwind CSS Integration**: Utility-first, maintainable styling.
- **Mobile-First Design**: Responsive layouts for all screen sizes.
- **Accessibility**: ARIA labels and keyboard navigation.
- **Dark Mode Support**: Seamless theme switching.
- **Performance**: Optimized rendering and caching.

### Card Components

Cards are used to highlight key resources and navigation points:

<Card title="Quick Start Guide" href="/docs/quickstart">
  Learn how to install, configure, and use MDX Viewer in minutes. This guide covers the essentials for getting started.
</Card>

<Card title="API Reference" href="/docs/api" horizontal>
  Detailed documentation for all components, properties, and configuration options available in MDX Viewer.
</Card>

<Card title="Community Examples">
  Browse real-world examples and templates contributed by the community for advanced use cases and inspiration.
</Card>

### Code Examples

MDX Viewer features advanced syntax highlighting with Shiki, supporting over 20 programming languages, multiple themes, and copy-to-clipboard functionality.

<CodeBlock language="typescript" filename="user-service.ts" showLineNumbers highlightLines="3,8-12">
{\`interface User {
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
}\`}
</CodeBlock>

<CodeBlock language="python" filename="data_processor.py">
{\`import pandas as pd
from typing import List, Dict, Any

def process_user_data(data: List[Dict[str, Any]]) -> pd.DataFrame:
    """Process raw user data into a structured DataFrame."""
    df = pd.DataFrame(data)
    
    # Clean and validate data
    df['email'] = df['email'].str.lower().str.strip()
    df['created_at'] = pd.to_datetime(df['created_at'])
    
    # Remove duplicates and invalid entries
    df = df.drop_duplicates(subset=['email'])
    df = df.dropna(subset=['name', 'email'])
    
    return df.reset_index(drop=True)\`}
</CodeBlock>

<CodeBlock language="rust" filename="authentication.rs">
{\`use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthToken {
    pub token: String,
    pub user_id: Uuid,
    pub expires_at: chrono::DateTime<chrono::Utc>,
}

impl AuthToken {
    pub fn new(user_id: Uuid, duration_hours: i64) -> Self {
        let token = Uuid::new_v4().to_string();
        let expires_at = chrono::Utc::now() + chrono::Duration::hours(duration_hours);
        
        Self { token, user_id, expires_at }
    }
    
    pub fn is_expired(&self) -> bool {
        chrono::Utc::now() > self.expires_at
    }
}\`}
</CodeBlock>

## Tabbed Content

Tabs are ideal for organizing related information in a compact, accessible format:

<Tabs
  items={[
    {
      label: "Installation",
      value: "install",
      content: "**NPM Installation:**\\n\\n\`\`\`bash\\nnpm install @your-org/mdx-viewer\\n# or\\nyarn add @your-org/mdx-viewer\\n# or\\npnpm add @your-org/mdx-viewer\\n\`\`\`\\n\\n**CDN Usage:**\\n\\n\`\`\`html\\n<script src=\\"https://unpkg.com/@your-org/mdx-viewer\\"></script>\\n\`\`\`"
    },
    {
      label: "Configuration",
      value: "config",
      content: "**Basic Setup:**\\n\\n\`\`\`tsx\\nimport { MDXViewerProvider, MDXViewer } from '@your-org/mdx-viewer';\\n\\nfunction App() {\\n  return (\\n    <MDXViewerProvider>\\n      <MDXViewer source={mdxContent} />\\n    </MDXViewerProvider>\\n  );\\n}\\n\`\`\`"
    },
    {
      label: "Customization",
      value: "custom",
      content: "**Theme Customization:**\\n\\n\`\`\`tsx\\nconst customTheme = createTheme({\\n  colors: {\\n    primary: '#10B981',\\n    secondary: '#8B5CF6'\\n  },\\n  typography: {\\n    fontFamily: 'Inter, sans-serif'\\n  }\\n});\\n\\n<MDXViewerProvider theme={customTheme}>\\n  <MDXViewer source={content} />\\n</MDXViewerProvider>\\n\`\`\`"
    },
    {
      label: "Advanced",
      value: "advanced",
      content: "**Plugin Integration:**\\n\\n\`\`\`tsx\\nimport remarkMath from 'remark-math';\\nimport rehypeKatex from 'rehype-katex';\\n\\n<MDXViewer\\n  source={content}\\n  remarkPlugins={[remarkMath]}\\n  rehypePlugins={[rehypeKatex]}\\n  generateTOC={true}\\n  tocConfig={{\\n    minLevel: 2,\\n    maxLevel: 4,\\n    sticky: true\\n  }}\\n/>\\n\`\`\`"
    }
  ]}
/>

## Collapsible Content

Accordions provide a way to present large amounts of information in a compact, user-friendly manner:

<Accordion title="Performance Optimizations" defaultOpen>
  MDX Viewer v2.0 is engineered for high performance with the following strategies:
  
  - Multi-level caching with component fingerprinting
  - Tailwind CSS utility-first styling for minimal runtime overhead
  - Optimized component loading for mobile devices
  - Shiki-based syntax highlighting with improved speed
  - Smart LRU cache for memory management

  **Benchmark Results:**
  - Initial compilation: < 80ms for typical documents (20% faster)
  - Re-compilation: < 30ms with enhanced caching (40% faster)
  - Large documents (50k+ words): < 400ms (20% faster)
  - Bundle size: < 45KB gzipped for core features (10% smaller)
  - Mobile performance: Optimized for 3G networks
</Accordion>

<Accordion title="Customization">
  MDX Viewer v2.0 is fully customizable using Tailwind CSS:

  **Theme System:**
  - Complete Tailwind CSS utility integration
  - Typography plugin support with responsive classes
  - Dark mode via CSS variables
  - Component-specific Tailwind class builders
  - Mobile-first responsive design

  **Component System:**
  - Tailwind-powered component overrides
  - Enhanced component registry with performance optimizations
  - Runtime theme switching
  - Mobile-responsive component variations
  - Accessibility-first component design
</Accordion>

<Accordion title="Browser Support">
  MDX Viewer supports all modern browsers with progressive enhancement:

  - Chrome 91+ – Full support
  - Firefox 90+ – Full support
  - Safari 14+ – Full support
  - Edge 91+ – Full support
  - Mobile browsers – Responsive design

  **Progressive Enhancement:**
  - Core content loads without JavaScript
  - Interactive features enhance the experience
  - Built-in accessibility features
</Accordion>

<Accordion title="Mobile Experience">
  The mobile experience has been completely redesigned:

  - Mobile table of contents drawer with floating action button
  - Touch-optimized components and interactions
  - Responsive breakpoints using Tailwind CSS
  - Optimized rendering and reduced bundle size for mobile
  - Enhanced ARIA support and keyboard navigation
  - Gesture support for swipe and pinch interactions
</Accordion>

## Callout Components

Callouts are used to highlight important information, warnings, or tips. They are styled for clarity, accessibility, and mobile responsiveness.

> **Note:** This is a standard informational callout. Use callouts to draw attention to key details or best practices.

> **Warning:** This is a warning callout. Use for important cautions or potential issues.

> **Tip:** This is a tip callout. Use for helpful suggestions or shortcuts.

## Advanced Features

### Mathematical Expressions

MDX Viewer supports LaTeX math expressions via KaTeX:

Inline math: $E = mc^2$ and $\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

### Complex Code Example

<CodeBlock language="sql" filename="user_analytics.sql" showLineNumbers>
{\`-- Complex user analytics query
WITH user_engagement AS (
  SELECT 
    u.id,
    u.email,
    u.created_at,
    COUNT(DISTINCT s.id) as session_count,
    COUNT(DISTINCT e.id) as event_count,
    AVG(s.duration_minutes) as avg_session_duration,
    MAX(s.created_at) as last_activity
  FROM users u
  LEFT JOIN sessions s ON u.id = s.user_id
  LEFT JOIN events e ON s.id = e.session_id
  WHERE u.created_at >= '2024-01-01'
  GROUP BY u.id, u.email, u.created_at
),
engagement_tiers AS (
  SELECT *,
    CASE 
      WHEN event_count >= 100 THEN 'high'
      WHEN event_count >= 20 THEN 'medium'
      ELSE 'low'
    END as engagement_tier,
    RANK() OVER (ORDER BY event_count DESC) as engagement_rank
  FROM user_engagement
)
SELECT 
  engagement_tier,
  COUNT(*) as user_count,
  AVG(event_count) as avg_events,
  AVG(avg_session_duration) as avg_duration
FROM engagement_tiers
GROUP BY engagement_tier
ORDER BY avg_events DESC;\`}
</CodeBlock>

## Markdown and HTML Elements

### Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

### Lists

1. Ordered list item one
2. Ordered list item two
   1. Nested ordered item
   2. Another nested item
3. Ordered list item three

- Unordered list item one
- Unordered list item two
  - Nested unordered item
  - Another nested item
- Unordered list item three

### Blockquotes

> This is a blockquote. Use blockquotes to highlight important information or quotations.

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

## Getting Started

To begin using MDX Viewer v2.0 with Tailwind CSS, refer to the following resources:

<Card title="Documentation" href="/docs">
  Access comprehensive guides, API references, and usage examples to help you get started quickly.
</Card>

<Card title="Interactive Demo" href="/demo" horizontal>
  Experiment with all components in a live playground environment.
</Card>

<Card title="Download" href="/download">
  Download the latest version from npm, GitHub, or use CDN links for rapid prototyping.
</Card>

---

*This documentation demonstrates the capabilities and flexibility of MDX Viewer v2.0 with Tailwind CSS integration. All components are designed for mobile-first responsive layouts, accessibility, and high performance.*
`

export default function PlaygroundPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>MDX Craft Playground</h1>
        <p>Experiment with MDX content in real-time</p>
      </header>

      <main className={styles.main}>
        <MDXViewer source={comprehensiveSource} />
      </main>

      <footer className={styles.footer}>
        <a href="/docs" target="_blank" rel="noopener noreferrer">
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

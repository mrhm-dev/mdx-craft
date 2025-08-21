'use client'

import { MDXViewer } from 'mdx-craft'
import 'mdx-craft/styles.css'
import styles from './page.module.css'

const comprehensiveSource = `
# 🚀 MDX Viewer v2.0 - Tailwind CSS Showcase

Welcome to the **enhanced demonstration** of our MDX Viewer v2.0 system! This document showcases all available components with the new Tailwind CSS architecture and mobile-first responsive design.

## 📚 Enhanced Component Library - v2.0

Our MDX Viewer v2.0 includes **enhanced built-in components** with Tailwind CSS styling, improved accessibility, and mobile-first responsive design. All components work without any imports and feature:

- ✨ **Tailwind CSS Integration** - Clean, utility-first styling
- 📱 **Mobile-First Design** - Responsive across all screen sizes  
- ♿ **Enhanced Accessibility** - ARIA labels and keyboard navigation
- 🌙 **Dark Mode Support** - Seamless light/dark theme switching
- ⚡ **Improved Performance** - Enhanced caching and optimization

### 🎴 Interactive Cards

Cards are perfect for creating engaging, clickable content blocks:

<Card title="Quick Start Guide" icon="⚡" href="/docs/quickstart">
  Get up and running with the MDX Viewer in under 5 minutes. This guide covers installation, basic setup, and your first MDX document.
</Card>

<Card title="API Reference" icon="📖" href="/docs/api" horizontal>
  Complete documentation of all components, props, and configuration options available in the MDX Viewer system.
</Card>

<Card title="Community Examples" icon="🌟">
  Explore real-world examples and templates created by our community. Perfect for inspiration and learning advanced techniques.
</Card>

### 💻 Code Examples

Our enhanced syntax highlighting features **Shiki integration** with support for 20+ programming languages, enhanced themes, and copy functionality:

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

## 🗂️ Enhanced Tabbed Content

Perfect for organizing related information with improved mobile interactions and responsive design:

<Tabs
  items={[
    {
      label: "Installation",
      value: "install",
      icon: "📦",
      content: "**NPM Installation:**\\n\\n\`\`\`bash\\nnpm install @your-org/mdx-viewer\\n# or\\nyarn add @your-org/mdx-viewer\\n# or\\npnpm add @your-org/mdx-viewer\\n\`\`\`\\n\\n**CDN Usage:**\\n\\n\`\`\`html\\n<script src=\\"https://unpkg.com/@your-org/mdx-viewer\\"></script>\\n\`\`\`"
    },
    {
      label: "Configuration",
      value: "config",
      icon: "⚙️",
      content: "**Basic Setup:**\\n\\n\`\`\`tsx\\nimport { MDXViewerProvider, MDXViewer } from '@your-org/mdx-viewer';\\n\\nfunction App() {\\n  return (\\n    <MDXViewerProvider>\\n      <MDXViewer source={mdxContent} />\\n    </MDXViewerProvider>\\n  );\\n}\\n\`\`\`"
    },
    {
      label: "Customization",
      value: "custom",
      icon: "🎨",
      content: "**Theme Customization:**\\n\\n\`\`\`tsx\\nconst customTheme = createTheme({\\n  colors: {\\n    primary: '#10B981',\\n    secondary: '#8B5CF6'\\n  },\\n  typography: {\\n    fontFamily: 'Inter, sans-serif'\\n  }\\n});\\n\\n<MDXViewerProvider theme={customTheme}>\\n  <MDXViewer source={content} />\\n</MDXViewerProvider>\\n\`\`\`"
    },
    {
      label: "Advanced",
      value: "advanced",
      icon: "🚀",
      content: "**Plugin Integration:**\\n\\n\`\`\`tsx\\nimport remarkMath from 'remark-math';\\nimport rehypeKatex from 'rehype-katex';\\n\\n<MDXViewer\\n  source={content}\\n  remarkPlugins={[remarkMath]}\\n  rehypePlugins={[rehypeKatex]}\\n  generateTOC={true}\\n  tocConfig={{\\n    minLevel: 2,\\n    maxLevel: 4,\\n    sticky: true\\n  }}\\n/>\\n\`\`\`"
    }
  ]}
/>

## 📋 Enhanced Collapsible Content

Use accordions with improved animations, better mobile interactions, and enhanced accessibility:


  <Accordion title="🎯 v2.0 Performance Optimizations" defaultOpen>
    Our MDX Viewer v2.0 is built for **exceptional performance** with enhanced optimization strategies:
    
    - **Enhanced Multi-level Caching**: Component fingerprinting and improved cache keys
    - **Tailwind CSS Optimization**: Utility-first styling with minimal runtime overhead
    - **Mobile-First Loading**: Optimized component loading for mobile devices
    - **Shiki Integration**: Enhanced syntax highlighting with better performance
    - **Improved Memory Management**: Smart LRU cache with mobile considerations
    
    **v2.0 Benchmark Results:**
    - Initial compilation: **< 80ms** for typical documents (20% improvement)
    - Re-compilation: **< 30ms** with enhanced caching (40% improvement)
    - Large documents (50k+ words): **< 400ms** (20% improvement)
    - Bundle impact: **< 45KB gzipped** for core features (10% reduction)
    - Mobile performance: **Optimized for 3G networks**
  </Accordion>
  
  <Accordion title="🔧 v2.0 Enhanced Customization">
    Every aspect of the MDX Viewer v2.0 can be customized with Tailwind CSS power:
    
    **Tailwind Theme System:**
    - Complete Tailwind CSS utility integration
    - Typography plugin support with responsive classes
    - Dark mode with CSS variable system
    - Component-specific Tailwind class builders
    - Mobile-first responsive design system
    
    **Enhanced Component System:**
    - Tailwind-powered component overrides
    - Enhanced component registry with performance optimizations
    - Runtime theme switching
    - Mobile-responsive component variations
    - Accessibility-first component design
  </Accordion>
  
  <Accordion title="🌐 Browser Support">
    Our MDX Viewer supports all modern browsers with graceful degradation:
    
    - **Chrome 91+** ✅ Full support
    - **Firefox 90+** ✅ Full support  
    - **Safari 14+** ✅ Full support
    - **Edge 91+** ✅ Full support
    - **Mobile browsers** ✅ Responsive design
    
    **Progressive Enhancement:**
    - Core content loads without JavaScript
    - Interactive features enhance the experience
    - Accessibility features built-in
  </Accordion>
  
  <Accordion title="📱 Enhanced Mobile Experience v2.0">
    Completely redesigned mobile-first experience:
    
    - **Mobile TOC Drawer**: Slide-out table of contents with floating action button
    - **Touch-Optimized Components**: Enhanced touch targets and interactions
    - **Responsive Breakpoints**: Tailwind CSS responsive design system
    - **Mobile Performance**: Optimized rendering and reduced bundle size
    - **Accessibility**: Enhanced ARIA support and keyboard navigation
    - **Gesture Support**: Swipe and pinch interactions where appropriate
  </Accordion>


## 🚨 Enhanced Callout Components v2.0

Use enhanced callouts with improved styling, better accessibility, and mobile-optimized layouts:




## 📊 Advanced Features

### Mathematical Expressions

Our system supports LaTeX math expressions through KaTeX integration:

Inline math: $E = mc^2$ and $\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$

Block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

### Complex Code Examples

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

## 🎨 Styling Examples

### Custom Styled Content

Here's how different markdown elements render with our default theme:

1. **Ordered lists** work perfectly
2. They maintain proper spacing
3. And support nested content

- Unordered lists are also supported
- With consistent bullet styling
  - Including nested items
  - That maintain hierarchy

> **Blockquotes** are styled with a subtle left border and background tint to draw attention to important quotes or excerpts from other sources.

| Feature | Status | Performance | Notes |
|---------|--------|-------------|-------|
| Syntax Highlighting | ✅ Ready | Excellent | 20+ languages supported |
| Math Rendering | ✅ Ready | Good | KaTeX integration |
| Table of Contents | ✅ Ready | Excellent | Auto-generated with smooth scroll |
| Dark Mode | ✅ Ready | Excellent | CSS variable based |
| Mobile Support | ✅ Ready | Excellent | Responsive design |
| Plugin System | ✅ Ready | Good | Remark/Rehype compatible |

---

## 🚀 Getting Started with v2.0

Ready to implement the enhanced MDX Viewer v2.0 with Tailwind CSS? Here's everything you need:

<Card title="📖 Documentation" icon="📚" href="/docs">
  Complete guides, API reference, and examples to help you get started quickly and build amazing experiences.
</Card>

<Card title="🎮 Interactive Demo" icon="🎯" href="/demo" horizontal>
  Try out all components in an interactive playground. Perfect for testing and experimentation.
</Card>

<Card title="💾 Download" icon="⬇️" href="/download">
  Get the latest version from npm, GitHub, or use our CDN links for quick prototyping and development.
</Card>


---

*This showcase demonstrates the enhanced power and flexibility of our MDX Viewer v2.0 system with Tailwind CSS integration. Every component features mobile-first responsive design, enhanced accessibility, and improved performance. Try the mobile TOC on smaller screens!*
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

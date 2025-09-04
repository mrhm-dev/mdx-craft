import { Example } from '@/store/editorStore'

export const mdxExamples: Example[] = [
  {
    id: 'basic-markdown',
    title: 'Basic Markdown',
    description: 'Standard markdown syntax with headings, lists, and formatting',
    content: `# Welcome to MDX Playground

This is a paragraph with **bold text** and *italic text*.

## Features

- Live preview with manual refresh
- Support for markdown syntax
- Component integration
- Code highlighting

### Formatting Examples

You can use \`inline code\` and also create links like [MDX Documentation](https://mdxjs.com).

> This is a blockquote with some inspiring text.
> It can span multiple lines.

---

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List
1. First step
2. Second step
3. Third step`,
  },
  {
    id: 'components',
    title: 'Rich Content',
    description: 'Images, links, and rich markdown content',
    content: `# Rich Markdown Content

This example shows various markdown features for rich content creation.

## Images

![Placeholder Image](https://via.placeholder.com/400x200/0ea5e9/ffffff?text=Sample+Image)

*Caption: This is a sample image with caption*

## Links and References

Visit [MDX Documentation](https://mdxjs.com) for more information.

You can also use reference-style links like [this one][1].

[1]: https://mdxjs.com

## Emphasis and Formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ***Bold and italic*** for strong emphasis
- ~~Strikethrough~~ for corrections
- \`inline code\` for technical terms

## Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste
Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save

## Horizontal Rules

Content above the rule

---

Content below the rule

## Nested Lists

1. First level item
   - Second level bullet
   - Another second level
     1. Third level numbered
     2. Another third level
2. Back to first level`,
  },
  {
    id: 'code-blocks',
    title: 'Code Examples',
    description: 'Syntax highlighting and code blocks',
    content: `# Code Blocks

MDX supports syntax highlighting for various programming languages.

## JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // 55
\`\`\`

## TypeScript

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserService {
  private users: Map<string, User> = new Map();
  
  addUser(user: User): void {
    this.users.set(user.id, user);
  }
  
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }
}
\`\`\`

## React Component

\`\`\`jsx
const TodoItem = ({ todo, onToggle }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
    </div>
  );
};
\`\`\`

## CSS

\`\`\`css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
\`\`\``,
  },
  {
    id: 'tables-lists',
    title: 'Tables & Advanced',
    description: 'Tables, task lists, and advanced markdown features',
    content: `# Tables and Advanced Features

## Markdown Table

| Feature | Support | Description |
|---------|---------|-------------|
| Tables | ✅ | Create structured data tables |
| Task Lists | ✅ | Interactive checkboxes |
| Footnotes | ✅ | Add references and notes |
| Emoji | 😄 | Use emoji in your content |
| Math | ✅ | LaTeX math expressions |

## Task List

- [x] Create MDX content
- [x] Add component support
- [ ] Implement live preview
- [ ] Add syntax highlighting
- [ ] Deploy to production

## Math Expressions

Inline math: $E = mc^2$

Block math:

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}
$$

## Definition Lists

MDX
: Markdown for the component era

React
: A JavaScript library for building user interfaces

TypeScript
: JavaScript with syntax for types

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## HTML Elements

You can also use basic HTML elements:

<details>
  <summary>Click to expand</summary>
  
  This content is hidden by default and can be expanded by clicking the summary.
  
  - Item 1
  - Item 2
  - Item 3
</details>

## Keyboard Shortcuts

<kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open command palette`,
  },
]

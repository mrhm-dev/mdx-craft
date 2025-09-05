export const tablesLists = {
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
}

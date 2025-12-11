---
'mdx-craft': minor
---

#### 🎉 New FolderStructure Component

- **27b1fbf, 1b86a89, be8b3a9**: Added interactive folder and file tree visualization component
  - New `<FolderStructure>`, `<Folder>`, and `<File>` components for rendering file/folder hierarchies
  - Context-based state management for folder collapse/expand states
  - Unique folder path tracking to preserve individual folder states
  - Smooth animations and hover effects for better UX
  - Right-aligned chevron icons that appear on hover or when folders are expanded
  - Professional tree-style visual design with subtle vertical lines
  - Support for nested folder structures with automatic depth tracking
  - `defaultCollapsed` prop to control initial folder states
  - Clean, responsive layout with text truncation for long names

  **New Icon Components:**
  - `FileIcon` - Icon for file items
  - `FolderIcon` - Icon for folder items
  - `ImageIcon` - Special icon for image files

  **Usage Example:**

  ```tsx
  <FolderStructure>
    <Folder name="src">
      <File name="index.ts" />
      <Folder name="components">
        <File name="Button.tsx" />
      </Folder>
    </Folder>
  </FolderStructure>
  ```

### Improvements

- Enhanced folder state persistence - folders maintain their collapsed/expanded state independently
- Improved visual hierarchy with subtle borders and hover states
- Optimized rendering with memoized context values and callbacks

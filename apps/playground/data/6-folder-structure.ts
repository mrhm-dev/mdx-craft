export const folderStructure = {
  id: 'folder-structure',
  title: 'Folder Structure',
  description: 'Interactive folder and file tree visualization',
  content: `# Folder Structure Component

Visualize your project's file and folder structure with an interactive, collapsible tree view.

## Basic Example

Click on folders to expand or collapse them:

<FolderStructure>
  <Folder name="my-project">
    <File name="package.json" />
    <File name="README.md" />
    <File name="tsconfig.json" />
    <Folder name="src">
      <File name="index.ts" />
      <File name="app.ts" />
    </Folder>
    <Folder name="public">
      <File name="index.html" />
      <File name="logo.png" image />
    </Folder>
  </Folder>
</FolderStructure>

## Collapsed by Default

Use \`defaultCollapsed\` to start folders in a collapsed state:

<FolderStructure>
  <Folder name="project-root">
    <File name="package.json" />
    <File name="README.md" />
    <Folder name="src">
      <File name="index.ts" />
      <Folder name="components">
        <File name="Button.tsx" />
        <File name="Card.tsx" />
        <File name="Input.tsx" />
      </Folder>
    </Folder>
    <Folder name="node_modules" defaultCollapsed>
      <File name="react" />
      <File name="react-dom" />
      <File name="typescript" />
      <File name="next" />
      <Folder name="@types">
        <File name="react" />
        <File name="node" />
      </Folder>
    </Folder>
    <Folder name="dist" defaultCollapsed>
      <File name="index.js" />
      <File name="index.d.ts" />
      <File name="bundle.js" />
      <File name="bundle.css" />
    </Folder>
  </Folder>
</FolderStructure>

## Monorepo Structure

<FolderStructure>
  <Folder name="my-monorepo">
    <File name="package.json" />
    <File name="pnpm-workspace.yaml" />
    <File name="turbo.json" />
    <Folder name="apps">
      <Folder name="web">
        <File name="package.json" />
        <Folder name="app">
          <File name="layout.tsx" />
          <File name="page.tsx" />
        </Folder>
        <Folder name="components">
          <File name="Header.tsx" />
          <File name="Footer.tsx" />
        </Folder>
      </Folder>
      <Folder name="docs">
        <File name="package.json" />
        <Folder name="content">
          <File name="guide.mdx" />
          <File name="api.mdx" />
        </Folder>
      </Folder>
    </Folder>
    <Folder name="packages">
      <Folder name="ui">
        <File name="package.json" />
        <Folder name="src">
          <File name="index.ts" />
          <Folder name="components">
            <File name="Button.tsx" />
            <File name="Card.tsx" />
          </Folder>
        </Folder>
      </Folder>
      <Folder name="utils">
        <File name="package.json" />
        <Folder name="src">
          <File name="index.ts" />
          <File name="helpers.ts" />
        </Folder>
      </Folder>
    </Folder>
  </Folder>
</FolderStructure>

## With Images

Use the \`image\` prop to display image files with a purple icon:

<FolderStructure>
  <Folder name="assets">
    <Folder name="images">
      <File name="logo.svg" image />
      <File name="hero.jpg" image />
      <File name="background.png" image />
      <Folder name="icons">
        <File name="favicon.ico" image />
        <File name="apple-touch-icon.png" image />
      </Folder>
    </Folder>
    <Folder name="fonts">
      <File name="inter-regular.woff2" />
      <File name="inter-bold.woff2" />
    </Folder>
    <Folder name="videos" defaultCollapsed>
      <File name="intro.mp4" />
      <File name="demo.webm" />
    </Folder>
  </Folder>
</FolderStructure>

## Next.js Project

<FolderStructure>
  <Folder name="nextjs-app">
    <File name="package.json" />
    <File name="next.config.js" />
    <File name="tsconfig.json" />
    <Folder name="app">
      <File name="layout.tsx" />
      <File name="page.tsx" />
      <File name="globals.css" />
      <Folder name="api">
        <Folder name="users">
          <File name="route.ts" />
        </Folder>
      </Folder>
      <Folder name="dashboard">
        <File name="page.tsx" />
        <File name="layout.tsx" />
      </Folder>
    </Folder>
    <Folder name="components">
      <File name="Header.tsx" />
      <File name="Footer.tsx" />
      <File name="Navigation.tsx" />
    </Folder>
    <Folder name="lib">
      <File name="utils.ts" />
      <File name="db.ts" />
    </Folder>
    <Folder name="public">
      <File name="logo.svg" image />
      <File name="favicon.ico" image />
    </Folder>
  </Folder>
</FolderStructure>

## Component Library

<FolderStructure>
  <Folder name="ui-library">
    <File name="package.json" />
    <File name="tsconfig.json" />
    <Folder name="src">
      <File name="index.ts" />
      <Folder name="components">
        <Folder name="Button">
          <File name="Button.tsx" />
          <File name="Button.test.tsx" />
          <File name="Button.stories.tsx" />
        </Folder>
        <Folder name="Card">
          <File name="Card.tsx" />
          <File name="Card.test.tsx" />
          <File name="Card.stories.tsx" />
        </Folder>
        <Folder name="Input">
          <File name="Input.tsx" />
          <File name="Input.test.tsx" />
        </Folder>
      </Folder>
      <Folder name="hooks">
        <File name="useTheme.ts" />
        <File name="useMedia.ts" />
      </Folder>
      <Folder name="utils">
        <File name="cn.ts" />
        <File name="colors.ts" />
      </Folder>
    </Folder>
    <Folder name="dist" defaultCollapsed>
      <File name="index.js" />
      <File name="index.d.ts" />
    </Folder>
  </Folder>
</FolderStructure>

## Features

- 📁 **Collapsible folders** - Click to expand/collapse
- 🔽 **Default collapsed** - Use \`defaultCollapsed\` prop
- 🎨 **Color-coded icons** - Folders (amber), Files (blue), Images (purple)
- 🌲 **Tree lines** - Visual hierarchy with connecting lines
- ⌨️ **Monospace font** - Authentic file system look
- 🔄 **Smooth animations** - Chevron rotates on expand/collapse
`,
}

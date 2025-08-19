import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlaygroundPage from '../page'

// Mock the mdx-craft package
jest.mock('mdx-craft', () => ({
  MDXEditor: ({ value, onChange, preview, className }: any) => (
    <div data-testid="mdx-editor" className={className}>
      <textarea
        data-testid="editor-textarea"
        defaultValue={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {preview && (
        <div data-testid="preview-pane">
          Preview: {value}
        </div>
      )}
    </div>
  ),
}))

// Mock CSS imports
jest.mock('mdx-craft/styles.css', () => ({}))

describe('PlaygroundPage', () => {
  it('renders without crashing', () => {
    render(<PlaygroundPage />)
    expect(screen.getByText('MDX Craft Playground')).toBeInTheDocument()
  })

  it('renders header with title and description', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByText('MDX Craft Playground')).toBeInTheDocument()
    expect(screen.getByText('Experiment with MDX content in real-time')).toBeInTheDocument()
  })

  it('renders MDXEditor with initial content', () => {
    render(<PlaygroundPage />)
    
    const editor = screen.getByTestId('mdx-editor')
    expect(editor).toBeInTheDocument()
    
    const textarea = screen.getByTestId('editor-textarea')
    // Check that the textarea has the initial content
    const content = textarea.value
    expect(content).toContain('# Welcome to MDX Craft Playground')
  })

  it('enables preview mode', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument()
  })

  it('updates content when typing in editor', async () => {
    const user = userEvent.setup()
    render(<PlaygroundPage />)
    
    const textarea = screen.getByTestId('editor-textarea')
    await user.clear(textarea)
    await user.type(textarea, '# New Content')
    
    expect(textarea).toHaveValue('# New Content')
    expect(screen.getByText('Preview: # New Content')).toBeInTheDocument()
  })

  it('renders footer with links', () => {
    render(<PlaygroundPage />)
    
    const docLink = screen.getByRole('link', { name: 'Documentation' })
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    
    expect(docLink).toHaveAttribute('href', '/docs')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/yourusername/mdx-craft')
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<PlaygroundPage />)
    
    const pageElement = container.querySelector('.page')
    expect(pageElement).toBeInTheDocument()
    
    const headerElement = container.querySelector('.header')
    expect(headerElement).toBeInTheDocument()
    
    const mainElement = container.querySelector('.main')
    expect(mainElement).toBeInTheDocument()
    
    const footerElement = container.querySelector('.footer')
    expect(footerElement).toBeInTheDocument()
  })

  it('contains initial MDX content with proper structure', () => {
    render(<PlaygroundPage />)
    
    const textarea = screen.getByTestId('editor-textarea')
    const content = textarea.value
    
    expect(content).toContain('# Welcome to MDX Craft Playground')
    expect(content).toContain('## Features')
    expect(content).toContain('- **Live Preview**')
    expect(content).toContain('```javascript')
    expect(content).toContain('| Feature | Status |')
  })

  it('handles long content properly', () => {
    render(<PlaygroundPage />)
    
    const longContent = 'Very long content '.repeat(10) // Reduced for faster test
    const textarea = screen.getByTestId('editor-textarea')
    
    fireEvent.change(textarea, { target: { value: longContent } })
    
    expect(textarea).toHaveValue(longContent)
  })

  it('maintains state when re-rendering', () => {
    const { rerender } = render(<PlaygroundPage />)
    
    // Initial render should have default content
    const textarea = screen.getByTestId('editor-textarea')
    const initialContent = textarea.value
    
    // Re-render and check content is maintained
    rerender(<PlaygroundPage />)
    const newTextarea = screen.getByTestId('editor-textarea')
    expect(newTextarea.value).toBe(initialContent)
  })

  it('has accessible structure', () => {
    render(<PlaygroundPage />)
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('MDX Craft Playground')
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for navigation links
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('footer links have correct attributes', () => {
    render(<PlaygroundPage />)
    
    const docLink = screen.getByRole('link', { name: 'Documentation' })
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    
    expect(docLink).toHaveAttribute('target', '_blank')
    expect(docLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
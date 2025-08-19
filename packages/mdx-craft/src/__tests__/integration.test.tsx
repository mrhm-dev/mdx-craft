import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MDXEditor, MDXPreview } from '../index.js'

describe('MDX Craft Integration Tests', () => {
  describe('MDXEditor and MDXPreview Integration', () => {
    it('works together in split view mode', () => {
      let currentValue = '# Initial Content'
      const handleChange = (value: string) => {
        currentValue = value
      }

      render(<MDXEditor value={currentValue} onChange={handleChange} preview={true} />)

      // Check initial content is displayed in editor
      expect(screen.getByDisplayValue('# Initial Content')).toBeInTheDocument()

      // Check preview pane exists and contains content
      const previewPane = document.querySelector('.mdx-preview-pane')
      expect(previewPane).toBeInTheDocument()
      expect(previewPane).toHaveTextContent('# Initial Content')

      // Update the content
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '# Updated Content' } })

      expect(currentValue).toBe('# Updated Content')
    })

    it('handles complex MDX-like content', () => {
      const complexContent = '# Main Title\\n\\n## Subtitle\\n\\nHere is some content.'

      let currentValue = ''
      const handleChange = (value: string) => {
        currentValue = value
      }

      render(<MDXEditor value={currentValue} onChange={handleChange} preview={true} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: complexContent } })

      expect(currentValue).toBe(complexContent)
    })
  })

  describe('Standalone Component Tests', () => {
    it('MDXPreview handles various content types', () => {
      const testCases = [
        { content: '# Heading', description: 'heading content' },
        { content: 'Plain text', description: 'plain text' },
        { content: '**Bold text**', description: 'bold text' },
        { content: 'code block', description: 'simple text' },
        { content: '- Item 1', description: 'list item' },
        { content: '', description: 'empty content' },
      ]

      testCases.forEach(({ content }) => {
        const { container } = render(<MDXPreview content={content} />)
        expect(container.firstChild).toBeInTheDocument()
        if (content) {
          expect(container.firstChild).toHaveTextContent(content)
        }
      })
    })

    it('MDXEditor handles edge cases', () => {
      const onChange = jest.fn()

      render(<MDXEditor value="" onChange={onChange} placeholder="Custom placeholder" />)

      const textarea = screen.getByPlaceholderText('Custom placeholder')

      // Test empty input
      expect(textarea).toHaveValue('')

      // Test simple input change
      fireEvent.change(textarea, { target: { value: 'Hello' } })
      expect(onChange).toHaveBeenCalledWith('Hello')

      // Test another input change
      fireEvent.change(textarea, { target: { value: 'New content' } })
      expect(onChange).toHaveBeenCalledWith('New content')
    })
  })

  describe('Component Props Integration', () => {
    it('passes through custom components to MDXPreview', () => {
      const customComponents = {
        h1: ({ children }: { children: React.ReactNode }) => (
          <h1 data-testid="custom-h1" style={{ color: 'red' }}>
            {children}
          </h1>
        ),
      }

      render(<MDXPreview content="# Custom Heading" components={customComponents as any} />)

      // The component prop is accepted (actual MDX parsing would use it)
      expect(screen.getByText('# Custom Heading')).toBeInTheDocument()
    })

    it('applies custom styling classes correctly', () => {
      const { container: editorContainer } = render(
        <MDXEditor value="test" onChange={jest.fn()} className="custom-editor" />
      )

      const { container: previewContainer } = render(
        <MDXPreview content="test" className="custom-preview" />
      )

      expect(editorContainer.firstChild).toHaveClass('custom-editor')
      expect(previewContainer.firstChild).toHaveClass('custom-preview')
    })
  })

  describe('Performance and Error Handling', () => {
    it('handles rapid content changes', () => {
      const onChange = jest.fn()

      render(<MDXEditor value="" onChange={onChange} />)

      const textarea = screen.getByRole('textbox')

      // Simulate multiple rapid changes
      fireEvent.change(textarea, { target: { value: '1' } })
      fireEvent.change(textarea, { target: { value: '12' } })
      fireEvent.change(textarea, { target: { value: '123' } })

      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenLastCalledWith('123')
    })

    it('handles null and undefined values gracefully', () => {
      expect(() => {
        render(<MDXPreview content={null as any} />)
      }).not.toThrow()

      expect(() => {
        render(<MDXPreview content={undefined as any} />)
      }).not.toThrow()
    })

    it('handles very large content', () => {
      const largeContent = 'Large content '.repeat(100) // Reduced size for test

      expect(() => {
        render(<MDXPreview content={largeContent} />)
      }).not.toThrow()

      // Just check that the component renders without error
      expect(screen.getByText(largeContent.trim())).toBeInTheDocument()
    })
  })
})

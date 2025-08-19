import React from 'react'
import { render, screen } from '@testing-library/react'
import { MDXPreview } from '../MDXPreview'

describe('MDXPreview', () => {
  it('renders without crashing', () => {
    render(<MDXPreview content="# Hello World" />)
    expect(screen.getByText('# Hello World')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <MDXPreview content="# Test" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('mdx-preview', 'custom-class')
  })

  it('renders with default className when none provided', () => {
    const { container } = render(<MDXPreview content="# Test" />)
    expect(container.firstChild).toHaveClass('mdx-preview')
  })

  it('renders empty content', () => {
    const { container } = render(<MDXPreview content="" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles markdown-like content', () => {
    const content = '# Main Title\\n## Subtitle\\n- List item 1\\n- List item 2'
    render(<MDXPreview content={content} />)
    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('accepts custom components prop', () => {
    const customComponents = {
      h1: ({ children }: { children: React.ReactNode }) => (
        <h1 data-testid="custom-h1">{children}</h1>
      ),
    }
    
    render(
      <MDXPreview content="# Custom Header" components={customComponents} />
    )
    
    // Since we're not actually parsing MDX yet, this tests the prop is accepted
    expect(screen.getByText('# Custom Header')).toBeInTheDocument()
  })

  it('applies prose styling classes', () => {
    const { container } = render(<MDXPreview content="# Test" />)
    const proseElement = container.querySelector('.prose')
    expect(proseElement).toBeInTheDocument()
    expect(proseElement).toHaveClass('prose-slate', 'max-w-none')
  })

  it('handles special characters in content', () => {
    const content = 'Special chars: <>&"'
    render(<MDXPreview content={content} />)
    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('handles multiline content', () => {
    const content = 'Line 1\\nLine 2\\nLine 3'
    render(<MDXPreview content={content} />)
    expect(screen.getByText(content)).toBeInTheDocument()
  })
})
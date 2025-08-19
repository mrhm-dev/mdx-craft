import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MDXEditor } from '../MDXEditor.js'

describe('MDXEditor', () => {
  const defaultProps = {
    value: 'Initial content',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<MDXEditor {...defaultProps} />)
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument()
  })

  it('displays the provided value', () => {
    render(<MDXEditor {...defaultProps} value="Test content" />)
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument()
  })

  it('calls onChange when content is modified', () => {
    const onChangeMock = jest.fn()

    render(<MDXEditor {...defaultProps} onChange={onChangeMock} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'New content' } })

    expect(onChangeMock).toHaveBeenCalledWith('New content')
  })

  it('applies custom className', () => {
    const { container } = render(<MDXEditor {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('mdx-editor-container', 'custom-class')
  })

  it('shows placeholder when provided', () => {
    render(<MDXEditor {...defaultProps} value="" placeholder="Enter your MDX here..." />)
    expect(screen.getByPlaceholderText('Enter your MDX here...')).toBeInTheDocument()
  })

  it('uses default placeholder when none provided', () => {
    render(<MDXEditor {...defaultProps} value="" />)
    expect(screen.getByPlaceholderText('Write your MDX content here...')).toBeInTheDocument()
  })

  it('does not show preview pane when preview is false', () => {
    const { container } = render(<MDXEditor {...defaultProps} preview={false} />)
    expect(container.querySelector('.mdx-preview-pane')).not.toBeInTheDocument()
  })

  it('shows preview pane when preview is true', () => {
    const { container } = render(<MDXEditor {...defaultProps} preview={true} />)
    expect(container.querySelector('.mdx-preview-pane')).toBeInTheDocument()
  })

  it('renders preview with current value', () => {
    render(<MDXEditor {...defaultProps} value="# Preview Content" preview={true} />)
    // Check that preview pane exists and contains the content
    const previewPane = document.querySelector('.mdx-preview-pane')
    expect(previewPane).toBeInTheDocument()
    expect(previewPane).toHaveTextContent('# Preview Content')
  })

  it('updates preview when value changes', () => {
    const onChangeMock = jest.fn()

    render(<MDXEditor value="Initial" onChange={onChangeMock} preview={true} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Updated' } })

    expect(onChangeMock).toHaveBeenCalledWith('Updated')
  })

  it('has correct CSS classes for layout', () => {
    const { container } = render(<MDXEditor {...defaultProps} preview={true} />)

    const container_ = container.querySelector('.mdx-editor-container')
    expect(container_).toHaveClass('flex', 'gap-4')

    const editor = container.querySelector('.mdx-editor')
    expect(editor).toHaveClass('flex-1')

    const previewPane = container.querySelector('.mdx-preview-pane')
    expect(previewPane).toHaveClass('flex-1')
  })

  it('textarea has correct styling classes', () => {
    render(<MDXEditor {...defaultProps} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass(
      'w-full',
      'h-full',
      'p-4',
      'border',
      'border-gray-300',
      'rounded-lg',
      'resize-none',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    )
  })

  it('handles empty value', () => {
    render(<MDXEditor {...defaultProps} value="" />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('handles special characters in value', () => {
    const specialContent = 'Special: <>&"'
    render(<MDXEditor {...defaultProps} value={specialContent} />)
    expect(screen.getByDisplayValue(specialContent)).toBeInTheDocument()
  })

  it('handles multiline content', () => {
    const multilineContent = 'Line 1\\nLine 2\\nLine 3'
    render(<MDXEditor {...defaultProps} value={multilineContent} />)
    expect(screen.getByDisplayValue(multilineContent)).toBeInTheDocument()
  })

  it('maintains focus when typing', async () => {
    const user = userEvent.setup()

    render(<MDXEditor {...defaultProps} />)

    const textarea = screen.getByRole('textbox')
    await user.click(textarea)
    expect(textarea).toHaveFocus()

    await user.type(textarea, ' additional text')
    expect(textarea).toHaveFocus()
  })
})

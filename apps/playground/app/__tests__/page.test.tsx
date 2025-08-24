import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PlaygroundPage from '../page'

// Mock the mdx-craft package
jest.mock('mdx-craft', () => ({
  MDXViewer: () => <div data-testid="mdx-viewer">MDX Viewer</div>,
  TOC: () => <div data-testid="toc">TOC Component</div>,
}))

// Mock next-themes
const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
    resolvedTheme: 'light',
  }),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ href, children }: any) {
    return <a href={href}>{children}</a>
  }
})

// Mock the content file
jest.mock('../../content', () => ({
  comprehensiveSource: 'Test content for MDX',
}))

describe('PlaygroundPage', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders without crashing', () => {
    render(<PlaygroundPage />)
    expect(screen.getByText('MDX Craft: The Modern React MDX Rendering Solution')).toBeTruthy()
  })

  it('renders the playground link', () => {
    render(<PlaygroundPage />)

    const playgroundLink = screen.getByText('Playground')
    expect(playgroundLink).toBeTruthy()
  })

  it('renders MDXViewer component', () => {
    render(<PlaygroundPage />)

    const mdxViewer = screen.getByTestId('mdx-viewer')
    expect(mdxViewer).toBeTruthy()
  })

  it('renders TOC component', () => {
    render(<PlaygroundPage />)

    const toc = screen.getByTestId('toc')
    expect(toc).toBeTruthy()
  })

  it('renders "On this page" text', () => {
    render(<PlaygroundPage />)

    expect(screen.getByText('On this page')).toBeTruthy()
  })

  it('renders theme toggle button', () => {
    render(<PlaygroundPage />)

    const themeButton = screen.getByLabelText('Toggle dark mode')
    expect(themeButton).toBeTruthy()
  })

  it('calls setTheme when theme button is clicked', () => {
    render(<PlaygroundPage />)

    const themeButton = screen.getByLabelText('Toggle dark mode')
    fireEvent.click(themeButton)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})

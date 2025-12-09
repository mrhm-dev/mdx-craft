import { highlightCode, HighlightOptions, getShikiHighlighter } from './shiki-highlighter.js'

describe('highlightCode', () => {
  beforeEach(() => {
    // Clear cache before each test
    getShikiHighlighter().clearCache()
  })

  it('should not return cached content for different code with same options', async () => {
    const code1 = 'const a = 1;'
    const code2 = 'const b = 2;'
    const options: HighlightOptions = {
      language: 'typescript',
      theme: 'github-light',
    }

    const result1 = await highlightCode(code1, options)
    const result2 = await highlightCode(code2, options)

    // Check that results are different
    expect(result1.html).not.toBe(result2.html)

    // Check content (shiki wraps in pre/code/span)
    // We check if the unique part of code is present
    expect(result1.html).toContain('const')
    expect(result1.html).toContain('a')
    expect(result1.html).toContain('1')

    expect(result2.html).toContain('const')
    expect(result2.html).toContain('b')
    expect(result2.html).toContain('2')
  })

  it('should return cached content for same code and options', async () => {
    const code = 'const c = 3;'
    const options: HighlightOptions = {
      language: 'typescript',
      theme: 'github-light',
    }

    const result1 = await highlightCode(code, options)
    const result2 = await highlightCode(code, options)

    expect(result1).toBe(result2) // Should be same object reference if cached
  })
})

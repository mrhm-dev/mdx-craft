import { deepMerge, cn } from '../utils.js'

describe('deepMerge', () => {
  it('should merge simple objects', () => {
    const target = { a: 1, b: 2 }
    const source = { b: 3, c: 4 }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should merge nested objects', () => {
    const target = {
      colors: { primary: 'red', secondary: 'green' },
      typography: { base: 'prose' },
    }
    const source = {
      colors: { primary: 'blue' },
      typography: { size: 'prose-lg' },
    }
    const result = deepMerge(target, source as any)

    expect(result).toEqual({
      colors: { primary: 'blue', secondary: 'green' },
      typography: { base: 'prose', size: 'prose-lg' },
    })
  })

  it('should handle deeply nested objects', () => {
    const target = {
      components: {
        callout: {
          base: 'base-class',
          info: 'info-class',
        },
      },
    }
    const source = {
      components: {
        callout: {
          warning: 'warning-class',
        },
      },
    }
    const result = deepMerge(target, source as any)

    expect(result).toEqual({
      components: {
        callout: {
          base: 'base-class',
          info: 'info-class',
          warning: 'warning-class',
        },
      },
    })
  })

  it('should handle undefined source values', () => {
    const target = { a: 1, b: 2 }
    const source = { a: undefined, c: 3 }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle null source values', () => {
    const target = { a: 1, b: 2 }
    const source = { a: null, c: 3 }
    const result = deepMerge(target, source as any)

    expect(result).toEqual({ a: null, b: 2, c: 3 })
  })

  it('should handle empty objects', () => {
    const target = { a: 1, b: 2 }
    const source = {}
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle arrays (treat as primitive)', () => {
    const target = { items: [1, 2] }
    const source = { items: [3, 4] }
    const result = deepMerge(target, source)

    expect(result).toEqual({ items: [3, 4] })
  })

  it('should not mutate original objects', () => {
    const target = { a: 1, b: { c: 2 } }
    const source = { b: { d: 3 } }
    const originalTarget = JSON.parse(JSON.stringify(target))
    const originalSource = JSON.parse(JSON.stringify(source))

    deepMerge(target, source as any)

    expect(target).toEqual(originalTarget)
    expect(source).toEqual(originalSource)
  })

  it('should handle mixed types correctly', () => {
    const target = {
      string: 'hello',
      number: 42,
      boolean: true,
      object: { nested: 'value' },
    }
    const source = {
      string: 'world',
      number: 100,
      boolean: false,
      object: { another: 'value' },
    }
    const result = deepMerge(target, source as any)

    expect(result).toEqual({
      string: 'world',
      number: 100,
      boolean: false,
      object: { nested: 'value', another: 'value' },
    })
  })
})

describe('cn (class name utility)', () => {
  it('should join multiple class strings', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should filter out falsy values', () => {
    const result = cn('class1', null, undefined, false, 'class2', '')
    expect(result).toBe('class1 class2')
  })

  it('should handle empty array', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle single class', () => {
    const result = cn('single-class')
    expect(result).toBe('single-class')
  })

  it('should handle mixed truthy and falsy values', () => {
    const result = cn('class1', null, 'class2', undefined, 'class3', false, 'class4')
    expect(result).toBe('class1 class2 class3 class4')
  })

  it('should handle whitespace in class names', () => {
    const result = cn('  class1  ', '  class2  ')
    expect(result).toBe('  class1     class2  ')
  })
})

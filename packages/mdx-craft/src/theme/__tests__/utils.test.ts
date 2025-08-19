import { deepMerge, createTheme, cn, getThemeClasses, createComponentClasses } from '../utils.js'
import { defaultTheme } from '../preset.js'
import type { Theme, PartialTheme } from '../types.js'

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

describe('createTheme', () => {
  it('should return default theme when no overrides provided', () => {
    const theme = createTheme()
    expect(theme).toEqual(defaultTheme)
  })

  it('should merge partial theme overrides', () => {
    const overrides: PartialTheme = {
      colors: {
        primary: 'text-red-600 dark:text-red-400',
      },
    }
    const theme = createTheme(overrides)

    expect(theme.colors.primary).toBe('text-red-600 dark:text-red-400')
    expect(theme.colors.secondary).toBe(defaultTheme.colors.secondary)
    expect(theme.typography).toEqual(defaultTheme.typography)
  })

  it('should merge nested component overrides', () => {
    const overrides: PartialTheme = {
      components: {
        callout: {
          info: 'custom-info-class',
        },
      },
    }
    const theme = createTheme(overrides)

    expect(theme.components.callout.info).toBe('custom-info-class')
    expect(theme.components.callout.base).toBe(defaultTheme.components.callout.base)
  })

  it('should handle empty overrides object', () => {
    const theme = createTheme({})
    expect(theme).toEqual(defaultTheme)
  })

  it('should handle undefined overrides', () => {
    const theme = createTheme(undefined)
    expect(theme).toEqual(defaultTheme)
  })

  it('should merge multiple nested levels', () => {
    const overrides: PartialTheme = {
      typography: {
        base: 'custom-prose',
      },
      colors: {
        primary: 'text-blue-600',
      },
      components: {
        card: 'custom-card',
        callout: {
          warning: 'custom-warning',
        },
      },
    }
    const theme = createTheme(overrides)

    expect(theme.typography.base).toBe('custom-prose')
    expect(theme.colors.primary).toBe('text-blue-600')
    expect(theme.components.card).toBe('custom-card')
    expect(theme.components.callout.warning).toBe('custom-warning')
    expect(theme.components.callout.base).toBe(defaultTheme.components.callout.base)
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

describe('getThemeClasses', () => {
  const theme: Theme = {
    typography: {
      base: 'prose prose-gray',
      size: 'prose-base',
      maxWidth: 'max-w-none',
    },
    colors: {
      primary: 'text-emerald-600',
      secondary: 'text-slate-600',
      background: 'bg-white',
      foreground: 'text-zinc-900',
      muted: 'text-zinc-500',
      border: 'border-zinc-200',
      error: 'text-red-600',
      warning: 'text-amber-600',
      success: 'text-green-600',
      info: 'text-blue-600',
    },
    components: {
      card: 'card-class',
      codeBlock: 'code-block-class',
      accordion: 'accordion-class',
      tabs: 'tabs-class',
      callout: {
        base: 'callout-base',
        info: 'callout-info',
        warning: 'callout-warning',
        tip: 'callout-tip',
        note: 'callout-note',
        important: 'callout-important',
        caution: 'callout-caution',
      },
      toc: {
        container: 'toc-container',
        mobile: 'toc-mobile',
        button: 'toc-button',
        list: 'toc-list',
        item: 'toc-item',
        activeItem: 'toc-active-item',
        heading: 'toc-heading',
      },
    },
  }

  const themeClasses = getThemeClasses(theme)

  describe('colors', () => {
    it('should return correct color class', () => {
      expect(themeClasses.colors('primary')).toBe('text-emerald-600')
      expect(themeClasses.colors('secondary')).toBe('text-slate-600')
      expect(themeClasses.colors('error')).toBe('text-red-600')
    })

    it('should handle all color keys', () => {
      const colorKeys: Array<keyof Theme['colors']> = [
        'primary',
        'secondary',
        'background',
        'foreground',
        'muted',
        'border',
        'error',
        'warning',
        'success',
        'info',
      ]

      colorKeys.forEach((key) => {
        expect(themeClasses.colors(key)).toBe(theme.colors[key])
      })
    })
  })

  describe('typography', () => {
    it('should combine typography classes', () => {
      const result = themeClasses.typography()
      expect(result).toBe('prose prose-gray prose-base max-w-none')
    })
  })

  describe('components', () => {
    it('should return component class for simple components', () => {
      expect(themeClasses.components('card')).toBe('card-class')
      expect(themeClasses.components('codeBlock')).toBe('code-block-class')
      expect(themeClasses.components('accordion')).toBe('accordion-class')
      expect(themeClasses.components('tabs')).toBe('tabs-class')
    })

    it('should return base class for callout component', () => {
      expect(themeClasses.components('callout')).toBe('callout-base')
    })

    it('should return container class for toc component', () => {
      expect(themeClasses.components('toc')).toBe('toc-container')
    })

    it('should return empty string for unknown component', () => {
      // @ts-expect-error - testing unknown component
      expect(themeClasses.components('unknown')).toBe('')
    })
  })

  describe('callout', () => {
    it('should return base class for base variant', () => {
      expect(themeClasses.callout('base')).toBe('callout-base')
    })

    it('should combine base and variant classes for other variants', () => {
      expect(themeClasses.callout('info')).toBe('callout-base callout-info')
      expect(themeClasses.callout('warning')).toBe('callout-base callout-warning')
      expect(themeClasses.callout('tip')).toBe('callout-base callout-tip')
      expect(themeClasses.callout('note')).toBe('callout-base callout-note')
      expect(themeClasses.callout('important')).toBe('callout-base callout-important')
      expect(themeClasses.callout('caution')).toBe('callout-base callout-caution')
    })
  })

  describe('toc', () => {
    it('should return correct toc element class', () => {
      expect(themeClasses.toc('container')).toBe('toc-container')
      expect(themeClasses.toc('mobile')).toBe('toc-mobile')
      expect(themeClasses.toc('button')).toBe('toc-button')
      expect(themeClasses.toc('list')).toBe('toc-list')
      expect(themeClasses.toc('item')).toBe('toc-item')
      expect(themeClasses.toc('activeItem')).toBe('toc-active-item')
      expect(themeClasses.toc('heading')).toBe('toc-heading')
    })
  })
})

describe('createComponentClasses', () => {
  const theme: Theme = {
    typography: {
      base: 'prose prose-gray',
      size: 'prose-base',
      maxWidth: 'max-w-none',
    },
    colors: {
      primary: 'text-emerald-600',
      secondary: 'text-slate-600',
      background: 'bg-white',
      foreground: 'text-zinc-900',
      muted: 'text-zinc-500',
      border: 'border-zinc-200',
      error: 'text-red-600',
      warning: 'text-amber-600',
      success: 'text-green-600',
      info: 'text-blue-600',
    },
    components: {
      card: 'card-class',
      codeBlock: 'code-block-class',
      accordion: 'accordion-class',
      tabs: 'tabs-class',
      callout: {
        base: 'callout-base',
        info: 'callout-info',
        warning: 'callout-warning',
        tip: 'callout-tip',
        note: 'callout-note',
        important: 'callout-important',
        caution: 'callout-caution',
      },
      toc: {
        container: 'toc-container',
        mobile: 'toc-mobile',
        button: 'toc-button',
        list: 'toc-list',
        item: 'toc-item',
        activeItem: 'toc-active-item',
        heading: 'toc-heading',
      },
    },
  }

  const componentClasses = createComponentClasses(theme)

  describe('buildContentClasses', () => {
    it('should build content classes without additional classes', () => {
      const result = componentClasses.buildContentClasses()
      expect(result).toBe('prose prose-gray prose-base max-w-none')
    })

    it('should build content classes with additional classes', () => {
      const result = componentClasses.buildContentClasses('custom-class')
      expect(result).toBe('prose prose-gray prose-base max-w-none custom-class')
    })

    it('should handle multiple additional classes', () => {
      const result = componentClasses.buildContentClasses('class1 class2')
      expect(result).toBe('prose prose-gray prose-base max-w-none class1 class2')
    })
  })

  describe('buildComponentClasses', () => {
    it('should build component classes without additional classes', () => {
      const result = componentClasses.buildComponentClasses('card')
      expect(result).toBe('card-class')
    })

    it('should build component classes with additional classes', () => {
      const result = componentClasses.buildComponentClasses('card', 'custom-class')
      expect(result).toBe('card-class custom-class')
    })

    it('should handle callout component', () => {
      const result = componentClasses.buildComponentClasses('callout', 'custom-class')
      expect(result).toBe('callout-base custom-class')
    })

    it('should handle toc component', () => {
      const result = componentClasses.buildComponentClasses('toc', 'custom-class')
      expect(result).toBe('toc-container custom-class')
    })
  })

  describe('buildCalloutClasses', () => {
    it('should build base callout classes', () => {
      const result = componentClasses.buildCalloutClasses('base')
      expect(result).toBe('callout-base')
    })

    it('should build variant callout classes', () => {
      const result = componentClasses.buildCalloutClasses('info')
      expect(result).toBe('callout-base callout-info')
    })

    it('should build callout classes with additional classes', () => {
      const result = componentClasses.buildCalloutClasses('warning', 'custom-class')
      expect(result).toBe('callout-base callout-warning custom-class')
    })

    it('should handle all callout variants', () => {
      const variants: Array<keyof Theme['components']['callout']> = [
        'base',
        'info',
        'warning',
        'tip',
        'note',
        'important',
        'caution',
      ]

      variants.forEach((variant) => {
        const result = componentClasses.buildCalloutClasses(variant)
        if (variant === 'base') {
          expect(result).toBe('callout-base')
        } else {
          expect(result).toBe(`callout-base callout-${variant}`)
        }
      })
    })
  })

  describe('buildTOCClasses', () => {
    it('should build regular toc classes', () => {
      const result = componentClasses.buildTOCClasses('item')
      expect(result).toBe('toc-item')
    })

    it('should build active toc item classes', () => {
      const result = componentClasses.buildTOCClasses('item', true)
      expect(result).toBe('toc-active-item')
    })

    it('should build toc classes with additional classes', () => {
      const result = componentClasses.buildTOCClasses('container', false, 'custom-class')
      expect(result).toBe('toc-container custom-class')
    })

    it('should build active toc item with additional classes', () => {
      const result = componentClasses.buildTOCClasses('item', true, 'custom-class')
      expect(result).toBe('toc-active-item custom-class')
    })

    it('should handle non-item elements with isActive flag', () => {
      const result = componentClasses.buildTOCClasses('heading', true)
      expect(result).toBe('toc-heading')
    })

    it('should handle all toc elements', () => {
      const elements: Array<keyof Theme['components']['toc']> = [
        'container',
        'mobile',
        'button',
        'list',
        'item',
        'activeItem',
        'heading',
      ]

      elements.forEach((element) => {
        const result = componentClasses.buildTOCClasses(element)
        // buildTOCClasses uses the theme's toc classes, which would be like 'toc-item', 'toc-active-item', etc.
        const expected = element === 'activeItem' ? 'toc-active-item' : `toc-${element}`
        expect(result).toBe(expected)
      })
    })
  })
})

describe('Edge Cases and Error Handling', () => {
  it('should handle deepMerge with circular references gracefully', () => {
    const obj1: any = { a: 1 }
    const obj2: any = { b: 2 }
    obj1.circular = obj2
    obj2.circular = obj1

    // This should not throw and should handle the circular reference
    expect(() => deepMerge(obj1, { d: 3 })).not.toThrow()
  })

  it('should handle deepMerge with functions', () => {
    const target = { fn: () => 'target' }
    const source = { fn: () => 'source' }
    const result = deepMerge(target, source)

    expect(result.fn).toBe(source.fn)
  })

  it('should handle createTheme with malformed overrides', () => {
    const malformedOverrides = {
      colors: null,
      typography: undefined,
      components: 'not-an-object',
    } as any

    // Should not throw and should handle gracefully
    expect(() => createTheme(malformedOverrides)).not.toThrow()
  })

  it('should handle cn with various falsy values', () => {
    expect(cn(0 as any, false, null, undefined, '', NaN as any)).toBe('')
    expect(cn('valid', 0 as any, false, null, undefined, '', NaN as any, 'also-valid')).toBe(
      'valid also-valid'
    )
  })

  it('should handle getThemeClasses with minimal theme', () => {
    const minimalTheme: Theme = {
      typography: { base: '', size: '', maxWidth: '' },
      colors: {
        primary: '',
        secondary: '',
        background: '',
        foreground: '',
        muted: '',
        border: '',
        error: '',
        warning: '',
        success: '',
        info: '',
      },
      components: {
        card: '',
        codeBlock: '',
        accordion: '',
        tabs: '',
        callout: {
          base: '',
          info: '',
          warning: '',
          tip: '',
          note: '',
          important: '',
          caution: '',
        },
        toc: {
          container: '',
          mobile: '',
          button: '',
          list: '',
          item: '',
          activeItem: '',
          heading: '',
        },
      },
    }

    const themeClasses = getThemeClasses(minimalTheme)
    expect(themeClasses.typography()).toBe('')
    expect(themeClasses.colors('primary')).toBe('')
  })
})

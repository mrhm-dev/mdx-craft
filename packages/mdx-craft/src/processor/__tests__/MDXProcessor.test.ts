import { MDXProcessor } from '../MDXProcessor.js'
import type { CompilerOptions } from '../types.js'
import React from 'react'

// Mock components for testing
const mockComponents = {
  Button: ({ children }: { children: React.ReactNode }) =>
    React.createElement('button', { className: 'test-button' }, children),
  Card: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { className: 'test-card' }, children),
}

describe('MDXProcessor', () => {
  let processor: MDXProcessor

  beforeEach(() => {
    processor = new MDXProcessor()
  })

  afterEach(() => {
    processor.clearCache()
  })

  describe('constructor', () => {
    it('should create processor with default configuration', () => {
      const stats = processor.getCacheStats()
      expect(stats.maxSize).toBe(10 * 1024 * 1024) // 10MB
      expect(stats.entries).toBe(0)
    })

    it('should create processor with custom configuration', () => {
      const customProcessor = new MDXProcessor({
        cacheEnabled: false,
        cacheMaxSize: 5,
        cacheTTL: 60000,
      })
      const stats = customProcessor.getCacheStats()
      expect(stats.maxSize).toBe(5 * 1024 * 1024) // 5MB
    })
  })

  describe('compile (async)', () => {
    it('should compile simple MDX content', async () => {
      const options: CompilerOptions = {
        source: '# Hello World\n\nThis is a test.',
        components: {},
        generateTOC: true, // Need to explicitly enable TOC
      }

      const result = await processor.compile(options)

      expect(result.content).toBeTruthy()
      expect(result.metadata.headings).toHaveLength(1)
      expect(result.metadata.headings[0]).toEqual({
        id: 'hello-world',
        text: 'Hello World',
        level: 1,
      })
      expect(result.metadata.cacheHit).toBe(false)
      expect(result.error).toBeUndefined()
    })

    it('should compile MDX with custom components', async () => {
      const options: CompilerOptions = {
        source: '<Button>Click me</Button>',
        components: mockComponents,
      }

      const result = await processor.compile(options)

      expect(result.content).toBeTruthy()
      expect(result.metadata.componentCount).toBe(2)
      expect(result.error).toBeUndefined()
    })

    it('should use cache on second compilation', async () => {
      const options: CompilerOptions = {
        source: '# Cached Content',
        components: {},
      }

      // First compilation
      const result1 = await processor.compile(options)
      expect(result1.metadata.cacheHit).toBe(false)

      // Second compilation (should hit cache)
      const result2 = await processor.compile(options)
      expect(result2.metadata.cacheHit).toBe(true)
      expect(result2.metadata.duration).toBeLessThan(result1.metadata.duration)
    })

    it('should handle compilation errors gracefully', async () => {
      const options: CompilerOptions = {
        source: '{invalid jsx}',
        components: {},
      }

      const result = await processor.compile(options)

      expect(result.content).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('Could not parse')
      expect(result.metadata.headings).toEqual([])
    })

    it('should generate TOC when enabled', async () => {
      const options: CompilerOptions = {
        source: '# First\n## Second\n### Third\n# Fourth',
        components: {},
        generateTOC: true,
      }

      const result = await processor.compile(options)

      expect(result.metadata.headings).toHaveLength(4)
      expect(result.metadata.headings[0]?.level).toBe(1)
      expect(result.metadata.headings[1]?.level).toBe(2)
      expect(result.metadata.headings[2]?.level).toBe(3)
      expect(result.metadata.headings[3]?.level).toBe(1)
    })

    it('should work with custom remark plugins', async () => {
      const customPlugin = () => (tree: any) => {
        // Simple plugin that counts nodes
        const visit = (node: any) => {
          if (node.children) {
            node.children.forEach(visit)
          }
        }
        visit(tree)
        return tree
      }

      const options: CompilerOptions = {
        source: '# Test\n\nWith custom plugin',
        components: {},
        remarkPlugins: [customPlugin],
      }

      const result = await processor.compile(options)
      expect(result.error).toBeUndefined()
      expect(result.content).toBeTruthy()
    })

    it('should work with custom rehype plugins', async () => {
      const customPlugin = () => (tree: any) => tree

      const options: CompilerOptions = {
        source: '# Test\n\nWith rehype plugin',
        components: {},
        rehypePlugins: [customPlugin],
      }

      const result = await processor.compile(options)
      expect(result.error).toBeUndefined()
      expect(result.content).toBeTruthy()
    })

    it('should respect development mode setting', async () => {
      const options: CompilerOptions = {
        source: '# Development Mode Test',
        components: {},
        development: true,
      }

      const result = await processor.compile(options)
      expect(result.error).toBeUndefined()
      expect(result.content).toBeTruthy()
    })
  })

  describe('compileSync', () => {
    it('should compile simple MDX content synchronously', () => {
      const options: CompilerOptions = {
        source: '# Hello Sync\n\nThis is a sync test.',
        components: {},
        generateTOC: true,
      }

      const result = processor.compileSync(options)

      expect(result.error).toBeUndefined()
      expect(result.content).toBeTruthy()
      expect(result.metadata.headings).toHaveLength(1)
      expect(result.metadata.headings[0]).toEqual({
        id: 'hello-sync',
        text: 'Hello Sync',
        level: 1,
      })
      expect(result.metadata.cacheHit).toBe(false)
    })

    it('should use cache on second sync compilation', () => {
      const options: CompilerOptions = {
        source: '# Cached Sync Content',
        components: {},
      }

      // First compilation
      const result1 = processor.compileSync(options)
      expect(result1.metadata.cacheHit).toBe(false)

      // Second compilation (should hit cache)
      const result2 = processor.compileSync(options)
      expect(result2.metadata.cacheHit).toBe(true)
      expect(result2.metadata.duration).toBeLessThan(result1.metadata.duration)
    })

    it('should handle sync compilation errors gracefully', () => {
      const options: CompilerOptions = {
        source: '{invalid jsx sync}',
        components: {},
      }

      const result = processor.compileSync(options)

      expect(result.content).toBeNull()
      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('Could not parse')
      expect(result.metadata.headings).toEqual([])
    })

    it('should share cache between async and sync methods', async () => {
      const options: CompilerOptions = {
        source: '# Shared Cache Test',
        components: {},
      }

      // First async compilation
      const asyncResult = await processor.compile(options)
      expect(asyncResult.metadata.cacheHit).toBe(false)

      // Sync compilation should hit cache
      const syncResult = processor.compileSync(options)
      expect(syncResult.metadata.cacheHit).toBe(true)
    })
  })

  describe('cache management', () => {
    it('should clear cache', async () => {
      const options: CompilerOptions = {
        source: '# Cache Clear Test',
        components: {},
      }

      // Compile and cache
      await processor.compile(options)
      expect(processor.getCacheStats().entries).toBe(1)

      // Clear cache
      processor.clearCache()
      expect(processor.getCacheStats().entries).toBe(0)

      // Next compilation should not hit cache
      const result = await processor.compile(options)
      expect(result.metadata.cacheHit).toBe(false)
    })

    it('should respect cache disabled configuration', async () => {
      const noCacheProcessor = new MDXProcessor({
        cacheEnabled: false,
      })

      const options: CompilerOptions = {
        source: '# No Cache Test',
        components: {},
      }

      // First compilation
      const result1 = await noCacheProcessor.compile(options)
      expect(result1.metadata.cacheHit).toBe(false)

      // Second compilation should also miss cache
      const result2 = await noCacheProcessor.compile(options)
      expect(result2.metadata.cacheHit).toBe(false)
    })

    it('should generate different cache keys for different sources', async () => {
      const options1: CompilerOptions = {
        source: '# Content 1',
        components: {},
      }

      const options2: CompilerOptions = {
        source: '# Content 2',
        components: {},
      }

      await processor.compile(options1)
      await processor.compile(options2)

      expect(processor.getCacheStats().entries).toBe(2)
    })

    it('should generate different cache keys for different components', async () => {
      const options1: CompilerOptions = {
        source: '# Same Content',
        components: { Button: mockComponents.Button },
      }

      const options2: CompilerOptions = {
        source: '# Same Content',
        components: { Card: mockComponents.Card },
      }

      await processor.compile(options1)
      await processor.compile(options2)

      expect(processor.getCacheStats().entries).toBe(2)
    })

    it('should generate different cache keys for different plugin configurations', async () => {
      const plugin1 = () => (tree: any) => tree
      const plugin2 = () => (tree: any) => tree

      const options1: CompilerOptions = {
        source: '# Same Content',
        components: {},
        remarkPlugins: [plugin1],
      }

      const options2: CompilerOptions = {
        source: '# Same Content',
        components: {},
        remarkPlugins: [plugin1, plugin2],
      }

      await processor.compile(options1)
      await processor.compile(options2)

      expect(processor.getCacheStats().entries).toBe(2)
    })
  })

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const stats1 = processor.getCacheStats()
      expect(stats1.entries).toBe(0)
      expect(stats1.size).toBe(0)
      expect(stats1.hitRate).toBe(0)

      // Add some entries
      await processor.compile({
        source: '# Test 1',
        components: {},
      })

      await processor.compile({
        source: '# Test 2',
        components: {},
      })

      const stats2 = processor.getCacheStats()
      expect(stats2.entries).toBe(2)
      expect(stats2.size).toBeGreaterThan(0)
    })
  })

  describe('precompile', () => {
    it('should precompile multiple sources', async () => {
      const sources = [
        {
          key: 'source1',
          options: {
            source: '# Source 1',
            components: {},
          } as CompilerOptions,
        },
        {
          key: 'source2',
          options: {
            source: '# Source 2',
            components: {},
          } as CompilerOptions,
        },
        {
          key: 'source3',
          options: {
            source: '# Source 3',
            components: {},
          } as CompilerOptions,
        },
      ]

      await processor.precompile(sources)

      // All sources should be cached
      expect(processor.getCacheStats().entries).toBe(3)

      // Compiling them again should hit cache
      for (const { options } of sources) {
        const result = await processor.compile(options)
        expect(result.metadata.cacheHit).toBe(true)
      }
    })

    it('should handle precompile errors gracefully', async () => {
      const sources = [
        {
          key: 'valid',
          options: {
            source: '# Valid',
            components: {},
          } as CompilerOptions,
        },
        {
          key: 'invalid',
          options: {
            source: '{invalid}',
            components: {},
          } as CompilerOptions,
        },
      ]

      // Should not throw even with invalid source
      await expect(processor.precompile(sources)).resolves.not.toThrow()

      // Valid source should still be cached
      const validResult = await processor.compile(sources[0]!.options)
      expect(validResult.metadata.cacheHit).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty source', async () => {
      const options: CompilerOptions = {
        source: '',
        components: {},
      }

      const result = await processor.compile(options)
      expect(result.content).toBeTruthy()
      expect(result.metadata.headings).toEqual([])
      expect(result.error).toBeUndefined()
    })

    it('should handle very large content', async () => {
      const largeContent = '# Heading\n\n' + 'This is a paragraph.\n\n'.repeat(1000)
      const options: CompilerOptions = {
        source: largeContent,
        components: {},
      }

      const result = await processor.compile(options)
      expect(result.content).toBeTruthy()
      expect(result.error).toBeUndefined()
    })

    it('should handle special characters in headings', async () => {
      const options: CompilerOptions = {
        source: '# Hello & World!\n## Test @ 123\n### Special #$% Characters',
        components: {},
        generateTOC: true,
      }

      const result = await processor.compile(options)
      expect(result.metadata.headings).toHaveLength(3)
      expect(result.metadata.headings[0]?.id).toBe('hello-world')
      expect(result.metadata.headings[1]?.id).toBe('test-123')
      expect(result.metadata.headings[2]?.id).toBe('special-characters')
    })

    it('should handle MDX without complex imports', async () => {
      const options: CompilerOptions = {
        source: '# MDX Content\n\nContent here without imports.',
        components: {},
      }

      const result = await processor.compile(options)
      // Should compile without errors
      expect(result.error).toBeUndefined()
      expect(result.content).toBeTruthy()
    })

    it('should handle concurrent compilations', async () => {
      const options1: CompilerOptions = {
        source: '# Concurrent 1',
        components: {},
      }

      const options2: CompilerOptions = {
        source: '# Concurrent 2',
        components: {},
      }

      const options3: CompilerOptions = {
        source: '# Concurrent 3',
        components: {},
      }

      // Run compilations concurrently
      const results = await Promise.all([
        processor.compile(options1),
        processor.compile(options2),
        processor.compile(options3),
      ])

      // All should succeed
      results.forEach((result) => {
        expect(result.content).toBeTruthy()
        expect(result.error).toBeUndefined()
      })

      // All should be cached
      expect(processor.getCacheStats().entries).toBe(3)
    })
  })

  describe('performance', () => {
    it('should track compilation duration', async () => {
      const options: CompilerOptions = {
        source: '# Performance Test\n\nContent for timing.',
        components: {},
      }

      const result = await processor.compile(options)
      expect(result.metadata.duration).toBeGreaterThan(0)
      expect(result.metadata.duration).toBeLessThan(5000) // Should be reasonably fast
    })

    it('should have faster cache hits than compilations', async () => {
      const options: CompilerOptions = {
        source: '# Cache Performance\n\nComparing compilation vs cache hit speed.',
        components: {},
      }

      // First compilation
      const compileResult = await processor.compile(options)
      const compileDuration = compileResult.metadata.duration

      // Clear cache to force recompilation
      processor.clearCache()

      // Compile again to populate cache
      await processor.compile(options)

      // Third time should hit cache
      const cacheResult = await processor.compile(options)
      const cacheDuration = cacheResult.metadata.duration

      // Cache hit should be significantly faster
      expect(cacheDuration).toBeLessThan(compileDuration)
      expect(cacheResult.metadata.cacheHit).toBe(true)
    })
  })
})

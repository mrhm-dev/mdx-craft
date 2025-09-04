import { MDXCache, getGlobalCache, clearGlobalCache } from '../cache.js'
import type { CacheEntry } from '../../types/processor.js'

describe('MDXCache', () => {
  let cache: MDXCache

  beforeEach(() => {
    cache = new MDXCache()
  })

  describe('constructor', () => {
    it('should create cache with default values', () => {
      const defaultCache = new MDXCache()
      const stats = defaultCache.getStats()

      expect(stats.maxSize).toBe(10 * 1024 * 1024) // 10MB in bytes
      expect(stats.size).toBe(0)
      expect(stats.entries).toBe(0)
      expect(stats.hitRate).toBe(0)
    })

    it('should create cache with custom max size and TTL', () => {
      const customCache = new MDXCache(5, 600000)
      const stats = customCache.getStats()

      expect(stats.maxSize).toBe(5 * 1024 * 1024) // 5MB in bytes
    })
  })

  describe('generateKey', () => {
    it('should generate consistent keys for same inputs', () => {
      const source = 'test content'
      const components = ['comp1', 'comp2']
      const pluginFingerPrint = 'plugin123'

      const key1 = MDXCache.generateKey(source, components, pluginFingerPrint)
      const key2 = MDXCache.generateKey(source, components, pluginFingerPrint)

      expect(key1).toBe(key2)
    })

    it('should generate different keys for different sources', () => {
      const key1 = MDXCache.generateKey('source1')
      const key2 = MDXCache.generateKey('source2')

      expect(key1).not.toBe(key2)
    })

    it('should generate different keys for different components', () => {
      const source = 'same source'
      const key1 = MDXCache.generateKey(source, ['comp1'])
      const key2 = MDXCache.generateKey(source, ['comp2'])

      expect(key1).not.toBe(key2)
    })

    it('should sort components to ensure consistent keys', () => {
      const source = 'test content'
      const key1 = MDXCache.generateKey(source, ['comp2', 'comp1'])
      const key2 = MDXCache.generateKey(source, ['comp1', 'comp2'])

      expect(key1).toBe(key2)
    })

    it('should handle undefined components and plugin fingerprint', () => {
      const source = 'test content'
      const key = MDXCache.generateKey(source)

      expect(typeof key).toBe('string')
      expect(key.length).toBeGreaterThan(0)
    })

    it('should generate different keys for different plugin fingerprints', () => {
      const source = 'same source'
      const key1 = MDXCache.generateKey(source, undefined, 'plugin1')
      const key2 = MDXCache.generateKey(source, undefined, 'plugin2')

      expect(key1).not.toBe(key2)
    })
  })

  describe('set and get', () => {
    const mockEntry: CacheEntry = {
      content: null,
      metadata: {
        timestamp: Date.now(),
      },
    }

    it('should store and retrieve entries', () => {
      const key = 'test-key'
      cache.set(key, mockEntry)

      const retrieved = cache.get(key)
      expect(retrieved).toEqual(mockEntry)
    })

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent')
      expect(result).toBeNull()
    })

    it('should update access order when getting entries', () => {
      const key1 = 'key1'
      const key2 = 'key2'
      const entry1 = { ...mockEntry, metadata: { ...mockEntry.metadata, timestamp: Date.now() } }
      const entry2 = { ...mockEntry, metadata: { ...mockEntry.metadata, timestamp: Date.now() } }

      cache.set(key1, entry1)
      cache.set(key2, entry2)

      // Access key1 to move it to end of access order
      cache.get(key1)

      // Both entries should still be accessible
      expect(cache.get(key1)).toEqual(entry1)
      expect(cache.get(key2)).toEqual(entry2)
    })

    it('should handle replacing existing entries', () => {
      const key = 'test-key'
      const now = Date.now()
      const entry1: CacheEntry = {
        content: null,
        metadata: {
          timestamp: now - 1000,
        },
      }
      const entry2: CacheEntry = {
        content: null,
        metadata: {
          timestamp: now - 500,
        },
      }

      cache.set(key, entry1)
      cache.set(key, entry2)

      const retrieved = cache.get(key)
      expect(retrieved?.metadata.timestamp).toBe(now - 500)
      // Check that the second entry replaced the first
    })
  })

  describe('TTL (Time To Live)', () => {
    it('should return null for expired entries', () => {
      const shortTTLCache = new MDXCache(10, 100) // 100ms TTL
      const key = 'test-key'
      const entry: CacheEntry = {
        content: null,
        metadata: {
          timestamp: Date.now() - 200, // 200ms ago, older than TTL
        },
      }

      shortTTLCache.set(key, entry)

      // Entry should be expired
      const result = shortTTLCache.get(key)
      expect(result).toBeNull()
    })

    it('should return valid entries within TTL', () => {
      const longTTLCache = new MDXCache(10, 300000) // 5 minutes TTL
      const key = 'test-key'
      const entry: CacheEntry = {
        content: null,
        metadata: {
          timestamp: Date.now() - 1000, // 1 second ago, within TTL
        },
      }

      longTTLCache.set(key, entry)

      const result = longTTLCache.get(key)
      expect(result).toEqual(entry)
    })

    it('should remove expired entries from cache when accessed', () => {
      const shortTTLCache = new MDXCache(10, 50)
      const key = 'test-key'
      const entry: CacheEntry = {
        content: null,
        metadata: {
          timestamp: Date.now() - 100, // Already expired
        },
      }

      shortTTLCache.set(key, entry)
      expect(shortTTLCache.getStats().entries).toBe(1)

      // Access expired entry
      shortTTLCache.get(key)

      // Entry should be removed
      expect(shortTTLCache.getStats().entries).toBe(0)
    })
  })

  describe('delete', () => {
    const mockEntry: CacheEntry = {
      content: null,
      metadata: {
        timestamp: Date.now(),
      },
    }

    it('should delete existing entries', () => {
      const key = 'test-key'
      cache.set(key, mockEntry)

      const deleted = cache.delete(key)
      expect(deleted).toBe(true)
      expect(cache.get(key)).toBeNull()
    })

    it('should return false for non-existent entries', () => {
      const deleted = cache.delete('non-existent')
      expect(deleted).toBe(false)
    })

    it('should update stats when deleting', () => {
      const key = 'test-key'
      cache.set(key, mockEntry)

      const statsBefore = cache.getStats()
      cache.delete(key)
      const statsAfter = cache.getStats()

      expect(statsAfter.entries).toBe(statsBefore.entries - 1)
      expect(statsAfter.size).toBeLessThan(statsBefore.size)
    })
  })

  describe('clear', () => {
    it('should clear all entries', () => {
      const entry: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      cache.set('key1', entry)
      cache.set('key2', entry)

      expect(cache.getStats().entries).toBe(2)

      cache.clear()

      const stats = cache.getStats()
      expect(stats.entries).toBe(0)
      expect(stats.size).toBe(0)
    })
  })

  describe('LRU eviction', () => {
    it('should evict least recently used entries when size limit is exceeded', () => {
      // Test LRU behavior with a cache that can hold only 2 entries
      const limitedCache = new MDXCache(10, 300000) // Normal size cache

      // Mock the estimateSize method to return a fixed large size
      const originalEstimateSize = (limitedCache as any).estimateSize
      const maxSizePerEntry = Math.floor(limitedCache.getStats().maxSize / 2.5) // Allow ~2 entries
      ;(limitedCache as any).estimateSize = () => maxSizePerEntry

      const entry1: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }
      const entry2: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }
      const entry3: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      limitedCache.set('key1', entry1)
      limitedCache.set('key2', entry2)
      limitedCache.set('key3', entry3) // This should trigger eviction of key1

      // Restore original method
      ;(limitedCache as any).estimateSize = originalEstimateSize

      // key1 should be evicted (least recently used)
      expect(limitedCache.get('key1')).toBeNull()
      expect(limitedCache.get('key2')).not.toBeNull()
      expect(limitedCache.get('key3')).not.toBeNull()
    })

    it('should handle access order correctly during eviction', () => {
      const limitedCache = new MDXCache(10, 300000)

      // Mock the estimateSize method to allow only ~2 entries
      const maxSizePerEntry = Math.floor(limitedCache.getStats().maxSize / 2.5)
      ;(limitedCache as any).estimateSize = () => maxSizePerEntry

      const entry1: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }
      const entry2: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }
      const entry3: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      limitedCache.set('key1', entry1)
      limitedCache.set('key2', entry2)

      // Access key1 to make it more recently used (moves to end of accessOrder)
      limitedCache.get('key1')

      // Add key3, should evict key2 (now least recently used at beginning)
      limitedCache.set('key3', entry3)

      expect(limitedCache.get('key1')).not.toBeNull()
      expect(limitedCache.get('key2')).toBeNull()
      expect(limitedCache.get('key3')).not.toBeNull()
    })
  })

  describe('hit/miss tracking', () => {
    it('should record hits and misses correctly', () => {
      const entry: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      cache.set('existing', entry)

      cache.recordHit()
      cache.recordHit()
      cache.recordMiss()

      const stats = cache.getStats()
      expect(stats.hitRate).toBe(2 / 3) // 2 hits out of 3 total
    })

    it('should handle zero hits and misses', () => {
      const stats = cache.getStats()
      expect(stats.hitRate).toBe(0)
    })

    it('should calculate hit rate correctly with only hits', () => {
      cache.recordHit()
      cache.recordHit()

      const stats = cache.getStats()
      expect(stats.hitRate).toBe(1)
    })

    it('should calculate hit rate correctly with only misses', () => {
      cache.recordMiss()
      cache.recordMiss()

      const stats = cache.getStats()
      expect(stats.hitRate).toBe(0)
    })
  })

  describe('size estimation', () => {
    it('should estimate entry sizes', () => {
      const smallEntry: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      const largeEntry: CacheEntry = {
        content: null,
        metadata: {
          timestamp: Date.now(),
        },
      }

      cache.set('small', smallEntry)
      const statsAfterSmall = cache.getStats()

      cache.set('large', largeEntry)
      const statsAfterLarge = cache.getStats()

      expect(statsAfterLarge.size).toBeGreaterThan(statsAfterSmall.size)
    })

    it('should handle estimation errors gracefully', () => {
      // Create an entry that might cause JSON.stringify to fail
      const problematicEntry: CacheEntry = {
        content: null,
        metadata: {
          timestamp: Date.now(),
        },
      }

      // Add circular reference to metadata (this would cause JSON.stringify to fail)
      const circularMetadata = problematicEntry.metadata as any
      circularMetadata.circular = circularMetadata

      // Should not throw and should use default size
      expect(() => cache.set('problematic', problematicEntry)).not.toThrow()

      const stats = cache.getStats()
      expect(stats.size).toBeGreaterThan(0)
    })
  })

  describe('getStats', () => {
    it('should return correct stats for empty cache', () => {
      const stats = cache.getStats()

      expect(stats.size).toBe(0)
      expect(stats.entries).toBe(0)
      expect(stats.maxSize).toBe(10 * 1024 * 1024)
      expect(stats.hitRate).toBe(0)
    })

    it('should return correct stats after operations', () => {
      const entry: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      cache.set('key1', entry)
      cache.set('key2', entry)
      cache.recordHit()
      cache.recordMiss()

      const stats = cache.getStats()

      expect(stats.entries).toBe(2)
      expect(stats.size).toBeGreaterThan(0)
      expect(stats.hitRate).toBe(0.5)
    })
  })
})

describe('Global cache functions', () => {
  beforeEach(() => {
    clearGlobalCache()
  })

  afterEach(() => {
    clearGlobalCache()
  })

  describe('getGlobalCache', () => {
    it('should create global cache with default parameters', () => {
      const cache = getGlobalCache()
      const stats = cache.getStats()

      expect(stats.maxSize).toBe(10 * 1024 * 1024)
    })

    it('should create global cache with custom parameters', () => {
      const cache = getGlobalCache(5, 600000)
      const stats = cache.getStats()

      expect(stats.maxSize).toBe(5 * 1024 * 1024)
    })

    it('should return same instance on subsequent calls', () => {
      const cache1 = getGlobalCache()
      const cache2 = getGlobalCache()

      expect(cache1).toBe(cache2)
    })

    it('should ignore parameters on subsequent calls', () => {
      const cache1 = getGlobalCache(5)
      const cache2 = getGlobalCache(10) // Different parameters

      expect(cache1).toBe(cache2)
      expect(cache1.getStats().maxSize).toBe(5 * 1024 * 1024) // Original parameters preserved
    })
  })

  describe('clearGlobalCache', () => {
    it('should clear existing global cache', () => {
      const cache = getGlobalCache()
      const entry: CacheEntry = {
        content: null,
        metadata: { timestamp: Date.now() },
      }

      cache.set('test', entry)
      expect(cache.getStats().entries).toBe(1)

      clearGlobalCache()
      expect(cache.getStats().entries).toBe(0)
    })

    it('should handle clearing when no global cache exists', () => {
      expect(() => clearGlobalCache()).not.toThrow()
    })
  })
})

describe('Integration tests', () => {
  it('should handle realistic MDX cache workflow', () => {
    const cache = new MDXCache(1, 300000) // 1MB, 5 minutes TTL

    // Simulate caching compiled MDX content
    const mdxSource1 = '# Hello World\n\nThis is a test document.'
    const mdxSource2 = '## Another Document\n\nWith different content.'

    const key1 = MDXCache.generateKey(mdxSource1, ['MyComponent'], 'plugin-hash-123')
    const key2 = MDXCache.generateKey(mdxSource2, ['MyComponent'], 'plugin-hash-123')

    const entry1: CacheEntry = {
      content: null, // Would be actual React element in real usage
      metadata: {
        timestamp: Date.now(),
      },
    }

    const entry2: CacheEntry = {
      content: null,
      metadata: {
        timestamp: Date.now(),
      },
    }

    // Cache entries
    cache.set(key1, entry1)
    cache.set(key2, entry2)

    // Simulate cache hits
    cache.recordHit()
    const retrieved1 = cache.get(key1)
    expect(retrieved1).toEqual(entry1)

    cache.recordHit()
    const retrieved2 = cache.get(key2)
    expect(retrieved2).toEqual(entry2)

    // Simulate cache miss
    cache.recordMiss()
    const nonExistent = cache.get('non-existent-key')
    expect(nonExistent).toBeNull()

    // Check final stats
    const stats = cache.getStats()
    expect(stats.entries).toBe(2)
    expect(stats.hitRate).toBe(2 / 3) // 2 hits, 1 miss
  })

  it('should handle cache key generation with various inputs', () => {
    const baseSource = 'import { Component } from "react"\n\n# Test'

    // Test with different component combinations
    const key1 = MDXCache.generateKey(baseSource, ['Button', 'Card'])
    const key2 = MDXCache.generateKey(baseSource, ['Card', 'Button']) // Same components, different order
    const key3 = MDXCache.generateKey(baseSource, ['Button'])
    const key4 = MDXCache.generateKey(baseSource, ['Button', 'Card'], 'different-plugin')

    expect(key1).toBe(key2) // Order shouldn't matter
    expect(key1).not.toBe(key3) // Different components
    expect(key1).not.toBe(key4) // Different plugin fingerprint
  })
})

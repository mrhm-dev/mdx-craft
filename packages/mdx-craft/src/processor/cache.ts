import { type CacheEntry } from '../types/processor.js'

export class MDXCache {
  private cache: Map<string, CacheEntry>
  private accessOrder: string[]
  private maxSize: number // in bytes
  private currentSize: number
  private ttl: number
  private hits = 0
  private misses = 0

  constructor(maxSizeMB: number = 10, ttl: number = 300000) {
    this.cache = new Map()
    this.accessOrder = []
    this.maxSize = maxSizeMB * 1024 * 1024
    this.currentSize = 0
    this.ttl = ttl
  }

  /**
   * Generate a unique key for the cache entry
   * @param source - The source code to compile
   * @param components - The components to use for the compiler
   * @param pluginFingerPrint - The plugin finger print to use for the compiler
   * @returns The unique key for the cache entry
   */
  static generateKey(source: string, components?: string[], pluginFingerPrint?: string): string {
    const componentKey = components ? components.sort().join(',') : ''
    const sourceHash = this.simpleHash(source)
    const pluginKey = pluginFingerPrint ? pluginFingerPrint : ''
    return `${sourceHash}-${componentKey}-${pluginKey}`
  }

  /**
   * Generate a simple hash for the source code
   * @param str - The source code to hash
   * @returns The hash of the source code
   */
  private static simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  /**
   * Get an entry from the cache
   * @param key - The key of the entry to get
   * @returns The entry or null if it doesn't exist or is expired
   */
  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    if (now - entry.metadata.timestamp > this.ttl) {
      this.delete(key)
      return null
    }

    // Update access order
    this.updateAccessOrder(key)
    return entry
  }

  /**
   * Set an entry in the cache
   * @param key - The key of the entry to set
   * @param entry - The entry to set
   */
  set(key: string, entry: CacheEntry): void {
    const entrySize = this.estimateSize(entry)

    while (this.currentSize + entrySize > this.maxSize && this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift()
      if (lruKey) {
        this.delete(lruKey)
      }
    }

    // Delete existing entry if it exists
    if (this.cache.has(key)) {
      this.delete(key)
    }

    // Add new entry
    this.cache.set(key, entry)
    this.accessOrder.push(key)
    this.currentSize += entrySize
  }

  /**
   * Delete an entry from the cache
   * @param key - The key of the entry to delete
   * @returns True if the entry was deleted, false otherwise
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const entrySize = this.estimateSize(entry)
    this.currentSize -= entrySize
    this.cache.delete(key)

    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }

    return true
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
    this.currentSize = 0
  }

  /**
   * Get the stats of the cache
   * @returns The stats of the cache
   */
  getStats() {
    return {
      size: this.currentSize,
      entries: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
    }
  }

  /**
   * Update the access order of the cache
   * @param key - The key of the entry to update
   */
  private updateAccessOrder(key: string) {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    this.accessOrder.push(key)
  }

  /**
   * Estimate the size of an entry in the cache
   * @param entry - The entry to estimate the size of
   * @returns The estimated size of the entry in bytes
   */
  private estimateSize(entry: CacheEntry): number {
    // Rough estimation based on JSON stringify
    try {
      const str = JSON.stringify(entry.metadata)
      // Add some overhead for the compiled component
      return str.length * 2 + 1024 // Unicode chars can be 2 bytes + overhead
    } catch {
      return 1024 // Default size if estimation fails
    }
  }

  /**
   * Record a hit in the cache
   */
  recordHit(): void {
    this.hits++
  }

  /**
   * Record a miss in the cache
   */
  recordMiss(): void {
    this.misses++
  }

  /**
   * Calculate the hit rate of the cache
   * @returns The hit rate of the cache
   */
  private calculateHitRate(): number {
    const total = this.hits + this.misses
    return total === 0 ? 0 : this.hits / total
  }
}

let globalCache: MDXCache | null = null

/**
 * Get the global cache
 * @param maxSizeMB - The maximum size of the cache in MB
 * @param ttl - The time to live for the cache in milliseconds
 * @returns The global cache
 */
export const getGlobalCache = (maxSizeMB?: number, ttl?: number) => {
  if (!globalCache) {
    globalCache = new MDXCache(maxSizeMB, ttl)
  }
  return globalCache
}

/**
 * Clear the global cache
 */
export const clearGlobalCache = (): void => {
  if (globalCache) {
    globalCache.clear()
  }
  globalCache = null
}

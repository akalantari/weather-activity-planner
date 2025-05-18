import NodeCache from 'node-cache';
import { config } from '@/config';

/**
 * CacheService
 * Provides caching functionality for API responses
 */
export class CacheService {
  private readonly cache: NodeCache;

  protected readonly ttl: number;

  /**
   * Constructor
   */
  constructor() {
    this.cache = new NodeCache({ stdTTL: config.cache.ttl });
    this.ttl = config.cache.ttl;
  }

  /**
   * Gets a value from the cache
   * @param key - Cache key
   * @returns Cached value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Sets a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional TTL in seconds
   * @returns true if the key has been set successfully
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || this.ttl);
  }

  /**
   * Deletes a value from the cache
   * @param key - Cache key
   * @returns Number of deleted entries
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Deletes multiple values using a key pattern
   * @param pattern - Key pattern with * as wildcard
   * @returns Number of deleted entries
   */
  deletePattern(pattern: string): number {
    const keys = this.getKeys().filter(key => 
      this.matchesPattern(key, pattern)
    );
    
    return this.cache.del(keys);
  }

  /**
   * Gets all cache keys
   * @returns Array of cache keys
   */
  getKeys(): string[] {
    return this.cache.keys();
  }

  /**
   * Checks if a key exists in the cache
   * @param key - Cache key
   * @returns true if the key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Flushes the entire cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Checks if a key matches a pattern
   * @param key - Cache key
   * @param pattern - Pattern with * as wildcard
   * @returns true if the key matches the pattern
   */
  private matchesPattern(key: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(key);
  }
}

export const cacheServiceInstance = new CacheService();

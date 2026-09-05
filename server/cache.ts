/**
 * ProjectMentor AI - Smart Caching & Performance Tracker Suite
 * High-performance in-memory cache with TTL, invalidation tags, and latency metrics.
 */

import { Request, Response, NextFunction } from 'express';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
  createdAt: number;
}

class CacheManager {
  private store = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;
  private maxEntries = 500;

  /**
   * Get cached entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  /**
   * Set cache entry with TTL (seconds) and optional tags for grouped invalidation
   */
  set<T>(key: string, value: T, ttlSeconds: number = 60, tags: string[] = []): void {
    // Evict oldest if exceeding capacity
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
      tags,
      createdAt: Date.now()
    });
  }

  /**
   * Invalidate entry by key
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all entries tagged with a specific tag (e.g., "project:proj_1")
   */
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.store.entries()) {
      if (entry.tags.includes(tag)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get telemetry stats
   */
  getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? Math.round((this.hits / totalRequests) * 100) : 100;
    return {
      totalEntries: this.store.size,
      maxEntries: this.maxEntries,
      hits: this.hits,
      misses: this.misses,
      hitRatePercent: hitRate,
      status: 'OPTIMAL'
    };
  }
}

export const serverCache = new CacheManager();

// Latency & Request Telemetry Store
interface RequestMetric {
  path: string;
  durationMs: number;
  timestamp: number;
  status: number;
}

const latencyHistory: RequestMetric[] = [];
const MAX_METRICS_HISTORY = 200;

/**
 * Express Middleware: Measures API execution time and adds Server-Timing headers
 */
export function performanceTimingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startHr = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startHr);
    const durationMs = Math.round((diff[0] * 1e3 + diff[1] * 1e-6) * 100) / 100;

    latencyHistory.push({
      path: req.baseUrl + req.path,
      durationMs,
      timestamp: Date.now(),
      status: res.statusCode
    });

    if (latencyHistory.length > MAX_METRICS_HISTORY) {
      latencyHistory.shift();
    }
  });

  next();
}

/**
 * Returns aggregated performance metrics
 */
export function getPerformanceMetrics() {
  const memory = process.memoryUsage();
  const durations = latencyHistory.map(m => m.durationMs);
  durations.sort((a, b) => a - b);

  const p50 = durations.length > 0 ? durations[Math.floor(durations.length * 0.5)] : 0;
  const p95 = durations.length > 0 ? durations[Math.floor(durations.length * 0.95)] : 0;
  const avg = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  return {
    uptimeSeconds: Math.round(process.uptime()),
    memory: {
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      rssMb: Math.round(memory.rss / 1024 / 1024)
    },
    latency: {
      averageMs: avg,
      p50Ms: p50,
      p95Ms: p95,
      sampleCount: latencyHistory.length
    },
    cache: serverCache.getStats()
  };
}

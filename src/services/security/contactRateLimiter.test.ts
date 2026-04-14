import { afterEach, describe, expect, it } from 'vitest';
import {
  consumeContactRateLimit,
  resetContactRateLimitForTesting,
} from './contactRateLimiter';

afterEach(() => {
  resetContactRateLimitForTesting();
});

describe('contactRateLimiter', () => {
  it('allows requests within configured threshold', () => {
    const key = 'contact:0909';
    expect(consumeContactRateLimit(key, { nowMs: 1000, windowMs: 60000, maxRequests: 2 })).toEqual({
      allowed: true,
    });
    expect(consumeContactRateLimit(key, { nowMs: 2000, windowMs: 60000, maxRequests: 2 })).toEqual({
      allowed: true,
    });
  });

  it('blocks requests when threshold exceeded', () => {
    const key = 'contact:0909';
    consumeContactRateLimit(key, { nowMs: 1000, windowMs: 60000, maxRequests: 1 });

    expect(consumeContactRateLimit(key, { nowMs: 2000, windowMs: 60000, maxRequests: 1 })).toEqual({
      allowed: false,
      reason: 'RATE_LIMIT_EXCEEDED',
    });
  });
});

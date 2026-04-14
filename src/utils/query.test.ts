import { describe, expect, it } from 'vitest';
import { toQueryString } from './query';

describe('toQueryString', () => {
  it('builds query string from defined params only', () => {
    const query = toQueryString({
      q: 'home',
      page: 2,
      includeMap: true,
      empty: undefined,
    });

    expect(query).toContain('q=home');
    expect(query).toContain('page=2');
    expect(query).toContain('includeMap=true');
    expect(query).not.toContain('empty');
  });

  it('returns empty string when no params', () => {
    expect(toQueryString({})).toBe('');
  });
});

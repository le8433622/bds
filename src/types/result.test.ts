import { describe, expect, it } from 'vitest';
import { err, ok } from './result';

describe('result helpers', () => {
  it('creates ok result', () => {
    expect(ok(123)).toEqual({ ok: true, data: 123 });
  });

  it('creates error result', () => {
    expect(err('E_TEST', 'failure')).toEqual({
      ok: false,
      error: { code: 'E_TEST', message: 'failure' },
    });
  });
});

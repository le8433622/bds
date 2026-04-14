import { afterEach, describe, expect, it } from 'vitest';
import {
  clearToken,
  getToken,
  hasValidToken,
  resetTokenStorageForTesting,
  saveSessionToken,
  saveToken,
  setStoredTokenForTesting,
} from './tokenStorage';

afterEach(() => {
  resetTokenStorageForTesting();
});

describe('tokenStorage', () => {
  it('saves and returns token', async () => {
    await saveToken('abc');
    expect(await getToken()).toBe('abc');
  });

  it('clears token', async () => {
    await saveToken('abc');
    await clearToken();
    expect(await getToken()).toBeNull();
  });

  it('checks valid token', async () => {
    expect(await hasValidToken()).toBe(false);
    await saveToken('abc');
    expect(await hasValidToken()).toBe(true);
  });

  it('supports unicode token values', async () => {
    await saveToken('tôken-🔐');
    expect(await getToken()).toBe('tôken-🔐');
  });

  it('supports backward-compatible v1 token format', async () => {
    setStoredTokenForTesting('v1:YWJj');
    expect(await getToken()).toBe('abc');
  });

  it('returns null for expired session token', async () => {
    await saveSessionToken({
      token: 'abc',
      expiresAt: '2000-01-01T00:00:00.000Z',
    });

    expect(await getToken()).toBeNull();
    expect(await hasValidToken()).toBe(false);
  });

  it('returns null for unsupported stored token format', async () => {
    setStoredTokenForTesting('legacy-token-format');
    expect(await getToken()).toBeNull();
    expect(await hasValidToken()).toBe(false);
  });
});
